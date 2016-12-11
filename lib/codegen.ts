import {
  TestAst,
  ModuleAst,
  Feature,
  ProgramAst
} from './ast';
import {Construct} from './construct';

export interface SymbolTable {
  [key: string]: ModuleAst;
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

export class FeatureVisitor {
  visit(feature: Feature, symbolTable: SymbolTable, constructs: Construct<any>[]) {
    let result = `describe('${feature.name}', () => {\n`;
    result += feature.tests.map(t => new TestVisitor().visit(t, symbolTable, '  ', constructs)).join('\n');
    result += `});\n\n`;
    return result;
  }
}

export class ProgramVisitor {
  constructor(private constructs: Construct<any>[]) {}

  visit(program: ProgramAst) {
    const symbolTable = {};
    // Todo: generate and cache
    program.modules.forEach(m => symbolTable[m.name] = m);
    return program.features.map(t => new FeatureVisitor().visit(t, symbolTable, this.constructs)).join('');
  }
}
