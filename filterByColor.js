require("dotenv").config();
const { MongoClient } = require("mongodb");

async function filterByColors(database, colors, filterLogic) {
  try {
    const collection = database.collection('colors_used');

    const query = {};
    const colorArray = colors.split(',').map(color => color.trim());

    if (filterLogic === 'AND') {
      query.colors = { $all: colorArray }; // All colors must match
    } else {
      query.colors = { $in: colorArray }; // Any color can match
    }

    const results = await collection.find(query).toArray();
    return results;
  } catch (error) {
    console.error('Error filtering by colors:', error);
    throw error;
  }
}

module.exports = filterByColors;
