const obj = po
obj.init(env.url, 30)

web.transaction('Navigate to Accounts')
function openForm() {
    web.pause(2500)
    web.waitForVisible(obj.home.nav.accounts)
    web.execute(() => {
        let xpath = '//a[@href="/lightning/o/Account/home"]'
        document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
    })
    web.pause(2500)
    web.waitForVisible(obj.utils.newBtn)
    obj.click(obj.utils.newBtn)
    web.pause(5000)
}

web.transaction('Create All Account Types')
// web.getElementCount('//span[@class="slds-radio--faux"]')

const types = [
    'Billing',
    'Billing Aggregator',
    'Business',
    'Consumer',
    'Other', 
    'Service',
    'Service Aggregator'
]

var accountsCreated = 0
const accountTypes = types.length

for (let x = 1; x <= accountTypes; x++) {
    // choose account type
    openForm()
    web.waitForVisible(`(//span[@class="slds-radio--faux"])[${x}]`)
    obj.click(`(//span[@class="slds-radio--faux"])[${x}]`)
    obj.click(obj.utils.nextBtn)

    var account = `${obj.functions.generateName()} - ${types[x-1]}`

    web.pause(3000)
    web.waitForVisible(obj.accounts.newAccount.accountName)
    obj.type(obj.accounts.newAccount.accountName, account)
    obj.click(obj.utils.save)
    web.pause(3000)

    var updateMessage = obj.functions.getGreenMessage()
    if (updateMessage.includes(`${account} was created.`)) {
        web.waitForVisible('(//span[@class="custom-truncate uiOutputText"])[1]')
        if (!web.isExist(`(//span[@class="custom-truncate uiOutputText" and text()="${account}"])[1]`)) {
            assert.fail(`${account} was not created`)
        }
    }
    accountsCreated++
    log.info(updateMessage)
}

accountsCreated == accountTypes ? 
    log.info(`All ${accountTypes} account types were created`) 
    : 
    assert.fail(`Only ${accountsCreated} were created`)
    
web.dispose()