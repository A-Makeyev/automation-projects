const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const func = obj.functions
const manager = obj.ribbonManager


web.transaction('01. Initialize Selenium')
web.init()

web.transaction('02. Open Main Page As App User')
startTime = func.getTime()
obj.login(
    obj.users.app_user.username,
    obj.users.app_user.password,
    env.url, 30
)

web.transaction('03. Open Cases Page')
func.navigateToCases()

web.transaction('04. Open New Case')
obj.click(manager.cases.newCase)
web.selectFrame(obj.utils.frames.frame_1) // frame -> #1

web.transaction('05. Create New Plazma Collection Case')
func.createPniya(obj.ID, 'קורונה', 'איסוף פלזמה', 'תיאור כללי', 'down')

obj.click(cases.subSubjectField)
obj.type(cases.subSubjectInput, 'מאשר')
func.pressTAB()

web.transaction('06. Save Case')
func.savePniya()

web.transaction('07. Resolve Case')
func.resolve('טופל')

web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)