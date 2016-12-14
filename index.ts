import {transpile} from './lib/transpiler';

const program =

`
Module "login".
  Go to "app/login". Fill "mgechev+18@gmail.com" in "#username". Fill "foobar" in "#password"! Click "#login".

feature "login"
  Test "should login with proper username"
    Use "login". Wait 5. Assert text "#title" "Welcome in Minko's website".

  test "should not login without proper username"
    go to "app/login"
    fill "mgechev+19@gmail.com" in "#username"
    fill "foobar" in "#password"
    click "#login"
    wait 2
    assert text "#title" "Sorry"


feature "play game"
  test "should successfully playgame"
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

console.log(transpile(program));
