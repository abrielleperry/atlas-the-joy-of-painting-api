require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

async function convertFieldsToIntegers() {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const database = client.db(DATABASE_NAME);
    const collection = database.collection("subject_matter");

    const cursor = collection.find();
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const updatedDoc = {};

      Object.keys(doc).forEach((key) => {
        if (key !== "_id" && !isNaN(doc[key])) {
          updatedDoc[key] = parseInt(doc[key], 10);
        } else {
          updatedDoc[key] = doc[key];
        }
      });

      await collection.updateOne({ _id: doc._id }, { $set: updatedDoc });
    }

    console.log("All documents updated successfully!");
  } catch (err) {
    console.error("Error updating documents:", err.message);
  } finally {
    await client.close();
  }
}

convertFieldsToIntegers();
