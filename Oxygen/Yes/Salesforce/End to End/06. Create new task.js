const obj = po
obj.init(env.url, 30)

const TASK_NAME = `${obj.functions.generateName()} Task`

web.transaction('Create new task')
web.waitForVisible(obj.home.nav.tasks)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Task/home"]').click()
})


// new task
web.pause(2500)
web.waitForVisible(obj.tasks.newTask.moreOptionsBtn)
obj.click(obj.tasks.newTask.moreOptionsBtn)

web.pause(2500)
web.waitForVisible(obj.tasks.newTask._new)
obj.click(obj.tasks.newTask._new)

web.pause(5000)
web.waitForVisible(obj.tasks.newTask.subject)
obj.type(obj.tasks.newTask.subject, TASK_NAME)

web.pause(2500)
web.waitForVisible(obj.utils.save)
obj.click(obj.utils.save)
web.pause(2500)

web.transaction('Assert created task')
const createdTask = `//div[contains(@class, "slds-page-header__title")]//span[contains(text(), "${TASK_NAME}")]`
web.waitForVisible(createdTask)

if (!web.isExist(createdTask)) {
    assert.fail('The task was not created')
}

web.transaction('Delete the new task')
web.waitForVisible(obj.utils.deleteBtn)
obj.click(obj.utils.deleteBtn)

web.waitForVisible(obj.utils.popUpDeleteBtn)
obj.click(obj.utils.popUpDeleteBtn)
web.pause(2500)
web.dispose()