// test.js
import { isValidJSON } from './jsonValidator.js';

function runTests() {
  const testCases = [
    { input: '{}', expected: true, description: 'Empty object' },
    { input: '{"key": "value"}', expected: true, description: 'Simple key-value pair' },
    { input: '{"key1": "value1", "key2": "value2"}', expected: true, description: 'Multiple key-value pairs' },
    { input: '{"key": "value",}', expected: false, description: 'Trailing comma' },
    { input: '{"key" "value"}', expected: false, description: 'Missing colon' },
    { input: '{key: "value"}', expected: false, description: 'Unquoted key' },
    { input: '{"key": value}', expected: false, description: 'Unquoted value' },
    { input: '{{}}', expected: false, description: 'Nested empty objects' },
    { input: '{"key": "value", key2: "value2"}', expected: false, description: 'Mixed quoted and unquoted keys' },
    { input: '{"key": "value"', expected: false, description: 'Unclosed object' },
    { input: '{"key": "value}', expected: false, description: 'Unclosed string' },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${testCase.input}`);
    const result = isValidJSON(testCase.input);
    console.log(`Result: ${result}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Pass: ${result === testCase.expected}`);
    console.log('---');
  });
}

runTests();