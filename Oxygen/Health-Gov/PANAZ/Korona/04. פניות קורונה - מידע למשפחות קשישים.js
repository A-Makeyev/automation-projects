const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const func = obj.functions
const manager = obj.ribbonManager

function fillField(clickLocator, typeLocator, text) {
    obj.click(clickLocator)
    obj.type(typeLocator, text)
}


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

web.transaction('05. Create New Elderly Family Information Case')
func.createPniya(obj.ID, 'קורונה', 'מידע למשפחות קשישים', 'תיאור כללי', 'down')

obj.click(cases.subSubjectField)
obj.type(cases.subSubjectInput, 'בידוד בתוך המוסד')
func.pressTAB()


fillField(cases.familyContactNameField_corona, cases.familyContactNameInput_corona, 'שם הפונה')
fillField(cases.familyContactIdField_corona, cases.familyContactIdInput_corona, '318844265')
fillField(cases.familyContactPhoneField_corona, cases.familyContactPhoneInput_corona, '0529927749')
fillField(cases.familyContactRelationshipField_corona, cases.familyContactRelationshipInput_corona, 'אבא')
fillField(cases.institutionNameField_corona, cases.institutionNameInput_corona, 'א.ד.נ.מ-דתי צפון')


web.transaction('06. Save Case')
func.savePniya()

web.transaction('07. Resolve Case')
func.resolve('טופל')

web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)