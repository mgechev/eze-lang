import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';

export class GotoAst {
  url: string;
}

export class Goto extends Construct<GotoAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'go' && current.type === TokenType.ReservedWord) {
      if (next && next.lexeme === 'to' && next.type === TokenType.ReservedWord) {
        next = parser.next();
        if (!next || next.type !== TokenType.String) {
          parser.report(current, 'go to should receive a URL of type string');
        }
        const ast = new GotoAst();
        ast.url = next.lexeme as string;
        return ast;
      } else {
        parser.report(current, '"go" must be followed by "to"');
      }
    }
  }

  generate(ast: GotoAst, prefix: string) {
    if (ast instanceof GotoAst) {
      return `${prefix}browser.get('${ast.url}');\n`;
    }
    return undefined;
  }
}
