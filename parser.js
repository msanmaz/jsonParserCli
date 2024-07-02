// parser.js
import { TokenType } from './tokenTypes.js';
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
          console.log('Reached END state unexpectedly');
          throw new ParseError(`Unexpected token after end of JSON object: '${this.currentToken.value}'`, this.lexer.position);
      }
      
      if (state !== ParserState.END) {
        this.currentToken = this.lexer.nextToken();
      }
    }

    console.log(`Parsing complete. Final state: ${state}, Depth: ${this.depth}`);
    if (state !== ParserState.END || this.depth !== 0) {
      console.log('Error: Unexpected end of input');
      throw new ParseError(`Unexpected end of input`, this.lexer.position);
    }

    return true;
  }

  handleStartState() {
    console.log('Handling START state');
    if (this.currentToken.type === TokenType.LEFT_BRACE) {
      this.depth++;
      console.log(`Found opening brace. Depth is now ${this.depth}`);
      return ParserState.KEY;
    } else {
      console.log(`Error: Expected '{' but found ${this.currentToken.value}`);
      throw new ParseError(`Expected '{' at the start of the JSON object`, this.lexer.position);
    }
  }

  handleKeyState() {
    console.log('Handling KEY state');
    if (this.currentToken.type === TokenType.STRING) {
      console.log(`Found key: ${this.currentToken.value}`);
      return ParserState.COLON;
    } else if (this.currentToken.type === TokenType.RIGHT_BRACE) {
      this.depth--;
      console.log(`Found closing brace. Depth is now ${this.depth}`);
      if (this.depth === 0) {
        console.log('Closing the outermost object');
        return ParserState.END;
      } else {
        console.log('Closing an inner object');
        return ParserState.COMMA;
      }
    } else if (this.currentToken.type === TokenType.UNQUOTED) {
      console.log(`Error: Found unquoted key ${this.currentToken.value}`);
      throw new ParseError(`Unquoted key '${this.currentToken.value}' is not allowed`, this.lexer.position - this.currentToken.value.length);
    } else {
      console.log(`Error: Expected string key or '}' but found ${this.currentToken.value}`);
      throw new ParseError(`Expected string key or '}', found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  handleColonState() {
    console.log('Handling COLON state');
    if (this.currentToken.type === TokenType.COLON) {
      console.log('Found colon');
      return ParserState.VALUE;
    } else {
      console.log(`Error: Expected ':' but found ${this.currentToken.value}`);
      throw new ParseError(`Expected ':' after key, found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  handleValueState() {
    console.log('Handling VALUE state');
    if (this.currentToken.type === TokenType.STRING) {
      console.log(`Found value: ${this.currentToken.value}`);
      return ParserState.COMMA;
    } else {
      console.log(`Error: Expected string value but found ${this.currentToken.value}`);
      throw new ParseError(`Expected string value, found '${this.currentToken.value}'`, this.lexer.position);
    }
  }

  handleCommaState() {
    console.log('Handling COMMA state');
    if (this.currentToken.type === TokenType.COMMA) {
      console.log('Found comma');
      const nextToken = this.lexer.nextToken();
      console.log(`Next token after comma: ${JSON.stringify(nextToken)}`);
      if (nextToken.type === TokenType.RIGHT_BRACE) {
        console.log('Error: Found trailing comma');
        throw new ParseError(`Trailing comma is not allowed`, this.lexer.position);
      }
      this.currentToken = nextToken;
      return ParserState.KEY;
    } else if (this.currentToken.type === TokenType.RIGHT_BRACE) {
      this.depth--;
      console.log(`Found closing brace. Depth is now ${this.depth}`);
      return this.depth === 0 ? ParserState.END : ParserState.COMMA;
    } else {
      console.log(`Error: Expected ',' or '}' but found ${this.currentToken.value}`);
      throw new ParseError(`Expected ',' or '}', found '${this.currentToken.value}'`, this.lexer.position);
    }
  }
}