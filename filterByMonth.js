require("dotenv").config();
const { MongoClient } = require("mongodb");

async function filterByMonth(months) {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const database = client.db(process.env.DATABASE_NAME);

    const monthArray = months.split(',').map(month => month.trim());

    const monthRegex = new RegExp(`^(${monthArray.join('|')})`, 'i');

    const result = await database.collection('episode_dates').aggregate([
      { $match: { date: { $regex: monthRegex } } },
      { $sort: { date: 1 } }
    ]).toArray();

    if (result.length === 0) {
      console.log(`No episodes found for months: ${months}`);
    }
    return result;
  } catch (error) {
    console.error("Error fetching episode dates:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = { filterByMonth };
