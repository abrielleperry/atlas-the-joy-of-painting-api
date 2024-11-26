require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const loadData = require("./loadData");
const { filterByMonth } = require("./filterByMonth");
const { filterBySubject } = require("./filterBySubject");
const filterByColors = require('./filterByColor');
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

    // http://localhost:5001/filter-months?month=january
    app.get('/filter-months', async (req, res) => {
      try {
        const month = req.query.month.toLowerCase();
        const result = await filterByMonth(month);
        res.json(result);
      } catch (error) {
        console.error("Error fetching episode dates:", error.message);
        res.status(500).json({ error: 'Error fetching data' });
      }
    });

    // http://localhost:5001/filter-subjects?mountains=1
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

    // http://localhost:5001/filter-colors?color=bright red
    app.get('/filter-colors', async (req, res) => {
      const { color, filterLogic } = req.query;

      try {
        if (color) {
          const episodes = await filterByColors(database, color, filterLogic || 'OR'); // Pass database
          res.json(episodes);
        } else {
          res.status(400).json({ error: 'Color filter is required' });
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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

