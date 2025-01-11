web.transaction('01. Initialize')
web.init()

web.transaction('02. Assert FREE-TV')
web.open('http://free-tv.co.il')

if (web.isExist('//*[contains(text(), "LiveDns") or contains(text(), "Server Hangup") or contains(text(), "Connection reset by peer")]')) { 
    log.info('✔️ free-tv.co.il is offline')
    assert.pass()
} else {
    assert.fail('❌ free-tv.co.il is online')
}
