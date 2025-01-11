const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const fun = obj.functions
const manager = obj.ribbonManager
const companyNumber = '999999999'
const companyPniya = '999999999'
const ID = '999999999'


function savePniya() {
    web.selectWindow('title=פניה: פריט פניה חדש')
    obj.click(manager.cases._save)
}

function createNewCase(id, type, team, subject, unit, process) {
    var pniya = fun.getText(`${cases.formSelector}//span[@class="ms-crm-FormSelector"]`)
    if (pniya.includes('קורונה')) {
        obj.click(cases.formSelector)
        obj.click('//span[@title="מידע"]')
        if (web.isAlertPresent()) {
            web.alertAccept()
        }
    } 

    // type
    var selectedType = web.getText(cases.pniyaType)
    while (selectedType !== type) {
        let outerLoops = 0
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
        if (selectedType === type) {
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

    if (web.getText(cases.pniyaType) !== type) {
        while (!web.getText(cases.pniyaType) === type) {
            let loops = 0
            web.pause(1000)
            web.select(caseToSelect, `label=${type}`)
            loops++
            if (web.getText(cases.pniyaType) === type) {
                break
            } else if (loops > 15) {
                break
            }
        }
    }

    obj.click(cases.newContactField)

    // id
    obj.type(cases.newContactInput, id)
    fun.pressTAB()

    // team
    obj.click(cases.handlingTeamField)
    obj.type(cases.handlingTeamInput, team)
    fun.pressTAB()

    // subject
    obj.type(cases.subSubjectInput, subject)
    fun.pressTAB()
    
    // unit
    if (web.isVisible(cases.unitField)) {
        obj.click(cases.unitField)
        web.execute(() => {
            document.getElementById('el_id_businessunit_status').click()
        })
    
        obj.type(cases.unitInput, unit)
        fun.pressTAB()
    }

    // process
    if (web.isVisible(cases.processInput)) {
        obj.type(cases.processInput, process)

        var checkList = web.getText(cases.checkList)
        if (checkList.length < 1) {
            let loops = 0
            while (checkList.length < 1) {
                checkList = web.getText(cases.checkList)
                loops++
                if (loops > 15) {
                    break
                }  
            }
        }

        obj.click(cases.descriptionField)
        obj.type(cases.descriptionInput, checkList)

    } else {
        obj.click(cases.descriptionField)
        obj.type(cases.descriptionInput, '.1.2.3.')
    }
}


web.transaction('01. Initialize Selenium')
web.init()


web.transaction('02. Open Main Page As App User')
startTime = fun.getTime()
obj.login(
    obj.users.app_user.username,
    obj.users.app_user.password,
    env.url, 30
)


web.transaction('03. Open Cases Page')
fun.navigateToCases()


web.transaction('04. Open Cases Page')
obj.click(manager.cases.newCase)
web.selectFrame(utils.frames.frame_1) // frame -> #1


web.transaction('05. Create New Case')
createNewCase(
    ID, 
    'בירור סטאטוס',
    'מרב"ד- תל אביב', 
    'בירור סטטוס בתהליך', 
    'המכון הרפואי לבטיחות בדרכים', 
    'סטאטוס תיק מרבד'
)


web.transaction('06. Save Case')
savePniya()

web.selectFrame(utils.frames.frame_1) // frame -> #1

if (!fun.getText('//*[@id="el_id_subjectmain_type_lookupValue"]') === 'מידע מינהלי במערכת הבריאות') {
    assert.fail('לא הוצג מידע מינהלי במערכת הבריאות')
} 


web.transaction('07. Get Patient Name & Pniya Number')
var patientName = web.getText(cases.contactName)
if (patientName.length < 1) {
    let loops = 0
    while (patientName.length < 1) {
        patientName = web.getText(cases.contactName)
        loops++
        if (loops > 15) {
            break
        }  
    }
}

web.waitForExist(cases.pniyaNumber)
assert.equal(web.isExist(cases.pniyaNumber), true)

/* GET PNIYA */
var pniyaNumber = fun.getText(cases.pniyaNumber)
var pniyaIsNumeric = pniyaNumber.match(/\d+/g)

if (pniyaIsNumeric == null || pniyaIsNumeric.includes('פריט פניה חדש')) {
    let loops = 0
    while (pniyaIsNumeric == null) {
        web.pause(1000)
        pniyaNumber = fun.getText(cases.pniyaNumber)
        pniyaIsNumeric = pniyaNumber.match(/\d+/g)
        loops++
        if (loops > 15) {
            break
        }
    }
}

log.info(`פניה: ${pniyaNumber}`)


web.transaction('08. Open Information Window')
web.selectWindow(`title=פניה: ${pniyaNumber}`)
obj.click(manager.moreOptionsBtn)
obj.click(manager.cases.moreOptions.showInfo)

web.isAlertPresent() ? 
    assert.fail('לא ניתן להפעיל את השירות המבוקש - התקבלה שגיאה בקריאה למרבד') 
    : 
    web.selectWindow(`title=נבדק: ${patientName}`)


web.transaction('09. Validate Information')
web.selectFrame(utils.frames.frame_0) // frame -> #0

var displayedName = web.getText('(//label[@data-for-id="firstname_label"])[1]')
if (displayedName.length < 1) {
    let loops = 0
    while (displayedName.length < 1) {
        displayedName = web.getText('(//label[@data-for-id="firstname_label"])[1]')
        loops++
        if (loops > 30) {
            break
        }  
    }
}

var displayedID = web.getText('//label[@data-for-id="governmentid_label"]')
if (displayedID.length < 1) {
    let loops = 0
    while (displayedID.length < 1) {
        displayedID = web.getText('//label[@data-for-id="governmentid_label"]')
        loops++
        if (loops > 15) {
            break
        } 
    }
}

if (displayedName !== patientName) {
    assert.fail(`${displayedName} doesn't match ${patientName}`)
} else {
    if (displayedID !== ID) {
        assert.fail(`${displayedID} doesn't match ${ID}`)
    } else {
        web.closeWindow()
    }
}


web.transaction('10. Open Resolve Window')
web.selectWindow(`title=פניה: ${pniyaNumber}`)
obj.click(manager.cases.resolve)

web.selectFrame(utils.frames.dialogFrame) // frame -> dialog

obj.click(utils.resolveField)
obj.type(utils.resolveInput, 'טופל')


web.transaction('11. Resolve')
obj.click(utils.finishDialog)

web.selectWindow()
web.selectFrame(utils.frames.frame_1) // frame -> #1

web.waitForExist('//div[contains(text(), "מצב נפתר")]')
assert.equal(web.isVisible('//div[contains(text(), "מצב נפתר")]'), true)

const status = fun.getText(utils.status)

status === 'נפתר' ? 
    log.info(`Pniya ${pniyaNumber} finished with status: ${status}`) 
    : 
    assert.fail('האירוע לא נפתר')


web.transaction('12. Open New Case Page')
web.selectWindow()
fun.navigateToCases()
obj.click(manager.cases.newCase)
web.selectFrame(utils.frames.frame_1) // frame -> #1


web.transaction('13. Fill Case Details')
web.pause(2500)
web.waitForExist(cases.selectCase)
web.select(cases.selectCase, 'label=בירור סטאטוס')

var customer = web.getText('//label[@id="סוג לקוח_label"]')
if (customer.length < 1) {
    let loops = 0
    while (customer.length < 1) {
        customer = web.getText('//label[@id="סוג לקוח_label"]')
        loops++
        if (loops > 15) {
            break
        } 
    }
}

if (customer.includes('איש קשר')) {
    obj.click(cases.custumerType)
}

obj.click(cases.companyField)
obj.type(cases.companyInput, companyNumber)
fun.pressTAB()

// get company name
var companyName = web.getText(cases.companyName)
if (companyName.length < 1) {
    let loops = 0
    while (companyName.length < 1) {
        companyName = web.getText(cases.companyName)
        loops++
        if (loops > 15) {
            break
        } 
    }
}

log.info('Company name: ' + companyName)

obj.click(cases.descriptionField)
obj.type(cases.descriptionInput, 'Regression Test')
fun.pressTAB()

obj.type(cases.handlingTeamInput, 'אמ"ר')
fun.pressTAB()

obj.type(cases.subSubjectInput, 'רישום אמ"ר')
fun.pressTAB()

if (!web.getText('//*[@id="el_id_subjectmain_type_lookupValue"]') === 'רישוי במערכת הבריאות') {
    assert.fail('לא הוצג רישוי במערכת הבריאות')
}

obj.click(cases.unitField)
// web.execute(() => {
//     document.getElementById('el_id_businessunit_status').click()
// })


obj.type(cases.unitInput, 'אמ"ר')
fun.pressTAB()

obj.type(cases.processInput, 'רישום מוצר')
fun.pressTAB()


web.transaction('14. Save Case')
savePniya()


web.transaction('15. Open Information Window')
obj.click(manager.moreOptionsBtn)
obj.click(manager.cases.moreOptions.showInfo)

// health gov 
// empty title window
web.selectWindow('title=')
obj.type('//input[@id="txtIncidentNum"]', companyPniya)


web.transaction('16. Fetch Information')
obj.click('//input[@id="btnAddDoc"]')


web.transaction('17. Validate Information')
if (!web.isVisible('//table[@id="incidentAMRGV"]')) {
    log.info('There is no imformation available')
} else {
    var tableData = []
    const rows = web.getElementCount('//table[@id="incidentAMRGV"]//td')
    for (let td = 1; td <= rows; td++) {
        let loops = 0
        while(web.getText(`(//table[@id="incidentAMRGV"]//td)[${td}]`).length < 1) { 
            web.getText(`(//table[@id="incidentAMRGV"]//td)[${td}]`)
            loops++
            if (loops > 15) {
                break
            } 
        }
        if (web.getText(`(//table[@id="incidentAMRGV"]//td)[${td}]`).length > 1) {
            tableData.push(web.getText(`(//table[@id="incidentAMRGV"]//td)[${td}]`))
        }
    }

    log.info('Table data:')
    log.info(tableData)

    if (tableData[0].includes(companyPniya)) {
        if (tableData[5].includes(companyName)) {
            web.closeWindow()
        }
    } else {
        assert.fail(`
            ${tableData[0]} doesn't match ${companyPniya}
            ${tableData[5]} doesn't match ${companyName}
        `)
    }
}

web.dispose('Passed')
endTime = fun.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)