import {Observable} from 'rxjs';
/* tslint:disable */

const program =

`
Module "login"
  Go to "app/login".
  Fill "mgechev+18@gmail.com" in "#username".
  Fill "foobar" in "#password".
  Click "#login"!


Feature "login"
  Test "should login with proper username"
    Use "login".
    Wait 5.
    Assert text "#title" "Welcome".

  Test "should not login without proper username"
    Go to "app/login".
    Fill "mgechev+19@gmail.com" in "#username".
    Fill "foobar" in "#password"!
    Click "#login"!
    Wait 2.
    Assert text "#title" "Sorry".


Feature "play game"
  Test "should successfully playgame"
    use "login"
    go to "app/earn"
    click "#whatever"
    click "#a1"
    code \`if (...) {\`
      click "#a2"
    code \`} else {\`
      click "#a3"
    code \`}\`
`;

import {transpile} from './lib/transpiler';

Observable.from(program.split(''))
.subscribe(c => console.log(c));

console.log(transpile(program));

