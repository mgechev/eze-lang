import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';

export class GotoAst {
  url: string;
}

export class Goto extends Construct<GotoAst> {

  get title() {
    return 'Go to URL';
  }

  get construct() {
    return ['go', 'to', ConstructLiteralType.String];
  }

  getAst(parser: Parser) {
    parser.next();
    parser.next();
    const ast = new GotoAst();
    ast.url = parser.next().lexeme as string;
    return ast;
  }

  generate(ast: GotoAst, prefix: string) {
    if (ast instanceof GotoAst) {
      return `${prefix}browser.get('${ast.url}');\n`;
    }
    return undefined;
  }
}
