export class ModuleAst {
  name: string;
  operations: any[] = [];
}

export class TestAst {
  name: string;
  operations: any[] = [];
}

export class BeforeEachAst {
  operations: any[] = [];
}

export class AfterEachAst {
  operations: any[] = [];
}

export class FeatureAst {
  name: string;
  tests: TestAst[] = [];
  beforeEach: BeforeEachAst[] = [];
  afterEach: AfterEachAst[] = [];
}

export class ProgramAst {
  modules: ModuleAst[] = [];
  features: FeatureAst[] = [];
}
