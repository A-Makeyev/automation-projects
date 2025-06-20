module.exports = {
    longWait: 15000,
    shortWait: 5000,
    waitASecond: 1000,
    loginPage: require('./Pages/LoginPage'),
    mainPage: require('./Pages/MainPage'),
    accountPage: require('./Pages/AccountPage'),

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
}
