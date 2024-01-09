const futureYear = (parseInt(date.now('YYYY')) + 7).toString()
const randNum = Math.floor(Math.random() * (999999 - 9) + 9)
const email = 'qatamirtest' + randNum + '@gmail.com'
const cardName = 'devscalosubransenberg'
const cardNumber = '77777777777777'
const phoneNumber = '777777777777'
const firstName = 'Cloud'
const lastName = 'Beat'

web.transaction('01. Initialize Selenium')
web.init()

web.transaction('02. Open Main Page')
web.open('https://www.canadianvisaexpert.com')
web.waitForVisible('//div[@class="header"]')

web.transaction('03. Open Apply Form')
web.click('//a[text()="Apply"]')
web.selectFrame('//iframe[@id="ApplyForm"]')

web.transaction('04. Enter Details')
web.type('id=Fname', firstName)
web.type('id=Lname', lastName)

web.select('id=birth_day', 'value=19')
web.select('id=birth_month', 'value=6')
web.select('id=birth_year', 'value=1989')

web.select('id=marital_status_select', 'label=Single')
web.select('id=occupation', 'label=Agricultural Inspector')
web.select('id=education_level', 'label=Bachelor\'s Degree')
web.select('id=birth_country', 'label=Belgium')
web.select('id=phone_code', 'label=Barbados (+1246)')

web.type('id=Email', email)
web.type('id=phone', phoneNumber)

web.execute(() => {
    document.evaluate(
        '//input[@id="YesPassportRadio"]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()

    document.evaluate(
        '//input[@id="iSpaekEn"]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
})

web.transaction('05. Submit Form')
web.execute(() => {
    document.evaluate(
        '//div[@id="submitBTN"]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
})

web.transaction('06. Select Products')
web.waitForVisible('//div[@id="productSelectionCanada"]')

const productPrice = web.getText('//div[contains(text(), "Canadian Visa Expert Single assessment")]//..//div[@class="ProductPrice"]')

web.click('//div[contains(text(), "Canadian Visa Expert Single assessment")]//..//..//div[@data-translate="Payment_btnSubmit"]')
web.waitForVisible('//div[@id="orderSummary"]')

web.transaction('06. Select Payment Method')
web.type('//input[contains(@id, "CreditCardTab_firstName")]', cardName)
web.type('//input[contains(@id, "CreditCardTab_CcNumber")]', cardNumber)
web.type('//input[contains(@id, "CreditCardTab_CvvCode")]', '111')

web.select('//select[contains(@id, "CreditCardTab_ExpMonth")]', 'value=12')
web.select('//select[contains(@id, "CreditCardTab_ExpYear")]', `value=${futureYear}`)

web.click('//span[contains(text(), "I agree to Canadian Visa Expert")]//..//..//div[@id="checkbox"]')

web.transaction('07. Submit Payment')
web.click('//input[@type="submit" and contains(@id, "CreditCardTab_Button")]')
web.waitForVisible('//div[@id="ProductsContainer"]')
web.waitForVisible('//div[@id="OrderDetailesDiv"]')

web.transaction('08. Assert Login to my Application')
web.click('//a[@data-translate="loginAppBtn"]')

web.selectWindow()
web.waitForVisible('//li[@id="loginImg"]//a[text()="Logout"]')
web.waitForVisible('//p[contains(text(), "Thank you for signing up with Canadian Visa Expert")]')

web.transaction('09. Assert View or Print Invoice')
web.selectWindow('title=Canadian Visa Expert')
web.click('//a[@id="viewInvoiceBtn"]')
web.selectWindow()

assert.equal(
    web.isVisible(`//td[contains(text(), "Customer Name")]//..//span[contains(text(), "${firstName} ${lastName}")]`),
    true, `${firstName} ${lastName} doesn't appear in the Invoice`
)

assert.equal(
    web.isVisible(`//td[contains(text(), "Customer Email")]//..//span[contains(text(), "${email}")]`),
    true, `${email} doesn't appear in the Invoice`
)

assert.equal(
    web.isVisible(`(//td[contains(text(), "Total")]//..//span[contains(text(), "${productPrice}")])[1]`),
    true, `Wrong price appears in the invoice: ${productPrice}`
)

assert.equal(
    web.isVisible('//div[contains(text(), "Purchased Items")]//..//span[contains(text(), "Canadian Visa Expert Single assessment")]'),
    true, `Invoice is showing the wrong item: ${web.getText('//span[@id="ContentPlaceHolder1_rptPurchasedItems_lblProductName_0"]')}`
)

log.info('Invoice Customer Name: ' + web.getText('//td[contains(text(), "Customer Name")]//..//span'))
log.info('Invoice Email: ' + web.getText('//td[contains(text(), "Customer Email")]//..//span'))
log.info('Invoice Product: ' + web.getText('//span[@id="ContentPlaceHolder1_rptPurchasedItems_lblProductName_0"]'))
log.info('Invoice Total Price: ' + web.getText('(//td[contains(text(), "Total")]//..//span)[1]'))