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
    select h.account_number from wiz_wo_history h, WIZ_CUSTOMER_DESCRIP d 
    where h.account_number = d.account_number 
    and length(d.sf_consumer_id) > 3 and h.wo_type = 'SC' 
    and h.closed_date between (sysdate - 130) and (sysdate - 100) 
    and h.account_number not in (select w.account_number 
    from wiz_work_order w where w.wo_type = 'SC') 
    and d.home_area_code like '0%'
`

web.transaction('07. Fetch Accounts & Search Customer By Number')
for (let x = 1; x <= 30; x++) {
    var account_number =  selectAccountQuery[x].ACCOUNT_NUMBER
    if (account_number === null || account_number === 'undefined') {
        if (x >= 2) {
            assert.fail(
                'Cannot fetch a valid account number with the given query: \n' + selectAccountQuery
                + '\nafter ' + x + ' tries'
            )
        }
        continue
    }

    searchPage.searchCustomerByAccount(account_number)
    
    if (web.isVisible(searchPage.customerNotFoundMsg, shortWait)) {
        log.info('Accout number: ' + account_number + ' is empty')

        if (x >= 2) {
            assert.fail(
                'Cannot fetch a valid account number with the given query: \n' + selectAccountQuery
                + '\nafter ' + x + ' tries'
            )
        }
        func.refresh()
        continue 
    }

    if (web.isVisible(alpha360.customerDetails, shortWait)) {
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
    web.isVisible(cases.activityTimelineComponent), true,
    `activity Timeline component did not load properly for account: ${account_number}`
)

web.transaction('11. Open Expert Consulting Form')
po.click(cases.expertConsultingBtn)

var cunsultingValue = web.getValue(cases.expertConsultingInput)
if (!cunsultingValue.includes('התייעצות בכיר')) {
    assert.fail('Input was not initialized with expert consulting value')
}

po.click(cases.expertConsultingSecondaryReasonBtn)
po.click(cases.expertConsultingReasons.helpWithWizard)

web.transaction('12. Create Expert Consulting Request')
po.click(cases.modalSaveBtn)
func.refresh()

web.transaction('13. Assert That The New Request Was Created')
po.click(cases.refreshActivityTimeline)

let expertInquiries = web.getElementCount('//div[@class="slds-media"]//*[contains(@title, "התייעצות בכיר")]')
log.info('Total number of expert inquiries: ' + expertInquiries)

if (expertInquiries > 0) {
    assert.equal(
        web.isVisible(`(//*[contains(text(), "התייעצות בכיר") and contains(text(), "${func.currentDate()}")])[1]`), true,
        'There was a problem with creating an expert consulting request'
    )
} else {
    assert.fail('Failed to create an inquiry')
}
