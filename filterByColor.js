require("dotenv").config();
const { MongoClient } = require("mongodb");

async function filterByColors(database, colors, filterLogic) {
  try {
    const collection = database.collection('colors_used');
    const colorArray = colors.split(',').map(color => color.trim());

    let query;
    if (filterLogic === 'AND') {
      // "AND" logic: All colors must match
      query = { colors: { $all: colorArray } };
    } else {
      // "OR" logic: Any color can match
      query = { colors: { $in: colorArray } };
    }

    const results = await collection.find(query).toArray();
    return results;
  } catch (error) {
    console.error('Error filtering by colors:', error);
    throw error;
  }
}

module.exports = filterByColors;
