const obj = po
obj.init(env.url, 30)

const ACC = obj.ACC
const utils = obj.utils
const func = obj.functions

const Channel_Number = func.generateNumber()
const Legacy_Channel_External_ID = func.generateNumber()
const Account_Name = `${func.generateName()} Account`
const Channel_Type = Account_Name.replace('Account', 'Type')

function deleteChannel() {
    web.transaction('Delete Channel')
    obj.click(utils.showMoreActions)
    obj.click(utils.moreActions_delete)
    obj.click(utils.popUpDeleteBtn)
}

web.transaction('Create new billing acount')
func.createAccount(Account_Name)

web.transaction('Create New Additional Communication Channel')
web.waitForVisible(obj.home.nav.ACC)

try {
    obj.click(obj.home.nav.ACC)
} catch($) {
    web.execute(() => {
        document.evaluate(
            '//a[contains(@href, "Additional_Communication_Channel")]', 
            document, 
            null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
            null
        ).singleNodeValue.click()
    })
}

web.waitForExist('//div[@id="brandBand_1"]')
web.waitForVisible('(//span[contains(text(), "Additional Communication Channels")])[4]')
obj.click(utils.newBtn)

obj.type(ACC.billingAccount, Account_Name)
obj.click(`(//div[@title="${Account_Name}"])[1]`)

obj.type(ACC.channelNumber, Channel_Number)

obj.click(ACC.channelTypeSelect)
obj.click(ACC.channelTypes.MF)

const chosenType = web.getText(ACC.channelTypeSelect)
if (chosenType.length < 1) {
    while (chosenType.length < 1) {
        chosenType = web.getText(ACC.channelTypeSelect)
    }
}

obj.type(ACC.legacyExternalID, Legacy_Channel_External_ID)
obj.click(utils.save)

web.transaction('Assert Details')
const formattedText = '//span[text()="Additional Communication Channel Name"]//..//..//lightning-formatted-text'
const channalName = web.getText(formattedText)
if (channalName.length < 1) {
    while (channalName.length < 1) {
        channalName = web.getText(formattedText)
    }
}

channalName.includes('ACC') ? log.info(`Channel Name: ${channalName}`) : log.info('Channel name wasn\'t generated')

if (web.isExist(`//span[text()="Legacy Channel External Id"]//..//..//lightning-formatted-text[text()="${Legacy_Channel_External_ID}"]`)) {
    if (web.isExist(`//span[text()="Channel Type"]//..//..//lightning-formatted-text[text()="${chosenType}"]`)) {
        if (web.isExist(`//span[text()="Billing Account"]//..//..//a[text()="${Account_Name}"]`)) {
            if (web.isExist(`//span[text()="Channel Number"]//..//..//a[text()="${Channel_Number}"]`)) {
                deleteChannel()
                if (func.getGreenMessage().includes(channalName)) { 
                    log.info(func.getGreenMessage())
                }
            }
        }
    }
} else { assert.fail('The channel wasn\t created') }