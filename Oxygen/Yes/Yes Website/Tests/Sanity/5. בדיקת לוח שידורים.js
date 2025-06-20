po.init('5. בדיקת לוח שידורים')

web.transaction('03. Open TV Guide Page')
web.point('//header//a[contains(text(), "עולם התוכן")]')
po.click('//header//a[contains(text(), "עולם התוכן")]//..//a[contains(text(), "לוח שידורים")]')

web.transaction('04. Assert TV Guide Menu')
assert.equal(
    web.isVisible('//section[@class="broadcast-schedule"]'), true,
    'Broadcast Schedule details section is not visible'
)

assert.equal(
    web.isVisible('//section[@class="broadcast-schedule"]//h1[contains(text(), "לוח שידורים")]'), true,
    'Broadcast Schedule header is not visible'
)

web.transaction('05. Assert Scroll Functionality Inside Channals')
var channalElements = '//div[@class="bs-body"]//h3[contains(@class, "channel-row")]'

if (!web.isVisible(channalElements, po.longWait)) {
    po.log('warning', 'Channals failed to load at first try')
    web.refresh()
}

var channalCount = web.getElementCount(channalElements)
web.scrollToElement(`(${channalElements})[${channalCount}]`)

if (web.isVisible(`(${channalElements})[${channalCount}]`)) {
    let channalNumber = web.getAttribute(`(${channalElements})[${channalCount}]`, 'id').replace(/\D/g, '')
    po.log('success', `Last channal (${channalNumber}) is visible after scroll`)
} else {
    po.log('error', `Last channal at index ${channalCount} is not visible after scroll`)
}

web.transaction('06. Assert Scroll Functionality Inside Shows')
web.setTimeout(po.shortWait)

var timeElements = '//div[@class="bs-body"]//div[@class="bs-time-name"]'
var timeCount = web.getElementCount(timeElements)

var hours = Number(po.getCurrentDateAndTime('hours'))
var showTime = hours >= 12 ? '23:' : '7:' 
var showElement = `(//div[@class="bs-body"]//div[@class="bs-start-time" and contains(text(), "${showTime}")])[1]`

for (let x = 1; x <= timeCount; x++) {
    hours >= 12 ? po.click('//div[@class="slider-prev"]//img') : po.click('//div[@class="slider-next"]//img')
    web.pause(150)
}

if (web.isVisible(showElement)) {
    web.scrollToElement(showElement)
    let showName = po.getText(`${showElement}//..//div[@class="bs-schedule-item-name"]`)
    po.log('success', `Show (${showName}) is visible after scroll`)
} else {
    po.log('error', `Show at index ${showName} is not visible after scroll`)
}

web.transaction('07. Assert That Show Window Opens')
var showElements = '//div[@class="bs-body"]//div[contains(@class, "channel-item")]'
var showElementsCount = web.getElementCount(showElements)
var randomIndex = po.getRandomNumber(2, showElementsCount / 2)

web.scrollToElement(`(${showElements})[${randomIndex}]`)
var randomShowName = po.getText(`(${showElements})[${randomIndex}]//div[@class="bs-schedule-item-name"]`)

po.click(`(${showElements})[${randomIndex}]`)
var randomShowElement = `//div[@class="modal-dialog"]//*[@id="popupSchedTitle" and contains(text(), "${randomShowName}")]`
if (web.isVisible(randomShowElement)) {
    po.log('success', `Window (${randomShowName}) opened`)
} else {
    po.log('error', `Window (${randomShowName}) failed to open`)
}

web.transaction('08. Assert That Show Window Closes')
po.click(`${randomShowElement}//..//button[@data-dismiss="modal"]`)
if (web.isExist('//div[@id="modalSched" and @aria-hidden="true"]')) {
    po.log('success', `Window (${randomShowName}) closed`)
} else {
    po.log('error', `Window (${randomShowName}) failed to close`)
}

web.transaction('09. Assert Filter By Date')
var initialDateName = po.getText('//div[@id="d-select"]//*[@class="day-selected"]')
var totalShowsBeforeFilter = web.getElementCount('//div[@class="bs-schedule-item-name"]')
po.log('info', `Show count BEFORE filter: ${totalShowsBeforeFilter}`)

po.click('//div[@id="d-select"]//img[@class="select-arrow"]')
var filterDateElements = `//div[@class="select-day-row" and not(contains(text(), "${initialDateName}"))]`
var filterDateCount = web.getElementCount(filterDateElements)
var selectedDate = `(${filterDateElements})[${po.getRandomNumber(2, filterDateCount)}]`
var selectedDateName = po.getText(selectedDate)
po.click(selectedDate)
web.pause(po.longWait)

var totalShowsAfterFilter = web.getElementCount('//div[@class="bs-schedule-item-name"]')
po.log('info', `Show count AFTER filter: ${totalShowsAfterFilter}`)

var dateNameAfterFilter = po.getText('//div[@id="d-select"]//*[@class="day-selected"]')
if (dateNameAfterFilter == initialDateName) {
    po.log('warning', `Failed to change filter date from (${initialDateName}) to (${selectedDateName})`)
} else {
    po.log('success', `Changed filter date from (${initialDateName}) to (${dateNameAfterFilter})`)
}
