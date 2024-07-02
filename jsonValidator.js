// jsonValidator.js
import { Lexer } from './lexer.js';
import { Parser } from './parser/parser.js';
import { ParseError } from './parser/parseError.js';

export function isValidJSON(jsonString) {
  try {
    const lexer = new Lexer(jsonString);
    const parser = new Parser(lexer);
    return parser.parse();
  } catch (error) {
    if (error instanceof ParseError) {
      console.error(`Parsing error at position ${error.position}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error.message}`);
    }
    return false;
  }
}
