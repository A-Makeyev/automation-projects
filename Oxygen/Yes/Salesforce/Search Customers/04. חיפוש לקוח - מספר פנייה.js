const main = po.alphaMainPage
const searchPage = po.searchCustomerPage
const alpha360 = po.customerDetails360

const caseNumber = '25992406'
const customerName = 'איילת גאוי'
const accountNumber = '885393'

po.init(env.url, 60)

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
if (!web.isVisible(searchPage.header, 5000)) {
    po.click(main.navigationBtn)
    po.click(main.navigationOptions.customers)
    assert.equal(web.isVisible(searchPage.header), true)
}

web.transaction('06. Select Customer By Name')
po.click(searchPage.searchParametersBtn)
web.pause(1500)

if (!web.isVisible(searchPage.parameters.caseNumber, 5000)) {
    po.click(searchPage.searchParametersBtn)
}

po.click(searchPage.parameters.caseNumber)
po.type(searchPage.caseNumberInput, caseNumber)

web.transaction('07. Search Customer')
po.click(searchPage.searchBtn)

web.transaction('08. Assert Customer Details')
assert.equal(
    web.isExist(`//c-alp360-header-container//strong[text()="${customerName}"]`), true,
    `Customer ${customerName} has failed to load`
)

assert.equal(
    web.isExist(`//div[text()="${accountNumber}"]`), true,
    `Account ${accountNumber} has failed to load`
)

alpha360.loadCustomerDetails()