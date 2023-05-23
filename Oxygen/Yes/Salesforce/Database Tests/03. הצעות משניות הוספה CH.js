po.init(env.url, 35)
log.info('03. הצעות משניות הוספה CH')

const func = po.functions
const main = po.alphaMainPage
const searchPage = po.searchCustomerPage
const alpha360 = po.customerDetails360

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('06. Connect to Wiz Database & Fetch Account Number')
db.setConnectionString(env.wiz_con_string)
const selectAccountDetails =
`
    SELECT * 
    FROM wiz_work_order w 
    WHERE w.Wo_Type = 'CH' 
    AND w.wo_status = 'O' 
    AND ROWNUM <= 20
`
const accountNumbers = db.executeQuery(selectAccountDetails)

web.transaction('07. Select Customer By Account Number')
for (let x = 0; x < accountNumbers.length; x++) {
    if (accountNumbers[x] === null) {
        if (x >= accountNumbers.length) 
            assert.fail('Cannot fetch a valid account number')
        continue
    }

    if (searchPage.searchCustomerByAccount(accountNumbers[x].ACCOUNT_NUMBER)) {
        var account_number = accountNumbers[x].ACCOUNT_NUMBER
        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('08. Fetch Offers')
const selectOfferDetails = 
`
    SELECT DISTINCT o.account_number, o.addl_offer_id, o.creating_user creating_user, TO_NCHAR(M.OFFER_DESC),
        TO_NCHAR(ot.offer_type_desc), o.start_date, o.projected_end_date, cho.outlet_code outlet 
    FROM wiz_cust_hp_additional_offer o, tr.tr_marketing_offer M, tr.tr_marketing_offer_type ot, 
        TR.TR_OFFER_PRODUCT DD, CODES_PROD7.WIZ_PRODUCT_CODES FF, wiz_customer_hp_occurrence cho 
    WHERE o.addl_offer_id = M.MARKETING_OFFER_ID AND m.offer_type_code = ot.offer_type_code 
    AND DD.OFFER_ID = M.MARKETING_OFFER_ID 
    AND FF.PRODUCT_CODE = DD.BPRODUCT_CODE 
    AND cho.occurrence_id(+) = o.occurrence_id 
    AND FF.REPLICATE_TO_RBM<>'N' 
    AND O.ACCOUNT_NUMBER = ${account_number} 
    AND NOT EXISTS (
        SELECT 1 
        FROM tr.tr_offer_features qq 
        WHERE QQ.MARKETING_OFFER_ID = O.ADDL_OFFER_ID 
        AND QQ.FEATURE_CODE = 18 
        AND QQ.FEATURE_VALUE IN (24, 26)
    )
`
const query = db.executeQuery(selectOfferDetails)
log.info(query[0])

const queryValues = Object.values(query[0])
const offer_id = queryValues[1]
const offer_desc = queryValues[3]
const offer_type = queryValues[4]

const offer_outlet = query[0].OUTLET
const creating_user = query[0].CREATING_USER
const offer_start_date = func.convertDateWithTimeFromDB(query[0].START_DATE)

web.transaction('09. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('10. Assert Data Rows')
alpha360.assertDataRows()

web.transaction('11. Compare Customer\'s Details From Database')
if (!alpha360.isChartOpen('מוצרים פעילים')) {
    po.click(alpha360.activeProducts)
}

if (alpha360.isChartEmpty('מוצרים פעילים')) {
     log.info('אין נתונים להציג בטבלת מוצרים פעילים')
} else {
    if (!web.isVisible('//a[contains(text(), "' + offer_id + '")]', po.shortWait)) {
        po.click(alpha360.activeProducts)
    }

    web.waitForVisible(
        '//a[contains(text(), "' + offer_id + '")]//..//..//..//..//..//..//th[@data-label="שקע"]'
        + '//lightning-base-formatted-text[text()="' + offer_outlet + '"]'
    )

    web.waitForVisible(
        '//a[contains(text(), "' + offer_id + '")]'
        + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_type + '"]'
    )

    web.waitForVisible(
        '//a[contains(text(), "' + offer_id + '")]'
        + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_desc + '"]'
    )

    web.waitForVisible(
        '//a[contains(text(), "' + offer_id + '")]'
        + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_start_date + '"]'
    )
}

web.transaction('12. Assert Price From Database')
let selectPriceQuery = `SELECT TR.get_offer_price_for_ACC (${account_number}, ${offer_id}) FROM dual`
let price = db.getScalar(selectPriceQuery)

if (price == undefined || price == null) {
    log.info('Price was empty from the following query: ' + selectPriceQuery)
} else {
    log.info('Price: ' + price)
    log.info('Price type: ' + typeof price)
}

if (!(!isNaN(price))) {
    assert.fail('The price is not a number')
}

web.transaction('13. Fetch Representative Name')
let selectRepNameQuery = `SELECT TO_NCHAR(t.descr) FROM wiz_employee_codes t WHERE t.employee_code = '${creating_user}'`
let repName = db.getScalar(selectRepNameQuery)

if (repName == undefined || repName == null) {
    log.info('Rep Name was empty from the following query: ' + selectRepNameQuery)
} else {
    log.info('Representative Name: ' + repName)
    log.info('Representative type: ' + typeof repName)
}

web.transaction('14. Connect to ODS Customer Database & Fetch Representative Affiliation')
db.setConnectionString(env.ods_customer_con_string)
let selectRepAffiliationQuery = `SELECT TO_NCHAR(t.orgtx1) FROM sap_hr_hierarchy t WHERE t.wizard_code = '${creating_user}'`
let repAffiliation = db.executeQuery(selectRepAffiliationQuery)

if (repAffiliation.length < 1) {
    log.info('Rep Affiliation was empty from the following query: ' + selectRepAffiliationQuery)
} else {
    log.info('Rep Affiliation:')
    log.info(repAffiliation)
    log.info('Affiliation: ' + Object.values(repAffiliation[0]))
    log.info('Affiliation type: ' + typeof repAffiliation)
}
