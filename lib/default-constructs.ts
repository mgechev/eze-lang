import {Construct} from './construct';
import * as c from './default-constructs/index';

export const defaultConstructs: Construct<any>[] = [
  new c.AssertText(),
  new c.Goto(),
  new c.Click(),
  new c.CustomCode(),
  new c.Fill(),
  new c.Use(),
  new c.Wait(),
  new c.DisableAngular()
];

