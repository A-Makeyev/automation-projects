po.init()

web.transaction('03. Search Deals')
web.select('//option[contains(text(), "בחר איזור")]//..//..//select', 'label=אילת')
web.click('//div[contains(text(), "מצא לי חופשה")]')

assert.equal(
    web.isVisible('//h1[contains(text(), "תוצאות חיפוש")]'), true,
    'תוצאות חיפוש לא מופיעות'
)

web.transaction('04. Assert Price')
var rp = po.resultsPage

var sitePrice = web.getText(rp.firstResultSitePrice).replace('₪', '').trim()
var clubPrice = web.getText(rp.firstResultClubPrice).replace('₪', '').trim()
var originalPrice = web.getText(rp.firstResultOriginalPrice).replace('₪', '').trim()

sitePrice = Number(sitePrice)
clubPrice = Number(clubPrice)
originalPrice = Number(originalPrice)

var expectedSitePrice = Math.floor(originalPrice * 0.95)
var expectedClubPrice = Math.floor(expectedSitePrice * 0.9)

log.info('Site Price: ' + sitePrice)
log.info('Club Price: ' + clubPrice)
log.info('original Price: ' + originalPrice)
log.info('Expected Site Price: ' + expectedSitePrice)
log.info('expected Club Price: ' + expectedClubPrice)

if (sitePrice == expectedSitePrice) {
    log.info('✔️ Site Price - Valid')
} else {
    assert.fail(`❌ Expteced Site Price to be: ${expectedSitePrice}. Instead got: ${sitePrice}`)
}

if (clubPrice == expectedClubPrice) {
    log.info('✔️ Club Price - Valid')
} else {
    assert.fail(`❌ Expteced Site Price to be: ${expectedClubPrice}. Instead got: ${clubPrice}`)
}
