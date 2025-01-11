const obj = require('../oxygen.po.js')

const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const fun = obj.functions
const manager = obj.ribbonManager

function addBusinessDays(days) {
/*  adds business days to current date 
 *  sunday is a day off in a global week  
 *  meanwhile in israel it is not 
 */
    let globalWeek = 6
    let israeliWeek = 5
    let now = new Date()
    let dayOfTheWeek = now.getDay()
    let calendarDays = days
    let deliveryDay = dayOfTheWeek + days
    if (deliveryDay >= israeliWeek) {
        days -= israeliWeek - dayOfTheWeek
        calendarDays += 2
        deliveryWeeks = Math.floor(days / israeliWeek)
        calendarDays += deliveryWeeks * 2
    }
    now.setTime(now.getTime() + calendarDays * 24 * 60 * 60 * 1000)

    let dd = String(now.getDate()).padStart(2, "0")
    let mm = String(now.getMonth() + 1).padStart(2, "0")
    let yyyy = now.getFullYear()

    return dd + '/' + mm + '/' + yyyy
}

function getTime() {
    return (new Date()).getTime()
}

function deleteCase() {
    obj.click(manager.cases._delete)
    fun.closeDialogFrame()
    web.selectWindow()
}

function navigateToCases() {
    obj.click(nav.workPlaceArrow)
    obj.click(nav.workPlaceOptions.cases)
}

function closeTask() {
    web.selectWindow()
    
    if (web.isAlertPresent()) {
        web.alertAccept()
        web.selectWindow()
    } 

    obj.click(manager.tasks.dismissTask)
    web.pause(3000)
    web.execute(() => {
        document.evaluate(
            '//span[@command="task|NoRelationship|Form|Mscrm.Form.CloseActivity"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue.click()
    })
   
    web.selectFrame(utils.frames.dialogFrame)
    obj.click(utils.finishDialog)
    web.selectWindow()
}

function createCase() {
    obj.click(manager.cases.newCase)
    web.selectFrame(utils.frames.frame_1) // frame -> #1

    var pniya = fun.getText(`${cases.formSelector}//span[@class="ms-crm-FormSelector"]`)
    if (pniya.includes('קורונה')) {
        obj.click(cases.formSelector)
        obj.click('//span[@title="מידע"]')
        if (web.isAlertPresent()) {
            web.alertAccept()
        }
    } 

    web.pause(3000)
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

    if (selectedType !== 'בקשת מידע') {
        while (selectedType !== 'בקשת מידע') {
            let outerLoops = 0
            fun.pressARROW_UP()

            selectedType = web.getText(cases.pniyaType)
            while (selectedType.length < 1) {
                let innerLoops = 0
                selectedType = web.getText(cases.pniyaType)
                innerLoops++
                if (innerLoops > 15) {
                    break
                }
            }

            if (selectedType === 'בקשת מידע') {
                break
            } else {
                obj.click(cases.caseType)
                fun.pressARROW_UP()
            }

            outerLoops++
            if (outerLoops > 15) {
                break
            }
        }
    }

    obj.click(cases.newContactField)
    obj.type(cases.newContactInput, obj.ID)
    fun.pressTAB()

    obj.click(cases.descriptionField)
    obj.type(cases.descriptionInput, 'Regression Test')
    fun.pressTAB()

    obj.type(cases.handlingTeamInput, 'אמ"ר')
    fun.pressTAB()

    obj.type(cases.subSubjectInput, 'רישום אמ"ר')
    fun.pressTAB()

    if (!fun.getText('//*[@id="el_id_subjectmain_type_lookupValue"]') === 'רישוי במערכת הבריאות') {
        assert.fail('לא הוצג רישוי במערכת הבריאות')
    } else {
        // Exit iframe to access ribbon manager
        web.selectWindow('title=פניה: פריט פניה חדש')

        // Save
        obj.click(manager.cases._save)
    }
}

function findPniya(number) {
    web.selectFrame(utils.frames.frame_0) // frame -> #0
    web.waitForExist('//div[@id="crmGrid_gridBodyContainer"]')

    var rowIsHidden = true
    const order = '//label[text()="מספר פניה"]'
    const next = '//a[@id="_nextPageImg"]/img'
    const row = `//span[text()="${number}"]`

    obj.click(order)
    if (!web.isExist(row)) {
        let loops = 0
        while (rowIsHidden) {
            obj.click(next)
            if (web.isExist(row)) {
                obj.click(row)
                web.selectWindow()
                obj.click(manager.cases.edit)
                rowIsHidden = false
            }
            loops++
            if (loops > 15) {
                break
            }
        }
    }
    obj.click(row)
    web.selectWindow()
    obj.click(manager.cases.edit)
}

function openNewTask() {
    obj.click(manager.cases.addTask)
    web.selectWindow('title=משימה: פריט משימה חדש')
    web.selectFrame(utils.frames.frame_0) // frame -> #0

    const lookUpValue = '//span[@id="regardingobjectid_lookupValue"]'
    var pniyaInsideNewTask = web.getText(lookUpValue)
    if (pniyaInsideNewTask.length < 1) {
        let loops = 0
        while (pniyaInsideNewTask.length < 1) {
            pniyaInsideNewTask = web.getText(lookUpValue)
            loops++
            if (loops > 15) {
                break
            }
        }
    }
    
    if (pniyaInsideNewTask.includes(pniyaNumber)) {
        web.selectWindow('title=משימה: פריט משימה חדש')
        obj.click(manager.tasks.saveAndClose)
    } else {
        assert.fail(`${pniyaNumber} doesn't exist in new task window`)
    }
}


web.transaction('01. Initialize Selenium')
web.init()

web.transaction('02. Open Main Page As Moked Rep')
startTime = fun.getTime()
obj.login(
    obj.users.moked_rep.username,
    obj.users.moked_rep.password,
    env.url, 30 // --> timeout 
)

web.transaction('03. Open Cases')
navigateToCases()

web.transaction('04. Create New Case')
createCase()

web.selectFrame(utils.frames.frame_1) // frame -> #1
web.waitForExist(cases.pniyaNumber)

/* GET PNIYA */
var pniyaNumber = fun.getText(cases.pniyaNumber)
var pniyaIsNumeric = pniyaNumber.match(/\d+/g)

if (pniyaIsNumeric == null || pniyaIsNumeric.includes('פריט פניה חדש')) {
    let loops = 0
    while (pniyaIsNumeric == null) {
        web.pause(1000)
        pniyaNumber = fun.getText(cases.pniyaNumber)
        pniyaIsNumeric = pniyaNumber.match(/\d+/g)

        // log.info(pniyaNumber)
        // log.info(pniyaIsNumeric)
        // log.info(loops)

        loops++
        if (loops > 15) {
            break
        }
    }
}

log.info(`פניה: ${pniyaNumber}`)

web.transaction('05. Refresh Page And Close Dialog Frame')
fun.refresh()
fun.closeDialogFrame()
web.pause(1500)

web.transaction('06. Open SMS Window')
obj.click(manager.cases.sendSMS)
web.selectFrame(utils.frames.alertFrame)
obj.type(utils.smsTextArea, 'SMS TEST')


web.transaction('07. Send SMS')
obj.click(utils.sendSmsBtn)

const message = fun.getText(utils.popUp)
if (!message.includes('ההודעה נשלחה ללקוח')) {
    log.info('sms לא הופיע הודעת שליחת')
}


web.transaction('08. Assign to Moked BO')
web.selectWindow()

if (!web.isExist(manager.cases.assignToMoked_BO)) {
    deleteCase()
    createCase()
} else {
    obj.click(manager.cases.assignToMoked_BO)
    web.waitForExist(manager.cases.resolve)
}

if (web.isAlertPresent()) {
    let loops = 0
    while(web.isAlertPresent()) {
        web.alertAccept()
        loops++
        if (loops > 15) {
            break
        }
    }
}


web.transaction('09. Dispose Previous Session And Reinitialize Selenium')
web.dispose('Passed')
web.init()


web.transaction('10. Open Main Page As Moked BO')
obj.login(
    obj.users.BO_rep.username,
    obj.users.BO_rep.password,
    env.url, 30
)


web.transaction('11. Open Cases')
navigateToCases()


web.transaction('12. Find Pniya Number')
findPniya(pniyaNumber)
web.selectWindow(`title=פניה: ${pniyaNumber}`)


web.transaction('13. Open New Task')
openNewTask()
web.pause(1500)
web.selectWindow(`title=פניה: ${pniyaNumber}`)


web.transaction('14. Refresh Page')
fun.refresh()


web.transaction('15. Open Incorrect Assignment')
web.selectFrame(utils.frames.frame_0) // frame -> #0
obj.click(cases.incorrectAssignment)

obj.click(cases.assignReasonField)
obj.type(cases.assignReasonInput, 'חוסר פרטים')

fun.pressTAB()
obj.type(cases.reasonDescriptionTextarea, 'יש הרבה סיבות')


web.transaction('16. Assign to Natzig And Update Details')
web.selectWindow()
obj.click(manager.cases.assignToNatzig)

web.selectFrame(utils.frames.frame_0) // frame -> #0

// obj.click(cases.descriptionField)
for (let c = 2; c > 0; c--) {
    web.execute(() => {
        setTimeout(() => {
            document.querySelector('#description').click()
        }, 200)
    })
}

// obj.type(cases.descriptionInput, 'Automation Still Running')
web.execute(() => {
    document.querySelector('#description_i').style.display = 'block'
    document.querySelector('#description_i').value = 'Automation Still Running'
})
fun.pressTAB()


web.selectWindow(`title=פניה: ${pniyaNumber}`)

web.transaction('17. Save Natzig Details')
obj.click(manager.cases._save)

web.transaction('18. Dismiss Task As Moked BO')
// wait for moked BO option to disappear
if (!web.isVisible(manager.cases.assignToMoked_BO)) {
    web.selectWindow()
} else {
    web.waitForNotExist(manager.cases.assignToMoked_BO)
    web.selectWindow()
}


web.transaction('19. Open Tasks Page')
obj.click(nav.pniyaArrow)
obj.click(nav.pniyaOptions.tasks)

// frame #0 -> case tasks frame
web.selectFrame(utils.frames.frame_0, utils.frames.caseTasksFrame) 

obj.click(utils.caseTasks_firstTableRow)


web.transaction('20. Dismiss Current Task')
closeTask()

// back to the case
obj.click(utils.closeBtn)

web.transaction('21. Refresh Page')
fun.refresh()


web.transaction('22. Reassign to Moked BO And Open New Task')
obj.click(manager.cases.assignToMoked_BO)
web.waitForExist(manager.cases.resolve)


web.transaction('23. Open New Task')
openNewTask()
web.pause(1500)
web.selectWindow(`title=פניה: ${pniyaNumber}`)


web.transaction('24. Assign to Handling Team')
obj.click(manager.cases.assignToTeam)
web.isAlertPresent() ? web.alertAccept() : log.info('Assign to Team alert wasn\'t displayed')


web.transaction('25. Dispose Previous Session And Reinitialize Selenium')
web.dispose('Passed')
web.init()


web.transaction('26. Open Main Page As Amar Rep')
obj.login(
    obj.users.amar_rep.username,
    obj.users.amar_rep.password,
    env.url, 30
)


web.transaction('27. Open Cases Page')
navigateToCases()
web.selectFrame(utils.frames.frame_0) // frame -> #0


web.transaction('28. Select Current Pniya')
obj.click(utils.sortByPniyaNumber)
// web.doubleClick('//span[text()="' + pniyaNumber + '"]')

obj.click('(//table[@id="gridBodyTable"]//tbody/tr)[1]')
web.selectWindow()
obj.click(manager.cases.edit)


web.transaction('29. Open Tasks Page')
web.selectWindow()
obj.click(nav.pniyaArrow)
obj.click(nav.pniyaOptions.tasks)

// frame #1 -> case tasks frame
web.selectFrame(utils.frames.frame_1, utils.frames.caseTasksFrame) 


web.transaction('30. Dismiss The Current Open Task')
// select task with status -> open
obj.click(utils.caseTasks_firstTableRowOpen)
obj.click(utils.caseTasks_edit)

closeTask()
obj.click(utils.closeBtn)

// frame #1 -> previous cases frame
web.selectFrame(utils.frames.frame_1, utils.frames.previousCases)


web.transaction('31. Validate SLA Dates')
var SLA_Date = fun.getText(`//td[text()="${pniyaNumber}"]//..//td[12]`)
const errorMessage = `${SLA_Date} is not 2 business days after ${fun.currentDate()}`
log.info('SLA Date: ' + SLA_Date)

if (SLA_Date != addBusinessDays(2)) {
    log.info(errorMessage)
} 

web.selectWindow(`title=פניה: ${pniyaNumber}`)


web.transaction('32. Assign To Moked BO')
obj.click(manager.cases.assignToMoked_BO)

// frame #1 -> previous cases frame
web.selectFrame(utils.frames.frame_1, utils.frames.previousCases)
// web.waitForExist(`//td[text()="${pniyaNumber}"]//..//td[text()="${addBusinessDays(2)}"]`)


web.transaction('33. Validate Current Business Days')
SLA_Date = fun.getText(`//td[text()="${pniyaNumber}"]//..//td[12]`)
if (SLA_Date != addBusinessDays(2)) {
    log.info(errorMessage)
} 


web.transaction('34. Dispose Previous Session And Reinitialize Selenium')
web.dispose('Passed')
web.init()


web.transaction('35. Open Main Page As Moked BO')
obj.login(
    obj.users.BO_rep.username,
    obj.users.BO_rep.password,
    env.url, 30
)


web.transaction('36. Open Cases Page')
navigateToCases()


web.transaction('37. Find Pniya Number')
findPniya(pniyaNumber)
web.selectWindow(`title=פניה: ${pniyaNumber}`)


web.transaction('38. Assign To Natzig')
obj.click(manager.cases.assignToNatzig)

web.selectFrame(utils.frames.frame_1) // frame -> #1
web.waitForVisible(cases.owner)


web.transaction('39. Validate Case Owner')
const caseOwner = fun.getText(cases.owner)
log.info('Owner: ' + caseOwner)


if (!caseOwner.includes('נציג מוקד')) {
    assert.fail('לא הוקצה לנציג מוקד')
} else {
    web.transaction('40. Open Resolve Window')
    web.selectWindow(`title=פניה: ${pniyaNumber}`)
    obj.click(manager.cases.resolve)
    web.selectFrame(utils.frames.dialogFrame) // frame -> dialog

    obj.click(utils.resolveField)
    obj.type(utils.resolveInput, 'טופל')

    web.transaction('41. Resolve Case')
    obj.click(utils.finishDialog)

    web.selectWindow()
    web.selectFrame(utils.frames.frame_1) // frame -> #1
    web.waitForExist('//div[contains(text(), "מצב נפתר")]')

    web.transaction('42. Validate Status')
    var status = web.getText(utils.status)
    if (status.length < 0) {
        let loops = 0
        while(status.length < 0) {
           status = web.getText(utils.status) 
            loops++
            if (loops > 15) {
                break
            }
        }
    }

    log.info('Status: ' + status)

    /* status === 'נפתר' ? assert.pass() : assert.fail('האירוע לא נפתר') */

    if (status.includes('נפתר')) {
        assert.equal(fun.getText(utils.status), 'נפתר')

        web.dispose('Passed')
        endTime = getTime()
		log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)
    } else {
        assert.fail('האירוע לא נפתר')
    }
}
