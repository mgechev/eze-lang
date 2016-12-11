import {Parser} from './parser';
import {Token} from './lexer';
import {SymbolTable} from './codegen';

export abstract class Construct<T> {
  abstract parse(parser: Parser, current: Token, next: Token): T;
  abstract generate(ast: T, prefix: string, symbolTable?: SymbolTable, constructs?: Construct<any>[]): string;
}
