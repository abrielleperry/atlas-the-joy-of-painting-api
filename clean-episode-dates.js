const fs = require("fs");
const { parse } = require("json2csv");

const filePath = "Episode-Dates.csv";

// Read the raw content of the file
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const rawContent = data.split("\n");

  // Process the raw content to extract episode name, date, and extra information
  const processedData = rawContent
    .map((line) => {
      const match = line.trim().match(/"(.+)"\s\((.+)\)/);
      if (match) {
        let title = match[1];
        const dateExtra = match[2];

        // Replace 'Mount McKinley' with 'Mt. McKinley' in the title
        title = title.replace("Mount McKinley", "Mt. McKinley");

        // Extract date and extra info
        const dateMatch = dateExtra.match(/([\w]+\s\d{1,2},\s\d{4})(.*)/);
        let date, extra;

        if (dateMatch) {
          date = dateMatch[1].trim();
          extra = dateMatch[2].trim().replace(/[()]/g, ""); // Remove all `(` and `)` characters
        } else {
          date = dateExtra.trim();
          extra = "";
        }

        return { Title: title, Date: date, Extra: extra };
      }
      return null; // Ignore lines that don't match
    })
    .filter((item) => item !== null); // Remove null values from invalid lines

  // Convert processed data to CSV
  const fields = ["Title", "Date", "Extra"];
  const csvData = parse(processedData, { fields });

  // Save the cleaned data to the same CSV file
  fs.writeFile(filePath, csvData, (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
    } else {
      console.log(`Cleaned data has been saved to ${filePath}.`);
    }
  });
});
