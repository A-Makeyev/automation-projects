web.transaction('01. Open moovitapp.com')
web.init()
web.open('https://moovitapp.com/')
const windowWidth = web.execute(() => { return window.innerWidth })
const windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

web.transaction('02. Search Addresses')
web.waitForVisible('//mv-search-control')
web.pause(1500)
web.type('id=position_start', 'Haifa')
web.waitForVisible('//mv-search-results')

web.pause(1500)
web.type('id=position_end', 'Tel Aviv')
web.waitForVisible('//mv-search-results')

web.transaction('03. Get Location Results')
var randomResultElements = '//mv-location-result[contains(@id, "location")]'
var results = web.getElementCount(randomResultElements)
var randomResultIndex = Math.floor(Math.random() * results) + 1
var randomResultElement = `(${randomResultElements})[${randomResultIndex}]`
var info = web.getText(`${randomResultElement}//div[@class="location-info"]`)
web.pause(1500)
log.info('Result info: ' + info)

web.transaction(`04. Open (${info}) Location Result`)
web.click(randomResultElement)

web.transaction('05. Open Lines')
web.click('//span[contains(text(), "Lines")]')

web.transaction('06. Get Line Results')
var randomResultElements = '//div[contains(@id, "line") and not(@id="line_0")]'
var lines = web.getElementCount(randomResultElements)
var randomLinesIndex = Math.floor(Math.random() * lines) + 1
var randomLineElement = `(${randomResultElements})[${randomLinesIndex}]`
var info = web.getText(`${randomLineElement}//div[contains(@class, "line-item")]`)
web.pause(1500)
log.info('Line info: ' + info)

web.transaction(`07. Open (${info}) Line Result`)
web.click(randomLineElement)

web.transaction(`08. Get (${info}) Line Schedule`)
if (web.isVisible('//div[@class="message" and contains(text(), "There are no upcoming departures")]', 5000)) {
    log.info(web.getText('//div[@class="message"]'))
} else {
    if (web.isVisible('//a[contains(text(), "View full schedule")]', 5000)) {
        web.click('//a[contains(text(), "View full schedule")]')
        var arrivalTimeElements = '//div[contains(@class, "arrival-item")]'
        var arrivalTimes = web.getElementCount('//div[contains(@class, "arrival-item")]')

        log.info('Line Arrival Times:')
        for (let x = 1; x <= arrivalTimes; x++) {
            log.info(
                web.getText(`(${arrivalTimeElements})[${x}]`)
            )
        }
    }
}
