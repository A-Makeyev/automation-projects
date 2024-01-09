function getRandomEmail(domain, length) {
    var name = ''
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for(var i = 0; i < length; i++)
        name += chars.charAt(Math.floor(Math.random() * chars.length))
    return `${name}@${domain}`
}

var email = getRandomEmail("cloudbeat.io", 10)
log.info(`Email: ${email}`)


web.transaction('Initializing')
web.init()
web.open('https://azurewebsites.net/fr/france/registrate/')
web.setTimeout(9000)

web.waitForExist('//form[@action="/TevaFrHcpRegistrationBlock/RegisterUser"]')

web.transaction('Close cookies')
if (web.isExist('//div[contains(@id, "disclaimer-block")]'))
    web.click('//div[@class="btn-close"]')

web.transaction('Fill form')
web.type('id=regFormFirstName', 'Testabon')
web.type('id=refFormLastName', 'Villalon')
web.type('id=regFormRpps', '10987654321')
web.type('id=regFormEmail', email)
web.type('id=refFormRepeatEmail', email)

web.transaction('Assert if the button is available')
if (web.isExist('//button[contains(@class, "send-button") and @disabled]'))
    web.click('id=regFormRpps')

web.waitForExist('//button[contains(@class, "send-button") and not(@disabled)]')
web.click('//button[contains(@class, "send-button")]')

web.transaction('If email already exists, enter another one')
if (web.isExist('//p[contains(@class, "register-error")]')) {
    email = getRandomEmail("cloudbeat.io", 10)
    log.info(`New email: ${email}`)
    web.type('id=regFormEmail', email)
    web.type('id=refFormRepeatEmail', email)
    web.pause(1000)
}


web.transaction('Assert if the sign up was successful')
web.waitForExist('//h3[contains(@class, "container account-page-title ")]')
web.dispose();