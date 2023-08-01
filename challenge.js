const fs = require("fs");
const assert = require("assert");

// take input from the command line
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("correct usage: node challenge.js file.txt");
  process.exit(1);
}
const filename = args[0];
(async () => {
  await readFileAndCleanData(filename);
  console.log("Step 1 Output:");
  console.log(JSON.stringify(step1(filename), null, 2));

  console.log("Step 2 Output:");
  console.log(JSON.stringify(step2(filename), null, 2));

  console.log("Step 3 Output:");
  console.log(JSON.stringify(await step3(filename), null, 2));
})();

// read the file and remove all non-alphanumeric characters
async function readFileAndCleanData(filename) {
  try {
    const data = await fs.promises.readFile(filename, "utf8");
    const splitedData = data.split(",");
    const cleanData = splitedData
      .filter((s) => s.match(/^[a-zA-Z0-9]+$/))
      .join(",");

    await fs.promises.writeFile(filename, cleanData, "utf8");
  } catch (err) {
    console.error("Error reading/cleaning/writing the file:", err);
    process.exit(1);
  }
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
// step3 -> read file and combine 1 and 2
async function step3(filename) {
  const step1Output = await step1(filename);
  const step2Output = await step2(filename);

  const step3Output = {};
  for (const key of Object.keys(step1Output)) {
    step3Output[key] = {
      count: step1Output[key],
      indices: step2Output[key],
    };
  }

  return step3Output;
}
// Unit Tests
// Unit Tests
async function runTests() {
  const testData = "1,2,1,1,3,hello,invalid!,4,1,2,hello,text";
  const testFilename = "test_input.txt";

  // Write test data to a temporary file
  await fs.promises.writeFile(testFilename, testData, "utf8");
  await readFileAndCleanData(testFilename);

  const testStep1Output = await step1(testFilename);
  const testStep2Output = await step2(testFilename);
  const testStep3Output = await step3(testFilename);

  // Clean up the temporary file
  await fs.promises.unlink(testFilename);

  const expectedStep1Output = {
    1: 4,
    2: 2,
    3: 1,
    4: 1,
    hello: 2,
    text: 1,
  };

  const expectedStep2Output = {
    1: [0, 2, 3, 7],
    2: [1, 8],
    3: [4],
    4: [6],
    hello: [5, 9],
    text: [10],
  };

  const expectedStep3Output = {
    1: {
      count: 4,
      indices: [0, 2, 3, 7],
    },
    2: {
      count: 2,
      indices: [1, 8],
    },
    3: {
      count: 1,
      indices: [4],
    },
    4: {
      count: 1,
      indices: [6],
    },
    hello: {
      count: 2,
      indices: [5, 9],
    },
    text: {
      count: 1,
      indices: [10],
    },
  };

  assert.deepStrictEqual(testStep1Output, expectedStep1Output);
  assert.deepStrictEqual(testStep2Output, expectedStep2Output);
  assert.deepStrictEqual(testStep3Output, expectedStep3Output);

  console.log("All tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test Error:", err.message);
});
