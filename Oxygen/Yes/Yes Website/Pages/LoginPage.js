module.exports = {
    idInput: 'id=ID',
    otpInput: 'id=otp',
    phoneInput: 'id=Phone_number',
    loginButton: '//input[@value="כניסה לחשבון" and not (@disabled)]',
    loginError: '//*[@class="loginError"]',

    login: () => {
        web.transaction(`Open ${env.url}`)
        web.init()
        web.open(env.url)

        web.transaction('Open Login Page')
        let tries = 10
        while (!web.isVisible(po.loginPage.idInput, po.waitASecond)) {
            if (tries == 0) break
            web.pause(po.waitASecond)
            web.click(po.mainPage.enterAccountButton)
        }
        
        web.transaction('Login')
        web.type(po.loginPage.idInput, env.userId)
        web.type(po.loginPage.phoneInput, env.userPhone)
        web.click(po.loginPage.loginButton)
        
        if (web.isVisible(po.loginPage.otpInput)) {
            log.info('Sent OTP')
            web.back()
        } else {
            assert.fail('Failed to send OTP')
        }

        if (web.isVisible(po.mainPage.userAccountButton)) {
            log.info('Logged In Successfully')
        } else if (web.isVisible(po.loginPage.loginError)) {
            assert.fail(web.getText(po.loginPage.loginError))
        } else {
            assert.fail('Failed to login')
        }
    },
}
