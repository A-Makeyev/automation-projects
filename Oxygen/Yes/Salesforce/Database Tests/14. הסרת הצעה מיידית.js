po.init(env.url, 70)
log.info('14. הסרת הצעה מיידית')

const cases = po.cases
const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage
const currentYear = func.currentDate().slice(6)
const currentDay = func.getDay(func.currentDate())

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('06. Connect to Wiz Database & Fetch Account Details')
db.setConnectionString(env.wiz_con_string)
var selectOfferDetails =
`
    SELECT DISTINCT O.ACCOUNT_NUMBER, o.addl_offer_id, TO_NCHAR(M.OFFER_DESC), ot.offer_type_code,
        TO_NCHAR(ot.offer_type_desc), cho.outlet_code outlet 
    FROM wiz_cust_hp_additional_offer o, tr.tr_marketing_offer M, tr.tr_marketing_offer_type ot, 
        TR.TR_OFFER_PRODUCT DD,CODES_PROD7.WIZ_PRODUCT_CODES FF, wiz_customer_hp_occurrence cho 
    WHERE o.addl_offer_id = M.MARKETING_OFFER_ID 
    AND m.offer_type_code = ot.offer_type_code 
    AND DD.OFFER_ID = M.MARKETING_OFFER_ID 
    AND FF.PRODUCT_CODE = DD.BPRODUCT_CODE 
    AND cho.occurrence_id(+) = o.occurrence_id 
    AND FF.REPLICATE_TO_RBM<>'N' 
    AND o.addl_offer_id IS NOT null 
    AND NOT EXISTS (
        SELECT 1 
        FROM tr.tr_offer_features qq 
        WHERE QQ.MARKETING_OFFER_ID = O.ADDL_OFFER_ID 
        AND QQ.FEATURE_CODE = 18 
        AND QQ.FEATURE_VALUE IN (24, 26)
    ) 
    AND ROWNUM <= 20
`
var accountNumbers = db.executeQuery(selectOfferDetails)

web.transaction('07. Select Customer By Account Number')
for (let x = 1; x <= accountNumbers.length; x++) {
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

web.transaction('08. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('09. Assert That Delete Product Option Exists')
var deleteButtons = '//*[name()="svg" and @data-key="delete"]'
var deleteButtonsCount = web.getElementCount(deleteButtons)

for (let x = 1; x <= deleteButtonsCount; x++) {
    var offer = web.getText(
        '(//*[name()="svg" and @data-key="delete"])[' + x + ']'
        + ' //..//..//..//..//..//..//..//..//..//c-alp360-event-link-to-offer'
    )
    
    po.click(`(${deleteButtons})[${x}]`)
    if (web.isVisible('//div[contains(@class, "oneApplicationError")]', po.shortWait)) {
        log.warn(web.getText('//div[contains(@class, "oneApplicationError")]/label'))
        po.click('//div[@class="details-ctr collapsed"]//button')

        let errorDetails = web.getText('//div[@class="details-ctr expanded"]//textarea')
        po.type('//div[contains(@class, "oneApplicationError")]//textarea', 'שגיאה בהסרת הערוץ')
        po.click('//button[@title="אישור"]')
        assert.fail('Technical Info: ' + errorDetails)
    }

    if (web.isVisible('//h2[text()="הסרת הערוץ"]', po.shortWait / 2)) {

        web.transaction('10. Assert Removal Date')
        let removalDate = web.getValue('//input[@name="Remove_Date"]')
        let removalDay = removalDate.match(/\d{2}|\d{1}/)[0]
        let removalYear = removalDate.match(/\d{4}/)[0]

        if (removalDay != currentDay) {
            assert.fail(
                'Removal day (' + removalDay + ')'
                + ' is not the displayed as the current day '
                + '(' + currentDay + ')' 
            )
        }

        if (removalYear != currentYear) {
            assert.fail(
                'Removal year (' + removalYear + ')'
                + ' is not the displayed as the current year '
                + '(' + currentYear + ')' 
            )
        }

        assert.equal(
            web.isVisible('//button[contains(@title, "בחר תאריך")]'), true,
            'Calendar button is not displayed'
        )

        break

    } else if (x == deleteButtonsCount) {
         log.info('Could not find offers with a delete option') 
         assert.pass()
    }
}

web.transaction('11. Select Remove Reason')
web.select('//select[@name="Remove_reason"]', 'index=1')

web.transaction('12. Remove Offer')
web.execute(() => {
    document.evaluate(
        '//*[(text()="הבא")]', document, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
})

web.transaction('13. Assert Offer Removal')
web.setTimeout(25 * 1000)

if (web.isVisible(alpha360.removalStatus)) {
    var removalStatus = web.getText(alpha360.removalStatus) 

    var tries = 20
    while (removalStatus == 'Loading' || removalStatus == '') {
        removalStatus = web.getText(alpha360.removalStatus)
        web.pause(po.waitASecond)
        tries--
    }
    removalStatus != '' ? log.info('Removal Status: ' + removalStatus) : log.info('Removal Status was not displayed')
} 

if (removalStatus != null) {
    if (removalStatus.length < 1) {
        assert.fail('לא מוצגת הודעה בחלון הסרת הערוץ')
    } else if (removalStatus == 'שרות נכשל') {
        assert.fail(`שירות הסרת הערוץ נכשל אצל לקוח ${account_number}`)
    }

    if (removalStatus == 'הערוץ הוסר בהצלחה'  ||removalStatus == 'בקשת הסרה נשלחה בהצלחה' ) {
        assert.pass()
    }
}
