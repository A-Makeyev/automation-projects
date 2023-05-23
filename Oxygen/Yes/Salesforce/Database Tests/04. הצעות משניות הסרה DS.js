po.init(env.url, 35)
log.info('04. הצעות משניות הסרה DS')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage

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
const accountDetails = db.executeQuery(selectAccountDetails)

web.transaction('07. Fetch Offers & Extract Outlet')
for (var x = 0; x < accountDetails.length; x++) {
    if (accountDetails[x] === null) {
        if (x >= accountDetails.length) {
            assert.fail('Cannot fetch a valid account number')
        }
        continue
    }

    if (searchPage.searchCustomerByAccount(accountDetails[x].ACCOUNT_NUMBER)) {
        var account_number = accountDetails[x].ACCOUNT_NUMBER
    } else {
        func.refresh()
        continue
    }

    var existingOutlet = false
    var selectOfferDetails = 
    `
        SELECT DISTINCT e.account_number, e.offer_id, TO_NCHAR(eo.OFFER_DESC) AS OFFER_DESC,
            to_char(e.start_date, 'DD-MON-YYYY') start_date, to_char(e.END_DATE, 'DD-MON-YYYY') end_date,
            TO_NCHAR(OT.EQUIPMENT_OFFER_TYPE_DESC), e.creation_user, cho.outlet_code outlet 
        FROM WIZ_CUST_HP_EQUIP_OFFER_HIST e, tr.tr_equipment_offer eo, tr.tr_equipment_offer_type ot,
            WIZ_CUST_HP_OCCURRENCE_HIST cho 
        WHERE e.OFFER_ID = eo.EQUIPMENT_OFFER_ID 
        AND eo.equipment_type_code = OT.EQUIPMENT_OFFER_TYPE_CODE 
        AND cho.occurrence_id(+) = e.occurrence_id 
        AND e.ACCOUNT_NUMBER = ${account_number}
    `
    var query = db.executeQuery(selectOfferDetails)

    if (query.length < 1) {
        continue
    }

    for (let z = 0; z < query.length; z++) {
        if (query[z].ACCOUNT_NUMBER > 1) {
            if (query[z].OUTLET !== null) {
                if (query[z].OUTLET.includes('M')) {
                    var validQuery = query[z]
                    existingOutlet = true
                    log.info('Existing Outlet: ' + existingOutlet)
                    log.info(`Account (${query[z].ACCOUNT_NUMBER}) OUTLET: + ${query[z].OUTLET}`)
                    break
                }
            } 
        }
    }

    if (existingOutlet) {
        log.info('Valid Query:')
        log.info(validQuery)

        var queryValues = Object.values(validQuery)
        var offer_desc = queryValues[2]
        var offer_type = queryValues[5]

        var offer_id = validQuery.OFFER_ID
        var offer_outlet = validQuery.OUTLET
        var creating_user = validQuery.CREATION_USER
        var offer_start_date = func.convertDateFromDB(validQuery.START_DATE)

        log.info(`Account number: ${account_number} -> Outlet: ${offer_outlet}`)
        break
    } 
}

if (offer_outlet === undefined) {
    assert.fail(`Failed to find an account with an existing "ALL" outlet after ${x} attemps`)
} 

web.transaction('08. Open Customer\'s Products')
alpha360.openProducts(account_number)

web.transaction('09. Assert Data Rows')
alpha360.assertDataRows()

web.transaction('10. Compare Customer\'s Details From Database')
if (!alpha360.isChartOpen('מוצרים פעילים')) {
    po.click(alpha360.activeProducts)
}

if (alpha360.isChartEmpty('מוצרים פעילים')) {
     log.info('אין נתונים להציג בטבלת מוצרים פעילים')
} else {
    if (!web.isVisible(`//a[contains(text(), "${offer_id}")]`, po.shortWait * 2)) {
        // if the offer id from the query does not appear, find a new one with the same outlet
        let otherOffersWithOutlet = '//lightning-base-formatted-text[contains(text(), "M0")]//..//..//..//..//..//a'
        let offerCount = web.getElementCount(otherOffersWithOutlet)

        if (offerCount > 1) {
            log.warn(`Offer ${offer_id} was not displayed, available offers:`)

            for (let offer = 1; offer <= offerCount; offer++) {
                if (web.isVisible(`(${otherOffersWithOutlet})[${offer}]`, po.shortWait)) {
                    log.info(web.getText(`(${otherOffersWithOutlet})[${offer}]`))
                }
            }
        }

        let randomOfferNumber = func.generateNumber(1, offerCount)
        offer_id = web.getText(`(${otherOffersWithOutlet})[${randomOfferNumber}]`)

        let otherOfferOutlet = `//a[contains(text(), "${offer_id}")]//..//..//..//..//..//..//..//*[contains(text(), "M0")]`
        let otherOfferType = `(//a[contains(text(), "${offer_id}")]//..//..//..//..//..//..//..//lightning-base-formatted-text)[2]`
        let otherOfferDesc = `(//a[contains(text(), "${offer_id}")]//..//..//..//..//..//..//..//lightning-base-formatted-text)[3]`
        let otherOfferDate = `(//a[contains(text(), "${offer_id}")]//..//..//..//..//..//..//..//lightning-base-formatted-text)[4]`

        offer_outlet = web.getText(otherOfferOutlet)
        offer_type = web.getText(otherOfferType)
        offer_desc = web.getText(otherOfferDesc)
        offer_start_date = web.getText(otherOfferDate)

        log.info(`New offer id: ${offer_id}`)
        log.info(`New offer outlet: ${offer_outlet}`)
        log.info(`New offer type: ${offer_type}`)
        log.info(`New offer desc: ${offer_desc}`)
        log.info(`New offer start date: ${offer_start_date}`)
    }

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]//..//..//..//..//..//..//..//th[@data-label="שקע"]'
            + '//lightning-base-formatted-text[text()="' + offer_outlet + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]'
            + '//..//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_type + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]'
            + '//..//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_desc + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )

    assert.equal(
        web.isVisible(
            '//a[contains(text(), "' + offer_id + '")]'
            + '//..//..//..//..//..//..//..//lightning-base-formatted-text[text()="' + offer_start_date + '"]'
        ), true, 'הצעה ' + offer_id + ' אינה מופיעה'
    )
}

web.transaction('11. Assert Price From Database')
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

web.transaction('12. Fetch Representative Name')
let selectRepNameQuery = `SELECT TO_NCHAR(t.descr) FROM wiz_employee_codes t WHERE t.employee_code = '${creating_user}'`
let repName = db.getScalar(selectRepNameQuery)

if (repName == undefined || repName == null) {
    log.info('Rep Name was empty from the following query: ' + selectRepNameQuery)
} else {
    log.info('Representative Name: ' + repName)
    log.info('Representative type: ' + typeof repName)
}

web.transaction('13. Connect to ODS Customer Database & Fetch Representative Affiliation')
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
