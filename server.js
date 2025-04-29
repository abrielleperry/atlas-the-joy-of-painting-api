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
      res.json({ message: "Welcome to The Joy of Painting API!" });
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
     *         name: mountains
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include mountains
     *       - in: query
     *         name: trees
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include trees
     *       - in: query
     *         name: clouds
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include clouds
     *       - in: query
     *         name: lake
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include lake
     *       - in: query
     *         name: snow
     *         schema:
     *           type: string
     *           enum: ["1"]
     *         description: Set to 1 to include snow
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
     *         description: Additional parameters for subjects (e.g., mountains=1) or colors
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
