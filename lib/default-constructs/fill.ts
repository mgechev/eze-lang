import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class FillAst {
  text: string;
  selector: string;
}

export class Fill extends Construct<FillAst> {

  get title() {
    return 'Fill textbox';
  }

  get construct() {
    return ['fill', ConstructLiteralType.String, 'in', ConstructLiteralType.String];
  }

  getAst(parser: Parser) {
    parser.next();
    const ast = new FillAst();
    ast.text = parser.next().lexeme as string;
    parser.next();
    ast.selector = parser.next().lexeme as string;
    return ast;
  }

  generate(ast: FillAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof FillAst) {
      return `${prefix}element(by.css('${ast.selector}')).sendKeys('${ast.text}');\n`;
    }
    return undefined;
  }
}
