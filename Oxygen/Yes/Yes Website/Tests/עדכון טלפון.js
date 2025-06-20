po.loginPage.login()

web.transaction('Save Current Phone Number')
if (web.isVisible(po.accountPage.currentPhoneNumber)) {
    var currentPhoneNumber = web.getText(po.accountPage.currentPhoneNumber)
    currentPhoneNumber = currentPhoneNumber.match(/\b\d{3}-\d{7}\b/)[0]
    log.info('Current phone number: ' + currentPhoneNumber)
} else {
    assert.fail('לא מופיע מספר טלפון')
}

web.transaction('Open Update Phone Number Page')
web.click(po.accountPage.updatePhoneNumberButton)

web.transaction('Update Phone Number')
var newPhoneNumber = currentPhoneNumber.slice(0, -1) + '9'
log.info('New phone number: ' + newPhoneNumber)

web.clear(po.accountPage.newPhoneNumberInput)
web.type(po.accountPage.newPhoneNumberInput, newPhoneNumber)
web.click(po.accountPage.saveNewPhoneNumberButton)

web.transaction('Assert Phone Number Was Updated')
var updatedPhoneNumber = web.getText(po.accountPage.currentPhoneNumber)
updatedPhoneNumber = updatedPhoneNumber.match(/\b\d{3}-\d{7}\b/)[0]
log.info('Updated phone number: ' + updatedPhoneNumber)

if (newPhoneNumber === updatedPhoneNumber) {
    if (web.isVisible(po.mainPage.notificationText, po.shortWait)) {
        log.info(web.getText(po.mainPage.notificationText))
    }
    log.info(`Updated phone number from ${currentPhoneNumber} to ${updatedPhoneNumber}`)
} else {
    assert.fail(`Failed to update phone number from ${currentPhoneNumber} to ${updatedPhoneNumber}`)
}

web.transaction('Revert Back To Old Phone Number')
web.click(po.accountPage.updatePhoneNumberButton)
web.clear(po.accountPage.newPhoneNumberInput)
web.type(po.accountPage.newPhoneNumberInput, currentPhoneNumber)
web.click(po.accountPage.saveNewPhoneNumberButton)

if (web.isVisible(po.accountPage.currentPhoneNumber)) {
    var revertedPhoneNumber = web.getText(po.accountPage.currentPhoneNumber)
    revertedPhoneNumber = revertedPhoneNumber.match(/\b\d{3}-\d{7}\b/)[0]
    log.info('Reverted phone number: ' + revertedPhoneNumber)
} else {
    assert.fail(`Failed to revert phone number ${currentPhoneNumber}`)
}
