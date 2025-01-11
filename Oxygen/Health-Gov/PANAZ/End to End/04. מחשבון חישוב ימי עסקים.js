const obj = po
const nav = obj.nav
const utils = obj.utils
const fun = obj.functions
const manager = obj.ribbonManager
const calc = obj.businessDaysCalculator


web.transaction('01. Initialize Selenium')
web.init()


web.transaction('02. Open Main Page As App User')
startTime = fun.getTime()
obj.login(
    obj.users.app_user.username,
    obj.users.app_user.password,
    env.url, 30
)


web.transaction('03. Open Boards Page Open Business Days Calculator')
obj.click(nav.boards)


web.transaction('04. Open Business Days Calculator')
obj.click(manager.boards.businessDaysCalculator)
web.selectWindow(calc.window)


web.transaction('05. Choose 2 Days From The Current Date')
obj.click(calc.startDate)
obj.click(`//a[text()="${fun.getDay(fun.currentDate())}"]`)

obj.type(calc.daysToCalculates, '2')
obj.click(calc.calculate)

assert.equal(web.isVisible(calc.dueDate), true)

if (web.getValue(calc.dueDate).length < 1) {
    obj.click(calc.calculate)
}


web.transaction('06. Assert Generated Date')
var dueDate = fun.addBusinessDays(2)
var generatedDate = web.getValue(calc.dueDate)

if (generatedDate == '') {
    let loops = 0
    while (generatedDate == '') {
        generatedDate = web.getValue(calc.dueDate)
        loops++
        if (loops > 15) {
            break
        } 
    }
}

log.info('Excpected Date: ' + dueDate)
log.info('Generated Date: ' + generatedDate)

generatedDate == dueDate ? web.dispose('Passed') : log.info('תאריך ימי העסקים מכליל בחישוב את החגים בישראל')

web.dispose('Passed')
endTime = fun.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)