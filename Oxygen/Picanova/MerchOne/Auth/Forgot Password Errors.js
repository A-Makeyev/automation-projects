const auth = require('../Pages/Auth.js')

web.transaction(`Open ${env.dashboardUrl}`)
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login page is displayed')
} else {
    po.po.errors.push('Failed to load login page')
}

web.transaction('Assert Forgot Your Password Page Is Displayed')
po.click(auth.forgotPasswordButton)

if (web.isVisible(auth.forgotPasswordForm)) {
    if (web.isVisible(auth.forgotPasswordFormHeader)) {
        po.passedTests.push('"Forgot your password?" header is displayed')
    } else {
        po.po.errors.push('"Forgot your password?" page is not displayed')
    }
}

web.transaction('Enter Wrong Email And Send')
po.type(auth.emailInput, 'wrong@gmail.com')
po.click(auth.forgotPasswordSendButton)

if (web.isVisible(auth.inputErrorMessage)) {
    po.passedTests.push('Error Message: ' + web.getText(auth.inputErrorMessage))
} else {
    po.po.errors.push('Wrong Email Error Message Is Not Displayed')
}
