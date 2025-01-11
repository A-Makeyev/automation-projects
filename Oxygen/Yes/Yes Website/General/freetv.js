web.transaction('01. Initialize')
web.init()

web.transaction('02. Assert FREETV')
web.open('http://freetv.co.il')

if (web.isExist('//title[contains(text(), "Unknown Host")]')) {
    log.info('✔️ freetv.co.il is offline')
} else {
    assert.fail('❌ freetv.co.il is online')
}
