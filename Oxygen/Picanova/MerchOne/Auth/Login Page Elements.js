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

web.transaction('Go Back to Login Page')
po.click(auth.backButton)

if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login page is displayed after clicking on back')
} else {
    po.po.errors.push('Failed to load login page after clicking on back')
}

web.transaction('Open Create It Page')
po.click(auth.createAccountButton)

if (web.isVisible(auth.signupForm)) {
    if (web.isVisible(auth.signupFormHeader)) {
        po.passedTests.push('Signup page is displayed')
    } else {
        po.errors.push('"Signup" header is not displayed')
    }
} else {
    po.po.errors.push('Failed to load signup page')
}

web.transaction('Display Results')
po.displayResults()
