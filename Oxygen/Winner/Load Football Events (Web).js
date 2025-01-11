web.transaction('01. Initialize')
web.init()

web.transaction('02. Open Main Page')
web.open('https://m.winner.co.il/')

var mainContent = '//div[@class="content"]'
var mainContentCount = web.getElementCount(mainContent)

for (let i = 1; i <= mainContentCount; i++) {
    web.waitForExist(`(${mainContent})[${i}]`)
}

web.transaction('03. Load Football Events')
web.click('//a[@data-eventpath-name="כדורגל"]')

var footballEvent = '//tr[@class="event"]'
var footballEventCount = web.getElementCount(footballEvent)

for (let i = 1; i <= footballEventCount; i++) {
    web.waitForExist(`(${footballEvent})[${i}]`)
}
