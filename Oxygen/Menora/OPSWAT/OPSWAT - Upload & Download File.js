var os = require('os')
var currentDirectory = os.userInfo().homedir
log.info(currentDirectory)

var cloudbeat = false
var fs = require('fs')
var fileName = 'SFE_TEST_FILE.pdf'
var uploadFilePath, 
    downloadFilePath = `${currentDirectory}\\Downloads\\${fileName}`

if (cloudbeat) {
    uploadFilePath = `C:\\`
} else {
    uploadFilePath = `M:\\Anatoly\\Data\\${fileName}`
}

web.transaction('01. Init')
web.init()
web.setTimeout(50 * 1000)
const waitASecond = 1000

web.transaction('02. Open Main Page')
web.open('https://whitening.menora.co.il')

web.transaction('03. Login')
web.type('id=username', user)
web.type('id=password', pass)
web.click('id=loginButton')


if (web.isVisible('(//div[contains(@class, "alert-danger")])[1]', waitASecond))
    assert.fail(web.getText('(//div[contains(@class, "alert-danger")])[1]'))

web.waitForVisible('id=content-wrapper')
web.waitForVisible('id=sidebar')

web.transaction('04. Upload File')
web.click('id=topbar-upload-files-btn')
web.fileBrowse('//span[@id="browse"]//..//input[@type="file"]', uploadFilePath)

assert.contain(
    web.getText('//p[@class="file-text"]'), fileName,
    'There was a problem with uploading the file'
)

if (web.isVisible(`//p[@class="file-text" and contains(text(), "${fileName}")]`)) {
    web.click('id=upload-files-modal-confirm-btn')

    assert.equal(
        web.isVisible(
            '//span[@class="trim-text" and contains(text(), "' + fileName + '")]'
            + '//..//..//..//..//..//..//span[@role="presentation" and contains(text(), "Sanitized")]'
        ), true, `The file ${fileName} has failed to upload and sanitize`
    )
    log.info(`${fileName} was uploaded successfully`)
}

web.transaction('05. Download File')
web.click(
    '//span[@class="trim-text" and contains(text(), "' + fileName + '")]'
    + '//..//..//..//..//..//..//input[@ref="eInput"]'
)

web.click('id=my-files-bulk-download-btn')
web.pause(waitASecond)

web.transaction('06. Assert File')
pdf.assert(downloadFilePath, 'SFE')

if (!fs.existsSync(downloadFilePath)) {
    assert.fail('There was a problem with downloading the file')
} else {
    log.info(`${fileName} was downloaded successfully`)

    web.transaction('07. Delete File From Directory')
    fs.unlinkSync(downloadFilePath)
    if (fs.existsSync(downloadFilePath)) {
		assert.fail(`Failed to delete ${fileName} from ${downloadFilePath}`)
	} else {
		log.info(`Deleted ${fileName} from ${downloadFilePath}`)
	}
        
    web.transaction('08. Delete File From OPSWAT')
    web.pause(waitASecond)

    // if there are multiple files, delete all of them
    var deleteAll = web.getElementCount('//span[@class="trim-text"]') > 1 ? true : false
    if (deleteAll) {
        web.click('//div[@col-id="selection"]//div[@ref="cbSelectAll"]')
    } else {
        web.click(
            '//span[@class="trim-text" and contains(text(), "' + fileName + '")]'
            + '//..//..//..//..//..//..//input[@ref="eInput"]'
        )
    }

    web.click('//button[@id="my-files-bulk-delete-btn"]')

    if (web.isVisible('//*[@class="modal-title" and text()="Delete Items"]')) {
        web.click('//button[@id="confirmation-modal-confirm-btn"]')
        web.pause(waitASecond)
    }

    log.info(
        web.isVisible('//div[@class="toast-message"]') ? web.getText('//div[@class="toast-message"]') : ''
    )

    web.refresh()
    web.waitForNotExist('//span[@class="trim-text" and contains(text(), "' + fileName + '")]')
    
    if (web.isVisible('//span[@class="trim-text" and contains(text(), "' + fileName + '")]', waitASecond)) {
        assert.fail(`File ${fileName} was not deleted`)
    } else {
        assert.pass()
    }
}
