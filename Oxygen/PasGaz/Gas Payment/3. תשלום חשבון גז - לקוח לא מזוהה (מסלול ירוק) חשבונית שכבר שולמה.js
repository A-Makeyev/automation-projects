po.init(env.debtPaymentUrl, false)
web.setTimeout(75 * 1000)

const utils = po.utils
const general = po.general

const customerNumber = '9999999999'
const invoiceNumber = '9999999999'
const email = 'anatoly.makeyev@cloudbeat.io'

web.transaction('04. Enter Customer Details')
if (web.isVisible('//div[contains(text(), "פעולות לשרותכם")]//..//a[contains(text(), "תשלום חשבון גז")]', utils.shortWait)) {
    web.click('//div[contains(text(), "פעולות לשרותכם")]//..//a[contains(text(), "תשלום חשבון גז")]')
}

if (web.isVisible('//*[contains(text(), "מה מספר הצרכן שלך?")]')) {
    utils.type('//div[@class="inputWrapper"]//input', customerNumber)
    utils.click('//div[@class="inputWrapper"]//cf-input-button')
}

if (web.isVisible('//*[contains(text(), "איזה מספר חשבונית ברצונך לשלם?")]')) {
    utils.type('//div[@class="inputWrapper"]//input', invoiceNumber)
    utils.click('//div[@class="inputWrapper"]//cf-input-button')
} 

web.transaction('05. Assert That Invoice Is Already Paid')
if (web.isVisible(`//p[contains(text(), "${invoiceNumber}")]`) && web.isVisible('//p[contains(text(), "החשבונית כבר שולמה")]')) {
    utils.click('//cf-radio-button//*[contains(text(), "לא")]')
    utils.click('//cf-radio-button//*[contains(text(), "סיום")]')
} else {
    assert.fail('לא מופיעה הודעה שהחשבונית כבר שולמה')
}

web.transaction('06. Assert That Page Was Redirected')
utils.assertRedirectedPage()
