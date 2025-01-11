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

web.transaction('05. Create New Exceptional Exit From Insulation Case')
var pniya = func.getText(`${cases.formSelector}//span[@class="ms-crm-FormSelector"]`)
if (!pniya.includes('קורונה')) {
    obj.click(cases.formSelector)
    obj.click(`//span[@title="קורונה"]`)

    if (web.isAlertPresent()) {
        web.alertAccept()
    }
} 

web.select(cases.selectCase_corona, 'label=יציאה חריגה מבידוד')

// ID
func.fillField(cases.contactIdField_corona, cases.contactIdInput_corona, obj.ID)

// description
func.fillField(cases.descriptionField, cases.descriptionInput, 'תיאור כללי')

// sub subject -> wedding
func.fillField(cases.subSubjectField, cases.subSubjectInput, 'חתונה, בר/בת מצוה או ברית')

// isolation reason -> verified patient 
func.fillField(cases.isolationRreasonField_corona, cases.isolationRreasonInput_corona, 'חולה מאומת')

// decision -> confirmed
func.fillField(cases.decisionField_corona, cases.decisionInput_corona, 'מאושר')

// handler -> exceptional moked
func.fillField(cases.handlerField_corona, cases.handlerInput_corona, 'מוקד חריגים')


web.transaction('06. Save Case')
func.savePniya()

web.transaction('07. Resolve Case')
func.resolve('טופל')

web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)