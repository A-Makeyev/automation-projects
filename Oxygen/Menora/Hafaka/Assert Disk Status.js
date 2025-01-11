web.transaction('01. Init')
web.init()

web.transaction('02. Open Dashboard Page')
web.open('https://adminconsole')

if (web.isVisible('//h1[text()="Your connection is not private"]', 3000)) {
    web.click('//button[@id="details-button"]')
    web.click('//a[@id="proceed-link"]')
}

web.waitForVisible('//div[@class="dashboard ng-scope"]')

web.transaction('03. Open Disk Storage')
web.click('//a[@id="navigationItem_mstoragePool"]')
web.click('//a[@id="navigationItem_storagePoolDisk"]')

web.transaction('04. Assert Disk Status: Online')
var diskStatus = '//*[@id="cv-k-grid-td-status"]'
var diskName = '//*[@id="cv-k-grid-td-storagePoolName"]'

var offlineDisks = []
var diskCount = web.getElementCount(diskName)

for (let x = 1; x <= diskCount; x++) {
    let disk = web.getText(`(${diskName})[${x}]`)
    let status = web.getText(`(${diskName})[${x}]//..${diskStatus}`)
    status = status.toLocaleLowerCase()

    if (status.includes('online')) {
        log.info(`✓ Disk ${disk} is ${status}`)
    } else {
        offlineDisks.push(`X Disk ${disk} is ${status}`)
    }

}

if (offlineDisks.length > 0) {
    log.info(offlineDisks)
    assert.fail('One or more disks are offline')
}
