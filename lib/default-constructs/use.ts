import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class UseAst {
  name: string;
}

export class Use extends Construct<UseAst> {
  get title() {
    return 'Use module';
  }

  get construct() {
    return ['use', ConstructLiteralType.String];
  }

  getAst(parser: Parser) {
    parser.next();
    const ast = new UseAst();
    ast.name = parser.next().lexeme as string;
    return ast;
  }

  generate(ast: UseAst, prefix: string, symbolTable: SymbolTable, constructs: Construct<any>[]) {
    if (ast instanceof UseAst) {
      return symbolTable[ast.name];
    }
    return undefined;
  }
}
