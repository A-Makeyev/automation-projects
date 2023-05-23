po.init(env.url, 35)
log.info('12. תצוגה הצעות עתידיות & מאוקטבות ללקוח')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to Database WIZ Database')
db.setConnectionString(env.wiz_con_string)

web.transaction('05. Close All Active Tabs')
main.closeAllTabs()

web.transaction('06. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('07. Fetch Accounts & Search Customer By Number')
for (let x = 1; x <= 10; x++) {
    var selectAccountDetails =
     `
         SELECT l.account_number 
         FROM wiz_customer_hp_life l 
         WHERE l.customer_status = 'AC' 
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

web.transaction('08. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('09. Assert Active Products')
if (!alpha360.isChartOpen('הוספות/ הסרות')) {
    po.click(alpha360.futureActions)
}

if (alpha360.isChartEmpty('הוספות/ הסרות')) {
    log.info('אין נתונים להציג בטבלת הוספות / הסרות עתידיות')
}

var tableData = '//*[contains(@data-component-id, "alp360CommonBillingDataRowsWrapper")]//td[contains(text(), "")]'
var tableDataCount = web.getElementCount(tableData)

log.info('Data Rows Found: ' + tableDataCount)

for (let x = 1; x <= tableDataCount; x++) {
    assert.equal(
        web.isVisible(`(${tableData})[${x}]`), true,
        `There was a problem with cell: (${tableData})[${x}]`
    )
}

log.info('✔ Valid Data Rows: ' + tableDataCount)
