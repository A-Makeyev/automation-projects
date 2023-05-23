const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const func = obj.functions
const manager = obj.ribbonManager


web.transaction('01. Initialize Selenium')
web.init()

web.transaction('02. Open Main Page As Nurse')
startTime = func.getTime()
obj.login(
    obj.users.nurse.username,
    obj.users.nurse.password,
    env.url, 30
)

web.transaction('03. Open Cases Page')
func.navigateToCases()

web.transaction('04. Open New Case')
obj.click(manager.cases.newCase)
web.selectFrame(obj.utils.frames.frame_1) // frame -> #1

web.transaction('05. Create New Case - Korona Info')
func.createPniya(obj.ID, 'קורונה', 'בקשת מידע', 'תיאור כללי', 'up')

obj.click(cases.subSubjectField)
obj.type(cases.subSubjectInput, 'מידע כללי על המחלה והנגיף')
func.pressTAB()

web.transaction('06. Save Case')
func.savePniya()

web.transaction('07. Resolve Case')
func.resolve('טופל')

web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)