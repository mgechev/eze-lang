export class ModuleAst {
  name: string;
  operations: any[] = [];
}

export class GotoAst {
  url: string;
}

export class FillAst {
  text: string;
  where: string;
}

export class ClickAst {
  where: string;
}

export class AssertTextAst {
  text: string;
  selector: string;
}

export class WaitAst {
  duration: number;
}

export class CustomCodeAst {
  code: string;
}

export class TestAst {
  name: string;
  operations: any[] = [];
}

export class TestCaseAst {
  name: string;
  tests: TestAst[] = [];
}

export class UseAst {
  name: string;
}

export class ProgramAst {
  modules: ModuleAst[] = [];
  testCases: TestCaseAst[] = [];
}
