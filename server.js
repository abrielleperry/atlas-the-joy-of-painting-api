require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const loadData = require("./loadData");
const { filterByMonth } = require("./filterByMonth");
const { filterBySubject } = require("./filterBySubject");
const filterByColors = require("./filterByColor");
const { combinedFilter } = require("./filtersCombined");
const cors = require("cors");
const { specs, swaggerUi } = require("./swagger-config");

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const PORT = process.env.PORT || 5001;
(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Swagger documentation route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  let dbClient;

  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully!");

    const database = dbClient.db(DATABASE_NAME);

    /**
     * @swagger
     * /:
     *   get:
     *     summary: Welcome message
     *     description: Returns a welcome message for the API
     *     responses:
     *       200:
     *         description: Welcome message
     */
    app.get("/", (req, res) => {
      res.redirect("/api-docs");
    });

    /**
     * @swagger
     * /filter-months:
     *   get:
     *     summary: Filter episodes by month
     *     description: Returns episodes that aired in the specified month(s)
     *     parameters:
     *       - in: query
     *         name: month
     *         schema:
     *           type: string
     *         required: true
     *         description: Month(s) to filter by (e.g., january or january,february)
     *     responses:
     *       200:
     *         description: List of episodes from the specified month(s)
     *       500:
     *         description: Server error
     */
    app.get("/filter-months", async (req, res) => {
      try {
        const month = req.query.month.toLowerCase();
        const result = await filterByMonth(month);
        res.json(result);
      } catch (error) {
        console.error("Error fetching episode dates:", error.message);
        res.status(500).json({ error: "Error fetching data" });
      }
    });

    /**
     * @swagger
     * /filter-subjects:
     *   get:
     *     summary: Filter episodes by subject matter
     *     description: Returns episodes that contain the specified subject(s)
     *     parameters:
     *       - in: query
     *         name: apple frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include apple frame
     *       - in: query
     *         name: aurora borealis
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include aurora borealis
     *       - in: query
     *         name: barn
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include barn
     *       - in: query
     *         name: beach
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include beach
     *       - in: query
     *         name: boat
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include boat
     *       - in: query
     *         name: bridge
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include bridge
     *       - in: query
     *         name: building
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include building
     *       - in: query
     *         name: bushes
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include bushes
     *       - in: query
     *         name: cabin
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include cabin
     *       - in: query
     *         name: cactus
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include cactus
     *       - in: query
     *         name: circle frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include circle frame
     *       - in: query
     *         name: cirrus
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include cirrus clouds
     *       - in: query
     *         name: cliff
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include cliff
     *       - in: query
     *         name: clouds
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include clouds
     *       - in: query
     *         name: conifer
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include conifer trees
     *       - in: query
     *         name: cumulus
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include cumulus clouds
     *       - in: query
     *         name: deciduous
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include deciduous trees
     *       - in: query
     *         name: diane andre
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include Diane Andre (guest)
     *       - in: query
     *         name: dock
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include dock
     *       - in: query
     *         name: double oval frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include double oval frame
     *       - in: query
     *         name: farm
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include farm
     *       - in: query
     *         name: fence
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include fence
     *       - in: query
     *         name: fire
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include fire
     *       - in: query
     *         name: florida frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include florida frame
     *       - in: query
     *         name: flowers
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include flowers
     *       - in: query
     *         name: fog
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include fog
     *       - in: query
     *         name: framed
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include framed paintings
     *       - in: query
     *         name: grass
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include grass
     *       - in: query
     *         name: guest
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include episodes with a guest
     *       - in: query
     *         name: half circle frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include half circle frame
     *       - in: query
     *         name: half oval frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include half oval frame
     *       - in: query
     *         name: hills
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include hills
     *       - in: query
     *         name: lake
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include lake
     *       - in: query
     *         name: lakes
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include multiple lakes
     *       - in: query
     *         name: lighthouse
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include lighthouse
     *       - in: query
     *         name: mill
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include mill
     *       - in: query
     *         name: moon
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include moon
     *       - in: query
     *         name: mountains
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include mountains
     *       - in: query
     *         name: night
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include night scene
     *       - in: query
     *         name: ocean
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include ocean
     *       - in: query
     *         name: oval frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include oval frame
     *       - in: query
     *         name: palm trees
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include palm trees
     *       - in: query
     *         name: path
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include path
     *       - in: query
     *         name: person
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include person
     *       - in: query
     *         name: portrait
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include portrait
     *       - in: query
     *         name: rectangle 3d frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include rectangle 3d frame
     *       - in: query
     *         name: rectangular frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include rectangular frame
     *       - in: query
     *         name: river
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include river
     *       - in: query
     *         name: rocks
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include rocks
     *       - in: query
     *         name: seashell frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include seashell frame
     *       - in: query
     *         name: snow
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include snow
     *       - in: query
     *         name: snowy mountain
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include snowy mountain
     *       - in: query
     *         name: split frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include split frame
     *       - in: query
     *         name: steve ross
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include Steve Ross (Bob's son)
     *       - in: query
     *         name: structure
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include structure
     *       - in: query
     *         name: sun
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include sun
     *       - in: query
     *         name: tomb frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include tomb frame
     *       - in: query
     *         name: trees
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include trees
     *       - in: query
     *         name: triple frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include triple frame
     *       - in: query
     *         name: waterfall
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include waterfall
     *       - in: query
     *         name: waves
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include waves
     *       - in: query
     *         name: windmill
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include windmill
     *       - in: query
     *         name: window frame
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include window frame
     *       - in: query
     *         name: winter
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include winter scene
     *       - in: query
     *         name: wood framed
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include wood framed
     *     responses:
     *       200:
     *         description: List of episodes with the specified subject(s)
     *       400:
     *         description: No filter parameters provided
     *       500:
     *         description: Server error
     */
    app.get("/filter-subjects", async (req, res) => {
      try {
        console.log("Received filter-subjects request with query:", req.query);

        if (Object.keys(req.query).length === 0) {
          console.log("No query parameters provided");
          return res.status(400).json({
            error: "No filter parameters provided",
            message:
              "Please provide at least one subject filter (e.g., ?mountains=1)",
          });
        }

        const subjectMatterCollection = database.collection("subject_matter");
        const results = await filterBySubject(
          subjectMatterCollection,
          req.query
        );

        console.log(`Returning ${results.length} results`);
        res.json(results);
      } catch (err) {
        console.error("Error fetching subjects:", err.message);
        res
          .status(500)
          .json({ error: "Internal Server Error", message: err.message });
      }
    });

    /**
     * @swagger
     * /filter-colors:
     *   get:
     *     summary: Filter episodes by colors used
     *     description: Returns episodes that use the specified color(s)
     *     parameters:
     *       - in: query
     *         name: color
     *         schema:
     *           type: string
     *         required: true
     *         description: Color(s) to filter by (e.g., "bright red" or "bright red,titanium white")
     *       - in: query
     *         name: filterLogic
     *         schema:
     *           type: string
     *           enum: [AND, OR]
     *         description: Logic to apply when multiple colors are specified (default is OR)
     *     responses:
     *       200:
     *         description: List of episodes using the specified color(s)
     *       400:
     *         description: Missing color parameter
     *       500:
     *         description: Server error
     */
    app.get("/filter-colors", async (req, res) => {
      const { color, filterLogic } = req.query;

      try {
        if (color) {
          const episodes = await filterByColors(
            database,
            color,
            filterLogic || "OR"
          );
          res.json(episodes);
        } else {
          res.status(400).json({ error: "Color filter is required" });
        }
      } catch (error) {
        console.error("Error fetching episodes:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    /**
     * @swagger
     * /filter-episodes:
     *   get:
     *     summary: Filter episodes with combined criteria
     *     description: Returns episodes that match multiple filter criteria
     *     parameters:
     *       - in: query
     *         name: month
     *         schema:
     *           type: string
     *         description: Month to filter by
     *       - in: query
     *         name: filterLogic
     *         schema:
     *           type: string
     *           enum: [AND, OR]
     *         description: Logic to apply when multiple filters are specified (default is AND)
     *       - in: query
     *         name: additionalParams
     *         description: Additional parameters for subjects (e.g., mountains=1) or colors (e.g., sap green) or both combined (e.g., waterfall=1,sap green)
     *     responses:
     *       200:
     *         description: List of episodes matching the combined criteria
     *       500:
     *         description: Server error
     */
    app.get("/filter-episodes", async (req, res) => {
      try {
        const { month, filterLogic } = req.query;

        // Extract dynamic query parameters for subjects and colors
        const dynamicQueryParams = { ...req.query };
        delete dynamicQueryParams.month;
        delete dynamicQueryParams.filterLogic;

        const episodes = await combinedFilter(database, {
          month,
          queryParams: dynamicQueryParams,
          filterLogic: filterLogic || "AND",
        });

        res.json(episodes);
      } catch (error) {
        console.error("Error combining filters:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    /**
     * @swagger
     * /available-colors:
     *   get:
     *     summary: Get all available colors
     *     description: Returns a list of all colors that can be used for filtering
     *     responses:
     *       200:
     *         description: List of available colors
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *       500:
     *         description: Server error
     */
    app.get("/available-colors", async (req, res) => {
      try {
        const colors = await database
          .collection("colors_used")
          .aggregate([
            { $unwind: "$colors" },
            { $group: { _id: "$colors" } },
            { $sort: { _id: 1 } },
          ])
          .toArray();

        res.json(colors.map((item) => item._id));
      } catch (error) {
        console.error("Error fetching available colors:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `Swagger documentation available at http://localhost:${PORT}/api-docs`
      );
    });

    process.on("SIGINT", async () => {
      await dbClient.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
})();
