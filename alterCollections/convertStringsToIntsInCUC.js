require('dotenv').config();
const { MongoClient } = require('mongodb');

async function convertFieldsToIntegers() {
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

    const integerFields = [
      'season',
      'episode',
      'index',
      'painting index',
      'number of colors',
      'black gesso',
      'bright red',
      'burnt umber',
      'cadmium yellow',
      'dark sienna',
      'indian red',
      'indian yellow',
      'liquid black',
      'liquid clear',
      'midnight black',
      'phthalo blue',
      'phthalo green',
      'prussian blue',
      'sap green',
      'titanium white',
      'van dyke brown',
      'yellow ochre',
      'alizarin crimson',
    ];

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      let updateFields = {};
      let needsUpdate = false;

      for (const field of integerFields) {
        if (doc[field] && typeof doc[field] === 'string') {
          const intValue = parseInt(doc[field], 10);
          if (!isNaN(intValue)) {
            updateFields[field] = intValue;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: updateFields }
        );
        updatedCount++;
        console.log(`Updated document ID: ${doc._id}`);
      }
    }

    console.log(`Total documents updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error converting fields to integers:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

convertFieldsToIntegers();
