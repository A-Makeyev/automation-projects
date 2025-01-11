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
    web.type('//div[@class="inputWrapper"]//input', customerNumber)
    utils.click('//div[@class="inputWrapper"]//cf-input-button')
}

if (web.isVisible('//*[contains(text(), "איזה מספר חשבונית ברצונך לשלם?")]')) {
    web.type('//div[@class="inputWrapper"]//input', invoiceNumber)
    utils.click('//div[@class="inputWrapper"]//cf-input-button')
}

web.transaction('05. Assert That The Invoice Can\'t Be Paid Online')
if (web.isVisible('//*[contains(text(), "לא ניתן לבצע תשלום חשבונית זו באתר, יש לפנות לנציג")]')) {
    web.transaction('05.01. Send Personal Details')
    general.sendContactDetails('אנטולי מקייב', '0527729974', 'נהרייה')
} else {
    assert.fail('לא הופיע תופס של הכנסת פרטים אישיים')
}

web.transaction('06. Assert That Page Was Redirected')
utils.assertRedirectedPage()
