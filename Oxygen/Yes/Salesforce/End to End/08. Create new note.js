const obj = po
obj.init(env.url, 30)

const notes = obj.notes
const TITLE = `${obj.functions.generateName()} Note`
const TEXT = `Lead email: ${obj.functions.generateEmail()}`

function pressENTER() {
    web.pause(1500)
    web.sendKeys('\uE007')
    web.pause(1500)
}

web.transaction('Create New Note')
web.waitForVisible(obj.home.nav.notes)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/ContentNote/home"]').click()
})

obj.click(obj.utils.newBtn)
web.pause(2500)
obj.type(notes.title, TITLE)
obj.click(notes.textArea)
web.pause(2500)
obj.type(notes.textArea, TEXT)
web.pause(2500)

pressENTER()

if (!web.isVisible(`//h2[contains(@class, "title")]/span[text()="${TITLE}"]`)) {
    obj.click(notes.share)
    web.pause(2500)
    if (!web.isVisible(notes.done)) {
        try {
            web.waitForVisible(notes.done)
        } catch(e) { log.info(e) }
    }
    obj.click(notes.done)
}

web.transaction('Assert Created Note')
var expectedTitle = `//h2[@class="title slds-truncate"]//span[contains(text(), "${TITLE}")]`
var expectedText = `${expectedTitle}//..//..//..//span[contains(text(), "${TEXT}")]`

web.waitForVisible(expectedTitle)
web.waitForVisible(expectedText)

var newTitle = web.getText(expectedTitle)
var newText = web.getText(expectedText)

if (newTitle != TEXT && newText != TEXT) {
    assert.fail(`
         ${newTitle} doesn't match ${TITLE}
         ${newText} doesn't match ${TEXT}
    `)
}

obj.click(expectedTitle)

// web.refresh()

web.transaction('Delete New Note')
web.waitForVisible(notes.deleteBtn)
obj.click(notes.deleteBtn)

web.waitForVisible(obj.utils.popUpDeleteBtn)
obj.click(obj.utils.popUpDeleteBtn)
web.dispose()