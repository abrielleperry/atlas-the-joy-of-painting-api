require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const loadData = require("./loadData");
const { filterByMonth } = require("./filterByMonth");
const { filterBySubject } = require("./filterBySubject");
const cors = require("cors");

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const PORT = process.env.PORT || 5001;

(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let dbClient;

  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully!");

    const database = dbClient.db(DATABASE_NAME);

    app.get('/episode-dates', async (req, res) => {
      try {
        const month = req.query.month.toLowerCase();
        const result = await filterByMonth(month);
        res.json(result);
      } catch (error) {
        console.error("Error fetching episode dates:", error.message);
        res.status(500).json({ error: 'Error fetching data' });
      }
    });

    app.get('/filter-subjects', async (req, res) => {
      try {
        const subjectMatterCollection = database.collection("subject_matter");
        const results = await filterBySubject(subjectMatterCollection, req.query);
        res.json(results);
      } catch (err) {
        console.error("Error fetching subjects:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("SIGINT", async () => {
      await dbClient.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
})();
