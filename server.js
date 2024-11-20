require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const loadData = require("./loadData"); // Import loadData.js
const { filterEpisodes } = require("./filterEpisodes");
const cors = require("cors");


const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const PORT = process.env.PORT || 5000;

(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let dbClient;

  try {
    // Connect to MongoDB
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully!");

    const database = dbClient.db(DATABASE_NAME);

    // Load data into MongoDB collections
    try {
      await loadData(database);
      console.log("Data successfully loaded into MongoDB.");
    } catch (err) {
      console.error("Error loading data:", err.message);
    }

    // Define Routes
    app.get("/", (req, res) => {
      res.send("The Joy Of Painting Database is connected and ready!");
    });

    app.get("/episodes", async (req, res) => {
      try {
        const results = await filterEpisodes(database, req.query);
        res.json(results);
      } catch (err) {
        console.error("Error fetching filtered episodes:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      if (dbClient) {
        await dbClient.close();
        console.log("MongoDB connection closed.");
      }
      process.exit();
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit if database connection fails
  }
})();
