// set to true when uploading to cloudbeat to avoid debug logs
const cloudbeat = false

function getTime(time) {
    return new Date().getTime(time)
}

function getActualTime(timeValue) {
    let hours = new Date(timeValue).getHours()
    let minutes = new Date(timeValue).getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutes}`
}

function subtractMinutesToCurrentTime(minutesToSubtract) {
    return new Date().getTime() - (minutesToSubtract * 60 * 1000)
}

web.transaction('01. Initialize')
web.init()

web.transaction('02. Open Main Page')
web.open('https://www.iaa.gov.il')
web.waitForVisible('//section[@id="toTop"]')

web.transaction('03. Close COVID 19 PopUp')
if (web.isVisible('//div[@class="modal-content"]')) {
    web.click('//div[@class="modal-content"]//button[@aria-label="סגירה"]')
}

web.transaction('04. Load Landing Flights Data')
web.click('(//div[contains(@class, "search")]//a[text()["נחיתות"]])[1]')

let landingFlights = '//tr[contains(@class, "flight_row")]'
let landingFlightsCount = web.getElementCount(landingFlights)
let displayedFlights = []

if (landingFlightsCount == 0) {
    let errorMessage =  '//*[contains(text(), "שגיאה")]'
    if (web.isVisible(errorMessage)) {
        log.info(web.getText(errorMessage))
    }
    assert.fail('There was a problem with loading flight data')
} else {
    for (let flight = 1; flight <= landingFlightsCount; flight++) {
        if (cloudbeat) {
            web.waitForVisible(`(${landingFlights})[${flight}]`)
        } else {
            let flightText = web.getText(`(${landingFlights})[${flight}]`)
            
            if (web.isVisible(`(${landingFlights})[${flight}]`)
            && (!/^\s*$/.test(flightText) || !flightText || flightText.length !== 0)) {

                displayedFlights.push(
                    web.getText(
                        `(${landingFlights})[${flight}]//div[@class="td-airline"]`
                    )
                )
            } else {
                assert.fail(`Flight at index ${flight} is not visible`)
            }
        }
    }
}

if (!cloudbeat) {
    log.info(`Displayed ${landingFlightsCount} Flights:`)
    log.info(displayedFlights)
}

web.transaction('05. Assert That UpDate Time Is Not Smaller Than 2 Minutes Of The Actual Time')
var displayedTime
if (web.isVisible('//time[@id="lastUpDateTime"]', 3000)) {
    displayedTime = web.getText('//time[@id="lastUpDateTime"]')
} else if (web.isVisible('//time[@id="lastUpdateTime"]', 3000)) {
    displayedTime = web.getText('//time[@id="lastUpdateTime"]')
}

let displayedTimeValue = getTime(displayedTime)
let actualTime = getActualTime(new Date().getTime())
let actualTimeMinus_2 = subtractMinutesToCurrentTime(2)

if (!cloudbeat) {
    log.info('Displayed Time: ' + displayedTime)
    log.info('Actual Time: ' + actualTime)
    log.info('Actual Time Minus 2 Minutes: ' + getActualTime(actualTimeMinus_2))
}

if (displayedTimeValue < actualTimeMinus_2) {
    assert.fail(`Displayed time (${displayedTime}) is less than 2 minutes of the actual time (${actualTime})`)
} else {
    log.info('UpDated time is synced correctly')
}
