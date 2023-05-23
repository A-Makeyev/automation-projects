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

web.transaction('05. Create New Clinic Exceptions Case')
func.createPniya(obj.ID, 'קורונה', 'חריגת קופ"ח', 'תיאור כללי', 'down')

obj.click(cases.subSubjectField)
obj.type(cases.subSubjectInput, 'חולה מאומת המבקש לעבור למלונית')
func.pressTAB()

obj.click(cases.sampleDateField_corona)
obj.type(cases.sampleDateInput_corona, func.currentDate())

obj.click(cases.samplePlaceField_corona)
obj.type(cases.samplePlaceInput_corona, 'קופת חולים')

if (func.getText('//label[@id="האם פנו לקופה?_label"]') == 'לא') {
    obj.click(cases.clinicEvac_corona)
}

web.transaction('06. Add Insurance Company')
if (!web.isVisible(cases.insuranceCompanyValue, 5000)) {
    obj.click(cases.insuranceCompanyField)
    obj.type(cases.insuranceCompanyInput, 'מכבי')
    func.pressTAB()
}

web.transaction('07. Save Case')
func.savePniya()

web.transaction('08. Resolve Case')
func.resolve('טופל')

web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)