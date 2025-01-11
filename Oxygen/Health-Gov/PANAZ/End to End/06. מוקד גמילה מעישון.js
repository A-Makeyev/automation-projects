const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const fun = obj.functions
const manager = obj.ribbonManager


web.transaction('01. Initialize Selenium')
web.init()


web.transaction('02. Open Main Page As General User')
startTime = fun.getTime()
obj.login(
    obj.users.general_user.username,
    obj.users.general_user.password,
    env.url, 30
)


web.transaction('03. Open Cases Page')
fun.navigateToCases()


web.transaction('04. Open New Case')
obj.click(manager.cases.newCase)
web.selectFrame(obj.utils.frames.frame_1) // frame -> #1


web.transaction('05. Create New Case - Quit Smoking')
fun.createPniya(obj.ID, 'מידע', 'גמילה מעישון', 'discription', 'down')

obj.click(cases.caseSource)
fun.pressARROW_DOWN()
fun.pressTAB()

obj.click(cases.serviceType)
fun.pressARROW_DOWN()
fun.pressTAB()


web.transaction('06. Assert Handling Team')
assert.equal(web.isVisible(cases.handlingTeamName), true)

var team = web.getText(cases.handlingTeamName)
if (team.length < 1) {
    let loops = 0
    while (team.length < 1) {
        team = web.getText(cases.handlingTeamName)
        loops++
        if (loops > 15) {
            break
        }
    }
}

if (!(team.includes('מוקד גמילה מעישון'))) {
    assert.fail('צוות אחרי לא הוצג כמוקד גמילה מעישון')
} else {
    web.transaction('07. Save')
    fun.savePniya()

    web.transaction('08. Resolve')
    fun.resolve('טופל')
    
    web.dispose('Passed')
    endTime = fun.getTime()
    log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)
}