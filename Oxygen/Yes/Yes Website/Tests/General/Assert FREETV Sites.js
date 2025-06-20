web.transaction('01. Initialize')
web.init()

var onlineSites = []
var offlineSites = []

web.transaction('02. Open FREETV')
web.open('http://freetv.co.il')

if (web.isExist('//title[contains(text(), "Unknown Host")]')) {
    offlineSites.push('http://freetv.co.il')
} else {
    onlineSites.push('http://freetv.co.il')
}

web.transaction('03. Open FREE-TV')
web.open('http://free-tv.co.il')

if (web.isExist('//*[contains(text(), "LiveDns") or contains(text(), "Server Hangup")]')) { 
    offlineSites.push('http://free-tv.co.il')
} else {
    onlineSites.push('http://free-tv.co.il')
}

web.transaction('04. Assert Results')
if (offlineSites.length > 0) {
    log.info('✔️ Offline Sites:')
    offlineSites.forEach(site => log.info(site))
}

if (onlineSites.length > 0) {
    log.info('Online Sites:')
    onlineSites.forEach(site => log.info(site)) 
    assert.fail(`❌ Online Sites: ${onlineSites.join(', ')}`)
}
