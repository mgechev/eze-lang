import {
  TestAst,
  ModuleAst,
  TestCaseAst,
  ProgramAst
} from './ast';
import {Construct} from './construct';

import {Token, TokenType} from './lexer';

export class Parser {
  private current = 0;
  constructor(private tokens: Token[], private constructs: Construct<any>[]) {}

  parse() {
    return this.parseProgramAst();
  }

  parseProgramAst() {
    const program = new ProgramAst();
    while (!this.end()) {
      const current = this.next();
      if (current.type === TokenType.ReservedWord) {
        if (current.lexeme === 'module') {
          program.modules.push(this.parseModule());
        } else if (current.lexeme === 'test') {
          let next = this.next();
          if (next && next.type === TokenType.ReservedWord && next.lexeme === 'case') {
            // Skipping the token "case"
            program.testCases.push(this.parseTestCase());
          } else {
            this.report(current, 'Unexpected token "test". Test cases should be on top level.');
          }
        } else {
          this.report(current, 'Unexpected token. Only modules and test cases are allowed on top level.');
        }
      } else {
        this.report(current, 'Unexpected token. Only reserved words are allowed on top level.');
      }
    }
    program.testCases.forEach(t => {
      t.tests = t.tests.filter(t => t.operations.length);
    });
    program.modules = program.modules.filter(m => m.operations.length);
    return program;
  }

  parseModule() {
    let current, next = this.next();
    const module = new ModuleAst();
    if (next.type === TokenType.String) {
      module.name = next.lexeme as string;
    }
    while (!this.end()) {
      current = next;
      next = this.next();
      this.current -= 1;
      if (this.isTestCaseOrTestOrModule(current, next)) {
        return module;
      }
      const operator = this.readOperation();
      if (operator) {
        module.operations.push(operator);
      } else {
        this.current -= 1;
      }
    }
    return module;
  }

  parseTestCase() {
    let current = this.next();
    const testCase = new TestCaseAst();
    testCase.name = current.lexeme as string;
    let next = this.next();
    current = next;
    while (!this.end()) {
      current = next;
      next = this.next();
      this.current -= 1;
      if (this.isTestCaseOrModule(current, next)) {
        this.current -= 1;
        return testCase;
      }
      testCase.tests.push(this.parseTest());
    }
    return testCase;
  }

  parseTest() {
    let current, next = this.next();
    let name = next.lexeme as string;
    const test = new TestAst();
    test.name = name;
    while (!this.end()) {
      current = next;
      next = this.next();
      this.current -= 1;
      if (this.isTestCaseOrTestOrModule(current, next)) {
        return test;
      }
      const operator = this.readOperation();
      if (operator) {
        test.operations.push(operator);
      } else {
        this.current -= 1;
      }
    }
    return test;
  }

  readOperation() {
    let current = this.next();
    let next = this.next();
    let operator: any;
    if (!current || !next || this.isTestCaseOrTestOrModule(current, next)) {
      this.current -= 1;
      return operator;
    }
    for (let i = 0; i < this.constructs.length; i += 1) {
      const res = this.constructs[i].parse(this, current, next);
      if (res) {
        return res;
      }
    }
    this.report(current, 'unknown operator');
  }

  isTestCaseOrTestOrModule(token, next) {
    if (this.isTestCaseOrModule(token, next) ||
        (token.type === TokenType.ReservedWord && token.lexeme === 'test')) {
      return true;
    }
    return false;
  }

  isTestCaseOrModule(token, next) {
    if (token.type === TokenType.ReservedWord && token.lexeme === 'module') {
      return true;
    } else if (token.type === TokenType.ReservedWord && token.lexeme === 'test' &&
              next.type === TokenType.ReservedWord && next.lexeme === 'case') {
      return true;
    }
    return false;
  }

  report(token, message) {
    throw new Error(message + `(${token.position.line}, ${token.position.character})`);
  }

  next() {
    return this.tokens[this.current++];
  }

  prev() {
    return this.tokens[--this.current];
  }

  end() {
    return this.current >= this.tokens.length;
  }
}
