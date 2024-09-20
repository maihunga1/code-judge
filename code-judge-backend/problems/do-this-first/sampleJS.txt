const fs = require('fs');
const testCaseFilePath = 'test-case.txt';

function addTwoNumbers(a, b) {
    //Enter your code here ...
}

fs.readFile(testCaseFilePath, 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    const lines = data.trim().split('\\n');
    for (let line of lines) {
        const [aStr, bStr, expectedStr] = line.split(' ');
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const expected = parseInt(expectedStr, 10);
        const result = addTwoNumbers(a, b);
        if (expected !== result) {
            console.log(`a = ${a}, b = ${b}`);
            console.log(`expected ${expected}, got ${result}`);
            break;
        }
    }
});
