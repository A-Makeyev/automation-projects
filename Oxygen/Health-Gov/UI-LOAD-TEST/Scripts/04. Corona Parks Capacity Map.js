const getDay = () => {
    let day = new Date()
        .toLocaleString('heb-il', { weekday: 'long' })
        .replace(/יום/g, '').replace(/\s/g, '')

    /* hebrew problem */
    if (day == 'Sunday' || day == 'Sun') { day = 'ראשון' } 
    else if (day == 'Monday' || day == 'Mon') { day = 'שני' } 
    else if (day == 'Tuesday' || day == 'Tue') { day = 'שלישי' }
    else if (day == 'Wednesday' || day == 'Wed') { day = 'רביעי' }
    else if (day == 'Thursday' || day == 'Thu') { day = 'חמישי' }
    else if (day == 'Friday' || day == 'Fri') { day = 'שישי' }
    else if (day == 'Saturday' || day == 'Sat') { day = 'שבת' }

    return day
}

const getHour = () => {
    let hour = new Date()
        .toLocaleTimeString('en-US', { hour12: false })
        .slice(0, 2)

    if (hour.charAt(0) == '0') {
        hour = hour.slice(1)
    }
    
    return hour
}

log.info('Day: ' + getDay())
log.info('Hour: ' + getHour())

web.transaction('01. Initialize')
web.init()
web.setTimeout(15 * 1000)

web.transaction('02. Open Parks Map Page')
web.open(po.ramzor.url + '/directives/park-loads-map')
web.waitForVisible('//h1[text()="מפת עומסים בפארקים ובשמורות טבע"]')

web.selectFrame('//iframe[@class="embed-responsive-item"]')
web.waitForExist('//div[@class="map-container mapboxgl-map"]//canvas')

const parks = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז']

for (let i = 1; i <= 5; i++) {
    web.transaction('03. Type Park Name')
    web.type('//div[@class="search-container"]//input', parks[0])

    web.transaction('04. Search Park Map')
    var items = web.getElementCount('//li[@class="search-results__item"]')
    web.click(`(//li[@class="search-results__item" and contains(text(), "${parks[0]}")])[${i}]`)

    if (web.isVisible('//div[@class="error-message"]')) {
        for (let j = 1; j <= items; j++) {
            web.type('//div[@class="search-container"]//input', parks[i])
            web.click(`(//li[@class="search-results__item" and contains(text(), "${parks[i]}")])[${j}]`)
            if (!web.isVisible('//div[@class="error-message"]')) {
                break
            }
        }
    }

    web.transaction('05. Assert Park Information')
    let displayedPark = po.getText('//h2[@data-place]')
    let displayedHour = po.getText('//span[@data-hour]')
    let displayedColor = po.getText('//div[@data-title-he]')
    let displayedDay = po.getText('(//span[@data-day-he])[1]')
    
    if (displayedDay != getDay())
        assert.fail('בתוצאות החיפוש מופיע יום שגוי')

    if (displayedHour != getHour()) 
        assert.fail('בתוצאות החיפוש מופיע שעה שגויה')

    log.info('Park: ' + displayedPark + ' is in color: ' + displayedColor)
}
