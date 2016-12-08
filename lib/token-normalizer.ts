import {Token} from './lexer';

export interface Transformer {
  (token: Token): Token;
}

export class TokenNormalizer {
  constructor(private transformers: Transformer[]) {}

  normalize(tokens: Token[]) {
    return tokens.map(token =>
      this.transformers.reduce((accum: Token, t: Transformer) => t(accum), token));
  }
}
