const obj = po
obj.init(env.url, 30)

const utils = obj.utils
const nav = obj.home.nav
const cities = obj.cities
const func = obj.functions
const CITY = `${func.generateName().toUpperCase()} City`
const CODE = generateCode()

function generateCode() {
    let code = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for(let x = 0; x < Math.floor(Math.random() * 7) + 7; x++) { 
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

function deleteCity() {
    web.transaction('Delete Created City')
    obj.click(utils.showMoreActions)
    web.pause(2500)

    obj.click(utils.moreActions_delete)
    func.confirmDelete()

    if (func.getGreenMessage().includes(`City "${CITY}" was deleted.`)) {
        log.info(func.getGreenMessage())
    } else {
        log.info(`${CITY} was not deleted`)
    }
}

web.transaction('Navigate to Cities')
web.waitForExist(nav.moreBtn)

try {
    obj.click(nav.moreBtn)
} catch($) {
    web.execute(() => {
        getElementByXPath = (xpath) => {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        }
        getElementByXPath('//nav[@aria-label="Global Navigation"]//span[text()="More"]').click()
    })
}

obj.click(nav.moreOptions.cities)

web.transaction('New City Details')
obj.click(utils.newBtn)

obj.type(cities.cityName, CITY)
web.pause(2500)
obj.type(cities.cityCode, CODE)
web.pause(2500)

obj.click(utils.save)

web.transaction('Assert Created City')
const createdHeader = web.getText(
    '//slot[@slot="primaryField"]/lightning-formatted-text'
)
const createdCity = web.getText(
    '//span[contains(text(), "City Name")]//..//..//lightning-formatted-text[@data-output-element-id="output-field"]'
)
const createdCode = web.getText(
    '//span[contains(text(), "City Code")]//..//..//lightning-formatted-text[@data-output-element-id="output-field"]'
)


if (!createdHeader.includes(CITY) 
   || !createdCity.includes(CITY)) {
       assert.fail(`${CITY} was not created`) 
} else {
    if (!createdCode.includes(CODE)) {
        assert.fail(`${CODE} was not created`)
    } else {
        deleteCity()
    }
}