const { MongoClient } = require("mongodb");
const fs = require("fs");

const MONGO_URI = "mongodb+srv://abrielleperry22:m5MFaOfAuit571pL@atlasschool.x25kz.mongodb.net/?retryWrites=true&w=majority&appName=atlasschool";
const DATABASE_NAME = "TheJoyOfPainting";

const COLLECTIONS = ["colors_used", "episode_dates", "subject_matter"];

// Function to get unique titles not in all three collections
async function getTrulyUniqueTitles() {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const titleCounts = {};

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    for (let collectionName of COLLECTIONS) {
      const collection = db.collection(collectionName);
      const titles = await collection.distinct("title");

      titles.forEach((title) => {
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });
    }

    // Filter titles that appear in fewer than all three collections
    const uniqueTitles = Object.keys(titleCounts).filter((title) => titleCounts[title] < 3);

    return uniqueTitles;
  } catch (error) {
    console.error("Error retrieving titles:", error);
    return [];
  } finally {
    await client.close();
  }
}

// Function to log truly unique titles to a file
async function logTrulyUniqueTitles() {
  try {
    const uniqueTitles = await getTrulyUniqueTitles();
    const logContent = `Titles not in all three collections:\n\n${uniqueTitles.join(", ")}\n`;

    // Write log to a file
    fs.writeFile("truly_unique_titles_log.txt", logContent, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      } else {
        console.log("Log file created: truly_unique_titles_log.txt");
      }
    });
  } catch (error) {
    console.error("Error logging unique titles:", error);
  }
}

// Run the function to log truly unique titles
logTrulyUniqueTitles();
