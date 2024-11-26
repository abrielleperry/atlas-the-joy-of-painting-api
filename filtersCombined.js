require("dotenv").config();
const { MongoClient } = require("mongodb");

async function combinedFilter(database, { month, queryParams, filterLogic }) {
  const pipeline = [];

  // Step 1: Match by month in episode_dates collection
  if (month) {
    pipeline.push({
      $match: { date: { $regex: `^${month}`, $options: 'i' } }
    });
  }

  // Step 2: Join with subject_matter collection on title
  pipeline.push({
    $lookup: {
      from: "subject_matter",
      localField: "title", // Common field
      foreignField: "title",
      as: "subjectDetails"
    }
  });

  // Step 3: Join with colors_used collection on title
  pipeline.push({
    $lookup: {
      from: "colors_used",
      localField: "title", // Common field
      foreignField: "title",
      as: "colorDetails"
    }
  });

  // Step 4: Filter by subjects (dynamic fields)
  const subjectMatch = {};
  const colorMatch = {};

  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === '1') {
      if (key.includes(' ')) {
        // Assume keys with spaces belong to colors_used
        colorMatch[key] = 1;
      } else {
        // Otherwise, assume keys belong to subject_matter
        subjectMatch[key] = 1;
      }
    }
  });

  if (Object.keys(subjectMatch).length > 0) {
    pipeline.push({
      $match: { "subjectDetails": { $elemMatch: subjectMatch } }
    });
  }

  if (Object.keys(colorMatch).length > 0) {
    pipeline.push({
      $match: { "colorDetails": { $elemMatch: colorMatch } }
    });
  }

  // Step 5: Sort by date
  pipeline.push({ $sort: { date: 1 } });

  // Execute the pipeline
  return database.collection("episode_dates").aggregate(pipeline).toArray();
}


module.exports = { combinedFilter }
