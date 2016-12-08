import {
  GotoAst,
  FillAst,
  CustomCodeAst,
  AssertTextAst,
  ClickAst,
  UseAst,
  WaitAst,
  TestAst,
  ModuleAst,
  TestCaseAst,
  ProgramAst
} from './ast';

import {Token, TokenType} from './lexer';

export class Parser {
  private current = 0;
  constructor(private tokens: Token[]) {}

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
        return module
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
        return test
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
    if (current.lexeme === 'go' && current.type === TokenType.ReservedWord) {
      if (next && next.lexeme === 'to' && next.type === TokenType.ReservedWord) {
        next = this.next();
        if (!next || next.type !== TokenType.String) {
          this.report(current, 'go to should receive a URL of type string');
        }
        const ast = new GotoAst();
        ast.url = <string>next.lexeme;
        return ast;
      } else {
        this.report(current, '"go" must be followed by "to"');
      }
    }
    if (current.lexeme === 'assert' && current.type === TokenType.ReservedWord) {
      if (next && next.lexeme === 'text' && next.type === TokenType.ReservedWord) {
        next = this.next();
        if (!next || next.type !== TokenType.String) {
          this.report(current, 'assert text should a selector and a text');
        } else {
          const selector = next.lexeme;
          next = this.next();
          if (next && next.type === TokenType.String) {
            const ast = new AssertTextAst();
            ast.selector = selector as string;
            ast.text = next.lexeme as string;
            return ast;
          } else {
            this.report(current, 'assert text should a selector and a text');
          }
        }
      } else {
        this.report(current, '"go" must be followed by "to"');
      }
    }
    if (current.lexeme === 'fill' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const text = next.lexeme;
        next = this.next();
        if (next.lexeme === 'in' && next.type === TokenType.ReservedWord) {
          next = this.next();
          if (next.type === TokenType.String) {
            const ast = new FillAst();
            ast.text = text as string;
            ast.where = next.lexeme as string;
            return ast;
          } else {
            this.report(current, 'fill "text" in "elementSelector"');
          }
        } else {
          this.report(current, 'fill "text" in "elementSelector"');
        }
      } else {
        this.report(current, 'fill "text" in "elementSelector"');
      }
    }
    if (current.lexeme === 'click' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const ast = new ClickAst();
        ast.where = next.lexeme as string;
        return ast;
      } else {
        this.report(current, 'click "cssSelector"');
      }
    }
    if (current.lexeme === 'code' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const ast = new CustomCodeAst();
        ast.code = next.lexeme as string;
        return ast;
      } else {
        this.report(current, 'code `cssSelector`');
      }
    }
    if (current.lexeme === 'wait' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.Number) {
        const ast = new WaitAst();
        ast.duration = next.lexeme as number;
        return ast;
      } else {
        this.report(current, 'wait duration');
      }
    }
    if (current.lexeme === 'use' && current.type === TokenType.ReservedWord) {
      if (next && next.type === TokenType.String) {
        const ast = new UseAst();
        ast.name = next.lexeme as string;
        return ast;
      } else {
        this.report(current, 'use "module-name"');
      }
    }
    this.report(current, 'unknown operator');
  }

  isTestCaseOrTestOrModule(token, next) {
    if (this.isTestCaseOrModule(token, next) ||
        (token.type === TokenType.ReservedWord && token.lexeme === 'test')) {
      return true
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

  end() {
    return this.current >= this.tokens.length;
  }
}
