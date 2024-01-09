po.init(env.debtPaymentUrl, false)
web.setTimeout(75 * 1000)

const utils = po.utils
const general = po.general

const customerNumber = '9999999999'
const invoiceNumber = '99999999999'
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

if (web.isVisible('//div[@id="conversational-form"]//*[contains(text(), "המשך לתשלום")]')) {
    utils.click('//div[@id="conversational-form"]//*[contains(text(), "המשך לתשלום")]')
} else if (web.isVisible(`//p[contains(text(), "${invoiceNumber}")]`) && web.isVisible('//p[contains(text(), "החשבונית כבר שולמה")]')) {
    utils.click('//cf-radio-button//*[contains(text(), "לא")]')
    utils.click('//cf-radio-button//*[contains(text(), "סיום")]')
    log.info(`חשבונית ${invoiceNumber} כבר שולמה ${customerNumber} של לקוח`)
    utils.assertRedirectedPage()
}

if (web.isVisible('(//span[@class="invoice-payment-price-label"])[1]')) {
    var invoicePaymentNumber = utils.getText('(//span[@class="invoice-payment-price-label"])[1]')
    var invoiceDate = utils.getText('(//span[@class="invoice-desc invoice-payment-date"])[1]')
    var invoicePeriod = utils.getText('(//span[@class="invoice-desc invoice-payment-period"])[1]')
    var invoicePrice = utils.getText('(//span[@class="invoice-payment-price"])[1]')
}

if (invoiceNumber !== invoicePaymentNumber) {
    assert.fail(`Invoice number (${invoiceNumber}) doesn't match the displayed invoice number (${invoicePaymentNumber})`)
} else {
    log.info('Invoice Number: ' + invoicePaymentNumber)
    log.info('Invoice Date: ' + invoiceDate)
    log.info('Invoice Period: ' + invoicePeriod)
    log.info('Invoice Price: ' + invoicePrice)
}

if (web.isVisible('//div[@id="conversational-form"]//*[contains(text(), "המשך לתשלום")]')) {
    utils.click('//div[@id="conversational-form"]//*[contains(text(), "המשך לתשלום")]')
}

if (web.isVisible('//*[contains(text(), "לאיזה מייל לשלוח לך את הקבלה?")]')) {
    utils.type('//div[@class="inputWrapper"]//input', email)
    utils.click('//div[@class="inputWrapper"]//cf-input-button')
    utils.click('//cf-radio-button//*[contains(text(), "המשך לתשלום")]')
}

web.transaction('05. Create Payment')
po.paymentWindow.createPayment()
utils.click('//*[contains(text(), "סיום")]')

web.transaction('06. Assert That Page Was Redirected')
utils.assertRedirectedPage()
