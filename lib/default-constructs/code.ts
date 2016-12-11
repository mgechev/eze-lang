import {Construct} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class CustomCodeAst {
  code: string;
}

export class CustomCode extends Construct<CustomCodeAst> {
  parse(parser: Parser, current: Token, next: Token) {
    if (current.lexeme === 'code' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const ast = new CustomCodeAst();
        ast.code = next.lexeme as string;
        return ast;
      } else {
        parser.report(current, 'code `cssSelector`');
      }
    }
  }

  generate(ast: CustomCodeAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof CustomCodeAst) {
      return prefix + ast.code + '\n';
    }
    return undefined;
  }
}
