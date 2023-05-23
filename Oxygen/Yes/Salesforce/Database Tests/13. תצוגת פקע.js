po.init(env.url, 35)
log.info('13. תצוגת פקע')

const func = po.functions
const main = po.alphaMainPage
const alpha360 = po.customerDetails360
const searchPage = po.searchCustomerPage
const pakaHeader = alpha360.pakaTableHeader
const extraInfo = alpha360.extraPakaInfoTable

web.transaction('04. Connect to Database WIZ Database & Fetch Account Number')
db.setConnectionString(env.wiz_con_string)
var selectAccountDetails =
`
    SELECT * 
    FROM wiz_work_order w 
    WHERE w.Wo_Type = 'CN' 
    AND w.wo_status = 'O' 
    AND ROWNUM <= 15
`
let accountNumbers = db.executeQuery(selectAccountDetails)
log.info(accountNumbers[func.generateNumber(0, accountNumbers.length -1)])

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
        break
    } else {
        func.refresh()
        continue
    }
}

web.transaction('08. Open Paka List')
po.click(`//c-alp360-main-details-adw//div[text()="${account_number}"]`)
po.click(alpha360.pakaList)

web.transaction('09. Assert That Paka Table Has 11 Headers')
web.setTimeout(10 * 1000)

if (alpha360.isChartEmpty('פק"עות  פתוחות')) {
    log.info(`אין נתונים להציג בטבלת פק"עות  פתוחות אצל לקוח ${account_number}`)
    assert.pass()
}

var pakaHeaders = `//strong[contains(text(), 'פק"עות  פתוחות')]//..//..//..//span[@class='slds-truncate']`
var pakaHeadersCount = web.getElementCount(pakaHeaders)
var visibleHeaders = 0

for (var i = 1; i <= pakaHeadersCount; i++) {
    if (web.isVisible(`(${pakaHeaders})[${i}]`)) 
        visibleHeaders += 1
    else 
        log.info(`Header at index: ${i} is not visible`)
}

visibleHeaders >= 11 ? log.info('Visible headers: ' + visibleHeaders) : log.warn("Paka table doesn't have 11 headers")

web.transaction('10. Assert Filter Functionality')
if (web.isVisible(pakaHeader.pakaType)) {
    po.click(pakaHeader.pakaType)
    po.click(pakaHeader.pakaType)

    if (web.isVisible(`${pakaHeader.pakaType}//..${pakaHeader.filterArrowDisplayed}`, po.shortWait)) {
        log.info('סוג פק"ע ביצע פילטור בהצלחה')
    } else {
        assert.fail('סוג פק"ע לא ביצע פילטור')
    }
} else {
    log.info('סוג פק"ע לא מופיעה')
}

// delivery filter
if (web.isVisible(pakaHeader.deliveryType)) {
    po.click(pakaHeader.deliveryType)
    po.click(pakaHeader.deliveryType)

    if (web.isVisible(`${pakaHeader.deliveryType}//..${pakaHeader.filterArrowDisplayed}`)) {
        log.info('שיטת משלוח ביצע פילטור בהצלחה')
    } else {
        assert.fail('שיטת משלוח לא ביצע פילטור')
    }
} else {
    log.info('שיטת משלוח לא מופיעה')
}

// date filter
if (web.isVisible(pakaHeader.dateCoordination)) {
    po.click(pakaHeader.dateCoordination)
    po.click(pakaHeader.dateCoordination)

    if (web.isVisible(`${pakaHeader.dateCoordination}//..${pakaHeader.filterArrowDisplayed}`)) {
        log.info('תאריך תאום ביצע פילטור בהצלחה')
    } else  {
        assert.fail('תאריך תאום לא ביצע פילטור')
    }
} else {
    log.info('תאריך תאום לא מופיעה')
}

// hour filter
if (web.isVisible(pakaHeader.dateCoordination)) {
    po.click(pakaHeader.hourCoordination)
    po.click(pakaHeader.hourCoordination)

    if (web.isVisible(`${pakaHeader.hourCoordination}//..${pakaHeader.filterArrowDisplayed}`)) {
        log.info('שעת תאום ביצע פילטור בהצלחה')
   } else {
        assert.fail('שעת תאום לא ביצע פילטור') 
    }
} else {
    log.info('שעת תאום לא מופיעה')
}

web.transaction('11. Assert Extra Info Table')
var pakaNumber = web.getText(`(//strong[contains(text(), 'פק"עות  פתוחות')]//..//..//..//*[@data-label='מספר פק"ע']//a)[1]`)
pakaNumber = pakaNumber.split('-')[0].trim()
log.info('Paka Number: ' + pakaNumber)

po.click(`(//strong[contains(text(), 'פק"עות  פתוחות')]//..//..//..//span[@class="slds-radio_faux"])[1]`)

assert.equal(
    web.isVisible('//div[@class="extra-wrapper"]'), true,
    'לא נפתח מקטע עם מידע נוסף על הפק"ע'
)

var extraPakaNumber = web.getText('//div[@class="extra-wrapper"]//span[contains(text(), "מספר")]')
extraPakaNumber = extraPakaNumber.split(':')[1].trim()
log.info('Extra Paka Number: ' + extraPakaNumber)

if (!pakaNumber.includes(extraPakaNumber)) {
    log.error(`מספר פק"ע בטבלה: ${pakaNumber}`)
    log.error(`מספר פק"ע במידע נוסף: ${extraPakaNumber}`)
    assert.fail('מקטע עם מידע נוסף נפתח עם מספר פק"ע שגוי')
} 

// extra info -> jobs
if (web.isVisible(extraInfo.headers.jobs) == false) {
    assert.fail("כותרת ג'ובים לא מוצגת")
} else {
    po.click(extraInfo.headers.jobs)
    assert.equal(
        web.isVisible(extraInfo.tabs.jobs), true,
        "טבלת ג'ובים לא מוצגת"
    )
}

// extra info -> closing reason
if (web.isVisible(extraInfo.headers.closingReason) == false) {
    assert.fail("כותרת סיבת סגירה לא מוצגת")
} else {
    po.click(extraInfo.headers.closingReason)
    assert.equal(
        web.isVisible(extraInfo.tabs.closingReason), true,
        "טבלת סיבת סגירה לא מוצגת"
    )
}

// extra info -> notes
if (web.isVisible(extraInfo.headers.notes) == false) {
    assert.fail("כותרת הערות לא מוצגת")
} else {
    po.click(extraInfo.headers.notes)
    assert.equal(
        web.isVisible(extraInfo.tabs.notes), true,
        "טבלת הערות לא מוצגת"
    )
}

// extra info -> history
if (web.isVisible(extraInfo.headers.history) == false) {
    assert.fail("כותרת היסטוריה לא מוצגת")
} else {
    po.click(extraInfo.headers.history)
    assert.equal(
        web.isVisible(extraInfo.tabs.history), true,
        "טבלת היסטוריה לא מוצגת"
    )
}
