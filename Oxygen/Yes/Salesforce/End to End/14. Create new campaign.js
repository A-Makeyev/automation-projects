const obj = po
obj.init(env.url, 30)

const utils = obj.utils
const func = obj.functions
const campaigns = obj.campaigns
const controls = campaigns.controls
const CAMPAIGN = `${func.generateName().toUpperCase()} Campaign`
const LIST_API = `API_${Math.random().toString().slice(2, 6)}`
const animationDuration = 2500
const fiterLogic = 'True'

// function deleteList() {
//     try {
//         web.clickHidden(campaigns.controlsBtn)
//     } catch ($) {
//         web.execute(() => {
//             document.evaluate(
//             '//button[@title="List View Controls"]',
//             document,
//             null,
//             XPathResult.FIRST_ORDERED_NODE_TYPE,
//             null
//             ).singleNodeValue.click()
//         })
//     }

//     web.pause(animationDuration)

//     try {
//         web.clickHidden(controls._delete)
//     } catch ($) {
//         web.execute(() => {
//             document.evaluate(
//             '//span[contains(text(), "Delete")]',
//             document,
//             null,
//             XPathResult.FIRST_ORDERED_NODE_TYPE,
//             null
//             ).singleNodeValue.click()
//         })
//     }
//     func.confirmDelete()
// }

web.transaction('Navigate to Campaigns')
web.waitForVisible(obj.home.nav.campaigns)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Campaign/home"]').click()
})

web.transaction('New Campaign List Details')
web.pause(animationDuration)

try {
    web.clickHidden(campaigns.controlsBtn)
} catch ($) {
    web.execute(() => {
        document.evaluate(
        '//button[@title="List View Controls"]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
        ).singleNodeValue.click()
    })
}

web.pause(animationDuration)

try {
    obj.click(campaigns.newBtn)
} catch ($) {
    web.execute(() => {
        document.evaluate(
        '//span[contains(text(), "New")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
        ).singleNodeValue.click()
    })
}

web.pause(animationDuration)

web.assertText('//h2[contains(@class, "title") and contains(@id, "title")]', 'New List View')

// CAMPAIGN NAME //

try {
    web.execute(() => {
        document.evaluate(
        '(//input[contains(@id, "input")])[3]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
        ).singleNodeValue.click()
    })
    web.sendKeys(CAMPAIGN)
} catch ($) {
    obj.type(controls._new.listName, CAMPAIGN)
}

web.pause(animationDuration)

// API NAME //

try {
    web.execute(() => {
        document.evaluate(
        '(//input[contains(@id, "input")])[4]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
        ).singleNodeValue.click()
    })
    web.sendKeys(LIST_API)
} catch ($) {
    obj.type(controls._new.listApiName, LIST_API)
}

web.pause(animationDuration)
obj.click(controls._new.save)

web.transaction('Add Filters')
web.pause(animationDuration)
web.waitForVisible('//div[contains(@class, "panelBody")]')

obj.click(campaigns.addFilter)
obj.click(`//span[text()="${fiterLogic}"]`)
obj.click('//button/span[text()="Done"]')

const chosenValue = web.getText('//span[@class="test-operandsWrapper"]/span')
if (!chosenValue === fiterLogic) {
    assert.fail("Chosen logic didn't appear")
} else {
    obj.click(campaigns.addFilterLogic)

    const textArea = '//textarea[contains(@class, "filterLogicText")]'
    const error = '//div[contains(@class, "filterLogicError")]'
    const footer = '//div[contains(@class, "panelFooter")]'

    if (!web.isExist(textArea)) {
        assert.fail("Filter textarea didn't appear")
    } else {
        obj.type(textArea, 'Hello Text Area')
        obj.click(campaigns.save)
        if (!web.isExist(error)) {
            assert.fail("Error message didn't appear")
        } else {
            obj.click(campaigns.removeAll)
            web.pause(animationDuration)

            if (!web.isExist(footer)) {
                web.transaction('Delete List')
                try {
                    obj.click(campaigns.controlsBtn)
                } catch ($) {
                    web.execute(() => {
                        document.evaluate(
                        '//button[@title="List View Controls"]',
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                        ).singleNodeValue.click()
                    })
                }

                web.pause(animationDuration)

                try {
                    obj.click(controls._delete)
                } catch ($) {
                    web.execute(() => {
                        document.evaluate(
                        '//span[contains(text(), "Delete")]',
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                        ).singleNodeValue.click()
                    })
                }

                obj.click(utils.popUpDeleteBtn)

                if (!func.getGreenMessage().includes('List view deleted')) {
                    log.info('Delete message did not appear')
                } else {
                    web.dispose()
                    assert.pass()
                }

            } else {
                assert.fail("Remove all functionality didn't work")
            }
        }
    }
}