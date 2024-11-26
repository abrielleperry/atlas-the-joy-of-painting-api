require('dotenv').config();
const { MongoClient } = require('mongodb');

async function convertColorHexToArray() {
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

      if (doc['color hex'] && typeof doc['color hex'] === 'string') {
        try {
          // Replace single quotes with double quotes and parse the JSON string
          const colorHexArray = JSON.parse(doc['color hex'].replace(/'/g, '"'));

          // Update the document with the converted array
          await collection.updateOne(
            { _id: doc._id },
            { $set: { 'color hex': colorHexArray } }
          );

          updatedCount++;
          console.log(`Updated document ID: ${doc._id}`);
        } catch (error) {
          console.error(`Error parsing color hex for document ID: ${doc._id}`, error);
        }
      }
    }

    console.log(`Total documents updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error converting color hex to array:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

convertColorHexToArray();
