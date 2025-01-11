module.exports = {
    auth: require('./Pages/Auth.js'),
    dashboard: require('./Pages/Dashboard.js'),

    shortWait: 5000,
    waitASecond: 1000,
    longWait: 10 * 1000,
    passedTests: [],
    warnings: [],
    errors: [],

    log: (type, message) => {
        if (type == 'info') log.info(`(ℹ️) ${message}`)
        if (type == 'error') log.info(`❌ ${message}`)
        if (type == 'warning') log.info(`⚠️ ${message}`)
        if (type == 'success') log.info(`✔️ ${message}`)
    },

    click: (element) => {
        web.pause(po.waitASecond)
        web.click(element)
    },

    type: (element, text) => {
        po.click(element)
        web.type(element, text)
    },

    getText: (locator) => {
        let tries = 10
        let text = web.getText(locator)
        
        if (text.trim() === '' && text.length < 1) {
            while (text.length < 1) {
                web.pause(po.waitASecond)
                text = web.getText(locator)
                if (tries === 0) break
                else tries -- 
            }
        }
        return text
    },

    pressKey: (key) => {
        web.pause(po.waitASecond)
        switch(key) {
            case 'TAB':
                web.sendKeys('\uE004')
            case 'ENTER':
                web.sendKeys('\uE007')
            case 'SPACE':
                web.sendKeys('\uE00D')
            case 'BACKSPACE':
                web.sendKeys('\uE003')
            case 'ARROWDOWN':
                web.sendKeys('\uE015')
        }
        web.pause(po.waitASecond)
    },

    randomPassword: () => {
        let counter = 0
        let result = ''
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let number = String(Math.floor(Math.random() * (1000 - 100 + 1) + 100))

        while (counter < chars.length / 5) {
            if (counter % 2 == 0) {
                result += chars.charAt(Math.floor(Math.random() * chars.length)).toLowerCase()
            } else {
                result += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            counter ++
        }
        return result + number + result.slice(1) 
    },

    displayResults: () => {
        if (po.passedTests.length > 0) {
            po.log('info', 'Passed Tests:')
            po.passedTests.forEach(test => po.log('success', test))
        }

        if (po.warnings.length > 0) {
            po.log('info', 'Warnings:')
            po.warnings.forEach(test => po.log('warning', test))
        }

        if (po.errors.length > 0) {
            po.log('info', 'Errors:')
            po.errors.forEach(error => po.log('error', error))
            assert.fail(`${po.errors.length} errors were found`)
        }
    },

    init: (url) => {
        web.init()
        web.open(url)

        const windowWidth = web.execute(() => { return window.innerWidth })
        const windowHeight = web.execute(() => { return window.innerHeight })
        windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

        assert.equal(
            web.isVisible(po.auth.authLayout),
            true, `Failed to load "${url}" properly`
        )
    },

    login: (email, pass) => {
        let auth = po.auth
        if (web.isVisible(auth.loginForm)) {
            po.type(auth.emailInput, email)
            po.type(auth.passwordInput, pass)
            po.click(auth.loginButton)
        }
    },

    logout: () => {
        let auth = po.auth
        po.click(auth.accountMenu)
        po.click(auth.logoutButton)
        if (!web.isVisible(auth.accountMenu)) {
            po.log('success', `Logged out with -> "${email}"`)
        } else {
            po.log('error', `Failed to logout with -> "${email}"`)
        }
    },

    assertUserLoggedIn: (email) => {
        let auth = po.auth
        if (web.isVisible(auth.accountMenu)) {
            web.isVisible('//button[@data-uf-button="close"]', po.shortWait) && po.click('//button[@data-uf-button="close"]')
            if (web.isVisible(auth.accountMenu)) {
                po.log('success', `Logged in with -> "${email}"`)
            } else {
                po.log('error', `Failed to login with -> "${email}"`)
            }
        }
    },

    validateLogin: (email, pass) => {
        let auth = po.auth, displayedErrorMessage, successMessage, errorMessage
        let status = { message: '', error: Boolean }

        po.login(email, pass)
        if (web.isVisible(auth.inputErrorMessage)) {
            let field = web.getAttribute(auth.invalidInput, 'name')
            if (web.isVisible(auth.inputErrorMessage)) {
                displayedErrorMessage = web.getText(auth.inputErrorMessage)
                successMessage = `${field} field error message is displayed: "${displayedErrorMessage}"`
                status.message = successMessage
                status.error = false
            } else {
                errorMessage = `${field} field error message is NOT displayed`
                status.message = errorMessage
                status.error = true
            }
            web.pause(po.shortWait)
        } 
        return status
    },

    changePassword: (currentPassword, newPassword) => {
        let auth = po.auth

        po.click(auth.accountMenu)
        po.click(auth.accountButton)
        
        let firstName = web.getValue(auth.accountSettingsFirstNameInput)
        let lastName = web.getValue(auth.accountSettingsLastNameInput)

        po.type(auth.accountSettingsCurrentPasswordInput, currentPassword)
        po.type(auth.accountSettingsNewPasswordInput, newPassword)
        po.type(auth.accountSettingsConfirmNewPasswordInput, newPassword)
        po.click(auth.saveButton)

        if (web.isVisible(auth.toastMessage, po.shortWait)) {
            web.pause(po.waitASecond)
            let message = web.getText(auth.toastMessage)
            po.passedTests.push(firstName + ' ' + lastName + ' ' + message)
        } else {
            po.errors.push('Failed to change password')
        } 
        
        if (web.isVisible(auth.inputErrorMessage, po.shortWait)) {
            po.errors.push(`${web.getText(auth.inputErrorMessage)} (${newPassword})`)
        }
    },

    getUserName: () => {
        let auth = po.auth

        po.click(auth.accountMenu)
        po.click(auth.accountButton)
        
        let firstName = web.getValue(auth.accountSettingsFirstNameInput)
        let lastName = web.getValue(auth.accountSettingsLastNameInput)

        po.log('success', `User's Name: ${firstName} ${lastName}`)

        po.click(po.dashboard.dashboardNavLink)
        
        return [firstName, lastName]
    },

    assertNextButtonIsDisabled: (field, value) => {
        let auth = po.auth, successMessage, errorMessage
        let status = { message: '', error: Boolean }

        if (field) po.type(auth.signupInput(field), value)
        po.pressKey('TAB')
        
        if (web.isVisible(auth.signupNextButtonDisabled, po.shortWait)) {
            successMessage = field ? `Next Button Is Disabled When Entering Only "${field}"` : 'Next Button Is Disabled When Form Is Empty'
            status.message = successMessage
            status.error = false
        } else {
            errorMessage = `Next Button Is NOT Disabled When Entering Only "${field}"`
            status.message = errorMessage
            status.error = true
        }
        if (field) web.clear(auth.signupInput(field))
        return status
    },

    enterSignupDetails: (firstName, lastName, email, password, passwordConfirmation) => {
        let auth = po.auth
        po.type(auth.signupInput('first_name'), firstName)
        po.type(auth.signupInput('last_name'), lastName)
        po.type(auth.signupInput('email'), email)
        po.type(auth.signupInput('password'), password)
        po.type(auth.signupInput('password_confirmation'), passwordConfirmation)
    },

    updateEnvPassword: (env, newPassword) => {
        let fs = require('fs')
        let path = require('path')
        let envFilePath = path.join(__dirname, './oxygen.env.js')
        let testPassword = env == 'TEST' && newPassword
        let prodPassword = env == 'PROD' && newPassword
        
        let updatedEnv =
        `
            module.exports = {
                default: {
                    url: 'https://merchone:karneval2@testing.merchone.com',
                    dashboardUrl: 'https://merchone:karneval2@testing-dashboard.merchone.com',
                    supportUrl: 'https://support.merchone.com/en/support/home',
                    email: 'test.picanova.qa.team@gmail.com', 
                    appPassword: 'anty lwwz jiyn dqgj',  
                    password: '${testPassword}'
                },

                TEST: { 
                    url: 'https://merchone:karneval2@testing.merchone.com',
                    dashboardUrl: 'https://merchone:karneval2@testing-dashboard.merchone.com',
                    supportUrl: 'https://support.merchone.com/en/support/home',
                    email: 'test.picanova.qa.team@gmail.com',
                    appPassword: 'anty lwwz jiyn dqgj',  
                    password: '${testPassword}'
                },

                PROD: { 
                    url: 'https://merchone.com',
                    dashboardUrl: 'https://dashboard.merchone.com',
                    supportUrl: 'https://support.merchone.com/en/support/home',
					email: 'picanova.team@gmail.com', 
                    appPassword: 'xxxx xxxx xxxx xxxx',
                    password: 'xxxxxx'
                },

            }
        `
        fs.writeFileSync(envFilePath, updatedEnv)
		po.log('success', 'Updated ENV with the new password')
		po.log('warning', `Temporary you need to manually updade the new password in cloudbeat: ${newPassword}`)
    },
}
