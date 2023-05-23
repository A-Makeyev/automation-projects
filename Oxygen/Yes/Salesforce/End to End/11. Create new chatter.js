const obj = po
obj.init(env.url, 30)

const chatter = obj.chatter
const TEXT = 'Lorem ipsum dolor sit amet'
const postText = '//div[contains(@class, "feedBodyInner")]//span[contains(text(), "")]'

function deletePost(index) {
    const button = `(${postText})[${index}]//..//..//..//..//..//div[contains(@class, "forceChatterOverflowActionMenu")]//button`
    web.waitForVisible(button)
    obj.click(button)
    web.pause(2500)
    try {
        web.waitForVisible('//span[contains(text(), "Delete")]')
        obj.click('//span[contains(text(), "Delete")]')
    } catch(e) { 
        log.info(e)
    }
    obj.functions.confirmDelete()
}

web.transaction('Navigate to Chatter')
web.waitForVisible(obj.home.nav.chatter)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/page/chatter"]').click()
})


const posts = web.getElementCount(postText)
if (posts > 0) {
    web.transaction('Delete Older Posts')
    for (let post = 1; post <= posts; post++) {
        deletePost(post)
    }
}

web.transaction('Create New Post')
web.waitForVisible(chatter.openInput)
obj.click(chatter.openInput)
web.pause(2500)

obj.type(chatter.inputArea, TEXT)
web.waitForVisible(chatter.share)
obj.click(chatter.share)

web.transaction('Assert Created Post')
web.waitForVisible(`(${postText})[1]`)

const createdText = web.getText(`(${postText})[1]`)
if (!createdText.includes(TEXT)) {
    assert.fail(`${TEXT} wasn\'t posted`)
} else {
    deletePost(1)
}