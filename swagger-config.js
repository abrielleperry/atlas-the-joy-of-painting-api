const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "The Joy of Painting API",
      version: "1.0.0",
      description:
        'API for Bob Ross painting data from "The Joy of Painting" TV series',
      contact: {
        name: "API Support",
        url: "https://github.com/abrielleperry/atlas-the-joy-of-painting-api",
      },
    },
    servers: [
      //  {
      //    url: "http://localhost:5001",
      //    description: "Development server",
      //   },
      //  {
      //   url: "https://your-production-url.vercel.app",
      //   description: "Production server (update after deployment)",
      //  },
      {
        url: "https://joy-of-painting-api-74b668857b2b.herokuapp.com",
        description: "Heroku server",
      },
    ],
    components: {
      parameters: {
        subjectParam: {
          name: "subject",
          in: "query",
          description: "Set to 1 to include this subject",
          schema: {
            type: "string",
            enum: ["1"],
          },
        },
      },
    },
  },
  apis: ["./server.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
