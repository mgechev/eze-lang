export class ModuleAst {
  name: string;
  operations: any[] = [];
}

export class TestAst {
  name: string;
  operations: any[] = [];
}

export class Feature {
  name: string;
  tests: TestAst[] = [];
}

export class ProgramAst {
  modules: ModuleAst[] = [];
  features: Feature[] = [];
}
