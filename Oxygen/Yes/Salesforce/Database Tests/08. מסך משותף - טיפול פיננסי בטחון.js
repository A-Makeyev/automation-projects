po.init(env.url, 70)
log.info('08. מסך משותף - טיפול פיננסי בטחון')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to Database ODS Master Database & Fetch Account Number')
db.setConnectionString(env.ods_master_con_string)
let selectAccountDetails = 
`
    SELECT 
    t.account_number, t.fraud_customer_ind 
    FROM ACCOUNT_EXTERNAL_IND t 
    WHERE t.fraud_customer_ind = 1 
    AND t.view_mode IN (1, 4, 9) 
    AND ROWNUM <= 20
`
let accountNumbers = db.executeQuery(selectAccountDetails)

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
        log.info(accountNumbers[x])
        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('08. Assert Customer In Financial Service')
assert.equal(
    web.isVisible(`//div[@class="bezeq-notify-warning"]//..//..//a[text()="${account_number}"]`), true,
    `לקוח ${account_number} אינו בטיפול מוקד פיננסי של יס`
)

web.transaction('09. Assert That Inquiries Are Empty')
po.click(alpha360.openInquiries)

assert.equal(
    web.isVisible('//*[contains(text(), "לא קיימים נתונים להצגה")]'),
    true, `קיימות פניות ללקוח מספר: ${account_number}`
)

web.transaction('10. Assert That Icons Are Visible')
po.click(alpha360.customerDetails)
po.click(`//*[@data-component-id="alp360MainDetailsAdw"]//a[contains(@data-account-id, "") and contains(text(), "${account_number}")]`)

assert.equal(
    web.isVisible('//div[@data-id="WATCHING_BILL"]'),
    true, `אייקון מצב צפיה אינו מופיע ללקוח מספר: ${account_number}`
)

log.info(
    web.getText(`//a[text()="${account_number}"]//..//..//div[@class="bezeq-notify-warning"]`)
)
