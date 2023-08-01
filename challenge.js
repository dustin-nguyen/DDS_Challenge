const fs = require("fs");

// take input from the command line
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("correct usage: node challenge.js file.txt");
  process.exit(1);
}
const filename = args[0];
readFileAndCleanData(filename);
console.log(step1(filename));
console.log(step2(filename));

// read the file and remove all non-alphanumeric characters
function readFileAndCleanData(filename) {
  const data = fs.readFileSync(filename, "utf8", function (err, data) {
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

// step1 -> read file and count string
function step1(filename) {
  const data = fs.readFileSync(filename, "utf8", function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    return data;
  });
    
  const splitedData = data.split(",");
  const countMap = {};
  for (s of splitedData) {
    if (countMap[s]) countMap[s] += 1;
    else countMap[s] = 1;
  }

  const sortedCountMap = sortMap(countMap);
  
  return sortedCountMap;
}

// step2 -> read file and store string's location
function step2(filename) {
  const data = fs.readFileSync(filename, "utf8", function (err, data) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      return data;
    });

  const splitedData = data.split(",");
  const indexMap = {};
  for (let i = 0; i < splitedData.length; i++) { 
    const string = splitedData[i];
    if (indexMap[string]) indexMap[string].push(i);
    else indexMap[string] = [i];
  }

    const sortedCountMap = sortMap(indexMap);
   
    return sortedCountMap;
}
// sorted by numbers followed by text in ascending order.
function sortMap(map) {
  const sortedCountMap = {};
  Object.keys(map)
    .sort(function (a, b) {
      // if both are numbers
      if (isNaN(a) && isNaN(b)) return a.localeCompare(b);

      if (isNaN(a)) return 1;
      if (isNaN(b)) return -1;
      // if both are not numbers
      return parseInt(a) - parseInt(b);
    })
    .forEach(function (key) {
      sortedCountMap[key] = map[key];
    });
    return sortedCountMap;
}
