const fs = require("fs");

// Function to calculate the nth Fibonacci number
function fibonacci(n) {
  //Enter your code here ...
}

// Function to parse the saved Fibonacci test cases from a file
function parseFibonacciTestCases(fileContent) {
    const testCases = fileContent.trim().split("\n\n"); // Split into individual test cases

    return testCases.map((testCase) => {
        const lines = testCase.trim().split("\n");

        const n = parseInt(lines[0].trim(), 10);
        const expectedResult = parseInt(lines[1].trim(), 10);

        return { n, expectedResult };
    });
}

// Function to read test cases from a file and test the Fibonacci function
function testFibonacciFromFile(txtFilename = "fibonacci-test-case.txt") {
    const fileContent = fs.readFileSync(txtFilename, "utf8");
    const testCases = parseFibonacciTestCases(fileContent);

    for (let index = 0; index < testCases.length; index++) {
        const { n, expectedResult } = testCases[index];
        const result = fibonacci(n);

        if (result !== expectedResult) {
            console.log(`Test case ${index + 1} failed:`);
            console.log(`  Input n: ${n}`);
            console.log(`  Expected: ${expectedResult}`);
            console.log(`  Got: ${result}`);
            return;  // Exit after printing the first failed test case
        }
    }
}

// Example usage: Run tests from the file
testFibonacciFromFile("test-case.txt");