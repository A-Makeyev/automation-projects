po.init(env.url, 70)
log.info('07. לקוח מנותק מעל חצי שנה - מסך משותף')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to WIZ Database & Fetch Account Number')
db.setConnectionString(env.wiz_con_string)

let selectAccountDetails = 
`
    SELECT a.account_number, l.customer_status, a.hidden_flag 
    FROM WIZ__YES_CUST_HP_LIFE_ARCHIVE a, wiz_customer_hp_life l 
    WHERE a.hidden_flag = 'Y' 
    AND l.customer_status = 'IN' 
    AND ROWNUM <= 30
`
let disabledAccounts = db.executeQuery(selectAccountDetails)

let randomQuery = func.generateNumber(0, disabledAccounts.length -1)
let account_number = disabledAccounts[randomQuery].ACCOUNT_NUMBER
log.info(disabledAccounts[randomQuery])

web.transaction('05. Assert That Customer Account Is Disabled')
if (disabledAccounts[randomQuery].HIDDEN_FLAG == 'Y') {
    log.info('✔ Account ' + account_number + ' is disabled')
} else {
    assert.fail('✘ Account ' + account_number + ' is still active')
}

web.transaction('06. Close All Active Tabs')
main.closeAllTabs()

web.transaction('07. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('08. Search Customer By Account Number')
searchPage.searchCustomerByAccount(account_number)

web.transaction('09. Assert Customer Does Not Exist')
assert.equal(
    web.isVisible(searchPage.customerNotFoundMsg),
    true, 'הלקוח עדיין מחובר: ' + account_number
)
