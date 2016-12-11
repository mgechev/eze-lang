import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class FillAst {
  text: string;
  selector: string;
}

export class Fill extends Construct<FillAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'fill' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const text = next.lexeme;
        next = parser.next();
        if (next.lexeme === 'in' && next.type === TokenType.ReservedWord) {
          next = parser.next();
          if (next.type === TokenType.String) {
            const ast = new FillAst();
            ast.text = text as string;
            ast.selector = next.lexeme as string;
            return ast;
          } else {
            parser.report(current, 'fill "text" in "elementSelector"');
          }
        } else {
          parser.report(current, 'fill "text" in "elementSelector"');
        }
      } else {
        parser.report(current, 'fill "text" in "elementSelector"');
      }
    }
  }

  generate(ast: FillAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof FillAst) {
      return `${prefix}element(by.css('${ast.selector}')).sendKeys('${ast.text}');\n`;
    }
    return undefined;
  }
}
