import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class WaitAst {
  duration: number;
}

export class Wait extends Construct<WaitAst> {
  get title() {
    return 'Wait seconds';
  }

  get construct() {
    return ['wait', ConstructLiteralType.Number];
  }

  getAst(parser: Parser) {
    parser.next();
    const ast = new WaitAst();
    ast.duration = parser.next().lexeme as number;
    return ast;
  }

  generate(ast: WaitAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof WaitAst) {
      return `${prefix}browser.wait(new Promise(r => setTimeout(r, ${ast.duration * 1000})));\n`;
    }
    return undefined;
  }
}
