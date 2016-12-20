import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class CustomCodeAst {
  code: string;
}

export class CustomCode extends Construct<CustomCodeAst> {

  get title() {
    return 'Click on element';
  }

  get construct() {
    return ['code', ConstructLiteralType.String];
  }

  getAst(parser: Parser) {
    parser.next();
    const ast = new CustomCodeAst();
    ast.code = parser.next().lexeme as string;
    return ast;
  }

  generate(ast: CustomCodeAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof CustomCodeAst) {
      return prefix + ast.code + '\n';
    }
    return undefined;
  }
}
