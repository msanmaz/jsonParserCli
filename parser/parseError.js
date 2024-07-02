export class ParseError extends Error {
    constructor(message, position) {
      super(message);
      this.name = "ParseError";
      this.position = position;
    }
  }