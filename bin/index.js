#!/usr/bin/env node

function isValidJSON(jsonString) {
    // Step 1: Check opening and closing brackets
    function checkBrackets(str) {
      return str.trim().startsWith('{') && str.trim().endsWith('}');
    }
  
    // Simple lexer to tokenize the input
    function lexer(input) {
      const tokens = [];
      let current = 0;
  
      while (current < input.length) {
        let char = input[current];
  
        if (char === '{' || char === '}') {
          tokens.push({
            type: 'bracket',
            value: char
          });
          current++;
          continue;
        }
  
        // Skip whitespace
        if (/\s/.test(char)) {
          current++;
          continue;
        }
  
        // For now, treat everything else as a single token
        let value = '';
        while (current < input.length && !/[\{\}\s]/.test(input[current])) {
          value += input[current];
          current++;
        }
        if (value.length > 0) {
          tokens.push({
            type: 'value',
            value: value
          });
        }
      }
  
      return tokens;
    }
  
    // Simple parser to check bracket structure
    function parser(tokens) {
      let bracketCount = 0;
  
      for (let token of tokens) {
        if (token.type === 'bracket') {
          if (token.value === '{') {
            bracketCount++;
          } else if (token.value === '}') {
            bracketCount--;
          }
  
          if (bracketCount < 0) {
            return false; // Closing bracket before opening
          }
        }
      }
  
      return bracketCount === 0; // All brackets should be closed
    }
  
    // Main validation logic
    if (!checkBrackets(jsonString)) {
      return false;
    }
  
    const tokens = lexer(jsonString);
    return parser(tokens);
  }
  
  // Main CLI logic
  function main() {
    // Check if a file path is provided
    if (process.argv.length < 3) {
      console.log("lenght argv", process.argv.length)
      console.error('Usage: node json-parser.js <path-to-json-file>');
      process.exit(1);
    }
  
    const fs = require('fs');
    const filePath = process.argv[2];
    console.log("process argv:", process.argv[2])
    try {
      const jsonString = fs.readFileSync(filePath, 'utf8');
      console.log("jsonString:", jsonString)
      const isValid = isValidJSON(jsonString);
  
      if (isValid) {
        console.log('JSON is valid');
        process.exit(0);
      } else {
        console.log('JSON is invalid');
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      process.exit(1);
    }
  }
  
  main();