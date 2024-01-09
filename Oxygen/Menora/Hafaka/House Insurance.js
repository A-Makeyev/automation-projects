const fs = require('fs')
const obj = require('./PageObjects.js')
 
// Choose loop count
const loops = 10
web.init()

const logFileName = `UI Transactions-${getDate()}-${getTimestamp()}.csv`   
function logTransaction(name, startTime, endTime) {
    const logFile = `c:\\temp\\${logFileName}`
    const duration = endTime - startTime
    fs.appendFileSync(logFile, `${name}, ${startTime}, ${duration} \n`)
}

function logScreenshot() {
    try {
        const ss = web.takeScreenshot()
        const ts = (new Date()).getTime()
        const screenshotFileName = `c:\\temp\\screenshot-${ts}.png`
        fs.writeFileSync(screenshotFileName, ss, 'base64')
    }
    catch(e) {
        log.error('Faild to take a screenshot: ' + e.message)
    }
}

function getDate() {
    let today = new Date()
    let day = String(today.getDate()).padStart(2, '0')
    let month = String(today.getMonth()).padStart(2, '0')
    let year = today.getFullYear()
    return `${day}.${month}.${year}`
}

function getTimestamp() {
    return (new Date()).getTime()
}

function getHours() {
    let today = new Date()
    let hours = today.getHours()
    let minutes = today.getMinutes()
    minutes = minutes < 10 ? `0${minutes}` : minutes
    return (hours > 12) ? (`${hours-12}:${minutes}PM`) : (`${hours}:${minutes}AM`)
}

log.info(getDate())

function getTime() {
    return (new Date()).getTime()
}

var agent = '5555555'
var startDate = '555555'
var startTime, endTime

log.info('Start time: ' + getHours() + '\n')
web.transaction('Login')
startTime = getTime()

obj.LOGIN('QA')

endTime = getTime()
logTransaction("01. Login", startTime, endTime)

loopCount(loops)

function loopCount(iterations) {
    for (let i = 1; i <= iterations; i++) {
        try { 
            web.transaction('Form & Actions')
            startTime = getTime()
            
            web.waitForVisible('id=action')
            web.select('id=action', 'value=1')

            obj.click('id=search-branch-by-number')
            obj.click('//ngb-highlight[contains(text(), "22 - ��� �����")]')

            obj.type('id=startDate', startDate)
            obj.pressTAB() 
            // -1000

            web.waitForVisible('id=paymentMethod')
            web.select('id=paymentMethod', 'value=1')
            obj.type('id=search-agent-by-number', agent)

            obj.type('id=paymentCount', '10')
            obj.click('id=underwritingBtn')
            web.pause(5000)

            endTime = getTime() - 6000 // minus the delay
            logTransaction("02. Form & Actions", startTime, endTime)

            web.transaction('New customer')
            startTime = getTime()

            const id_array = ['PDInsId', 'PDInsLastName', 'PDInsFirstName', 'PDInsStreet', 'PDInsCity', 'PDInsMobilePhoneNo', 'PDInsAgentClientNo']
            const details = ['6833602', '�����', '����', '��', '��', '0544987897', '5555']

            for (let c = 0; c < id_array.length; c++) {
                if (c == 4) { 
                    obj.pressTAB()
                    // -1000
                }
                obj.type(`//input[@id="${id_array[c]}"]`, details[c])
            }

            obj.click('id=pd-Button-next')
            web.pause(5000)
            // -5000

            endTime = getTime() - 6000
            logTransaction("03. New customer", startTime, endTime)

            web.transaction('Get clauses')
            startTime = getTime()

            var clauses = web.getElementCount('//div[contains(@class, "clause-card-body")]')
            for (let clause = 1; clause < clauses; clause++) {
                web.waitForVisible(`(//div[contains(@class, "clause-card-body")])[${clause}]`)
            }

            endTime = getTime()
            logTransaction("04. Get clauses", startTime, endTime)

            web.transaction('Section 01-00085')
            startTime = getTime()

            obj.pressENTER()
            obj.pressF8()
            obj.pressENTER()
            // -9000

            web.pause(2000)
            obj.type('(//span[contains(text(), "����")]//..//..//input)[1]', '2')
            obj.type('(//span[contains(text(), "����")]//..//..//input)[2]', '4')
            obj.type('(//span[contains(text(), "����")]//..//..//input)[3]', '50')
            obj.type('//span[contains(text(), "����� ����� ���")]//..//..//input', startDate)
            obj.type('//span[contains(text(), "�� �����")]//..//..//input', '2')

            obj.pressF8()
            obj.pressENTER()
            // -6000

            endTime = getTime() - 17000
            logTransaction("05. Section 01-00085", startTime, endTime)

            web.transaction('Section 01-00090')
            startTime = getTime()

            obj.type('(//span[contains(text(), "����� ����")]//..//..//input)[1]', '500000')
            for (let x = 0; x < 12; x++) {
                if (x == 11) { 
                    for (let y = 0; y < 3; y++) {
                        obj.press_1()
                        obj.pressTAB()
                        // -12000
                    } 
                }
                obj.pressTAB()
                // -11000
            }

            obj.pressF8()
            obj.pressENTER()
            // -6000

            web.pause(5000)

            endTime = getTime() - 34000
            logTransaction("06. Section 01-00090", startTime, endTime)

            web.transaction('Section 01-00200')
            startTime = getTime()

            obj.type('(//span[contains(text(), "�����")]//..//..//input)[1]', '250000')
            obj.type('(//span[contains(text(), "������� �����")]//..//..//input)[1]', '5000')
            obj.type('(//span[contains(text(), "������� �����")]//..//..//input)[2]', '5000')

            for (let x = 0; x < 5; x++) {
                if (x == 0) {
                    for (let y = 0; y < 2; y++) {
                        obj.pressTAB()
                        obj.press_1()
                        // -8000
                    }
                }
                obj.pressTAB()
                // -4000
            }

            obj.pressTAB()
            obj.press_1()
            obj.pressF8()
            obj.pressENTER()
            // - 10000

            web.pause(5000)

            endTime = getTime() - 27000
            logTransaction("07. Section 01-00200", startTime, endTime)

            web.transaction('Section 02-00220')
            startTime = getTime()

            obj.type('(//label[@for="insuranceSum"])[12]//../input', '950000')
            obj.pressF8()
            obj.pressENTER()
            // -6000

            endTime = getTime() - 6000
            logTransaction("08. Section 02-00220", startTime, endTime)
            
            web.transaction('Section 02-00280')
            startTime = getTime()

            for (let x = 0; x < 2; x++) {
                obj.press_1()
                obj.pressTAB()
                // -8000
            } 

            obj.type('(//label[@for="insuranceSum"])[13]//../input', '50000')
            obj.pressF8()
            obj.pressENTER()
            // -6000

            endTime = getTime() - 14000
            logTransaction("09. Section 02-00280", startTime, endTime)
            
            web.transaction('Section 02-00291')
            startTime = getTime()
            obj.pressF8()
            obj.pressENTER()
            // -6000
            endTime = getTime() - 14000
            logTransaction("10. Section 02-00291", startTime, endTime)

            web.transaction('Section 02-00310')
            startTime = getTime()

            obj.type('(//label[@for="insuranceSum"])[16]//../input', '50000')
            obj.pressF8()
            obj.pressENTER()
            // -6000

            endTime = getTime() - 6000
            logTransaction("11. Section 02-00310", startTime, endTime)
            
            web.transaction('Section 02-00406')
            startTime = getTime()

            obj.click('(//label[@for="insuranceSum"])[21]//../input')
            obj.type('(//label[@for="insuranceSum"])[21]//../input', '20000')
            obj.pressF8()
            obj.pressENTER()
            // -6000

            endTime = getTime() - 6000
            logTransaction("12. Section 02-00406", startTime, endTime)
            
            web.transaction('Section 02-01950')
            startTime = getTime()

            obj.type('(//span[contains(text(), "���")]//..//..//input)[1]', '����')
            obj.type('(//label[@for="insuranceSum"])[24]//../input', '10000')
            obj.pressF8()
            obj.pressENTER()
            // -6000

            endTime = getTime() - 6000
            logTransaction("13. Section 02-01950", startTime, endTime)
            
            web.transaction('Section 03-00520')
            startTime = getTime()

            obj.type('(//span[contains(text(), "���� �����:")]//..//..//input)[1]', 'intel core i7')
            obj.type('(//label[@for="insuranceSum"])[29]//../input', '10000')
            obj.pressF8()
            // -3000

            endTime = getTime() - 3000
            logTransaction("14. Section 03-00520", startTime, endTime)

            web.transaction('Summary')
            startTime = getTime()

            web.waitForVisible('id=financialSummaryFormCollapse')
            obj.click('id=standingOrderControl')
            obj.type('id=standingOrderControl', '304260')
            
            endTime = getTime()
            logTransaction("15. Summary", startTime, endTime)

            web.transaction('Finish Policy')
            startTime = getTime()

            obj.click('id=finishBtnId')
            web.waitForVisible('id=finish-overlay-section')
            obj.click('//label[@for="isAgentComfirmedId"]')

            endTime = getTime()
            logTransaction("16. Finish Policy", startTime, endTime)

            web.transaction('Accept')
            startTime = getTime()

            obj.click('id=approveFinishBtnId')
            if (!web.isVisible('id=action')) {
                if (web.isVisible('//h6[contains(text(), "�����")]')) {
                    let error = web.getText('(//div[@class="modal-body"]/div)[1]')
                    assert.fail(error)
                }
            }

            endTime = getTime()
            logTransaction("17. Accept", startTime, endTime)

        } catch(err) {
            logScreenshot()            
            obj.LOGOUT()
            assert.fail(`~~~>>> ${err}`)
        }
        
        log.info(`~~~>>> Finished iteration #${i}`)
    }
}

web.transaction('Logout')
startTime = getTime()
obj.LOGOUT()
endTime = getTime()

logTransaction("17. Logout", startTime, endTime)
log.info('\nEnd time: ' + getHours())