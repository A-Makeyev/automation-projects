module.exports = {
    
    env_qa: 'https://hafaka-frontend-npcqa.menora.co.il',
    env_int: 'https://hafaka-frontend-npcint.menora.co.il',
    username: 'k90fis1',
    password: 'fis1',

    LOGIN: function(environment) {
        if (environment === 'QA') { web.open(`${this.env_qa}/login`) } 
        if (environment === 'INT') { web.open(`${this.env_int}/login`) }

        web.waitForExist('id=input-login-user')
    
        web.type('id=input-login-user', this.username)
        web.type('id=input-login-password', this.password)
        web.click('//button[@type="submit"]')
        log.info('~~~>>> Logged in')

        if (!web.isVisible('id=title-overlay-section')) {
            if (web.isVisible('//h6[contains(text(), "שגיאה")]')) {
                let error = web.getText('(//div[@class="modal-body"]/div)[1]')
                assert.fail(error)
            } else if (web.isVisible('//h6[contains(text(), "אימות משתמש")]')) {
                let error = web.getText('//div[@class="card-img-overlay"]//p')
                assert.fail(error)
            }
        } 
    },

    LOGOUT: function() {
        web.click('id=dropdownBasic1')
        web.waitForExist('//button[contains(text(), " התנתקות ")]')
        web.click('//button[contains(text(), " התנתקות ")]')
        web.waitForExist('//button[@id="logoff"]')
        web.click('//button[@id="logoff"]')
        log.info('~~~>>> Logged out')
        web.selectWindow()
        web.closeWindow()
        web.dispose()
    },

    pressTAB: () => {
        web.pause(500)
        web.sendKeys('\uE004')
        web.pause(500)
    },
    pressENTER: () => {
        web.pause(1500)
        web.sendKeys('\uE007')
        web.pause(1500)
    },
    pressARROW_DOWN: () => {
        web.pause(1500)
        web.sendKeys('\uE015')
        web.pause(1500)
    },
    pressF4: () => {
        web.pause(1500)
        web.sendKeys('\uE034')
        web.pause(1500)
    },
    pressF8: () => {
        web.pause(1500)
        web.sendKeys('\uE038')
        web.pause(1500)
    },
    press_1: () => {
        web.pause(1500)
        web.sendKeys('\uE01B')
        web.pause(1500)
    },

    click: function(element) {
        web.waitForVisible(element)
        web.click(element)
    },

    type: function(element, text) {
        web.waitForVisible(element)
        web.type(element, text)
    },

    underwritingBtn: '//button[@id="underwritingBtn"]',

}
