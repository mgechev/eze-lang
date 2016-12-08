import {Lexer, Token, TokenType} from './lexer';
import {Parser} from './parser';
import {ProgramVisitor} from './codegen';
import {TokenNormalizer, Transformer} from './token-normalizer';

export const transpile = (code: string) => {
  const tokens = new Lexer(code);
  const toLowerCase: Transformer = (token: Token) => {
    if (token.type === TokenType.ReservedWord && typeof token.lexeme === 'string') {
      token.lexeme = token.lexeme.toLowerCase();
    }
    return token;
  };
  const normalizer = new TokenNormalizer([toLowerCase]);
  const parser = new Parser(tokens.lex());
  return new ProgramVisitor().visit(parser.parse());
};
