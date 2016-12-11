import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class AssertTextAst {
  text: string;
  selector: string;
}

export class AssertText extends Construct<AssertTextAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'assert' && current.type === TokenType.ReservedWord) {
      if (next && next.lexeme === 'text' && next.type === TokenType.ReservedWord) {
        next = parser.next();
        if (!next || next.type !== TokenType.String) {
          parser.report(current, 'assert text should a selector and a text');
        } else {
          const selector = next.lexeme;
          next = parser.next();
          if (next && next.type === TokenType.String) {
            const ast = new AssertTextAst();
            ast.selector = selector as string;
            ast.text = next.lexeme as string;
            return ast;
          } else {
            parser.report(current, 'assert text should a selector and a text');
          }
        }
      } else {
        parser.report(current, '"go" must be followed by "to"');
      }
    }
  }

  generate(ast: AssertTextAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof AssertTextAst) {
      return `${prefix}expect(element(by.css('${ast.selector}')).getText()).toEqual('${ast.text}');\n`;
    }
    return undefined;
  }
}
