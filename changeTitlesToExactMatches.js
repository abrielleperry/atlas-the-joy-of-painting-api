const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://abrielleperry22:m5MFaOfAuit571pL@atlasschool.x25kz.mongodb.net/?retryWrites=true&w=majority&appName=atlasschool";
const DATABASE_NAME = "TheJoyOfPainting";

// Function to update documents
async function updateDocuments() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);

        const collections = ['colors_used', 'subject_matter', 'episode_dates'];

        // First update: 'cold spring day' to 'a cold spring day'
        const updates = [
            { oldValue: 'cold spring day', newValue: 'a cold spring day' },
            { oldValue: 'trace of spring', newValue: 'a trace of spring' },
            { oldValue: 'copper winter', newValue: 'a copper winter' },
            { oldValue: 'black and white seascape', newValue: 'black & white seascape' },
            { oldValue: 'arctic winter day', newValue: 'an arctic winter day' },
            { oldValue: 'pretty autumn day', newValue: 'a pretty autumn day' },
            { oldValue: 'half oval vignette', newValue: 'half-oval vignette' },

            { oldValue: "perfect winter's day", newValue: 'a perfect winter day' },
            { oldValue: 'spectacular view', newValue: 'a spectacular view' },
            { oldValue: "woodsman's retreat", newValue: "woodman's retreat" },
            { oldValue: "winters elegance", newValue: "winter elegance" },
            { oldValue: "winter's paradise", newValue: "winter paradise" },
            { oldValue: "the magic of fall,", newValue: "the magic of fall" },
            { oldValue: "little house by-the-road", newValue: "little house by-the-road" },
            { oldValue: "autumn mountains", newValue: "autumn mountain" },
            { oldValue: "back country", newValue: "back-country path" },
            { oldValue: "cabin at trial's end", newValue: "cabin at trails end" },
            { oldValue: "cabin at trail's end", newValue: "cabin at trails end" },
            { oldValue: "evening sunset", newValue: "evening at sunset" },
            { oldValue: "evergreen at sunset", newValue: "evergreens at sunset" },
            { oldValue: "forest down oval", newValue: "forest dawn oval" },
            { oldValue: "misty forest", newValue: "misty forest oval" },
            { oldValue: "golden rays of sunlight", newValue: "golden rays of sunshine" },
            { oldValue: "grey mountain", newValue: "gray mountain" },
            { oldValue: "mount mckinley", newValue: "mt. mckinley" },
            { oldValue: "old oak tree", newValue: "the old oak tree" },
            { oldValue: "toward day's end", newValue: "toward days end" },
            { oldValue: "hide-a-way cove", newValue: "hide a way cove" },
            { oldValue: "little house by-the-road", newValue: "little house by the road" },
            { oldValue: "mountain-by-the-sea", newValue: "mountain by the sea" },
            { oldValue: "mountain mirage wood shape", newValue: "mountain mirage" },
            { oldValue: "mountain hide-away", newValue: "mountain hideaway" },
            { oldValue: "mountain pass", newValue: "mountain path" },
            { oldValue: "to a warm winter", newValue: "a warm winter" },
            { oldValue: "pot 'o posies", newValue: "pot o' posies" },
            { oldValue: "quiet mountains river", newValue: "quiet mountain river" },
            { oldValue: "river's peace", newValue: "rivers peace" },
            { oldValue: "shades of gray", newValue: "shades of grey" },
            { oldValue: "snowfall", newValue: "snow fall" },
            { oldValue: "splendor of a snowy white", newValue: "splendor of a snowy winter" },
            { oldValue: "old home place", newValue: "the old home place" },
            { oldValue: "winter in pastel", newValue: "pastel winter" },
            { oldValue: "storm's a comin", newValue: "storm's a comin'" },
            { oldValue: "summer in the mountains", newValue: "summer in the mountain" },
            { oldValue: "footbridge", newValue: "the footbridge" },
            { oldValue: "old home place", newValue: "the old home place" },
            { oldValue: "old place home", newValue: "the old home place" },


          ];

        for (const { oldValue, newValue } of updates) {
            for (const collectionName of collections) {
                const collection = db.collection(collectionName);

                // Update documents where 'title' equals the oldValue
                const result = await collection.updateMany(
                    { title: oldValue },
                    { $set: { title: newValue } }
                );

                console.log(`Updated ${result.modifiedCount} documents in '${collectionName}' collection from '${oldValue}' to '${newValue}'.`);
            }
        }
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        await client.close();
    }
}

// Run the function
updateDocuments();
