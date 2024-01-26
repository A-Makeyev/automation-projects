po.init(env.url, 60)

const shortWait = 5000
const cases = po.cases
const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to WIZ Database')
db.setConnectionString(env.wiz_con_string)

web.transaction('05. Close All Active Tabs')
main.closeAllTabs()

web.transaction('06. Navigate To Search Account Page')
main.openSearchPage()

const selectAccountQuery = 
`
    select h.account_number 
    from wiz_wo_history h, WIZ_CUSTOMER_DESCRIP d 
    where h.account_number = d.account_number 
    and length(d.sf_consumer_id) > 3 
    and h.wo_type = 'SC' 
    and h.closed_date between (sysdate - 110) 
    and (sysdate - 70) 
    and h.account_number not in (SELECT w.account_number 
    from wiz_work_order w 
    where w.wo_type = 'SC') 
    and d.home_area_code like '0%'
`

web.transaction('07. Fetch Accounts & Search Customer By Number')
for (let x = 1; x <= 30; x++) {
    var account_number =  db.getScalar(`${selectAccountQuery} and rownum = ${x};`)
    if (account_number === null || account_number === 'undefined') {
        if (x >= 30) {
            assert.fail('Cannot fetch a valid account number with the given query: \n' + selectAccountQuery)
        }
        continue
    }

    searchPage.searchCustomerByAccount(account_number)
    
    if (web.isVisible(searchPage.customerNotFoundMsg, shortWait)) {
        log.info('Accout number: ' + account_number + ' is empty')
        func.refresh()
        continue 

    } else if (web.isVisible(alpha360.customerDetails, shortWait)) {
        log.info('Account Number: ' + account_number)
        break
    }
}

web.transaction('08. Open Customer Details')
po.click(`//c-alp360-main-details-adw//div[text()="${account_number}"]`)

web.transaction('09. Create Case')
po.click(cases.createCaseBtn)

if (web.isChecked(cases.assistCaseCheckbox, shortWait)) {
    po.click(cases.nextBtn)
} else {
    po.click(cases.assistCaseCheckbox)
    po.click(cases.nextBtn)
}

web.transaction('10. Assert Components')
assert.equal(
    web.isVisible(cases.issueReportingComponent), true,
    `Issue Reporting component did not load properly for account: ${account_number}`
)

assert.equal(
    web.isVisible(cases.activityTimelineComponent), true,
    `activity Timeline component did not load properly for account: ${account_number}`
)

web.transaction('11. ')

