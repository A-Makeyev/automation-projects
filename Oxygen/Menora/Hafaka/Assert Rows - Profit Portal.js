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

web.transaction("Connect to Elm Profit - Portal")
web.open('https://.menoramivt.net/extensions/ElmProfitportal/index.html')

web.transaction("Assert Page Title & Url")
assert.equal(web.getTitle(), 'Elm Profit - Portal')
assert.contain(web.getUrl(), 'XXXXXXXXXX.XXXXXXXX.XXX')
log.info(web.getUrl())

web.transaction("Assert That Data Table is Visible")
web.selectFrame('//iframe[@id="iframe1"]')
web.waitForVisible('//table[@id="senseTable"]')

var tableDataCount = web.getElementCount('//table[@id="senseTable"]//div[@ng-repeat="(key,val) in item[1]"]')
log.info('Data Rows Found: ' + tableDataCount)

var rows = [
    'פרמיה ברוטו', 'פרמיה ברוטו מורווחת', 'סה"כ תביעות', 'עמלה מורווחת כולל מע"מ', 'סה"כ הוצאות', 'רווח / (הפסד) חיתומי',
    'סך הכנסות מהשקעות', 'סך הכנסות מאשראי', 'עלות ריתוק הון', 'רווח / (הפסד) כולל', 'שיעור רווח מפרמיה מורווחת', 
    'Loss Ratio', 'כמות פוליסות', 'כמות בחשיפה ממוצעת', 'פרמיה ממוצעת', 'עלות תביעה לפוליסה', 'כמות פתיחת תביעות', 
    'שכיחות תביעות', 'שיעור עמלה מנטו לפני מע"מ', 'שיעור סך עמלה מנטו לפני מע"מ', 'שיעור דמים מנטו', 'שיעור הוצאות מפרמיה',
]

for (var row = 0; row < rows.length; row++) {
    var rowData = web.getElementCount(`//td[@rowname='${rows[row]}']//div`)
    for (var data = 1; data <= rowData; data++) {
        assert.equal(
            web.isVisible(`(//td[@rowname='${rows[row]}']//div)[${data}]`), true,
            `There was a problem with row: ${rows[row]}`
        )
        log.info(getText(`(//td[@rowname='${rows[row]}']//div)[${data}]`))
    }
    log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    log.info(`✓ Checked row: ${rows[row]}`)
    log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~")
}
