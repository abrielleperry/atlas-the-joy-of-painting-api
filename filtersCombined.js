require("dotenv").config();
const { MongoClient } = require("mongodb");

const combinedFilter = async (database, { month, queryParams, filterLogic }) => {
  const pipeline = [];

  if (month) {
    pipeline.push({
      $match: { date: { $regex: `^${month}`, $options: 'i' } }
    });
  }

  pipeline.push({
    $lookup: {
      from: "subject_matter",
      localField: "title",
      foreignField: "title",
      as: "subjectDetails"
    }
  });

  pipeline.push({
    $lookup: {
      from: "colors_used",
      localField: "title",
      foreignField: "title",
      as: "colorDetails"
    }
  });

  const subjectMatch = {};
  const colorMatch = {};

  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === '1') {
      if (key.includes(' ')) {
        colorMatch[key] = 1;
      } else {
        subjectMatch[key] = 1;
      }
    }
  });

  const matchConditions = [];

  if (Object.keys(subjectMatch).length > 0) {
    matchConditions.push({ "subjectDetails": { $elemMatch: subjectMatch } });
  }

  if (Object.keys(colorMatch).length > 0) {
    matchConditions.push({ "colorDetails": { $elemMatch: colorMatch } });
  }

  if (matchConditions.length > 0) {
    if (filterLogic === 'OR') {
      pipeline.push({ $match: { $or: matchConditions } });
    } else {
      pipeline.push({ $match: { $and: matchConditions } });
    }
  }

  pipeline.push({ $sort: { date: 1 } });

  return database.collection("episode_dates").aggregate(pipeline).toArray();
};


module.exports = { combinedFilter }
