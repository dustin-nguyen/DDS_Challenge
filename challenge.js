const fs = require("fs");

// take input from the command line
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("correct usage: node challenge.js file.txt");
  process.exit(1);
}
const filename = args[0];
readFileAndCleanData(filename);


// read the file and remove all non-alphanumeric characters
function readFileAndCleanData(filename) {
    const data =fs.readFileSync(filename, "utf8", function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        return data;
    });
    const cleanData = data.replace(/[^a-zA-Z0-9,]/g, "");
    fs.writeFileSync(filename, cleanData, function (err) { 
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
}
