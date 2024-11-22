require("dotenv").config();
const { MongoClient } = require("mongodb");

/**
 * Filters the subject_matter collection based on query parameters.
 * @param {Object} queryParams - Query parameters from the HTTP GET request.
 * @returns {Promise<Array>} - A promise resolving to an array of matching documents.
 */

async function filterBySubject(subjectMatterCollection, queryParams) {
  if (!subjectMatterCollection) {
    throw new Error("Collection not provided or not initialized");
  }

  const query = {};
  Object.keys(queryParams).forEach((key) => {
    const parsedKey = key.replace('+', ' ');
    const parsedValue = parseInt(queryParams[key], 10);
    query[parsedKey] = parsedValue;
    console.log(`Parsed key: ${parsedKey}, Parsed value: ${parsedValue}`);
  });

  console.log("Query Object:", query);

  const results = await subjectMatterCollection
    .find(query)
    .project({
      season: 1,
      episode: 1,
      title: 1,
      _id: 0,
      'apple frame': 1,
      'aurora borealis': 1,
      barn: 1,
      beach: 1,
      boat: 1,
      bridge: 1,
      building: 1,
      bushes: 1,
      cabin: 1,
      cactus: 1,
      'circle frame': 1,
      cirrus: 1,
      cliff: 1,
      clouds: 1,
      conifer: 1,
      cumulus: 1,
      deciduous: 1,
      'diane andre': 1,
      dock: 1,
      'double oval frame': 1,
      farm: 1,
      fence: 1,
      fire: 1,
      'florida frame': 1,
      flowers: 1,
      fog: 1,
      framed: 1,
      grass: 1,
      guest: 1,
      'half circle frame': 1,
      'half oval frame': 1,
      hills: 1,
      lake: 1,
      lakes: 1,
      lighthouse: 1,
      mill: 1,
      moon: 1,
      mountains: 1,
      night: 1,
      ocean: 1,
      'oval frame': 1,
      'palm trees': 1,
      path: 1,
      person: 1,
      portrait: 1,
      'rectangle 3d frame': 1,
      'rectangular frame': 1,
      river: 1,
      rocks: 1,
      'seashell frame': 1,
      snow: 1,
      'snowy mountain': 1,
      'split frame': 1,
      'steve ross': 1,
      structure: 1,
      sun: 1,
      'tomb frame': 1,
      tree: 1,
      trees: 1,
      'triple frame': 1,
      waterfall: 1,
      waves: 1,
      windmill: 1,
      'window frame': 1,
      winter: 1,
      'wood framed': 1
    })
    .toArray();

  console.log("Results:", results);

  const filteredResults = results.map(doc => {
    Object.keys(doc).forEach(key => {
      if (doc[key] === 0) {
        delete doc[key];
      }
    });
    return doc;
  });

  return filteredResults;
}

module.exports = { filterBySubject };
