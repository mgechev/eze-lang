import {
  TestAst,
  ModuleAst,
  FeatureAst,
  AfterEachAst,
  BeforeEachAst,
  ProgramAst
} from './ast';
import {Construct} from './construct';

export interface SymbolTable {
  [key: string]: string;
}

export class OperationVisitor {
  visit(operation: any, symbolTable: SymbolTable, prefix: string, constructs: Construct<any>[]) {
    for (let i = 0; i < constructs.length; i += 1) {
      let res = constructs[i].generate(operation, prefix, symbolTable, constructs);
      if (res) {
        return res;
      }
    }
    throw new Error('Cannot generate the code for ' + JSON.stringify(operation));
  }
}

export class ExpressionListVisitor {
  visit(operations: any[], symbolTable: SymbolTable, prefix: string, constructs: Construct<any>[]) {
    return operations.map(o => {
      return new OperationVisitor().visit(o, symbolTable, prefix, constructs);
    }).join('');
  }
}

export class TestVisitor {
  visit(test: TestAst, symbolTable: SymbolTable, prefix: string, constructs: Construct<any>[]) {
    let result = `${prefix}it('${test.name}', () => {\n`;
    result += new ExpressionListVisitor().visit(test.operations, symbolTable, prefix + '  ', constructs);
    result += `${prefix}});\n`;
    return result;
  }
}

export class AfterEachVisitor {
  visit(after: AfterEachAst, symbolTable: SymbolTable, prefix: string, constructs: Construct<any>[]) {
    let result = `${prefix}afterEach(() => {\n`;
    result += new ExpressionListVisitor().visit(after.operations, symbolTable, prefix + '  ', constructs);
    result += `${prefix}});\n`;
    return result;
  }
}

export class BeforeEachVisitor {
  visit(before: BeforeEachAst, symbolTable: SymbolTable, prefix: string, constructs: Construct<any>[]) {
    let result = `${prefix}beforeEach(() => {\n`;
    result += new ExpressionListVisitor().visit(before.operations, symbolTable, prefix + '  ', constructs);
    result += `${prefix}});\n`;
    return result;
  }
}

export class FeatureVisitor {
  visit(feature: FeatureAst, symbolTable: SymbolTable, constructs: Construct<any>[]) {
    let result = `describe('${feature.name}', () => {\n`;
    result += feature.beforeEach.map(b => new BeforeEachVisitor().visit(b, symbolTable, '  ', constructs)).join('\n');
    result += feature.tests.map(t => new TestVisitor().visit(t, symbolTable, '  ', constructs)).join('\n');
    result += feature.afterEach.map(a => new AfterEachVisitor().visit(a, symbolTable, '  ', constructs)).join('\n');
    result += `});\n\n`;
    return result;
  }
}

export class ProgramVisitor {
  constructor(private constructs: Construct<any>[]) {}

  visit(program: ProgramAst) {
    const symbolTable = {};
    const exprVisitor = new ExpressionListVisitor();
    program.modules.forEach(
      m => symbolTable[m.name] = exprVisitor.visit(m.operations, symbolTable, '    ', this.constructs));
    return program.features.map(t => new FeatureVisitor().visit(t, symbolTable, this.constructs)).join('');
  }
}

