const fs = require("fs");
const { parse } = require("json2csv");
const csv = require("csv-parser");

const inputFile = "./datasets/Colors-Used.csv";
const outputFile = "./datasets/Colors-Used.csv";

const rows = [];
fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => rows.push(row))
  .on("end", () => {
    const updatedRows = rows.map((row) => {
      const updatedRow = {};
      Object.keys(row).forEach((col) => {
        // Replace underscores with spaces and make lowercase
        let newCol = col.replace(/_/g, " ").toLowerCase();
        
        // Handle specific column name replacements and convert to lowercase
        if (newCol === "num colors") newCol = "number of colors";
        if (newCol === "youtube src") newCol = "youtube source";
        if (newCol === "") newCol = "index";
        if (newCol === "img src") newCol = "image source";
        if (newCol === "painting title") newCol = "title";

        // Assign the updated column name to the value and make value lowercase
        updatedRow[newCol] = row[col].toLowerCase();
      });
      return updatedRow;
    });

    // Ensure headers are lowercase in the final CSV
    const fields = Object.keys(updatedRows[0]);
    const updatedCsv = parse(updatedRows, { fields });

    fs.writeFile(outputFile, updatedCsv, (err) => {
      if (err) {
        console.error("Error writing the updated CSV:", err);
      } else {
        console.log("Updated CSV saved successfully!");
      }
    });
  })
  .on("error", (err) => {
    console.error("Error reading the CSV file:", err);
  });
