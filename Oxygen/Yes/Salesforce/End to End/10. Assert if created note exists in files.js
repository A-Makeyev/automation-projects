const obj = po
obj.init(env.url, 30)

const panel = obj.files.panel

const TITLE = `${obj.functions.generateName()} Note`
const TEXT = 'Lorem ipsum dolor sit amet'

function deletedFileMessage() {
    return web.getText('(//span[contains(@class, "toastMessage")])[1]')
}

web.transaction('Create New Note')
obj.functions.createNewNote(TITLE, TEXT)

web.transaction('Assert if the Note Exists Inside Files')
web.waitForVisible(obj.home.nav.files)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/ContentDocument/home"]').click()
})

web.transaction('Delete the Note')
const note = `//span[@title="${TITLE}"]`
web.waitForVisible(note)

if (!web.isExist(note)) {
    assert.fail(`${TITLE} doesn't exist inside files`)
} else {
    try {
        obj.click(note)
        if (web.getValue(panel.input) !== TITLE) {
            assert.fail(`${TITLE} doesn't match the panel title`)
        } else {
            obj.click(panel._delete)
            web.waitForVisible(obj.utils.popUpDeleteBtn)
            obj.click(obj.utils.popUpDeleteBtn)
            web.pause(2500) 
            if (!deletedFileMessage().includes('Record was deleted')) {
                assert.fail('Note file wasn\'t deleted')
            } 
            assert.pass()
        }
    } catch (e) { log.info(e) }
}