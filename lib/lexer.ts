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
    while ((current = this.next())) {
      let token: Token;
      if (/\n/.test(current)) {
        line += 1;
        character = 0;
      } else {
        character += 1;
      }
      if (!/\s/.test(current)) {
        if (current === '"' || current === '`') {
          token = this.readString();
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

  readString() {
    let result = '';
    let current: string;
    while ((current = this.next()) !== '"' && current !== '`' && !this.end()) {
      result += current;
    }
    return { lexeme: result, type: TokenType.String };
  }

  readNumber() {
    let result = this.program[this.current - 1];
    let current: string;
    while (!isNaN(parseInt(current = this.next())) && !this.end()) {
      result += current;
    }
    return { lexeme: parseInt(result), type: TokenType.Number };
  }

  readReservedWord() {
    let result = this.program[this.current - 1];
    let current: string;
    while ((current = this.next()) !== ' ' && current && !this.end()) {
      result += current;
    }
    return { lexeme: result, type: TokenType.ReservedWord };
  }

  next() {
    return this.program[this.current++];
  }

  end() {
    return this.current >= this.program.length;
  }
}
