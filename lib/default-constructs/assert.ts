import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class AssertTextAst {
  text: string;
  selector: string;
}

export class AssertText extends Construct<AssertTextAst> {

  get title() {
    return 'Assert element textual content';
  }

  get construct() {
    return ['assert', 'text', ConstructLiteralType.String, ConstructLiteralType.String];
  }

  getAst(parser: Parser) {
    parser.next();
    parser.next();
    const ast = new AssertTextAst();
    ast.selector = parser.next().lexeme as string;
    ast.text = parser.next().lexeme as string;
    return ast;
  }

  generate(ast: AssertTextAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof AssertTextAst) {
      return `${prefix}expect(element(by.css('${ast.selector}')).getText()).toEqual('${ast.text}');\n`;
    }
    return undefined;
  }
}
