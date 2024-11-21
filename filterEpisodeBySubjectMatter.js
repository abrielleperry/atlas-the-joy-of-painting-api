require("dotenv").config();
const { MongoClient } = require("mongodb");

async function filterEpisodeBySubjectMatter(subject) {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const database = client.db(process.env.DATABASE_NAME);

    const result = await database.collection('subject_matter').aggregate([
      {
        $match: {
          $or: Object.entries(subject).map(([key, value]) => ({
            [key]: { $regex: `${value}$`, $options: 'i' }
          }))
        }
      }
    ],
    { $sort: { _id: 1 } });

    if (result.length === 0) {
      console.log(`No episodes found for this subject: ${JSON.stringify(subject)}`);
    }

    return result;
  } catch (error) {
    console.error("Error fetching episode subject matter:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = { filterEpisodeBySubjectMatter };
