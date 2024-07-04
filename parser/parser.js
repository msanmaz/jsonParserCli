// parser.js
import { TokenType } from '../token/tokenTypes.js';
import { ParserState } from './parserState.js';
import { ParseError } from './parseError.js';

export class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.nextToken();
    this.depth = 0;
  }

  parse() {
    console.log('Starting to parse JSON');
    let state = ParserState.START;

    while (this.currentToken.type !== TokenType.EOF) {
      console.log(`Current state: ${state}, Current token: ${JSON.stringify(this.currentToken)}`);
      
      switch (state) {
        case ParserState.START:
          state = this.handleStartState();
          break;
        case ParserState.KEY:
          state = this.handleKeyState();
          break;
        case ParserState.COLON:
          state = this.handleColonState();
          break;
        case ParserState.VALUE:
          state = this.handleValueState();
          break;
        case ParserState.COMMA:
          state = this.handleCommaState();
          break;
        case ParserState.END:
          return true; // Successfully parsed
      }
      
      if (state !== ParserState.END) {
        this.currentToken = this.lexer.nextToken();
      }
    }

    console.log(`Parsing complete. Final state: ${state}, Depth: ${this.depth}`);
    return state === ParserState.END && this.depth === 0;
  }

  handleStartState() {
    console.log('Handling START state');
    if (this.currentToken.type === TokenType.LEFT_BRACE) {
      this.depth++;
      console.log(`Found opening brace. Depth is now ${this.depth}`);
      return ParserState.KEY;
    } else {
      throw new ParseError(`Expected '{' at the start of the JSON object`, this.lexer.position);
    }
  }

  handleKeyState() {
    console.log('Handling KEY state');
    if (this.currentToken.type === TokenType.STRING) {
      console.log(`Found key: ${this.currentToken.value}`);
      return ParserState.COLON;
    } else if (this.currentToken.type === TokenType.RIGHT_BRACE) {
      if (this.depth === 1 && this.lexer.position > 2) { // Check for trailing comma
        throw new ParseError('Trailing comma is not allowed', this.lexer.position - 1);
      }
      this.depth--;
      console.log(`Found closing brace. Depth is now ${this.depth}`);
      return this.depth === 0 ? ParserState.END : ParserState.COMMA;
    } else {
      throw new ParseError(`Expected string key or '}', found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  handleColonState() {
    console.log('Handling COLON state');
    if (this.currentToken.type === TokenType.COLON) {
      console.log('Found colon');
      return ParserState.VALUE;
    } else {
      throw new ParseError(`Expected ':' after key, found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  handleValueState() {
    console.log('Handling VALUE state');
    if ([TokenType.STRING, TokenType.NUMBER, TokenType.BOOLEAN, TokenType.NULL].includes(this.currentToken.type)) {
      console.log(`Found value: ${this.currentToken.value}`);
      return ParserState.COMMA;
    } else if (this.currentToken.type === TokenType.LEFT_BRACE) {
      this.parseNestedObject();
      return ParserState.COMMA;
    } else if (this.currentToken.type === TokenType.LEFT_BRACKET) {
      this.parseArray();
      return ParserState.COMMA;
    } else {
      throw new ParseError(`Expected value, found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  handleCommaState() {
    console.log('Handling COMMA state');
    if (this.currentToken.type === TokenType.COMMA) {
      console.log('Found comma');
      return ParserState.KEY;
    } else if (this.currentToken.type === TokenType.RIGHT_BRACE) {
      this.depth--;
      console.log(`Found closing brace. Depth is now ${this.depth}`);
      return this.depth === 0 ? ParserState.END : ParserState.COMMA;
    } else {
      throw new ParseError(`Expected ',' or '}', found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  parseNestedObject() {
    this.depth++;
    let state = ParserState.KEY;
    while (true) {
      this.currentToken = this.lexer.nextToken();
      switch (state) {
        case ParserState.KEY:
          if (this.currentToken.type === TokenType.RIGHT_BRACE) {
            this.depth--;
            return;
          }
          state = this.handleKeyState();
          break;
        case ParserState.COLON:
          state = this.handleColonState();
          break;
        case ParserState.VALUE:
          state = this.handleValueState();
          break;
        case ParserState.COMMA:
          if (this.currentToken.type === TokenType.RIGHT_BRACE) {
            this.depth--;
            return;
          }
          state = this.handleCommaState();
          if (state === ParserState.END) {
            return;
          }
          break;
      }
    }
  }

  parseArray() {
    console.log('Parsing array');
    while (this.currentToken.type !== TokenType.RIGHT_BRACKET) {
      this.currentToken = this.lexer.nextToken(); // Move to the next token
      console.log(`Array element token: ${JSON.stringify(this.currentToken)}`);
      
      if ([TokenType.STRING, TokenType.NUMBER, TokenType.BOOLEAN, TokenType.NULL].includes(this.currentToken.type)) {
        // Valid array element
        console.log(`Found array element: ${this.currentToken.value}`);
      } else if (this.currentToken.type === TokenType.LEFT_BRACE) {
        this.parseNestedObject();
      } else if (this.currentToken.type === TokenType.LEFT_BRACKET) {
        this.parseArray();
      } else if (this.currentToken.type === TokenType.RIGHT_BRACKET) {
        // End of array
        break;
      } else {
        throw new ParseError(`Expected array element or ']', found '${this.currentToken.value}'`, this.lexer.position);
      }

      // Check for comma or end of array
      this.currentToken = this.lexer.nextToken();
      if (this.currentToken.type === TokenType.COMMA) {
        // Move to the next element
        continue;
      } else if (this.currentToken.type === TokenType.RIGHT_BRACKET) {
        // End of array
        break;
      } else {
        throw new ParseError(`Expected ',' or ']', found '${this.currentToken.value}'`, this.lexer.position);
      }
    }
    console.log('Finished parsing array');
  }
}