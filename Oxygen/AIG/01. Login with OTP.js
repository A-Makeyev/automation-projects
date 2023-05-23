const config = require('./Config.js')

web.transaction('01. Initialize Twilio')
twilio.init(config.SID, config.TOKEN)

web.transaction('02. Initialize Selenium')
web.init()

web.transaction('03. Open Main Page')
web.open('https://services.aig.co.il/PersonalServices')
web.waitForExist('//h1[@id="login__title"]')

web.transaction('04. Enter Credentials')
web.type('//input[@id="custId"]', config.ID)
web.type('//input[@id="custPhone"]', config.TwilioNumber)
web.pause(3000) /* avoid empty click */

web.transaction('05. Login (Send SMS)')
web.click('//button[@id="btnLogin"]')
web.waitForVisible('//input[@id="password"]')
web.pause(13000) /* avoid empty click */
web.transaction('06.s Recieve OTP From Twilio')
let otp = twilio.getLastSms(false, 30 * 1000, 5 * 60 * 1000)
log.info(otp)
otp = otp.replace(/\D/g, '')
log.info(otp)

web.transaction('07. Enter OTP Code')
web.type('//input[@id="password"]', otp)
web.waitForExist('//button[@aria-describedby="loginExplanation" and @aria-disabled="false"]')

web.transaction('08. Login to Personal Area')
web.click('//button[@aria-describedby="loginExplanation" and @aria-disabled="false"]')

web.transaction('09. Assert Correct Name')
assert.equal(
    web.isVisible(`//button[@id="logOutButton" and contains(text(), "שלום ${config.NAME}")]`), true,
    `The correct name (${config.NAME}) was not displayed`
)

assert.contain(
    web.getText('//button[@id="logOutButton"]'), `שלום ${config.NAME}`,
    `The correct name (${config.NAME}) was not displayed`
)
