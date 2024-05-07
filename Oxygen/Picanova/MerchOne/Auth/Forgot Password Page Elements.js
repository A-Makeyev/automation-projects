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

web.transaction('Open Contact Us Page')
po.click(auth.contactUsButton)

const currentUrl = web.getUrl()
if (currentUrl.includes(env.supportUrl)) {
    po.passedTests.push('Opened: ' + currentUrl)
} else {
    po.po.errors.push(`Expected support url to be: "${env.supportUrl}", instead got: "${currentUrl}"`)
}

web.transaction('Assert Forgot Your Password Page Is Displayed After Going Back From Support Page')
web.back()

if (web.isVisible(auth.forgotPasswordForm)) {
    if (web.isVisible(auth.forgotPasswordFormHeader)) {
        po.passedTests.push('"Forgot your password?" Header Is Displayed After Going Back From Support Page')
    } else {
        po.po.errors.push('"Forgot your password?" Page Is Not Displayed After Going Back From Support Page')
    }
}

web.transaction('Assert Login Page Is Displayed After Clicking On Back To Login Button')
po.click(auth.backButton)
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login Page Is Displayed After Clicking On Back Button')
} else {
    po.po.errors.push('Login Page Is NOT Displayed After Clicking On Back Button')
}
