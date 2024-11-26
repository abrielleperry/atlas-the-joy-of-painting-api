require("dotenv").config();
const { MongoClient } = require("mongodb");

async function mergeMountainFields() {
  const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    console.log("Starting field merge...");

    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const database = client.db(process.env.DATABASE_NAME);
    const collection = database.collection("subject_matter");

    const cursor = collection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const mountainValue = doc.mountain !== undefined ? doc.mountain : 0;
      const mountainsValue = doc.mountains !== undefined ? doc.mountains : 0;

      const mergedValue = mountainValue === 1 || mountainsValue === 1 ? 1 : 0;

      const updateDoc = {
        $set: { mountains: mergedValue },
        $unset: { mountain: "" }
      };

      await collection.updateOne({ _id: doc._id }, updateDoc);

      console.log(`Updated document with _id: ${doc._id}, set mountains to: ${mergedValue}`);
    }

    console.log("Field merge completed successfully.");
  } catch (err) {
    console.error("Error during field merge:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

mergeMountainFields();
