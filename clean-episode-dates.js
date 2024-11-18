const fs = require("fs");
const { parse } = require("json2csv");

const filePath = "Episode-Dates.csv";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const rawContent = data.split("\n");

  const processedData = rawContent
    .map((line) => {
      const match = line.trim().match(/"(.+)"\s\((.+)\)/);
      if (match) {
        let title = match[1];
        const dateExtra = match[2];

        title = title.replace("Mount McKinley", "Mt. McKinley");

        const dateMatch = dateExtra.match(/([\w]+\s\d{1,2},\s\d{4})(.*)/);
        let date, extra;

        if (dateMatch) {
          date = dateMatch[1].trim();
          extra = dateMatch[2].trim().replace(/[()]/g, "");
        } else {
          date = dateExtra.trim();
          extra = "";
        }

        return { Title: title, Date: date, Extra: extra };
      }
      return null;
    })
    .filter((item) => item !== null);

  const fields = ["Title", "Date", "Extra"];
  const csvData = parse(processedData, { fields });

  fs.writeFile(filePath, csvData, (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
    } else {
      console.log(`Cleaned data has been saved to ${filePath}.`);
    }
  });
});
