const LoginPage = {
    enterUsername: (username) => {
        web.type("id=user-name", username)
    },

    enterPassword: (password) => {
        web.type("id=password", password)
    },

    pressLoginButton: () => {
        web.click("id=login-button")
    },

    assertLoginSuccess: () => {
        assert.equal(
            web.isVisible("id=inventory_container", 10000), true, 
            'Login button is visible after logining in'
        )
        log.info('✔️  Login successful - login button no longer visible')
    },

    assertLoginErrorMessage: (expectedMessage) => {
        web.waitForVisible("css=[data-test='error']", 30000)
        const errorMessage = web.getText("css=[data-test='error']")
        if (errorMessage.trim() !== expectedMessage) {
            throw new Error(`Expected error '${expectedMessage}', instead got '${errorMessage}'`)
        }
        log.info(`✔️  Error message displayed -> ${errorMessage}`)
    },
}

module.exports = LoginPage