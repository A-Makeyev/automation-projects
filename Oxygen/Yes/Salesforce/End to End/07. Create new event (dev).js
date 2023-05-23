/* events are currently available only in dev environment */

const obj = po
obj.init(env.url, 30)
log.info(env)
const EVENT_NAME = `${obj.functions.generateName()} Event`
var thisDay = (obj.functions.getDay(obj.functions.currentDate()))

web.transaction('Create new event')
try {
    web.waitForVisible(obj.home.nav.calendar)
} catch($) {
    assert.fail('Calendar is only available in dev environment')
}

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Event/home"]').click()
})


// new event
web.pause(2500)
web.waitForVisible(obj.utils.newEvent)
obj.click(obj.utils.newEvent)

web.pause(2500)
web.waitForVisible(obj.calendar.newEvent.subject)
obj.type(obj.calendar.newEvent.subject, EVENT_NAME)

// time
web.pause(5000)
web.waitForVisible(obj.calendar.newEvent.startTime)
obj.type(obj.calendar.newEvent.startTime, '00:00')

web.pause(2500)
web.waitForVisible(obj.calendar.newEvent.endTime)
obj.type(obj.calendar.newEvent.endTime, '00:00')

obj.click(obj.utils.save)
web.pause(5000)

web.transaction('Assert created event')
const createdEvent = `//a[@class="subject-link" and text()="${EVENT_NAME}"]`
web.waitForVisible(createdEvent)

if (!web.isExist(createdEvent)) {
    assert.fail('The event was not created')
}

web.transaction('Delete the new event')
web.scrollToElement(createdEvent)
web.point(createdEvent)

web.pause(2500)
web.waitForVisible(obj.calendar.deleteBtn)
obj.click(obj.calendar.deleteBtn)

web.pause(2500)
web.waitForVisible(obj.utils.popUpDeleteBtn)
obj.click(obj.utils.popUpDeleteBtn)
web.pause(2500)
web.dispose()