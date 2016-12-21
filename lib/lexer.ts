export enum TokenType {
  Number,
  ReservedWord,
  String
}

export interface CodePosition {
  line: number;
  character: number;
}

export interface Token {
  type: TokenType;
  lexeme: string | number;
  position?: CodePosition;
}

export class Lexer {
  private current = 0;
  constructor(private program: string) {}

  lex() {
    let result = [];
    let current: string;
    let line = 0;
    let character = 0;
    this.program = this.program.replace('\r\n', '\n').replace('\r', '\n');
    while ((current = this.next())) {
      let token: Token;
      if (/\n/.test(current)) {
        line += 1;
        character = 0;
      } else {
        character += 1;
      }
      if (!/\s|\.|\?|!|;|:/.test(current)) {
        if (current === '"' || current === '`' || current === `'`) {
          token = this.readString(current);
        } else if (!isNaN(parseInt(current))) {
          token = this.readNumber();
        } else {
          token = this.readReservedWord();
        }
        token.position = {
          line, character
        };
        result.push(token);
      }
    }
    return result;
  }

  private readString(startQuote: string) {
    let result = '';
    let current: string;
    while ((current = this.next()) !== startQuote && !this.end()) {
      result += current;
    }
    return { lexeme: result, type: TokenType.String };
  }

  private readNumber() {
    let result = this.program[this.current - 1];
    let current: string;
    while (!isNaN(parseInt(current = this.next())) && !this.end()) {
      result += current;
    }
    return { lexeme: parseInt(result), type: TokenType.Number };
  }

  private readReservedWord() {
    let result = this.program[this.current - 1];
    let current: string;
    while (!/\s/.test(current = this.next()) && current && !this.end()) {
      result += current;
    }
    return { lexeme: result, type: TokenType.ReservedWord };
  }

  private next() {
    return this.program[this.current++];
  }

  private end() {
    return this.current >= this.program.length;
  }
}
