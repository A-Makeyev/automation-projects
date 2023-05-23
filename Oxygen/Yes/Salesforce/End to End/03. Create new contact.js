const obj = po
obj.init(env.url, 30)

function generateName() {
    let capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    let randomNumber = (min, max) => {
  	    return Math.floor(Math.random() * (max - min)) + min
    }
	let names = ['Estabon', 'Stephan', 'Ivanka', 'Achilles', 'Naomi',
                'Villalon', 'Muskuvich', 'Gates', 'Scott', 'Peachey']
	return capitalize(names[randomNumber(0, names.length)]) 
}

// log.info(obj.functions.generateName())

function generateEmail() {
    let name = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let domains = ['gmail', 'hotmail', 'yahoo', 'live', 'gmx']
    for(let x = 0; x < Math.floor(Math.random() * 9) + 1; x++) { 
        name += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `${name}@${domains[Math.floor(Math.random() * domains.length) + 1]}.com`
}

// log.info(obj.functions.generateEmail())


const ACCOUNT = `${generateName()} Account`
var randomPhoneNumber = Math.random().toString().slice(2,11)


// first you need an account to make a contact
web.transaction('Create New Billing Account')
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

if (obj.functions.getGreenMessage().includes(`Account "${ACCOUNT}" was created`)) {
    log.info(obj.functions.getGreenMessage())
} 

web.transaction('Assert Created Account')
web.waitForVisible('(//span[@class="custom-truncate uiOutputText"])[1]')

if (!web.isExist(`(//span[@class="custom-truncate uiOutputText" and text()="${ACCOUNT}"])[1]`)) {
    assert.fail(`${ACCOUNT} was not created`)
}

web.transaction('Create New Contact')
// obj.click(obj.home.nav.contacts)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Contact/home"]').click()
})

// new contact
web.pause(5000)
web.waitForVisible(obj.utils.newBtn)
obj.click(obj.utils.newBtn)

// contact details
web.waitForVisible(obj.contacts.newContact.salutationBtn)
obj.click(obj.contacts.newContact.salutationBtn)

web.waitForVisible(obj.contacts.newContact.salutation.prof)
obj.click(obj.contacts.newContact.salutation.prof)

obj.type(obj.contacts.newContact.firstName, generateName())
obj.type(obj.contacts.newContact.lastName, generateName())

var firstName = web.getValue(obj.contacts.newContact.firstName)
var lastName = web.getValue(obj.contacts.newContact.lastName)

obj.type(obj.contacts.newContact.accountName, ACCOUNT)

web.pause(2500)
web.waitForVisible(`//div[@title="${ACCOUNT}"]`)
obj.click(`//div[@title="${ACCOUNT}"]`)

obj.type(obj.contacts.newContact.email, generateEmail())
obj.type(obj.contacts.newContact.mobile, randomPhoneNumber)

obj.click(obj.utils.save)
log.info(`Contact ${firstName} ${lastName} was created`)

web.transaction('Delete the account')
web.pause(5000)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Account/home"]').click()
})

web.waitForVisible('//table[contains(@class, "forceRecordLayout")]')
web.assertExist(`(//a[@title="${ACCOUNT}"])[1]`)
obj.click(`(//a[@title="${ACCOUNT}"]//..//..//..//span[contains(text(), "Show Actions")])[1]`)

web.pause(2500)
po.click(obj.utils.showActions_delete)
web.pause(2500)

obj.functions.pressTAB()
obj.functions.pressENTER()

log.info(obj.functions.getGreenMessage())
web.dispose()