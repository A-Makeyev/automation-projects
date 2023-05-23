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

let correntCustomer = web.getText('//c-alp360-customer-data//h1//strong')
log.info('לקוח: ' + correntCustomer)

web.transaction('07. Open Customer Details')
po.click(
    '//*[contains(@data-component-id, "alp360MainDetailsAdw")]'
    + '//div[text()="' + ACCOUNT_NUMBER + '"]'
)

web.transaction('08. Load General Details')
po.click(alpha360.generalDetails)

let labels = '//*[@data-component-id="alp360CommonBillingData"]//td//b[contains(text(), "")]'
let details = '//*[@data-component-id="alp360CommonBillingData"]//td//div[contains(text(), "")]'

let labelsCount = web.getElementCount(labels)
let detailsCount = web.getElementCount(details)

for (let label = 1; label <= labelsCount; label++) {
    if (web.isVisible('(' + labels + ')' + '[' + label + ']')) {
        let itemName = web.getText('(' + labels + ')' + '[' + label + ']')
        itemName.trim() != '' ? log.info('✔ ' + itemName) : ''
        log.info('✔ ' + web.getText('(' + labels + ')' + '[' + label + ']'))
    } else {
        log.warn('✘ Element -> (' + labels + ')' + '[' + label + '] <- is not visible on the page')
    }
}

for (let detail = 1; detail <= detailsCount; detail++) {
    if (web.isVisible('(' + details + ')' + '[' + detail + ']')) {
        let itemName = web.getText('(' + details + ')' + '[' + detail + ']')
        itemName.trim() != '' ? log.info('✔ ' + itemName) : ''
        log.info('✔ ' + web.getText('(' + details + ')' + '[' + detail + ']'))
    } else {
        log.warn('✘ Element -> (' + details + ')' + '[' + detail + '] <- is not visible on the page')
    }
}

web.transaction('09. Load All Products')
po.click(alpha360.products)

if (web.getElementCount('//p[text()="אין נתונים להציג"]') === 3) {
    assert.pass('אין נתונים להציג')
} else {
    let offerElements = '//strong[contains(text(), "מוצרים פעילים")]//..//..//..//..//tr//a'
    let dataElements = '//strong[contains(text(), "מוצרים פעילים")]//..//..//..//..//tr//lightning-base-formatted-text'
    
    let offerCount = web.getElementCount(offerElements)
    let dataCount = web.getElementCount(dataElements)

    for (let offer = 1; offer <= offerCount; offer++) {
        if (web.isVisible('(' + dataElements + ')' + '[' + offer + ']')) {
            let itemName = web.getText('(' + dataElements + ')' + '[' + offer + ']')
            itemName.trim() != '' ? log.info('✔ ' + itemName) : ''
            log.info('✔ ' + web.getText('(' + dataElements + ')' + '[' + offer + ']'))
        } else {
            log.warn('✘ Element -> (' + dataElements + ')' + '[' + offer + '] <- is not visible on the page')
        }
    }
       
    for (let item = 1; item <= dataCount; item++) {
        if (web.isVisible('(' + dataElements + ')' + '[' + item + ']')) {
            let itemName = web.getText('(' + dataElements + ')' + '[' + item + ']')
            itemName.trim() != '' ? log.info('✔ ' + itemName) : ''
        } else {
            log.warn('✘ Element -> (' + dataElements + ')' + '[' + item + '] <- is not visible on the page')
        }
    }
}
