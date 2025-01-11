module.exports = {
    longWait: 15000,
    shortWait: 5000,
    waitASecond: 1000,

    init: (caseName) => {
        web.transaction('01. Init')
        web.init({
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
                    '--disable-notifications',
                    '--enable-strict-powerful-feature-restrictions'
                ]
            }
        })

        web.transaction(`02. Open ${env.url}`)
        web.open(env.url)
        if (web.isVisible('id=main-content')) {
            po.log('info', `${caseName} (${env.name} סביבת)`)
        } else {
            po.log('error', `Failed to load main content at (${env.name} סביבת)`)
        }
    },

    getCurrentDateAndTime: (type) => {
        let today = new Date()
        let dd = String(today.getDate()).padStart(2, "0")
        let mm = String(today.getMonth() + 1).padStart(2, "0")
        let yyyy = today.getFullYear()
        let hours = today.getHours()
        let minutes = today.getMinutes()
        let seconds = today.getSeconds()

        if (type == 'day') return dd
        if (type == 'month') return mm
        if (type == 'year') return yyyy
        if (type == 'hours') return dd
        if (type == 'minutes') return hours
        if (type == 'seconds') return seconds
        return `${dd}-${mm}-${yyyy}_${hours}-${minutes}-${seconds}`
    },

    getRandomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min
    },

    getText: (element) => {
        web.pause(po.waitASecond)
        let text = web.getText(element)
        let tries = 10
        while (!text.trim()) {
            text = web.getText(element)
            web.pause(po.waitASecond)
            if (tries == 0) break
            tries--
        }
        return text
    },

    click: (element, hidden) => {
        web.pause(po.waitASecond)
        web.waitForVisible(element)
        hidden ? web.clickHidden(element) : web.click(element)
    },

    type: (element, str) => {
        po.click(element)
        web.type(element, str)
    },

    log: (type, message) => { 
        if (type == 'success') log.info(`✔️ ${message}`)
        if (type == 'warning') log.info(`⚠️ ${message}`)
        if (type == 'error') log.info(`❌ ${message}`)
        if (type == 'info') log.info(`(ℹ️) ${message}`)
    },

    pressTAB: () => {
        web.sendKeys('\uE004')
        web.pause(po.waitASecond)
    },

    pressENTER: () => {
        web.sendKeys('\uE007')
        web.pause(po.waitASecond)
    },

    pressBACKSPACE: () => {
        web.sendKeys('\uE003')
    },

    pressSPACE: () => {
        web.sendKeys('\uE00D')
        web.pause(po.waitASecond)
    },

    pressARROW_DOWN: () => {
        web.sendKeys('\uE015')
        web.pause(po.waitASecond)
    },

    loginWithExistingCustomer: () => {
        if (web.isVisible('id=login-frame', po.shortWait)) web.selectFrame('id=login-frame')
        if (web.isVisible('(//iframe[contains(@src, "Login")])[1]', po.shortWait)) web.selectFrame('(//iframe[contains(@src, "Login")])[1]')
        if (web.isVisible('//div[contains(@class, "logInValidationGroup")]//h3', po.shortWait)) {
            let msg = po.getText('//div[contains(@class, "logInValidationGroup")]//h3')
            if (msg.includes('התחברות באמצעות שם משתמש וסיסמה אינה זמינה')) {
                po.log('warning', 'התחברות באמצעות שם משתמש וסיסמה אינה זמינה')
                assert.pass()
            }
        }

        if (web.isVisible('//div[@class="signInPopup content"]', po.shortWait)) {
            if (web.isVisible('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//input[@placeholder="שם משתמש"]', po.shortWait)) {
                let user = web.getValue('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//input[@placeholder="שם משתמש"]')
                if (!user.trim()) web.type('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//input[@placeholder="שם משתמש"]', env.username)
                web.type('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//input[@placeholder="סיסמא"]', env.password)
                po.click('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//input[@title="כניסה"]')
            }

            po.click('//div[@class="signInPopup content"]//..//input[@title="כניסה"]')
            if (web.isVisible('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//*[@class="error"]', po.shortWait)) {
                assert.fail(po.getText('//div[normalize-space()="כניסה ללקוחות רשומים"]//..//*[@class="error"]'))
            }
        }
    },
    
    mainPage: {
        signInButton: 'id=sign-in',
    },

    footer: {
        content: '//footer[@class="yes-footer"]',
        logoImage: '//div[@class="footer_logo"]//img',
        links: '//div[@class="footer-links"]//a',
        socialLinks: '//div[@class="footer_net"]//a',
        socialImages: '//div[@class="footer_net"]//img',
    }

    

}
