po.init(env.url, 35)
log.info('05. הצעות ציוד הסטוריות')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

web.transaction('04. Connect to Wiz Database & Fetch Account Number With Offers')
db.setConnectionString(env.wiz_con_string)

var limit = 30
for (let x = 10; x <= limit; x++) {
    var selectAccountDetails = 
    `
        SELECT * 
        FROM wiz_work_order w 
        WHERE w.Wo_Type = 'DS' 
        AND w.wo_status = 'O' 
        AND ROWNUM <= ${limit}
    `
    var accountNumbers = db.executeQuery(selectAccountDetails)
    
    if (searchPage.searchCustomerByAccount(accountNumbers[x].ACCOUNT_NUMBER)) {
        var account_number = accountNumbers[x].ACCOUNT_NUMBER
    } else {
        func.refresh()
        continue
    }

    var selectOfferDetails = 
    `
        SELECT DISTINCT o.account_number, offer_id, o.addl_offer_id, TO_NCHAR(M.OFFER_DESC),
            TO_NCHAR(ot.offer_type_desc), o.start_date, o.projected_end_date, cho.outlet_code outlet 
        FROM wiz_cust_hp_additional_offer o, tr.tr_marketing_offer M, tr.tr_marketing_offer_type ot,
            TR.TR_OFFER_PRODUCT DD, CODES_PROD7.WIZ_PRODUCT_CODES FF, wiz_customer_hp_occurrence cho 
        WHERE o.addl_offer_id = M.MARKETING_OFFER_ID 
        AND m.offer_type_code = ot.offer_type_code 
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
    var query = db.executeQuery(selectOfferDetails)
    if (query.length < 1) {
        if (x == limit) {
            log.info('There are no available offers for account: ' + account_number)
            assert.pass()
        }
        continue
    } else {
        if (query.OUTLET === null) {
            continue
        } 
    }

    var queryWithOutlet = query[1] != null ? query[1] : query[0]
    log.info(queryWithOutlet)
    break
}

const queryValues = Object.values(queryWithOutlet)
const offer_id = queryValues[2] // ADDL_OFFER_ID
const offer_desc = queryValues[3] // M.OFFER_DESC
const offer_type = queryValues[4] // OT.OFFER_TYPE_DESC

const offer_outlet = queryWithOutlet.OUTLET
const creating_user = queryWithOutlet.CREATION_USER
const offer_start_date = func.convertDateWithTimeFromDB(queryWithOutlet.START_DATE)
const offer_end_date = func.convertDateWithTimeFromDB(queryWithOutlet.PROJECTED_END_DATE)

web.transaction('05. Assert Offer Price')
let price = db.getScalar(`select TR.get_offer_price_for_ACC (${account_number}, ${offer_id}) from dual`)
log.info('Price: ' + price)

if (!(!isNaN(price))) {
    assert.fail('The price is not a number')
}

web.transaction('06. Get Representative Name')
let repAffiliation = db.getScalar(`SELECT TO_NCHAR(t.descr) FROM wiz_employee_codes t WHERE t.employee_code = '${creating_user}'`)
log.info('Affiliation: ' + repAffiliation)

web.transaction('07. Connect to ODS Customer Database & Get Representative Affiliation')
db.setConnectionString(env.ods_customer_con_string)
let repName = db.getScalar(`SELECT TO_NCHAR(t.orgtx1) FROM sap_hr_hierarchy t WHERE t.wizard_code = '${creating_user}'`)
log.info('Representative Name: ' + repName)

web.transaction('08. Close All Active Tabs')
main.closeAllTabs()

web.transaction('09. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('10. Select Customer By Account Number')
searchPage.searchCustomerByAccount(account_number)

web.transaction('11. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('12. Assert Data Rows')
alpha360.assertDataRows()

web.transaction('13. Compare Customer\'s Details From Database')
if (!alpha360.isChartOpen('מוצרים פעילים')) {
    po.click(alpha360.activeProducts)
}

if (alpha360.isChartEmpty('מוצרים פעילים')) {
     log.info('אין נתונים להציג בטבלת מוצרים פעילים')
} else {
    if (
        !web.isVisible('//a[contains(text(), "' + offer_id + '")]//..//..//..//..//..//..//th[@data-label="שקע"]' + '//lightning-base-formatted-text[text()="' + offer_outlet + '"]')
        && !web.isVisible('//a[contains(text(), "' + offer_id + '")]' + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_start_date + '"]')
        && !web.isVisible('//a[contains(text(), "' + offer_id + '")]' + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_type + '"]')
        && !web.isVisible('//a[contains(text(), "' + offer_id + '")]' + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_desc + '"]')
    ) {
        log.info('הצעה ' + offer_id + ' אינה מופיעה')
    } else {
        log.info('הצעה ' + offer_id + ' מופיעה')
    }
}
