const fs = require("fs");
const csvParser = require("csv-parser");

/**
 * Reads the headers of a CSV file.
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<string[]>} - A promise that resolves to an array of column headers.
 */
const getHeaders = (filePath) => {
  return new Promise((resolve, reject) => {
    const headers = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("headers", (headerRow) => {
        headers.push(...headerRow);
        resolve(headers);
      })
      .on("error", (err) => reject(err));
  });
};

/**
 * Finds shared column names between multiple datasets.
 * @param {string[]} filePaths - Array of file paths to the datasets.
 * @returns {Promise<string[]>} - A promise that resolves to an array of shared column names.
 */
const findSharedColumns = async (filePaths) => {
  try {
    const headersList = await Promise.all(filePaths.map((file) => getHeaders(file)));

    const sharedColumns = headersList.reduce((shared, headers) =>
      shared.filter((header) => headers.includes(header))
    );

    return sharedColumns;
  } catch (err) {
    console.error("Error finding shared columns:", err);
    throw err;
  }
};

const COLORS_USED_FILE = "./datasets/Colors-Used.csv";
const EPISODE_DATES_FILE = "./datasets/Episode-Dates.csv";
const SUBJECT_MATTER_FILE = "./datasets/Subject-Matter.csv";

const datasetFiles = [COLORS_USED_FILE, EPISODE_DATES_FILE, SUBJECT_MATTER_FILE];

(async () => {
  try {
    const sharedColumns = await findSharedColumns(datasetFiles);
    console.log("Shared Columns Between Datasets:", sharedColumns);
  } catch (err) {
    console.error("Error analyzing datasets:", err);
  }
})();
