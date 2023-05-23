const obj = po
obj.init(env.url, 30)

function getGreenMsg() {
    let message = '//span[contains(@class, "forceActionsText")]'
    try {
        web.waitForVisible(message)
        while (web.getText(message).length < 1) {
            web.getText(message)
        }
        return web.getText(message)
    } catch(_) {
        return 'Message was not found'
    }
}

const ACCOUNT = `${obj.functions.generateName()} Account`

web.transaction('Create New Billing Account')
// obj.click(obj.home.nav.accounts)
// obj.clickHidden('//a[@href="/lightning/o/Account/home"]');
// web.getDriver().findElement('//a[@href="/lightning/o/Account/home"]').click();

web.waitForVisible(obj.home.nav.accounts)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Account/home"]').click()
})

// new account
web.waitForVisible(obj.utils.newBtn)
obj.click(obj.utils.newBtn)

// choose account type
web.waitForVisible(obj.accounts.newAccount.billingBtn)
obj.click(obj.accounts.newAccount.billingBtn)
obj.click(obj.utils.nextBtn)

// fill account details
web.waitForVisible(obj.accounts.newAccount.accountName)
obj.type(obj.accounts.newAccount.accountName, ACCOUNT)
obj.click(obj.utils.save)
web.pause(2500)

if (getGreenMsg().includes(`Account "${ACCOUNT}" was created`)) {
    log.info(getGreenMsg())
} else {
    log.info('Green message did not appear when creating the account')
}

web.transaction('Assert Created Account')
web.waitForVisible('(//span[@class="custom-truncate uiOutputText"])[1]')

if (!web.isExist(`(//span[@class="custom-truncate uiOutputText" and text()="${ACCOUNT}"])[1]`)) {
    assert.fail(`${ACCOUNT} was not created`)
}

web.transaction('Delete the Account')
obj.click(obj.accounts.moreActionsArrow)
obj.click(obj.accounts.moreActions.deleteAccount)
obj.click(obj.utils.popUpDeleteBtn)
web.pause(2500)

var textWhenDeleting = getGreenMsg()
if (textWhenDeleting.includes(`Account "${ACCOUNT}" was deleted`)) {
    log.info(textWhenDeleting)
} else {
    log.info('Green message did not appear when deleting the account')
}

web.dispose()