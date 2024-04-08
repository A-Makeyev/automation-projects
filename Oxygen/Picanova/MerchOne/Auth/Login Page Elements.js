const lp = require('../Pages/Login Page.js')

web.transaction('Initialize')
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(lp.authLayout)) {
    po.log('success', 'Login page is displayed')
} else {
    assert.fail('Failed to load login page')
}

web.transaction('Assert Forgot Your Password Page Is Displayed')
web.click(lp.forgotPasswordButton)

if (web.isVisible(lp.forgotPasswordForm)) {
    if (web.isVisible(lp.forgotPasswordFormHeader)) {
        po.log('success', '"Forgot your password?" header is displayed')
    } else {
        assert.fail('"Forgot your password?" page is not displayed')
    }
} 

web.transaction('Go Back to Login Page')
web.click(lp.backButton)

if (web.isVisible(lp.authLayout)) {
    po.log('success', 'Login page is displayed after clicking on back')
} else {
    assert.fail('Failed to load login page after clicking on back')
}

web.transaction('Open Create It Page')
web.click(lp.createAccountButton)

if (web.isVisible(lp.signupForm)) {
    if (web.isVisible(lp.signupFormHeader)) {
        po.log('success', 'Signup page is displayed')
    } else {
        errors.push('"Signup" header is not displayed')
    }
} else {
    assert.fail('Failed to load signup page')
}
