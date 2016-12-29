import {Lexer, Token, TokenType} from './lexer';
import {Parser} from './parser';
import {ProgramVisitor} from './codegen';
import {Construct} from './construct';
import {TokenNormalizer, Transformer} from './token-normalizer';

import * as c from './default-constructs/index';
import {parse} from './parse';
import {defaultConstructs} from './default-constructs';

export const transpile = (code: string, constructs: Construct<any>[] = []) => {
  let transpileConstructs = constructs.concat(defaultConstructs);
  transpileConstructs = transpileConstructs.sort((a, b) => a.priority - b.priority);

  return new ProgramVisitor(transpileConstructs).visit(parse(code, constructs));
};

