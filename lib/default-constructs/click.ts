import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class ClickAst {
  selector: string;
}

export class Click extends Construct<ClickAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'click' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const ast = new ClickAst();
        ast.selector = next.lexeme as string;
        return ast;
      } else {
        parser.report(current, 'click "cssSelector"');
      }
    }
  }

  generate(ast: ClickAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof ClickAst) {
      return `${prefix}element(by.css('${ast.selector}')).click();\n`;
    }
    return undefined;
  }
}
