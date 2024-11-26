require('dotenv').config();
const { MongoClient } = require('mongodb');

async function removeReturnNewLine() {
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

      if (doc.colors) {
        const originalColors = doc.colors;

        const cleanedColors = originalColors
          .replace(/\\r\\n/g, '')
          .replace(/'/g, '"');

        if (originalColors !== cleanedColors) {
          await collection.updateOne(
            { _id: doc._id },
            { $set: { colors: cleanedColors } }
          );
          updatedCount++;
          console.log(`Updated document ID: ${doc._id}`);
        }
      } else {
        console.log(`Skipped document ID: ${doc._id} (no colors field)`);
      }
    }

    console.log(`Total documents updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error modifying colors_used collection:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

removeReturnNewLine();
