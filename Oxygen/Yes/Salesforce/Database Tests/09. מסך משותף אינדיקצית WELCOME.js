po.init(env.url, 70)
log.info('09. מסך משותף אינדיקצית WELCOME')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to Database ODS Master Database & Fetch Account Number')
db.setConnectionString(env.ods_master_con_string)
let selectAccountDetails = 
`
    SELECT t.account_number 
    FROM account_external_ind t 
    WHERE VIEW_MODE = 1 
    AND t.new_cust = 1 
    AND ROWNUM <= 30
`
let accountNumbers = db.executeQuery(selectAccountDetails)
log.info(accountNumbers[func.generateNumber(0, accountNumbers.length -1)])

web.transaction('05. Close All Active Tabs')
main.closeAllTabs()

web.transaction('06. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('07. Search Customer By Account Number')
for (let x = 0; x < accountNumbers.length; x++) {
    if (accountNumbers[x] === null) {
        if (x >= accountNumbers.length) {
            assert.fail('Cannot fetch a valid account number')
        }
        continue
    }

    if (searchPage.searchCustomerByAccount(accountNumbers[x].ACCOUNT_NUMBER)) {
        var account_number = accountNumbers[x].ACCOUNT_NUMBER

        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('08. Connect to Database ODS Master Database & Fetch Customer Name')
db.setConnectionString(env.wiz_con_string)
let selectOfferDetails =
`
    SELECT d.account_number, TO_NCHAR(d.first_name), TO_NCHAR(d.last_name), d.ssn 
    FROM wiz_customer_descrip d 
    WHERE d.account_number = ${account_number}
`
let customer = db.executeQuery(selectOfferDetails)
log.info(customer)

if (Number(customer[0].ACCOUNT_NUMBER) !== account_number) { 
    assert.fail(
        'Customer: ' +  customer[0].ACCOUNT_NUMBER
        + ' Does not match the accout number: ' + account_number
    )
} else {
    var queryValues = Object.values(customer[0])
    var firstName = queryValues[1]
    var lastName = queryValues[2]
    var SSN = customer[0].SSN
}

web.transaction('09. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('10. Assert That Customer Name Appears In The Page')
let nameElements = `//div[contains(@class, "region-header")]//*[contains(text(), "${firstName} ${lastName}")]`
let count = web.getElementCount(nameElements)
for (let x = 1; x <= count; x++) {
    if (web.isVisible(`(${nameElements})[${x}]`, po.shortWait)) {
        assert.contain(
            web.getText(`(${nameElements})[${x}]`),
            `${firstName} ${lastName}`,
            `${firstName} ${lastName} is not displayed at: (${nameElements})[${x}]`
        )
    }
}

web.transaction('11. Connect to ODS Master Database & Fetch Customer Indication')
db.setConnectionString(env.ods_master_con_string)
let selectIndicationDetails = 
`
    SELECT t.account_number, t.new_cust 
    FROM ACCOUNT_EXTERNAL_IND t 
    WHERE t.new_cust=1 
    AND t.account_number = ${account_number}
`
let indication = db.executeQuery(selectIndicationDetails)
log.info(indication)

if (Number(indication[0].ACCOUNT_NUMBER) !== account_number) { 
    assert.fail(
        'Indication for account: ' +  indication[0].ACCOUNT_NUMBER
        + ' Does not match the accout number: ' + account_number
    )
} else {
    assert.equal(
        indication[0].NEW_CUST === 1, true,
        'New customer indication is not equal to 1'
    )
}

web.transaction('12. Assert That WELCOME Indication Appears')
let welcomeIndicatorColor = web.getCssValue(
    `//*[contains(text(), "${firstName} ${lastName}")]//..//..//span[contains(@class, "welcome")]`,
    'background-color'
)

if (welcomeIndicatorColor === 'rgba(2,195,154,1)') {
    log.info('Welcome Indicator Color is Green')
} else {
    log.info(`Welcome Indicator Color is: ${welcomeIndicatorColor}`)
}
