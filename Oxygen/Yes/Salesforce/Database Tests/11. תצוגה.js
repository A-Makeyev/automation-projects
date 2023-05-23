po.init(env.url, 70)
log.info('11. תצוגה')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to Database WIZ Database & Fetch Customer Data')
db.setConnectionString(env.wiz_con_string)
var data = db.executeQuery(`SELECT * FROM wiz_customer_hp_life WHERE ROWNUM <= 1`)
log.info(data)

assert.equal(
    typeof data === 'object', true,
    'Data from "wiz_customer_hp_life" is not displayed currently'
)

web.transaction('05. Close All Active Tabs')
main.closeAllTabs()

web.transaction('06. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('07. Fetch Accounts & Search Customer By Number')
for (let x = 1; x <= 10; x++) {
    var selectAccountDetails =
    `
        SELECT account_number 
        FROM wiz_customer_hp_life 
        WHERE customer_status = 'AC' 
        AND ROWNUM = ${x}
    `
    var account_number = db.getScalar(selectAccountDetails)

    if (searchPage.searchCustomerByAccount(account_number)) {
        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('07. Open Customer\'s CRM Page')
po.click(`//c-alp360-main-details-adw//div[text()="${account_number}"]//..//..//..//lightning-button-icon//button`)

/* need permissions to open CRM */
