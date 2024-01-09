const obj = po
const nav = obj.sub_nav
const utils = obj.utils
const func = obj.functions
const patients = obj.patients
const referrals = obj.referrals
const treatments = obj.treatments


function navigateToPatient() {
    obj.click(nav.menuBtn)

    for (let x = 0; x < 2; x++)
        func.pressTAB()

    func.pressARROW_DOWN()
    func.pressSPACE()

    func.pressARROW_DOWN()
    func.pressENTER()

    let loops = 0
    while (!web.isVisible('//span[contains(text(), "נבדק: נבדק- תצוגה מאוחדת")]', 3000)) {
        obj.click(obj.main_nav.home)
        navigateToPatient()

        loops++
        if (loops > 15) {
            assert.fail('There was a problem loading the patient page')
        }
    }
}


obj.init(env.url, 60)
startTime = func.getTime()

web.transaction('Navigate To The Current Patient')
navigateToPatient()

web.transaction('Create New Treatment')
obj.click(patients.list.referralsAndTreatments)
obj.click(patients.addNewStandard_incident)

obj.type(treatments.caseType, 'ביטוח לאומי')
obj.click(utils.searchResult)
obj.click('//li[@aria-label="בדיקות קליניות"]')

obj.click(utils.bottomSaveButton)
func.assertErrorMessage()

endTime = func.getTime()
log.info(
    'Test finished in: ' 
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)
