const auth = require('../Pages/Auth.js')

web.transaction(`Open ${env.dashboardUrl}`)
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login page is displayed')
} else {
    po.errors.push('Failed to load login page')
}

web.transaction('Enter wrong Email')
const emailValidation = po.validateLogin('wrong@email.com', env.password)
emailValidation.error ? errors.push(emailValidation.message) : po.passedTests.push(emailValidation.message)
web.clear(auth.emailInput)
web.clear(auth.passwordInput)
web.pause(po.waitASecond)

web.transaction('Enter wrong Password')
const passwordValidation = po.validateLogin(env.email, 'WrongPassword123')
passwordValidation.error ? errors.push(passwordValidation.message) : po.passedTests.push(passwordValidation.message)
web.clear(auth.emailInput)
web.clear(auth.passwordInput)

web.transaction('Enter Correct Credentials')
po.login(env.email, env.password)
po.assertUserLoggedIn(env.email)

web.transaction('Display Results')
po.displayResults()
