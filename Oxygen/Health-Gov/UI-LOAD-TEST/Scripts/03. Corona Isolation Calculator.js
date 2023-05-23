web.transaction('01. Initialize')
web.init()

web.transaction('02. Open Calculator Page')
web.open(po.ramzor.url + '/calculator')

if (!web.isVisible('//h2[text()="מחשבון בידוד"]') || !web.isVisible('//div[contains(@class, "main-content")]')) {
    web.refresh()
}

web.waitForVisible('//h2[text()="מחשבון בידוד"]')
web.waitForVisible('//div[contains(@class, "main-content")]')

web.transaction('03. Choose Reason (coming back from other country)')
web.click('//label[contains(text(), "חזרתי מחו”ל")]//..//..//div')

web.transaction('04. Open Return Date Page')
web.click('//a[contains(@class, "continue-btn")]')

web.transaction('05. Choose Known Return Date (no)')
web.click('//label[text()="לא"]')

web.transaction('06. Open Result Page')
web.click('//a[contains(@class, "continue-btn")]')
web.waitForVisible('//div[@class="result-block"]')

web.transaction('07. Validate Need of 14 Isolation Days')
let header = web.getText('//div[@class="content result-isolation clearfix"]//h2')
let duration = web.getText('(//div[@class="content result-isolation clearfix"]//h3)[1]')

assert.contain(header, 'התוצאה שלך: יש צורך בבידוד')
assert.contain(duration, 'משך הבידוד - 14 יום')

log.info(header)
log.info(duration)

web.transaction('08. Finish & Return to Calculator Page')
web.click('//a[text()="סיים"]')

assert.equal(
    web.isVisible('//h2[text()="מחשבון בידוד"]'), true,
    'מחשבון בידוד אינו מופיע בסיום הטופס'
)
