// need random names?

const PW = 'XXXXXX'
const USER = 'XXXX_Automation'
const EMAIL = 'XXXX@XXXXX.com'
const NAME = 'Estabon Villalon'
const URL = 'https://azurewebsites.net'

web.transaction('Initializing')
web.init()
web.open(URL)
web.setTimeout(9000)

web.transaction('Login')
web.waitForExist('//div[@id="LoginControl"]')
web.type('id=LoginControl_UserName', USER)
web.type('id=LoginControl_Password', PW)
web.click('id=LoginControl_Button1')

web.transaction('Close cookies')
if (web.isExist('//div[@id="cookies-popup"]')) {
    web.click('//a[@title="Accept cookies"]')
    web.pause(1000)
}

web.transaction('Click on an article and assert that it\'s locked')
web.waitForExist('//div[@class="item first"]//img')
web.click('//div[@class="item first"]//img')
web.waitForExist('//h2[contains(text(), "Log in to read this article")]')
web.assertExist('//a[@class="sprite-Register" and @title="Register"]')
web.assertExist('//a[@class="sprite-Key" and @title="Login"]')
web.assertExist('//a[text()="LOG IN"]')

web.transaction('Register')
web.click('//a[contains(text(), "Register now")]')
web.waitForExist('//div[@class="container-fluid bgcolor2"]')

const idPattern = 'pageid:pBlock:formid'

web.type(`//input[@id="${idPattern}:firstNameInput"]`, NAME.substring(0, 7))
web.type(`//input[@id="${idPattern}:lastNameInput"]`, NAME.substring(8, NAME.length))
web.select(`//select[@id="${idPattern}:countryInput"]`, 'value=ISR')
web.type(`//input[@id="${idPattern}:emailInput"]`, EMAIL)
web.type(`//input[@id="${idPattern}:confirmEmailInput"]`, EMAIL)
web.type(`//input[@id="${idPattern}:passwordInput"]`, 'Test@123 ')
web.click(`//input[@id="${idPattern}:j_id151:0:checkId"]`)
web.click(`//input[@id="${idPattern}:j_id151:1:checkId"]`)
web.click(`//input[@id="${idPattern}:buttonID1:j_id192:btnO"]`)
// captcha! \\
if (web.isExist('//iframe[@title="recaptcha challenge"]'))
    assert.fail('captcha!')

web.transaction('Assert registration')
web.waitForExist('id=mobmenu')
web.assertExist('//a[@class="sprite-Key" and @title="Logout"]')

var registeredName = web.getText('//a[@class="sprite-Profile"]')

if (registeredName != NAME) {
    assert.fail('The registered name doesn\'t equal the actual name')
} else {
    web.dispose()
}
