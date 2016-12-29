import {Lexer, Token, TokenType} from './lexer';
import {Parser} from './parser';
import {ProgramVisitor} from './codegen';
import {Construct} from './construct';
import {TokenNormalizer, Transformer} from './token-normalizer';

import * as c from './default-constructs/index';
import {parse} from './parse';

export const transpile = (code: string, constructs: Construct<any>[] = []) => {
  return new ProgramVisitor(constructs).visit(parse(code, constructs));
};

