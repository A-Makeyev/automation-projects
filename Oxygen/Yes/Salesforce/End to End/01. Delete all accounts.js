const obj = po
obj.init(env.url, 30)

function navigateToAccounts() {
    web.execute(() => {
        document.evaluate(
            '//a[@href="/lightning/o/Account/home"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue.click()
    })
}

function navigateToChannels() {
    web.execute(() => {
        getElementByXPath = (xpath) => {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        }
        getElementByXPath('//a[contains(@href, "Additional_Communication_Channel")]').click()
    })
}

web.transaction('Navigate To Accounts')
web.waitForVisible(obj.home.nav.accounts)
navigateToAccounts()

var accountCount = web.getElementCount(obj.utils.showActions)

function deleteAccounts(accounts) {
    var deleted = 0
    if (accounts == 0) {
        log.info('There are no accounts available')
        assert.pass()
    } else {
        var count = accounts;
        while(count == accounts) {
            if (accounts == 0) {
                break
            } else {
                web.transaction('Delete Account')
                let link = `//..//..//..//..//..//..//a[contains(@class, 'outputLookupLink')]`
                let path = `(//span[contains(text(), 'Show Actions')])[${count}]${link}`
                web.waitForVisible(path)
                let account = web.getText(path)
                obj.click(`//a[@title='${account}']//..//..//..${obj.utils.showActions}`)
                web.pause(2500)
                obj.click(obj.utils.showActions_delete)
                web.pause(2500)

                /* if an account is associated with a channel -> delete this channel */
                // if (web.isVisible(`(//div[contains(text(), "Your attempt to delete ${account} could not be completed")])[1]`, 2500)) {
                //     var channel = web.getText('(//div[@class="detail slds-text-align--center"])[1]')
                //     channel = channel.slice(-8)

                //     obj.click('(//button[@title="Close this window"])[1]//lightning-primitive-icon')
                //     navigateToChannels()

                //     web.waitForExist('//div[@id="brandBand_1"]')
                //     obj.click(`//a[@title="${channel}"]//..//..//..${obj.utils.showActions}`)
                //     web.pause(2500)
                //     obj.click(obj.utils.showActions_delete)
                //     web.pause(2500)
                //     obj.click(obj.utils.popUpDeleteBtn)
                //     web.pause(2500)

                //     navigateToAccounts()
                //     deleteAccounts(accountCount)
                // }

                obj.click(obj.utils.popUpDeleteBtn)
                web.pause(2500)
                count--
                deleted++
                accounts--
                log.info(`${account} was deleted`)
            }
        }
        accountCount = web.getElementCount(obj.utils.showActions) 
        if (accountCount > 1) {
            deleteAccounts(accountCount)
        }
    }
    accounts > 1 ? log.info(`${accounts} accounts still remaining`) : log.info(`${deleted} accounts were deleted successfully`)
}

deleteAccounts(accountCount)
web.dispose()