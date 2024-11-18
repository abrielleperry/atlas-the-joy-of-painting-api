const express = require("express");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const csvParser = require("csv-parser");

const MONGO_URI = "mongodb+srv://abrielleperry22:m5MFaOfAuit571pL@atlasschool.x25kz.mongodb.net/?retryWrites=true&w=majority&appName=atlasschool";
const DATABASE_NAME = "TheJoyOfPainting";

const COLORS_USED_FILE = "./datasets/Colors-Used.csv";
const EPISODE_DATES_FILE = "./datasets/Episode-Dates.csv";
const SUBJECT_MATTER_FILE = "./datasets/Subject-Matter.csv";

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
  const app = express();
  app.use(express.json());

  let dbClient;
  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully!");


    const database = dbClient.db(DATABASE_NAME);
    console.log(`Database '${DATABASE_NAME}' is ready!`);

    try {
      const colorsUsedData = await readCSVFile(COLORS_USED_FILE);
      if (colorsUsedData.length > 0) {
        const colorsCollection = database.collection("colors_used");
        await colorsCollection.insertMany(colorsUsedData);
        console.log("Inserted Colors Data into 'colors_used' collection.");
      } else {
        console.warn("Colors Used dataset is empty. Skipping insertion.");
      }
    } catch (err) {
      console.error("Error processing Colors Used dataset:", err);
    }

    try {
      const episodeDatesData = await readCSVFile(EPISODE_DATES_FILE);
      if (episodeDatesData.length > 0) {
        const episodesCollection = database.collection("episode_dates");
        await episodesCollection.insertMany(episodeDatesData);
        console.log("Inserted Episode Dates Data into 'episode_dates' collection.");
      } else {
        console.warn("Episode Dates dataset is empty. Skipping insertion.");
      }
    } catch (err) {
      console.error("Error processing Episode Dates dataset:", err);
    }

    try {
      const subjectMatterData = await readCSVFile(SUBJECT_MATTER_FILE);
      if (subjectMatterData.length > 0) {
        const subjectsCollection = database.collection("subject_matter");
        await subjectsCollection.insertMany(subjectMatterData);
        console.log("Inserted Subject Matter Data into 'subject_matter' collection.");
      } else {
        console.warn("Subject Matter dataset is empty. Skipping insertion.");
      }
    } catch (err) {
      console.error("Error processing Subject Matter dataset:", err);
    }
  } catch (err) {
    console.error("Database connection error:", err);
  }

  app.get("/", (req, res) => {
    res.send("The Joy Of Painting Database is connected and populated with dataset files!");
  });

  const PORT = process.env.PORT || 5000;
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
})();
