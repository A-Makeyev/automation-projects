const auth = require('../Pages/Auth.js')

web.transaction(`Open ${env.dashboardUrl}`)
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login page is displayed')
} else {
    po.errors.push('Failed to load login page')
}

web.transaction('Assert Forgot Your Password Page Is Displayed')
po.click(auth.forgotPasswordButton)

if (web.isVisible(auth.forgotPasswordForm)) {
    if (web.isVisible(auth.forgotPasswordFormHeader)) {
        po.passedTests.push('"Forgot your password?" header is displayed')
    } else {
        po.errors.push('"Forgot your password?" page is not displayed')
    }
}

web.transaction('Enter An Existing User Email Address And Send')
po.type(auth.emailInput, env.email)
po.click(auth.forgotPasswordSendButton)

var forgotPasswordTries = 5
while (web.isVisible(auth.inputErrorMessage, po.shortWait)) {
    if (web.isVisible(auth.resetPasswordConfirmationText, po.shortWait)) {
        break
    } else {
        po.log('warning', `${web.getText(auth.inputErrorMessage)} (${env.email})`)
        web.pause(po.longWait)
        web.clear(auth.emailInput)
        po.type(auth.emailInput, env.email)
        po.click(auth.forgotPasswordSendButton)
        if (forgotPasswordTries == 0) break
        else forgotPasswordTries--
    }
}

if (web.isVisible(auth.resetPasswordConfirmationText)) {
    let confirmationMessage = web.getText(auth.resetPasswordConfirmationText)
    po.passedTests.push(confirmationMessage)
} else {
    po.errors.push('Reset Password Confirmation Is Not Displayed')
}

web.transaction('Assert Login Page Is Displayed After Clicking On Back To Login Button')
po.click(auth.backToLoginButton)
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login Page Is Displayed After Clicking On Back To Login Button')
} else {
    po.errors.push('Login Page Is NOT Displayed After Clicking On Back To Login Button')
}

web.transaction('Reset Password Via Email')
email.init(env.email, env.appPassword, 'imap.gmail.com', 993, true, 5000)
const mail = email.getLastEmail(60, 'Reset Password Notification', 10 * 1000)                                   
const body = mail.textAsHtml 

const resetPasswordUrl = web.execute((body) => {
    let doc = document.createElement('html')
    doc.innerHTML = body
    let links = doc.getElementsByTagName('a')
    let urls = []

    for (let i = 0; i < links.length; i++) {
        urls.push(links[i].getAttribute('href'))
    }
    return urls.filter(i => i.includes('password-reset'))[0]
}, body)

if (resetPasswordUrl.includes('password-reset')) {
    po.passedTests.push(`Reset Password Url: ${resetPasswordUrl}`)
} else {
    po.errors.push('Failed to get reset password email')
}

web.transaction('Open Reset Password Page')
web.open(resetPasswordUrl)

web.transaction('Update New Password')
var newPassword = po.randomPassword()
po.passedTests.push('New Password: ' + newPassword)

web.type(auth.newPasswordInput, newPassword)
web.type(auth.repeatPasswordInput, newPassword)
web.pause(po.shortWait)
web.click(auth.updatePasswordButton)

if (web.isVisible(auth.authLayout)) {
    web.transaction('Login With The Old Password')
    po.validateLogin(env.email, env.password)

    web.transaction('Login With The New Password')
    po.login(env.email, newPassword)
    po.assertUserLoggedIn(env.email)
} 

web.transaction('Update New Password')
po.updateEnvPassword('TEST', newPassword)

web.transaction('Display Results')
po.displayResults()
