const lp = require('../Pages/Login Page.js')
var errors = []

web.transaction('Initialize')
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(lp.authLayout)) {
    po.log('success', 'Login page is displayed')
} else {
    assert.fail('Failed to load login page')
}

web.transaction('Enter wrong Email')
po.login('wrong@email.com', env.password)
const emailValidation = po.validateLogin('wrong@email.com', env.password, 'email')
emailValidation.includes('❌') && errors.push(emailValidation)

web.transaction('Enter wrong Password')
po.login(env.email, 'xxxxx')
const passwordValidation = po.validateLogin('wrong@email.com', env.password, 'password')
passwordValidation.includes('❌') && errors.push(passwordValidation)

if (errors.length > 0) {
    po.log('info', 'Errors:')
    errors.forEach(e => po.log('error', e))
    assert.fail(`${errors.length} errors were found`)
}

web.transaction('Enter Correct Credentials')
po.login(env.email, env.password)
po.assertUserLoggedIn(env.email)
