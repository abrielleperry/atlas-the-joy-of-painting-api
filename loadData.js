const fs = require("fs");
const csvParser = require("csv-parser");

const COLLECTIONS = {
  COLORS_USED: "colors_used",
  EPISODE_DATES: "episode_dates",
  SUBJECT_MATTER: "subject_matter",
};

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

const insertDataStrict = async (data, collection, collectionName) => {
  try {
    for (const [index, row] of data.entries()) {
      try {
        await collection.insertOne(row);
      } catch (err) {
        console.error(`Error inserting row ${index + 1} in '${collectionName}':`, row, err.message);
        throw new Error(`Failed to insert row ${index + 1} in '${collectionName}': ${err.message}`);
      }
    }
    console.log(`All data successfully inserted into '${collectionName}'.`);
  } catch (err) {
    console.error(`Aborting import for '${collectionName}' due to errors.`);
    throw err;
  }
};

const loadData = async (database) => {
  const COLORS_USED_FILE = process.env.COLORS_USED_FILE;
  const EPISODE_DATES_FILE = process.env.EPISODE_DATES_FILE;
  const SUBJECT_MATTER_FILE = process.env.SUBJECT_MATTER_FILE;

  try {
    const colorsUsedData = await readCSVFile(COLORS_USED_FILE);
    const colorsCollection = database.collection(COLLECTIONS.COLORS_USED);
    const colorsCount = await colorsCollection.countDocuments();
    if (colorsCount === 0) {
      console.log(`Inserting ${colorsUsedData.length} rows into '${COLLECTIONS.COLORS_USED}'.`);
      await insertDataStrict(colorsUsedData, colorsCollection, COLLECTIONS.COLORS_USED);
    } else {
      console.log(`'${COLLECTIONS.COLORS_USED}' collection already has data. Skipping insertion.`);
    }
  } catch (err) {
    console.error(`Error processing ${COLLECTIONS.COLORS_USED} dataset:`, err.message);
  }

  try {
    const episodeDatesData = await readCSVFile(EPISODE_DATES_FILE);
    const episodesCollection = database.collection(COLLECTIONS.EPISODE_DATES);
    const episodesCount = await episodesCollection.countDocuments();
    if (episodesCount === 0) {
      console.log(`Inserting ${episodeDatesData.length} rows into '${COLLECTIONS.EPISODE_DATES}'.`);
      await insertDataStrict(episodeDatesData, episodesCollection, COLLECTIONS.EPISODE_DATES);
    } else {
      console.log(`'${COLLECTIONS.EPISODE_DATES}' collection already has data. Skipping insertion.`);
    }
  } catch (err) {
    console.error(`Error processing ${COLLECTIONS.EPISODE_DATES} dataset:`, err.message);
  }

  try {
    const subjectMatterData = await readCSVFile(SUBJECT_MATTER_FILE);
    const subjectsCollection = database.collection(COLLECTIONS.SUBJECT_MATTER);
    const subjectsCount = await subjectsCollection.countDocuments();
    if (subjectsCount === 0) {
      console.log(`Inserting ${subjectMatterData.length} rows into '${COLLECTIONS.SUBJECT_MATTER}'.`);
      await insertDataStrict(subjectMatterData, subjectsCollection, COLLECTIONS.SUBJECT_MATTER);
    } else {
      console.log(`'${COLLECTIONS.SUBJECT_MATTER}' collection already has data. Skipping insertion.`);
    }
  } catch (err) {
    console.error(`Error processing ${COLLECTIONS.SUBJECT_MATTER} dataset:`, err.message);
  }
};

module.exports = loadData;
