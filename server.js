require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const loadData = require("./loadData");
const { filterEpisodeDatesByMonth } = require("./filterEpisodesByMonths");
const { filterEpisodeBySubjectMatter } = require("./filterEpisodeBySubjectMatter");

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

    try {
      await loadData(database);
      console.log("Data successfully loaded into MongoDB.");
    } catch (err) {
      console.error("Error loading data:", err.message);
    }

    app.get('/episode-dates', async (req, res) => {
      try {
        const month = req.query.month.toLowerCase();
        const result = await filterEpisodeDatesByMonth(month);

        res.json(result);
      } catch (error) {
        console.error("Error fetching episode dates:", error.message);
        res.status(500).json({ error: 'Error fetching data' });
      }
    });

    app.get('/episode-subject-matter', async (req, res) => {
  try {
    const subject = req.query.month.toLowerCase();
    const result = await filterEpisodeBySubjectMatter(subject);

    res.json(result);
  } catch (error) {
    console.error("Error fetching episode dates:", error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("SIGINT", async () => {
      if (dbClient) {
        await dbClient.close();
        console.log("MongoDB connection closed.");
      }
      process.exit();
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
})();
