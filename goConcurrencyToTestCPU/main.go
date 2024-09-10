package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
)

type Submission struct {
	TitleSlug       string `json:"titleSlug"`
	CodeFileContent string `json:"codeFileContent"`
	Language        string `json:"language"`
}

var submission = Submission{
	TitleSlug: "fibonacci",
	CodeFileContent: `
		const fs = require("fs");

		// Function to calculate the nth Fibonacci number
		function fibonacci(n) {
			if (n === 0) return 0;
			if (n === 1) return 1;

			let a = 0, b = 1;
			for (let i = 2; i <= n; i++) {
				let next = a + b;
				a = b;
				b = next;
			}
			return b;
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

			let allTestsPassed = true;

			testCases.forEach((testCase, index) => {
				const { n, expectedResult } = testCase;
				const result = fibonacci(n);

				if (result !== expectedResult) {
					console.log("Test case " + (index + 1) + " failed:");
					console.log("Input n: " + n);
					console.log("Expected: " + expectedResult);
					console.log("Got: " + result);
					allTestsPassed = false;
				}
			});

			if (allTestsPassed) {
				console.log("All test cases passed!");
			}
		}

		// Example usage: Run tests from the file
		testFibonacciFromFile("test-case.txt");
	`,
	Language: "javascript",
}

func main() {
	jsonData, _ := json.Marshal(submission)

	var wg sync.WaitGroup

	for i := 0; i < 500; i++ {
		wg.Add(1)
		go func(num int) {
			defer wg.Done()
			req, err := http.NewRequest("POST", "http://ec2-3-106-143-64.ap-southeast-2.compute.amazonaws.com:3000/submissions", bytes.NewBuffer(jsonData))
			if err != nil {
				fmt.Println(err)
			}

			fmt.Printf("making request %d\n", num)

			req.Header.Set("Content-Type", "application/json")

			rsp, err := http.DefaultClient.Do(req)
			if err != nil {
					fmt.Println(err)
					return // Or handle the error appropriately
			}
			defer rsp.Body.Close()

			// Read the response body
			body, err := ioutil.ReadAll(rsp.Body)
			if err != nil {
					fmt.Println("Error reading response body:", err)
					return // Or handle the error appropriately
			}

			// Print the response body (as a string, assuming it's text)
			fmt.Println(string(body))
		}(i)
	}

	wg.Wait()

	// time.Sleep(10 * time.Second)
}