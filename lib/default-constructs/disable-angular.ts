import {Construct, ConstructLiteralType} from '../construct';
import {TokenType, Token} from '../lexer';
import {Parser} from '../parser';
import {ExpressionListVisitor, SymbolTable} from '../codegen';

export class DisableAngularAst {}

export class DisableAngular extends Construct<DisableAngularAst> {
  get title() {
    return 'Disable Angular';
  }

  get construct() {
    return ['disable', 'angular'];
  }

  getAst(parser: Parser) {
    parser.next();
    parser.next();
    return new DisableAngularAst();
  }

  generate(ast: DisableAngularAst, prefix: string, symbolTable: SymbolTable, ) {
    if (ast instanceof DisableAngularAst) {
      return `${prefix}browser.ignoreSynchronization = true;\n`;
    }
    return undefined;
  }
}
