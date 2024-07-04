// test.js
import { isValidJSON } from './jsonValidator.js';

function runTests() {
  const testCases = [
    // Existing test cases
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

    // New test cases for different value types
    { input: '{"string": "value", "number": 42, "boolean": true, "null": null}', expected: true, description: 'Different value types' },
    { input: '{"nested": {"key": "value"}}', expected: true, description: 'Nested object' },

    // Test cases from previous discussion
    { input: '{"key1": true, "key2": False, "key3": null, "key4": "value", "key5": 101}', expected: false, description: 'Invalid boolean (capitalized)' },
    { input: '{"key1": true, "key2": false, "key3": null, "key4": "value", "key5": 101}', expected: true, description: 'Valid mixed types' },

    // Edge cases
    { input: '{"key": 01}', expected: false, description: 'Leading zero in number' },
    { input: '{"key": .5}', expected: false, description: 'Number starting with decimal point' },
    { input: '{"key": 1.}', expected: false, description: 'Number ending with decimal point' },
    { input: '{"key": 1e10}', expected: true, description: 'Scientific notation' },
    { input: '{"key": -0}', expected: true, description: 'Negative zero' },
    { input: '{"key": true, "key": false}', expected: true, description: 'Duplicate keys (valid in JSON, but might be unwanted)' },
    { input: '{"key": "\\u0041"}', expected: true, description: 'Unicode escape' },
    { input: '{"key": "value\\nnewline"}', expected: true, description: 'String with escaped newline' },
    { input: '{"key": "value\nnewline"}', expected: false, description: 'String with unescaped newline' },

    // Additional edge cases
    { input: '{"key": Infinity}', expected: false, description: 'Infinity is not valid JSON' },
    { input: '{"key": NaN}', expected: false, description: 'NaN is not valid JSON' },
    { input: '{"key": undefined}', expected: false, description: 'undefined is not valid JSON' },
    { input: '{"key": [1, 2, 3]}', expected: true, description: 'Array value' },
    { input: '[]', expected: false, description: 'Array at top level (our parser expects an object)' },
    { input: '{"key": ""}', expected: true, description: 'Empty string value' },
    { input: '{"": "value"}', expected: true, description: 'Empty string key' },
    { input: '{"key": "\\u005C"}', expected: true, description: 'Escaped backslash' },
    { input: '{"key": "\\""}', expected: true, description: 'Escaped quote in string' },
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