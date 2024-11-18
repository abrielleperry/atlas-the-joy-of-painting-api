const fs = require('fs');
const path = require('path');

function replaceUnderscores(filePath, outputFilePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const updatedContent = data.replace(/_/g, ' ');


        const quotesRemovedContent = removeQuotesFromTitleColumn(updatedContent);
        const capitalizedContent = capitalizeFirstLetterOfWords(quotesRemovedContent);
        const seasonSplitContent = splitSeasonAndEpisode(capitalizedContent);

        fs.writeFile(outputFilePath, seasonSplitContent, (err) => {
            if (err) {
                console.error('Error writing to the file:', err);
                return;
            }

            console.log(`File successfully updated! New file saved as ${outputFilePath}`);
        });
    });
}

function removeQuotesFromTitleColumn(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');

    const titleIndex = headers.findIndex(header => header.trim().toLowerCase() === 'title');

    if (titleIndex === -1) {
        console.warn("No 'title' column found in the CSV file.");
        return csvContent;
    }

    const processedLines = lines.map((line, index) => {
        if (index === 0) return line;

        const cells = line.split(',');

        if (cells[titleIndex]) {
            cells[titleIndex] = cells[titleIndex].replace(/"/g, '');
        }

        return cells.join(',');
    });

    return processedLines.join('\n');
}

function capitalizeFirstLetterOfWords(csvContent) {
    const lines = csvContent.split('\n');
    return lines.map(line => {
        return line
            .split(',')
            .map(cell => 
                cell
                    .trim()
                    .toLowerCase()
                    .replace(/\b\w/g, char => char.toUpperCase())
            )
            .join(',');
    }).join('\n');
}

function splitSeasonAndEpisode(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');

    const episodeIndex = headers.findIndex(header => header.trim().toLowerCase() === 'episode');

    if (episodeIndex === -1) {
        console.warn("No 'Episode' column found in the CSV file.");
        return csvContent;
    }

    headers.splice(episodeIndex, 0, 'Season');

    const processedLines = lines.map((line, index) => {
        if (index === 0) return headers.join(',');

        const cells = line.split(',');

        const match = cells[episodeIndex]?.match(/S(\d+)E(\d+)/i);
        if (match) {
            const season = parseInt(match[1], 10);
            const episode = parseInt(match[2], 10);

            cells[episodeIndex] = episode;
            cells.splice(episodeIndex, 0, season);
        } else {
            cells.splice(episodeIndex, 0, '');
        }

        return cells.join(',');
    });

    return processedLines.join('\n');
}

const inputFilePath = path.resolve(__dirname, 'Subject-Matter.csv');
const outputFilePath = path.resolve(__dirname, 'Subject-Matter.csv');
replaceUnderscores(inputFilePath, outputFilePath);
