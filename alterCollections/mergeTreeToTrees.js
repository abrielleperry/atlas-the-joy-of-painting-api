require("dotenv").config();
const { MongoClient } = require("mongodb");

async function mergeTreeFields() {
  const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    console.log("Starting tree field merge...");

    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const database = client.db(process.env.DATABASE_NAME);
    const collection = database.collection("subject_matter");

    const cursor = collection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const treeValue = doc.tree !== undefined ? doc.tree : 0;
      const treesValue = doc.trees !== undefined ? doc.trees : 0;

      const mergedValue = treeValue === 1 || treesValue === 1 ? 1 : 0;

      const updateDoc = {
        $set: { trees: mergedValue },
        $unset: { tree: "" }
      };

      await collection.updateOne({ _id: doc._id }, updateDoc);

      console.log(`Updated document with _id: ${doc._id}, set trees to: ${mergedValue}`);
    }

    console.log("Tree field merge completed successfully.");
  } catch (err) {
    console.error("Error during tree field merge:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

mergeTreeFields();
