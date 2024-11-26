require('dotenv').config();
const { MongoClient } = require('mongodb');

async function convertColorsToArray() {
  const MONGO_URI = process.env.MONGO_URI;
  const DATABASE_NAME = process.env.DATABASE_NAME;
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB.');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection('colors_used');
    const cursor = collection.find();

    let updatedCount = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      if (doc.colors && typeof doc.colors === 'string') {
        try {
          const colorsArray = JSON.parse(doc.colors);
          await collection.updateOne(
            { _id: doc._id },
            { $set: { colors: colorsArray } }
          );
          updatedCount++;
          console.log(`Updated document ID: ${doc._id}`);
        } catch (error) {
          console.error(`Error parsing colors for document ID: ${doc._id}`, error);
        }
      }
    }

    console.log(`Total documents updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error converting colors to array:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

convertColorsToArray();
