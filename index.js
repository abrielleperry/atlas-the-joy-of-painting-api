const express = require("express");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const csvParser = require("csv-parser"); // For CSV parsing

// MongoDB connection URI (replace with your credentials)
const MONGO_URI = "<your_connection_uri>";

// MongoDB Database Name
const DATABASE_NAME = "TheJoyOfPainting";

// Dataset file paths (replace with actual paths)
const COLORS_FILE = "./datasets/TJOP-Colors-Used-Original.csv";
const EPISODES_FILE = "./datasets/TJOP-Episode-Dates-Original.csv";
const SUBJECTS_FILE = "./datasets/TJOP-Subject-Matter-Original.csv";

// Helper to read CSV files
const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", (err) => reject(err));
  });
};

(async () => {
  // Initialize Express app
  const app = express();
  app.use(express.json());

  let dbClient;
  let database;

  try {
    // Connect to MongoDB
    dbClient = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await dbClient.connect();
    console.log("Connected to MongoDB successfully!");

    // Access the database
    database = dbClient.db(DATABASE_NAME);
    console.log(`Database '${DATABASE_NAME}' is ready!`);

    // Insert data from the dataset files
    const colorsData = await readCSVFile(COLORS_FILE);
    const episodesData = await readCSVFile(EPISODES_FILE);
    const subjectsData = await readCSVFile(SUBJECTS_FILE);

    // Insert Colors Data
    const colorsCollection = database.collection("colors_used");
    await colorsCollection.insertMany(colorsData);
    console.log("Inserted Colors Data into 'colors_used' collection.");

    // Insert Episodes Data
    const episodesCollection = database.collection("episodes");
    await episodesCollection.insertMany(episodesData);
    console.log("Inserted Episodes Data into 'episodes' collection.");

    // Insert Subject Matter Data
    const subjectsCollection = database.collection("subject_matter");
    await subjectsCollection.insertMany(subjectsData);
    console.log("Inserted Subject Matter Data into 'subject_matter' collection.");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }

  // Define a simple route to verify server is running
  app.get("/", (req, res) => {
    res.send("The Joy Of Painting Database is connected and populated with dataset files!");
  });

  // Start Express server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Close MongoDB connection gracefully when the app terminates
  process.on("SIGINT", async () => {
    if (dbClient) {
      await dbClient.close();
      console.log("MongoDB connection closed.");
    }
    process.exit();
  });
})();
