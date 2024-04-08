module.exports = {
    loginPage: require('./Pages/Login Page.js'),

    init: (url) => {
        web.init()

        web.transaction(`Open ${url}`)
        web.open(url)
        assert.equal(
            web.isVisible(po.loginPage.authLayout), 
            true, `Failed to load "${url}" properly`
        )
    },

    login: (email, pass) => {
        web.transaction(`Login With ${email}`)
        let lp = po.loginPage
        if (web.isVisible(lp.loginForm)) {
            web.type(lp.emailInput, email)
            web.type(lp.passwordInput, pass)
            web.click(lp.loginButton)
        }
    },

    validateLogin: (email, pass, field) => {
        let lp = po.loginPage, displayedErrorMessage

        po.login(email, pass)
        if (web.isVisible(lp.inputErrorMessage)) {
            displayedErrorMessage = web.getText(lp.inputErrorMessage)
            if (displayedErrorMessage === lp.expectedErrorMessageText) {
                let successMessage = `Field ${field} error message "${lp.expectedErrorMessageText}" is displayed`
                po.log('success', successMessage)
                return successMessage
            } else {
                let errorMessage = `Expected ${field} error message to be: "${lp.expectedErrorMessageText}", instead got: "${displayedErrorMessage}"`
                po.log('error', errorMessage)
                return errorMessage
            }
        }
    },

    assertUserLoggedIn: (email) => {
        if (web.isVisible('//div[contains(@class, "dashboard")]')) {
            if (web.isVisible('//div[@class="dashboard__header-account"]')) {
                log.info(`Logged in with "${email}"`)
            } else {
                assert.fail(`Failed to login with "${email}"`)
            }
            // if (web.isVisible('//button[@data-uf-button="close"]')) {
            //     web.click('//button[@data-uf-button="close"]')
            // }
        }
    },

    log: (type, message) => { 
        if (type == 'info') log.info(`(ℹ️) ${message}`)
        if (type == 'error') log.info(`❌ ${message}`)
        if (type == 'warning') log.info(`⚠️ ${message}`)
        if (type == 'success') log.info(`✔️ ${message}`)
    },

}