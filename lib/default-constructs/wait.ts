import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class WaitAst {
  duration: number;
}

export class Wait extends Construct<WaitAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'wait' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.Number) {
        const ast = new WaitAst();
        ast.duration = next.lexeme as number;
        return ast;
      } else {
        parser.report(current, 'wait duration');
      }
    }
  }

  generate(ast: WaitAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof WaitAst) {
      return `${prefix}browser.wait(new Promise(r => setTimeout(r, ${ast.duration})));\n`;
    }
    return undefined;
  }
}
