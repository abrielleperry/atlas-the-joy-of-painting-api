require("dotenv").config();
const { MongoClient } = require("mongodb");

/**
 * Filters the subject_matter collection based on query parameters.
 * @param {Object} subjectMatterCollection - MongoDB collection for subject matter
 * @param {Object} queryParams - Query parameters from the HTTP GET request.
 * @returns {Promise<Array>} - A promise resolving to an array of matching documents.
 */
async function filterBySubject(subjectMatterCollection, queryParams) {
  if (!subjectMatterCollection) {
    throw new Error("Collection not provided or not initialized");
  }

  try {
    console.log("Original query params:", queryParams);

    // Create a query object from the query parameters
    const query = {};

    Object.keys(queryParams).forEach((key) => {
      // Replace all '+' characters with spaces in the key
      const parsedKey = key.replace(/\+/g, " ");

      // Parse the value as an integer (this is what your original code did)
      const parsedValue = Number.parseInt(queryParams[key], 10);

      // Only add to query if the value is 1
      if (parsedValue === 1) {
        query[parsedKey] = parsedValue;
      }

      console.log(`Parsed key: ${parsedKey}, Parsed value: ${parsedValue}`);
    });

    console.log("Final query object:", query);

    // If no valid query parameters were provided, return an empty array
    if (Object.keys(query).length === 0) {
      console.log("No valid query parameters provided");
      return [];
    }

    // Find documents that match the query
    // Simplified projection - just exclude _id and keep everything else
    const results = await subjectMatterCollection
      .find(query)
      .project({ _id: 0 })
      .toArray();

    console.log(`Found ${results.length} results`);

    // Filter out fields with value 0 for cleaner output
    const filteredResults = results.map((doc) => {
      const filteredDoc = { ...doc };
      Object.keys(filteredDoc).forEach((key) => {
        if (filteredDoc[key] === 0) {
          delete filteredDoc[key];
        }
      });
      return filteredDoc;
    });

    return filteredResults;
  } catch (error) {
    console.error("Error in filterBySubject:", error);
    throw error;
  }
}

module.exports = { filterBySubject };
