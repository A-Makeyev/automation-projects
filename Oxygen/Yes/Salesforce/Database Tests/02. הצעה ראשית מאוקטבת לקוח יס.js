po.init(env.url, 35)
log.info('02. הצעה ראשית מאוקטבת לקוח יס')

const func = po.functions
const main = po.alphaMainPage
const searchPage = po.searchCustomerPage
const alpha360 = po.customerDetails360

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Search Account Page')
main.openSearchPage()

web.transaction('06. Connect to ODS Master Database')
db.setConnectionString(env.ods_master_con_string)

web.transaction('07. Fetch Account Number & Select Customer')
for (let x = 1; x <= 10; x++) {
    var selectAccount = 
    `
        SELECT t.account_number 
        FROM account_external_ind t 
        WHERE t.account_type = 1 
        AND t.sat_status_code = 2 
        AND t.view_mode = 1 
        AND ROWNUM = ${x}
    `
    var account_number = db.getScalar(selectAccount)

    if (searchPage.searchCustomerByAccount(account_number)) {
        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('08. Connect to Wiz Database & Fetch Offers')
db.setConnectionString(env.wiz_con_string)
const selectDetails = 
`
    SELECT DISTINCT r.account_number, r.offer_id offer_id, TO_NCHAR(mot.offer_type_desc) offer_type,
        TO_NCHAR(mo.offer_desc) offer_descr, to_char(r.start_date, 'DD-MON-YYYY') start_date,
        to_char(R.PROJECTED_END_DATE, 'DD-MON-YYYY') end_date, r.creation_user creating_user, 'ALL' outlet 
    FROM WIZ_CUSTOMER_HP_OFFER r, tr.tr_marketing_offer mo, tr.tr_marketing_offer_type mot 
    WHERE r.offer_id = mo.marketing_offer_id 
    AND mo.offer_type_code = mot.offer_type_code 
    AND r.account_number = ${account_number}
`
const query = db.executeQuery(selectDetails)
log.info(query[0])

const offer_id = query[0].OFFER_ID
const offer_outlet = query[0].OUTLET
const offer_type = query[0].OFFER_TYPE
const offer_descr = query[0].OFFER_DESCR
const creating_user = query[0].CREATING_USER
const offer_start_date = func.convertDateFromDB(query[0].START_DATE)
const offer_end_date = func.convertDateFromDB(query[0].END_DATE)

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
    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]//..//..//..//..//..//..//th[@data-label="שקע"]'
            + '//lightning-base-formatted-text[text()="' + offer_outlet + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]'
            + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_type + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]'
            + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_descr + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]'
            + '//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_start_date + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
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
