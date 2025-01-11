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

web.transaction('05. Create New Geriatric Institution Information Case')
var pniya = func.getText(`${cases.formSelector}//span[@class="ms-crm-FormSelector"]`)
if (!pniya.includes('קורונה')) {
    obj.click(cases.formSelector)
    obj.click(`//span[@title="קורונה"]`)

    if (web.isAlertPresent()) {
        web.alertAccept()
    }
} 

for (let x = 0; x < 7; x++) {
    obj.click(cases.caseType_corona)
    func.pressARROW_DOWN()   
}
func.pressENTER()

obj.click(cases.contactIdField_corona)
if (func.getValue(cases.contactIdInput_corona) == '') {
    func.fillField(
        cases.contactIdField_corona,
        cases.contactIdInput_corona,
        obj.ID
    )
}

func.fillField(
    cases.details_institutionNameField_corona,
    cases.details_institutionNameInput_corona,
    'א.ב. שיקום נתניה'
)

func.fillField(
    cases.continueTreatmentField_corona,
    cases.continueTreatmentInput_corona,
    'בריאות'
)

func.fillField(
    cases.descriptionField,
    cases.descriptionInput,
    'תיאור כללי'
)

func.fillField(
    cases.subSubjectField,
    cases.subSubjectInput,
    'הדרכות קורונה'
)

web.transaction('06. Add Insurance Company')


web.transaction('07. Save Case')
func.savePniya()

web.transaction('08. Resolve Case')
func.resolve('טופל')

web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)