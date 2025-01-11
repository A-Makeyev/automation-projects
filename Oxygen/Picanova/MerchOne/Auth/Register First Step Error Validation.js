const auth = require('../Pages/Auth.js')
const password = 'SomePassword123', wrongPassword = 'WrongPassword123'

web.transaction(`Open ${env.dashboardUrl}`)
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login page is displayed')
} else {
    po.po.errors.push('Failed to load login page')
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

web.transaction('Assert Next Button Is Disabled When Form Is Empty')
const emptyField = po.assertNextButtonIsDisabled()
emptyField.error ? po.errors.push(emptyField.message) : po.passedTests.push(emptyField.message)

web.transaction('Assert Next Button Is Disabled When Entering Only First Name')
const firstNameField = po.assertNextButtonIsDisabled('first_name', 'First Name')
firstNameField.error ? po.errors.push(firstNameField.message) : po.passedTests.push(firstNameField.message)

web.transaction('Assert Next Button Is Disabled When Entering Only Last Name')
const lastNameField = po.assertNextButtonIsDisabled('last_name', 'Last Name')
lastNameField.error ? po.errors.push(lastNameField.message) : po.passedTests.push(lastNameField.message)

web.transaction('Assert Next Button Is Disabled When Entering Only Email')
const emailField = po.assertNextButtonIsDisabled('email', env.email)
emailField.error ? po.errors.push(emailField.message) : po.passedTests.push(emailField.message)

web.transaction('Assert Next Button Is Disabled When Entering Only Password')
const passwordField = po.assertNextButtonIsDisabled('password', env.email)
passwordField.error ? po.errors.push(passwordField.message) : po.passedTests.push(passwordField.message)

web.transaction('Assert Next Button Is Disabled When Entering Only Password Confirmation')
const passwordConfirmationField = po.assertNextButtonIsDisabled('password_confirmation', env.email)
passwordConfirmationField.error ? po.errors.push(passwordConfirmationField.message) : po.passedTests.push(passwordConfirmationField.message)

web.transaction('Assert Next Button Is Disabled When Entering Correct Data And Not Matching Passwords')
po.enterSignupDetails('First Name', 'Last Name', 'some@email.com', password, wrongPassword)

const passwordsDontMatch = po.assertNextButtonIsDisabled()
if (passwordsDontMatch.error) {
    po.errors.push('Next Button Is NOT Disabled When Entering Correct Data And Not Matching Passwords')
} else {
    po.passedTests.push('Next Button Is Disabled When Entering Correct Data And Not Matching Passwords')
}

web.transaction('Assert Next Button Is Disabled When Entering Correct Data And Already Existing Email')
po.enterSignupDetails('First Name', 'Last Name', env.email, password, password)
po.click(auth.signupNextButton)

if (web.isVisible(auth.inputErrorMessage)) {
    po.passedTests.push(`Input Hint Error Message Is Displayed For Already Existing Email (${env.email})`)
} else {
    po.errors.push(`Input Hint Error Message Is NOT Displayed For Already Existing Email (${env.email})`)
}

web.transaction('Display Results')
po.displayResults()
