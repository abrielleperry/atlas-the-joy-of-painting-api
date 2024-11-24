require("dotenv").config();
const { MongoClient } = require("mongodb");

async function filterByColors(database, colors, filterLogic) {
  try {
    const collection = database.collection('colors_used');
    const colorArray = colors.split(',').map(color => color.trim());

    // Use regex for each color
    const regexArray = colorArray.map(color => new RegExp(color, 'i')); // Case-insensitive regex

    let query;
    if (filterLogic === 'AND') {
      // "AND" logic: All colors must match
      query = {
        $and: regexArray.map(regex => ({ colors: { $regex: regex } })),
      };
    } else {
      // "OR" logic: Any color can match
      query = {
        $or: regexArray.map(regex => ({ colors: { $regex: regex } })),
      };
    }

    const results = await collection.find(query).toArray();
    return results;
  } catch (error) {
    console.error('Error filtering by colors:', error);
    throw error;
  }
}

module.exports = filterByColors;
