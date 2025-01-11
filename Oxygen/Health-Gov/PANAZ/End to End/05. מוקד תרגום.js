const obj = po
const nav = obj.nav
const utils = obj.utils
const cases = obj.cases
const fun = obj.functions
const manager = obj.ribbonManager


web.transaction('01. Initialize Selenium')
web.init()


web.transaction('02. Open Main Page As Translation Rep')
startTime = fun.getTime()
obj.login(
    obj.users.translation_rep.username,
    obj.users.translation_rep.password,
    env.url,
    30
)


web.transaction('03. Open Cases Page')
fun.navigateToCases()


web.transaction('04. Open New Case')
fun.openNewCase()


web.transaction('05. Select Translation Type')
var pniya = fun.getText(`${cases.formSelector}//span[@class="ms-crm-FormSelector"]`)
if (!pniya.includes('מידע')) {
    obj.click(cases.formSelector)
    obj.click('//span[@title="מידע"]')

    if (web.isAlertPresent()) {
        web.alertAccept()
    }
} 

fun.pressENTER()

var selectedType = web.getText(cases.pniyaType)
if (selectedType.length < 1) {
    let loops = 0
    while (selectedType.length < 1) {
        selectedType = web.getText(cases.pniyaType)
        loops++
        if (loops > 15) {
            break
        } 
    }
}

if (selectedType !== 'פניית תרגום') {
    log.info('הפניה לא נפתחה כפניית תרגום')

    let outerLoops = 0
    while (selectedType !== 'פניית תרגום') {
        fun.pressARROW_DOWN()
        selectedType = web.getText(cases.pniyaType)
        if (selectedType.length < 1) {
            let innerLoops = 0
            while (selectedType.length < 1) {
                selectedType = web.getText(cases.pniyaType)
                innerLoops++
                if (innerLoops > 15) {
                    break
                }
            }
        }

        if (selectedType === 'פניית תרגום') {
            break
        } else {
            obj.click(cases.caseType)
            fun.pressARROW_DOWN()
        }
        outerLoops++
        if (outerLoops > 15) {
            break
        }
    }
}


web.transaction('06. Select French Language')
for (let x = 0; x < 4; x++) {
    fun.pressARROW_DOWN()
}
fun.pressENTER()


var lang = web.getText(cases.languageLabel)
if (lang.length < 1) {
    let loops = 0
    while (lang.length < 1) {
        lang = web.getText(cases.languageLabel)
        loops++
        if (loops > 15) {
            break
        }
    }
}


if (lang !== 'צרפתית') {
    let outerLoops = 0
    while (lang !== 'צרפתית') {
        obj.click(cases.language)
        fun.pressARROW_DOWN()
        fun.pressENTER()
        lang = web.getText(cases.languageLabel)
        if (lang.length < 1) {
            let innerLoops = 0
            while (lang.length < 1) {
                lang = web.getText(cases.languageLabel)
                innerLoops++
                if (innerLoops > 15) {
                    break
                }
            }
            outerLoops++
            if (outerLoops > 15) {
                break
            }
        }
    }
}

log.info(lang)


web.transaction('07. Fill In Details')
obj.click(cases.responsibleContactField)
obj.type(cases.responsibleContactInput, 'לא מזוהה')
fun.pressTAB()

obj.click(cases.descriptionField)
obj.type(cases.descriptionInput, 'תיאור כללי')

obj.click(cases.medicalType)
for (let x = 0; x < 3; x++) {
    fun.pressARROW_DOWN()
}
fun.pressENTER()

obj.click(cases.clinic)
for (let x = 0; x < 2; x++) {
    fun.pressARROW_DOWN()
}
fun.pressENTER()

var agreement = web.getText(cases.patientAgreement)
if (agreement.length < 1) {
    let loops = 0
    while (agreement.length < 1) {
        agreement = web.getText(cases.patientAgreement)
        loops++
        if (loops > 15) {
            break
        }
    }
}


if (agreement !== 'אישור') {
    obj.click(cases.patientAgreementField)
    log.info('אישור לא היה הערך הדיפולטיבי')
}


web.transaction('06. Select French Language')
fun.savePniya()


web.transaction('07. Open Resolve Window')
obj.click(manager.cases.resolve)

web.selectFrame(utils.frames.dialogFrame)
obj.click(utils.resolveField)

obj.type(utils.resolveInput, 'טופל')


web.transaction('08. Resolve Case')
obj.click(utils.finishDialog)

web.dispose('Passed')
endTime = fun.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)