po.init(env.debtPaymentUrl, false)
web.setTimeout(75 * 1000)

const utils = po.utils
const general = po.general

const customerNumber = '9999999999'
const invoiceNumber = '9999999999'
const phoneNumber = '052-7729974'

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

if (web.isVisible('//div[@id="conversational-form"]//*[contains(text(), "להמשיך להזדהות")]')) {
    utils.click('//cf-radio-button//*[contains(text(), "להזדהות")]')
}

if (web.isVisible(`//p[contains(text(), "${invoiceNumber}")]`) && web.isVisible('//p[contains(text(), "החשבונית כבר שולמה")]')) {
    utils.click('//cf-radio-button//*[contains(text(), "לא")]')
    utils.click('//cf-radio-button//*[contains(text(), "סיום")]')
} else if (web.isVisible('//div[@id="conversational-form"]//*[contains(text(), "הקלד טלפון לשליחת קוד חד-פעמי")]')) {
    utils.type('//div[@class="inputWrapper"]//input', phoneNumber)
    utils.click('//div[@class="inputWrapper"]//cf-input-button')

    web.transaction('05.01. Assert Phone Number')
    assert.equal(
        web.isVisible(`//*[contains(text(), "${phoneNumber}")]`), true,
        'מספר הטלפון המוצג אינו תואם למספר הטלפון שהוקלד'
    )

    if (web.isVisible('//div[@id="conversational-form"]//*[contains(text(), "מספר זה אינו הטלפון המשוייך למספר הטלפון שבמערכת")]')) {
        utils.type('//div[@class="inputWrapper"]//input', phoneNumber)
        utils.click('//div[@class="inputWrapper"]//cf-input-button')
    }

    if (web.isVisible('//div[@id="conversational-form"]//*[contains(text(), "זה אינו הטלפון המשוייך למספר הצרכן")]')) {
        log.info(`❌ מספר הטלפון ${phoneNumber} אינו משוייך למספר חשבונית ${invoiceNumber}`)
        general.sendContactDetails('אנטולי מקייב', '0527729974', 'נהרייה')
    }
} else if (web.isVisible('//p[contains(text(), "זיהינו שיש סכום לתשלום מעודכן")]')) {
    general.sendContactDetails('אנטולי מקייב', '0527729974', 'נהרייה')
}

web.transaction('06. Assert That Page Was Redirected')
utils.assertRedirectedPage()
