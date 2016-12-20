import {Parser} from './parser';
import {Token, TokenType} from './lexer';
import {SymbolTable} from './codegen';

export enum ConstructLiteralType {
  String,
  Number
};

export type Part = string | ConstructLiteralType;

export type Parts = Part[];


export interface ParsingResult<T> {
  ast: T;
  errors: string[];
}

export abstract class Construct<T> {
  abstract get title(): string;
  abstract get construct(): Parts;

  get priority() {
    return 0;
  }

  parse(parser: Parser): ParsingResult<T> {
    const errors = this.validate(parser);
    if (errors.length) {
      return {
        ast: null,
        errors
      };
    } else {
      return {
        ast: this.getAst(parser),
        errors
      };
    }
  }

  abstract generate(ast: T, prefix: string, symbolTable?: SymbolTable, constructs?: Construct<any>[]): string;

  protected abstract getAst(parser: Parser): T;

  protected validate(parser: Parser): string[] {
    let i = 0;
    const errors: string[] = [];
    let currentToken = parser.next();
    let totalMatch = 0;
    while (i < this.construct.length && !parser.end()) {
      const current = this.construct[i];
      totalMatch += 1;
      if (typeof current === 'string') {
        if (current !== currentToken.lexeme) {
          const pos = currentToken.position;
          errors.push(`Unexpected "${current}" keyword at (${pos.character}, ${pos.line}). Expecting "${current}".`);
          totalMatch -= 1;
        }
      } else if (current === ConstructLiteralType.Number) {
        if (currentToken.type !== TokenType.Number) {
          const pos = currentToken.position;
          errors.push(`Unexpected "${current}" token at (${pos.character}, ${pos.line}). Expecting number.`);
          totalMatch -= 1;
        }
      } else {
        if (currentToken.type !== TokenType.String) {
          const pos = currentToken.position;
          errors.push(`Unexpected "${current}" token at (${pos.character}, ${pos.line}). Expecting string.`);
          totalMatch -= 1;
        }
      }
      currentToken = parser.next();
      i += 1;
    }
    while (i) {
      parser.prev();
      i -= 1;
    }
    parser.prev();
    return errors;
  }
}
