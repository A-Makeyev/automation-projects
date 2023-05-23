const main = po.alphaMainPage
const searchPage = po.searchCustomerPage
const alpha360 = po.customerDetails360

po.init(env.url, 60)

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
if (!web.isVisible(searchPage.header, 5000)) {
    po.click(main.navigationBtn)
    po.click(main.navigationOptions.customers)
    assert.equal(web.isVisible(searchPage.header), true)
}

web.transaction('06. Select Customer By Device Number')
po.click(searchPage.searchParametersBtn)
web.pause(1500)

if (!web.isVisible(searchPage.parameters.deviceNumber, 5000)) {
    po.click(searchPage.searchParametersBtn)
}

po.click(searchPage.parameters.deviceNumber)
po.type(searchPage.deviceNumberInput, main.device)

web.transaction('07. Search Customer')
po.click(searchPage.searchBtn)

web.transaction('08. Assert Customer Details')
assert.equal(
    web.isExist(`//c-alp360-header-container//strong[text()="${main.customerName}"]`), true,
    `Customer ${main.customerName} has failed to load`
)

assert.equal(
    web.isExist(`//div[text()="${main.accountNumber}"]`), true,
    `Account ${main.accountNumber} has failed to load`
)

alpha360.loadCustomerDetails()