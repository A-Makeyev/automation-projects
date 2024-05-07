const auth = require('../Pages/Auth.js')
var errors, actives
const validPassword = 'VALiD000'
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

web.setTimeout(po.shortWait)

web.transaction(`Enter Invalid Password Rule -> "${rule1}"`)
po.type(auth.signupInput('password'), rule1)
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

if (errors == 5) {
    po.passedTests.push(`5 password validation errors appear after entering "${rule1}"`)
    po.log('info', `Error messages appear after entering "${rule1}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 5 password validation errors to appear after entering "${rule1}", instead got: ${errors}`)
}

if (actives == 0) {
    po.passedTests.push(`0 password validation actives appear after entering "${rule1}"`)
    po.log('info', `Active messages to appear after entering "${rule1}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 0 password validation actives to appear after entering "${rule1}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule2}"`)
po.type(auth.signupInput('password'), rule2)
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
    po.passedTests.push(`4 password validation errors appear after entering "${rule2}"`)
    po.log('info', `Error messages appear after entering "${rule2}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 4 password validation errors to appear after entering "${rule2}", instead got: ${errors}`)
}

if (actives == 1) {
    po.passedTests.push(`1 password validation active appears after entering "${rule2}"`)
    po.log('info', `Active messages to appear after entering "${rule2}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 1 password validation active to appear after entering "${rule2}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule3}"`)
po.type(auth.signupInput('password'), rule3)
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
    po.passedTests.push(`4 password validation errors appear after entering "${rule3}"`)
    po.log('info', `Error messages appear after entering "${rule3}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 4 password validation errors to appear after entering "${rule3}", instead got: ${errors}`)
}

if (actives == 1) {
    po.passedTests.push(`1 password validation active appears after entering "${rule3}"`)
    po.log('info', `Active messages to appear after entering "${rule3}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 1 password validation actives to appear after entering "${rule3}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule4}"`)
po.type(auth.signupInput('password'), rule4)
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
    po.passedTests.push(`4 password validation errors appear after entering "${rule4}"`)
    po.log('info', `Error messages appear after entering "${rule4}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 4 password validation errors to appear after entering "${rule4}", instead got: ${errors}`)
}

if (actives == 1) {
    po.passedTests.push(`1 password validation active appears after entering "${rule4}"`)
    po.log('info', `Active messages to appear after entering "${rule4}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 1 password validation active to appear after entering "${rule4}", instead got: ${actives}`)
}

web.transaction(`Enter Invalid Password Rule -> "${rule5}"`)
po.type(auth.signupInput('password'), rule5)
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

if (errors == 5) {
    po.passedTests.push(`5 password validation errors appear after entering "${rule5}"`)
    po.log('info', `Error messages appear after entering "${rule5}":`)
    for (let i = 1; i <= errors; i++) {
        po.log('error', web.getText(`(${auth.passwordValidationErrors})[${i}]`))
    }
} else {
    po.errors.push(`Expected 5 password validation errors to appear after entering "${rule1}", instead got: ${errors}`)
}

if (actives == 0) {
    po.passedTests.push(`0 password validation actives appear after entering "${rule5}"`)
    po.log('info', `Active messages to appear after entering "${rule5}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 0 password validation actives to appear after entering "${rule5}", instead got: ${actives}`)
}

web.transaction(`Enter Valid Password Rule -> "${validPassword}"`)
po.type(auth.signupInput('first_name'), 'First')
po.type(auth.signupInput('last_name'), 'Last')
po.type(auth.signupInput('email'), 'wrong@email.com')
po.type(auth.signupInput('password'), validPassword)
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
    po.passedTests.push(`5 password validation actives appear after entering "${validPassword}"`)
    po.log('info', `Active messages to appear after entering "${validPassword}":`)
    for (let i = 1; i <= actives; i++) {
        po.log('success', web.getText(`(${auth.passwordValidationActives})[${i}]`))
    }
} else {
    po.errors.push(`Expected 5 password validation actives to appear after entering "${validPassword}", instead got: ${actives}`)
}

web.transaction('Display Results')
po.displayResults()
