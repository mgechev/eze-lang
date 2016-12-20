import {Lexer, Token, TokenType} from './lexer';
import {Parser} from './parser';
import {ProgramVisitor} from './codegen';
import {Construct} from './construct';
import {TokenNormalizer, Transformer} from './token-normalizer';

import * as c from './default-constructs/index';

const defaultConstructs: Construct<any>[] = [
  new c.AssertText(),
  new c.Goto(),
  new c.Click(),
  new c.CustomCode(),
  new c.Fill(),
  new c.Use(),
  new c.Wait(),
  new c.DisableAngular()
];

export const transpile = (code: string, constructs: Construct<any>[] = []) => {
  const tokens = new Lexer(code);

  constructs = constructs.concat(defaultConstructs);

  constructs = constructs.sort((a, b) => a.priority - b.priority);

  const toLowerCase: Transformer = (token: Token) => {
    if (token.type === TokenType.ReservedWord && typeof token.lexeme === 'string') {
      token.lexeme = token.lexeme.toLowerCase();
    }
    return token;
  };
  const normalizer = new TokenNormalizer([toLowerCase]);
  const parser = new Parser(normalizer.normalize(tokens.lex()), constructs);
  return new ProgramVisitor(constructs).visit(parser.parse());
};


console.log(transpile(
`
Feature "talks"
  Test "open talks"
    Disable Angular
    Go to "http://blog.mgechev.com"
    Assert text "h1" "Talks"
`
));

