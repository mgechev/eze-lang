import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class UseAst {
  name: string;
}

export class Use extends Construct<UseAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'use' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const ast = new UseAst();
        ast.name = next.lexeme as string;
        return ast;
      } else {
        parser.report(current, 'use "module-name"');
      }
    }
  }

  generate(ast: UseAst, prefix: string, symbolTable: SymbolTable, constructs: Construct<any>[]) {
    if (ast instanceof UseAst) {
      return symbolTable[ast.name];
    }
    return undefined;
  }
}
