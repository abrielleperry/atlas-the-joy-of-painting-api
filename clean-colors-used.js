const fs = require("fs");
const { parse } = require("json2csv");
const csv = require("csv-parser");

const inputFile = "Colors-Used.csv";
const outputFile = "Colors-Used.csv";

const rows = [];
fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => rows.push(row))
  .on("end", () => {
    const updatedRows = rows.map((row) => {
      const updatedRow = {};
      Object.keys(row).forEach((col) => {
        let newCol = col.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        if (newCol === "Num Colors") newCol = "Number of Colors";
        if (newCol === "Youtube Src") newCol = "Youtube Source";
        if (newCol === "") newCol = "Index";
        if (newCol === "Img Src") newCol = "Image Source";
        if (newCol === "Painting Title") newCol = "Title";

        updatedRow[newCol] = row[col];
      });
      return updatedRow;
    });

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
