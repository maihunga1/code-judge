const fs = require("fs");

function twoSum(nums, target) {
  //Enter your code here ...
}

function parseTestCases(fileContent) {
  const testCases = fileContent.trim().split("\n\n");

  return testCases.map((testCase) => {
    const lines = testCase.trim().split("\n");

    const nums = lines[0]
      .trim()
      .split(" ")
      .map((num) => parseInt(num, 10));

    const target = parseInt(lines[1].trim(), 10);

    const result = lines[2]
      ? lines[2].trim() === ""
        ? []
        : lines[2]
            .trim()
            .split(", ")
            .map((n) => parseInt(n.trim(), 10))
      : [];

    return { nums, target, result };
  });
}

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function readAndTestCases(txtFilename = "test-case.txt") {
  const fileContent = fs.readFileSync(txtFilename, "utf8");
  const testCases = parseTestCases(fileContent);

  for (let index = 0; index < testCases.length; index++) {
    const { nums, target, result } = testCases[index];
    const output = twoSum(nums, target);

    if (!arraysAreEqual(output, result)) {
      console.log(`Test case ${index + 1} failed:`);
      console.log(`  Input nums: ${nums}`);
      console.log(`  Target: ${target}`);
      console.log(`  Expected: ${result}`);
      console.log(`  Got: ${output}`);
      return;
    }
  }
}

readAndTestCases("test-case.txt");
