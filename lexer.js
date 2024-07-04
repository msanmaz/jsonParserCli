// lexer.js
import {TokenType} from './token/tokenTypes.js'
import { Token } from './token/token.js';
import { ParseError } from './parser/parseError.js';

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
  }

  nextToken() {
    this.skipWhitespace();

    if (this.position >= this.input.length) {
      return new Token(TokenType.EOF, null);
    }

    const char = this.input[this.position];

    switch (char) {
      case '{': return this.createToken(TokenType.LEFT_BRACE, '{');
      case '}': return this.createToken(TokenType.RIGHT_BRACE, '}');
      case ':': return this.createToken(TokenType.COLON, ':');
      case ',': return this.createToken(TokenType.COMMA, ',');
      case '"': return this.readString();
      case 't': case 'f': case 'n': return this.readKeyword();
      case '[': return this.createToken(TokenType.LEFT_BRACKET, '[');
      case ']': return this.createToken(TokenType.RIGHT_BRACKET, ']');
      default:
        if (this.isDigit(char) || char === '-') return this.readNumber();
        throw new ParseError(`Unexpected character: ${char}`, this.position);
    }
  }

  createToken(type, value) {
    this.position++;
    return new Token(type, value);
  }

  readString() {
    let value = '';
    const startPos = this.position;
    this.position++; // Skip the opening quote
    while (this.position < this.input.length && this.input[this.position] !== '"') {
      if (this.input[this.position] === '\\') {
        this.position++;
        if (this.position >= this.input.length) {
          throw new ParseError('Unterminated string', startPos);
        }
        value += this.input[this.position];
      } else if (this.input[this.position] === '\n') {
        throw new ParseError('Unescaped newline in string', this.position);
      } else {
        value += this.input[this.position];
      }
      this.position++;
    }
    if (this.position < this.input.length) {
      this.position++; // Skip the closing quote
    } else {
      throw new ParseError('Unterminated string', startPos);
    }
    return new Token(TokenType.STRING, value);
  }

  readNumber() {
    let value = '';
    const startPos = this.position;
    let hasDot = false;
    let hasE = false;

    // Handle leading minus
    if (this.input[this.position] === '-') {
      value += this.input[this.position++];
    }

    // Handle integer part
    if (this.input[this.position] === '0') {
      value += this.input[this.position++];
      if (this.isDigit(this.input[this.position])) {
        throw new ParseError('Leading zeros are not allowed', startPos);
      }
    } else while (this.isDigit(this.input[this.position])) {
      value += this.input[this.position++];
    }

    // Handle fraction part
    if (this.input[this.position] === '.') {
      hasDot = true;
      value += this.input[this.position++];
      if (!this.isDigit(this.input[this.position])) {
        throw new ParseError('Expecting digit after decimal point', this.position);
      }
      while (this.isDigit(this.input[this.position])) {
        value += this.input[this.position++];
      }
    }

    // Handle exponent part
    if (this.input[this.position] === 'e' || this.input[this.position] === 'E') {
      hasE = true;
      value += this.input[this.position++];
      if (this.input[this.position] === '+' || this.input[this.position] === '-') {
        value += this.input[this.position++];
      }
      if (!this.isDigit(this.input[this.position])) {
        throw new ParseError('Expecting digit in exponent', this.position);
      }
      while (this.isDigit(this.input[this.position])) {
        value += this.input[this.position++];
      }
    }

    if (hasDot && value.endsWith('.')) {
      throw new ParseError('Number cannot end with decimal point', this.position - 1);
    }

    return new Token(TokenType.NUMBER, Number(value));
  }

  readKeyword() {
    const keywords = {
      'true': true,
      'false': false,
      'null': null
    };
    let value = '';
    const startPos = this.position;
    while (this.position < this.input.length && this.isAlpha(this.input[this.position])) {
      value += this.input[this.position];
      this.position++;
    }
    if (keywords.hasOwnProperty(value)) {
      return new Token(value === 'null' ? TokenType.NULL : TokenType.BOOLEAN, keywords[value]);
    }
    throw new ParseError(`Unexpected keyword: ${value}`, startPos);
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  isDigit(char) {
    return char >= '0' && char <= '9';
  }

  isAlpha(char) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }
}