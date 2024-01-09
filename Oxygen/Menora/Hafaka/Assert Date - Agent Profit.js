function formatDate(date) {
    let newDate = new Date(date)
    let dd = String(newDate.getDate()).padStart(2, "0")
    let mm = String(newDate.getMonth() +1).padStart(2, "0")
    let yyyy = newDate.getFullYear()
    return dd + '/' + mm + '/' + yyyy
}

var actualDate = new Date()
log.info('Actual date: ' + actualDate)

var dateOffset_5_days = (24 * 60 * 60 * 1000) * 5 

var date_5_daysAgo = new Date(actualDate)
date_5_daysAgo.setTime(date_5_daysAgo.getTime() - dateOffset_5_days)

log.info('date 5 days ago: ' + formatDate(date_5_daysAgo))
log.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

function getText(element) {
    web.waitForVisible(element)

    let loop = 0
    let text = web.getText(element)
    if (text.length >= 1) {
        return text
    } else {
        while (text == '' || text == null) {
            web.pause(1000)
            text = web.getText(element)
            
            loop++
            if (loop > 15) break
        }
    }
    return text
}

web.transaction("Init")
web.init()

web.transaction("Connect to Agent Profit")
web.open('https://menoramivt.net/extensions/agentprofit/index.html')

web.transaction("Assert Page Title & Url")
assert.equal(web.getTitle(), 'Agent Profit')
assert.contain(web.getUrl(), 'qliksenseprod01.menoramivt.net')
log.info(web.getUrl())

web.transaction("Assert That Dates are No Longer Than 5 Days")
var displayedDataDate = getText('//div[contains(text(), "תאריך נכונות הנתונים")]').match(/\d+/g).join('/')

log.info('displayed date: ' + displayedDataDate)
log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

displayedDataDate = new Date(formatDate(displayedDataDate))

log.info('displayed date: ' + displayedDataDate)
log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

// make sure that the displayed date is not bigger than actual date minus 5 days

var actualDateTime = actualDate.getTime()
var displayedDataDateTime = displayedDataDate.getTime()
var actualDateTime_minus_5_Days = actualDate - dateOffset_5_days

log.info('Actual date time: ' + actualDateTime)
log.info('Actual date - 5 days time: ' + actualDateTime_minus_5_Days)
log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

log.info('displayed DataDate Time: ' + displayedDataDateTime)
log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")


if (displayedDataDateTime < actualDateTime_minus_5_Days) {
    assert.fail(
        'Displayed data date (' + formatDate(displayedDataDate) + ') is longer than 5 days.'
        + ' Actual date: ' + formatDate(actualDate)
    )
}
