import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class ClickAst {
  selector: string;
}

export class Click extends Construct<ClickAst> {
  get title() {
    return 'Click on element';
  }

  get construct() {
    return ['click', ConstructLiteralType.String];
  }

  getAst(parser: Parser) {
    parser.next();
    const ast = new ClickAst();
    ast.selector = parser.next().lexeme as string;
    return ast;
  }

  generate(ast: ClickAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof ClickAst) {
      return `${prefix}element(by.css('${ast.selector}')).click();\n`;
    }
    return undefined;
  }
}
