const auth = require('../Pages/Auth.js')
var errors, actives
const validPassword = 'Test9033'
const rule1 = 'abcd'
const rule2 = 'abcdefgh'
const rule3 = 'Abcd'
const rule4 = '1234'
const rule5 = 'pass'

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
        po.log('warning', web.getText(auth.inputErrorMessage))
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
web.setTimeout(po.shortWait)

web.transaction(`Enter Invalid Password Rule -> "${rule1}"`)
po.type(auth.newPasswordInput, rule1)
po.pressKey('ENTER')

if (web.isVisible(auth.passwordValidationErrors, po.shortWait)) {
    errors = web.getElementCount(auth.passwordValidationErrors)
} else {
    errors = 0
}

if (auth.passwordValidationActives, po.shortWait) {
    actives = web.getElementCount(auth.passwordValidationActives)
} else {
    actives = 0
}

if (errors == 4) {
    po.passedTests.push(`4 password validation errors appear after entering "${rule1}"`)
    po.log('info', `Error messages appear after entering "${rule1}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 4 password validation errors to appear after entering "${rule1}", instead got: ${errors}`)
}

if (actives == 1) {
    po.passedTests.push(`1 password validation active appears after entering "${rule1}"`)
    po.log('info', `Active messages to appear after entering "${rule1}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 1 password validation active to appear after entering "${rule1}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule2}"`)
po.type(auth.newPasswordInput, rule2)
po.pressKey('ENTER')

if (web.isVisible(auth.passwordValidationErrors, po.shortWait)) {
    errors = web.getElementCount(auth.passwordValidationErrors)
} else {
    errors = 0
}

if (auth.passwordValidationActives, po.shortWait) {
    actives = web.getElementCount(auth.passwordValidationActives)
} else {
    actives = 0
}

if (errors == 3) {
    po.passedTests.push(`3 password validation errors appear after entering "${rule2}"`)
    po.log('info', `Error messages appear after entering "${rule2}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 3 password validation errors to appear after entering "${rule2}", instead got: ${errors}`)
}

if (actives == 2) {
    po.passedTests.push(`2 password validation actives appears after entering "${rule2}"`)
    po.log('info', `Active messages to appear after entering "${rule2}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 2 password validation actives to appear after entering "${rule2}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule3}"`)
po.type(auth.newPasswordInput, rule3)
po.pressKey('ENTER')

if (web.isVisible(auth.passwordValidationErrors, po.shortWait)) {
    errors = web.getElementCount(auth.passwordValidationErrors)
} else {
    errors = 0
}

if (auth.passwordValidationActives, po.shortWait) {
    actives = web.getElementCount(auth.passwordValidationActives)
} else {
    actives = 0
}

if (errors == 3) {
    po.passedTests.push(`3 password validation errors appear after entering "${rule3}"`)
    po.log('info', `Error messages appear after entering "${rule3}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 3 password validation errors to appear after entering "${rule3}", instead got: ${errors}`)
}

if (actives == 2) {
    po.passedTests.push(`2 password validation actives appear after entering "${rule3}"`)
    po.log('info', `Active messages to appear after entering "${rule3}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 2 password validation actives to appear after entering "${rule3}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule4}"`)
po.type(auth.newPasswordInput, rule4)
po.pressKey('ENTER')

if (web.isVisible(auth.passwordValidationErrors, po.shortWait)) {
    errors = web.getElementCount(auth.passwordValidationErrors)
} else {
    errors = 0
}

if (auth.passwordValidationActives, po.shortWait) {
    actives = web.getElementCount(auth.passwordValidationActives)
} else {
    actives = 0
}

if (errors == 3) {
    po.passedTests.push(`4 password validation errors appear after entering "${rule4}"`)
    po.log('info', `Error messages appear after entering "${rule4}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 3 password validation errors to appear after entering "${rule4}", instead got: ${errors}`)
}

if (actives == 2) {
    po.passedTests.push(`2 password validation actives appear after entering "${rule4}"`)
    po.log('info', `Active messages to appear after entering "${rule4}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 2 password validation actives to appear after entering "${rule4}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule5}"`)
po.type(auth.newPasswordInput, rule5)
po.pressKey('ENTER')

if (web.isVisible(auth.passwordValidationErrors, po.shortWait)) {
    errors = web.getElementCount(auth.passwordValidationErrors)
} else {
    errors = 0
}

if (auth.passwordValidationActives, po.shortWait) {
    actives = web.getElementCount(auth.passwordValidationActives)
} else {
    actives = 0
}

if (errors == 4) {
    po.passedTests.push(`4 password validation errors appear after entering "${rule5}"`)
    po.log('info', `Error messages appear after entering "${rule5}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 4 password validation errors to appear after entering "${rule5}", instead got: ${errors}`)
}

if (actives == 1) {
    po.passedTests.push(`1 password validation active appears after entering "${rule5}"`)
    po.log('info', `Active messages to appear after entering "${rule5}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 1 password validation active to appear after entering "${rule5}", instead got: ${actives}`)
}

web.transaction(`Enter Valid Password Rule -> "${validPassword}"`)
po.type(auth.newPasswordInput, validPassword)
po.pressKey('ENTER')

if (web.isVisible(auth.passwordValidationErrors, po.shortWait)) {
    errors = web.getElementCount(auth.passwordValidationErrors)
} else {
    errors = 0
}

if (auth.passwordValidationActives, po.shortWait) {
    actives = web.getElementCount(auth.passwordValidationActives)
} else {
    actives = 0
}

if (errors == 0) {
    po.passedTests.push(`0 password validation errors appear after entering "${validPassword}"`)
    po.log('info', `Error messages appear after entering "${validPassword}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 0 password validation errors to appear after entering "${validPassword}", instead got: ${errors}`)
}

if (actives == 5) {
    po.passedTests.push(`5 password validation active appear after entering "${validPassword}"`)
    po.log('info', `Active messages to appear after entering "${validPassword}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 5 password validation active to appear after entering "${validPassword}", instead got: ${actives}`)
}

web.transaction('Display Results')
po.displayResults()
