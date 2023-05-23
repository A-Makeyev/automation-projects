po.init(env.url, 70)
log.info('10. פרטי לקוח')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to Database WIZ Database & Fetch Customer Data')
db.setConnectionString(env.wiz_con_string)
var selectCustomerDetails = 
`
    SELECT d.account_number, d.ssn, d.dln, TO_NCHAR(d.first_name), TO_NCHAR(d.last_name) 
    FROM wiz_customer_descrip d 
    WHERE ROWNUM <= 30
`
var customers = db.executeQuery(selectCustomerDetails)

web.transaction('05. Close All Active Tabs')
main.closeAllTabs()

web.transaction('06. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('07. Select Customer By Account Number')
for (let x = 0; x < customers.length; x++) {
    if (customers[x] === null) {
        if (x >= customers.length) {
            assert.fail('Cannot fetch a valid account number')
        }
        continue
    }

    if (searchPage.searchCustomerByAccount(customers[x].ACCOUNT_NUMBER)) {
        log.info(customers[x])
        var queryValues = Object.values(customers[x])
        var account_number = queryValues[0]
        var firstName = queryValues[3] 
        var lastName = queryValues[4]
        var ssn = queryValues[1]
        var dln = queryValues[2]
        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('08. Open Customer\'s General Details')
po.click(`//c-alp360-main-details-adw//div[contains(text(), "${account_number}")]`)
po.click(alpha360.generalDetails)

web.transaction('09. Assert Customer Data')
var displayedId = web.getText('//td[@data-label="תעודת זהות"]//..//div[contains(text(), "")]')
var displayedName = web.getText('(//h1[contains(@class, "heading")]//strong)[2]').split(' ')

if (!(ssn.includes(displayedId))) 
    assert.fail('SSN (' + ssn + ') does not match displayed ID (' + displayedId + ')' )

if (!(displayedName[0] === firstName && displayedName[1] === lastName)) {
    assert.fail(
        'Displayed name (' + displayedName[0] + ') (' + displayedName[1] + ') '
        + 'does not match the name from the database (' + firstName + ') (' + lastName + ')'
    )
}
