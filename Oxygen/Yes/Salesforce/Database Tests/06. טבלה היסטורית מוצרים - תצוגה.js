po.init(env.url, 70)
log.info('06. טבלה היסטורית מוצרים - תצוגה')

const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage
const account_number = main.accountNumber

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('06. Select Customer By Account Number')
searchPage.searchCustomerByAccount(main.accountNumber)

if (web.isVisible(searchPage.customerNotFoundMsg, po.shortWait * 2)) {
    assert.fail(web.getText(searchPage.customerNotFoundMsg))
}

web.transaction('07. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('08. Assert Active Products Table')
if (!alpha360.isChartOpen('היסטורית מוצרים')) {
    po.click(alpha360.productsHistory)
}

if (alpha360.isChartEmpty('היסטורית מוצרים')) {
     log.info('אין נתונים להציג בטבלת היסטורית מוצרים')
} 

const tableRow = (title) => {
    return `//span[@title="${title}"]`
}

assert.equal(web.isVisible(tableRow('שקע')), true)
assert.equal(web.isVisible(tableRow('מספר הצעה')), true)
assert.equal(web.isVisible(tableRow('סוג הצעה')), true)
assert.equal(web.isVisible(tableRow('תיאור')), true)
assert.equal(web.isVisible(tableRow('תאריך התחלה')), true)
assert.equal(web.isVisible(tableRow('נציג מוכר')), true)

web.transaction('09. Open Product History')
if (web.isVisible(alpha360.productsHistory, po.shortWait)) {
    web.scrollToElement(alpha360.productsHistory)
    po.click(alpha360.productsHistory)
}

let dataElements = '//*[@class="record-page-decorator"]//lightning-base-formatted-text'
let offerLinks = '//*[@class="record-page-decorator"]//lightning-primitive-cell-factory//a'

let dataElementsCount = web.getElementCount(dataElements)
let offerLinksCount = web.getElementCount(offerLinks)

for (let data = 1; data <= dataElementsCount; data++) {
    assert.equal(
        web.isExist(`(${dataElements})[${data}]`), true,
        `Data element at index: ${data} did not load properly`
    )
    for (let link = 1; link <= offerLinks; link++) {
        assert.equal(
            web.isExist(`(${offerLinks})[${link}]`), true,
            `Offer link at index: ${link} did not load properly`
        )
    }
}
