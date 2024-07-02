// lexer.js
import { TokenType } from './token/tokenTypes.js';
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
      default: return this.readUnquoted();
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
      value += this.input[this.position];
      this.position++;
    }
    if (this.position < this.input.length) {
      this.position++; // Skip the closing quote
    } else {
      throw new ParseError('Unterminated string', startPos);
    }
    return new Token(TokenType.STRING, value);
  }

  readUnquoted() {
    let value = '';
    while (this.position < this.input.length && !['{', '}', ':', ',', '"', ' ', '\n', '\t', '\r'].includes(this.input[this.position])) {
      value += this.input[this.position];
      this.position++;
    }
    return new Token(TokenType.UNQUOTED, value);
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }
}