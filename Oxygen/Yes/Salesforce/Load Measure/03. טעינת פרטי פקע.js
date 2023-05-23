let fs = require('fs')
let create_file = false
let customers_without_paka = 'U:\\CUSTOMER DATA\\Customers Without PAKA.txt'

po.init(env.url, 60)

const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

var ACCOUNT_NUMBER

if (!ACCOUNT_NUMBER) {
    ACCOUNT_NUMBER = '2110399'
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

let correntCustomer = web.getText('//c-alp360-customer-data//h1//strong')

web.transaction('07. Open Customer Details')
po.click(
    '//*[contains(@data-component-id, "alp360MainDetailsAdw")]'
    + '//div[text()="' + ACCOUNT_NUMBER + '"]'
)

web.transaction('08. Load Paka List')
let PAKA_time_start = new Date().getTime()
po.click(alpha360.pakaList)

if (web.isVisible(`//*[@data-component-id="alp360MainDetailsAdw"]//*[contains(text(), "2110399")]//..//..//*[contains(text(), "לקוח לא פעיל")]`)) {
    log.info(`לקוח מספר ${ACCOUNT_NUMBER} לא פעיל`)
    assert.pass()
}

let PAKA_DATA = `//strong[contains(text(), 'פק"עות')]//..//..//..//..//tbody//tr`
let PAKA_COUNT = web.getElementCount(PAKA_DATA)

if (PAKA_COUNT > 0) {
    for (let paka = 1; paka <= PAKA_COUNT; paka++) {
        web.waitForVisible(`(${PAKA_DATA})[${paka}]`)
    }
} else {
    if (create_file) {
        if (PAKA_COUNT === 0) {
            log.info(`${correntCustomer} (${ACCOUNT_NUMBER}) doesn't have data to display`)
            
            if (!fs.existsSync(file)) {
                fs.appendFileSync(file, 'account, \n', `${ACCOUNT_NUMBER}, \n`)
            } else {
                fs.appendFileSync(file, `${ACCOUNT_NUMBER}, \n`)
            }
        } 
    }
    log.info(`אין פקע"ות להציג`)
}

let PAKA_time_end = new Date().getTime()
log.info(`Paka Data loaded in: ${((PAKA_time_end - PAKA_time_start) / 1000).toFixed(1)} seconds`)
