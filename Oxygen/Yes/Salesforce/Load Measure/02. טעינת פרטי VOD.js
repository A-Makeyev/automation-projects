var fs = require('fs')
var create_file = false
var customers_with_vod = 'U:\\CUSTOMER DATA\\Customers With VOD.txt'
var customers_without_vod = 'U:\\CUSTOMER DATA\\Customers Without VOD.txt'

po.init(env.url, 60)

const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

var ACCOUNT_NUMBER

if (!ACCOUNT_NUMBER) {
    ACCOUNT_NUMBER = '857800'
} else {
    ACCOUNT_NUMBER = params.account
}

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('06. Select Customer By Account Number')
searchPage.searchCustomerByAccount(ACCOUNT_NUMBER) 

if (web.isVisible(main.errorToastMessage, po.shortWait)) {
    assert.fail(web.getText(main.errorToastMessage))
}

var correntCustomer = web.getText('//c-alp360-customer-data//h1//strong')

web.transaction('07. Open Customer Details')
po.click(
    '//*[contains(@data-component-id, "alp360MainDetailsAdw")]'
    + '//div[text()="' + ACCOUNT_NUMBER + '"]'
)

web.transaction('08. Load VOD Content')
var VOD_time_start = new Date().getTime()
po.click(alpha360.content)
web.setTimeout(5000)

var VOD_freeContentTable = '//strong[contains(text(), "תכני VOD ללא תשלום")]//..//..//..//..//tbody'
var VOD_payedContentTable = '//strong[contains(text(), "תכני VOD בתשלום")]//..//..//..//..//tbody'

var freeContentRows = '//strong[contains(text(), "תכני VOD בתשלום")]//..//..//..//..//tr'
var payedContentRows = '//strong[contains(text(), "תכני VOD בתשלום")]//..//..//..//..//tr'

if (web.isVisible(VOD_freeContentTable)) {
    for (let row = 2; row <= web.getElementCount(freeContentRows); row++) {
        assert.equal(
            web.isVisible(`(${freeContentRows})[${row}]`), true,
            `Row ${row} at VOD free content table did not load correctly`
        )
    }
}

if (web.isVisible(VOD_payedContentTable)) {
    for (let row = 2; row <= web.getElementCount(payedContentRows); row++) {
        assert.equal(
            web.isVisible(`(${payedContentRows})[${row}]`), true,
            `Row ${row} at VOD payed content table did not load correctly`
        )
    }
}

if (create_file) {
    try {
        if (!fs.existsSync(customers_with_vod)) {
            fs.appendFileSync(customers_with_vod, `account, \n${ACCOUNT_NUMBER}, \n`)
        } else {
            fs.appendFileSync(customers_with_vod, `${ACCOUNT_NUMBER}, \n`)
        }
    } catch(e) { 
        if (!web.isVisible(VOD_freeContentTable) && !web.isVisible(VOD_payedContentTable)) {
            log.info(`${correntCustomer} (${ACCOUNT_NUMBER}) doesn't have data to display`)
            
            if (create_file) {
                if (!fs.existsSync(customers_without_vod)) {
                    fs.appendFileSync(customers_without_vod, `account, \n${ACCOUNT_NUMBER}, \n`)
                } else {
                    fs.appendFileSync(customers_without_vod, `${ACCOUNT_NUMBER}, \n`)
                }
            }
        } 
    }     
}

var VOD_time_end = new Date().getTime()
log.info(`VOD Content loaded in: ${((VOD_time_end - VOD_time_start) / 1000).toFixed(1)} seconds`)
