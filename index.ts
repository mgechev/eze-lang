import {transpile} from './lib/transpiler';

const program =

`
module "login"
  go to "app/login"
  fill "mgechev+18@gmail.com" in "#username"
  fill "foobar" in "#password"
  click "#login"


test case "login"
  test "should login with proper username"
    use "login"
    wait 5
    assert text "#title" "Welcome"

  test "should not login without proper username"
    go to "app/login"
    fill "mgechev+19@gmail.com" in "#username"
    fill "foobar" in "#password"
    click "#login"
    wait 2
    assert text "#title" "Sorry"


test case "play game"
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