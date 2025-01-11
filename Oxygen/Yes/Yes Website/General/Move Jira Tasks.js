const fs = require('fs')
const os = require('os')
const path = require('path')
const logsFolderPath = path.join(__dirname, '../Logs/Jira')
const logFilePath = `${logsFolderPath}\\Move Jira Tasks ${po.getCurrentDateAndTime()}.txt`
const pathToXLSX = path.join(__dirname, "../Data/טסטים מהג'ירה הישן.xlsx")
const pathToDownloads = `${os.userInfo().homedir}\\Downloads`
const data = utils.readXlsx(pathToXLSX)

web.init()
 
for (let i = 0; i < data.length; i++) {
    // let val = Object.values(data[i])[0]
    let testName = data[i].__EMPTY
    let csvFilePath = `${pathToDownloads}\\${testName}.csv`
    let val = data[i].__EMPTY
    if (val.includes('XRAY')) {
        log.info(`${'*'.repeat(40)} ${i} of ${data.length} ${'*'.repeat(40)}`)
        let task = moveJiraTask(testName, csvFilePath)
        fs.appendFileSync(logFilePath, `#${i} ${task}`)
        fs.appendFileSync(logFilePath, '\n')
    }
}

function moveJiraTask(xrayTestName, filePath) {
    // step 1 -> download csv from the old jira

    web.open('https://devops.bezeqint.co.il/jira/projects/XRAY/issues')
    // https://devops.bezeqint.co.il/jira/secure/XrayTestStepExportAction!default.jspa?key=XRAY-3192

    if (web.isVisible('id=main-message', po.longWait)) {
        po.click('id=details-button')
        po.click('id=proceed-link')
    }

    if (web.isVisible('id=login-form-username', po.longWait)) {
        web.type('id=login-form-username', 'amakeiv')
        web.type('id=login-form-password', 'Vv1234567')
        po.click('id=login-form-remember-me')
        po.click('id=login-form-submit')
    }

    if (web.isVisible('id=header', po.longWait)) {
        web.type('id=quickSearchInput', xrayTestName)
        po.pressENTER()
    }

    if (web.isVisible(`//a[@data-issue-key="${xrayTestName}"]`)) {
        
        if (web.isVisible('//button[@data-testid="raven-steps-import-export-button" or @data-testid="raven-steps-export-button"]', po.longWait)) {
            po.click('//button[@data-testid="raven-steps-import-export-button" or @data-testid="raven-steps-export-button"]')
            po.click('id=raven-to-csv-link')
            
            if (web.isVisible(`//div[@id="raven-export-step-dialog"]//*[@title="Export ${xrayTestName} Steps to csv"]`)) {
                po.click('id=export-steps-csv-file-submit')
            }
        } else {
            po.log('warning', `Test ${xrayTestName} doesn't have an export file`)
            return `⚠️  Test ${xrayTestName} doesn't have an export file`
        }
    }

    web.pause(po.shortWait)

    // step 2 -> upload csv to the new jira
    if (fs.existsSync(filePath)) {
        po.log('success', `Downloaded case ${xrayTestName} to -> ${filePath}`)
        web.open(`https://yesjira.atlassian.net/jira/core/projects/XRAY/board`)

        if (web.isVisible('id=form-login', po.longWait)) {
            web.type('id=username', 'amakeiv@yes.co.il')
            po.click('id=login-submit')

            if (web.isVisible('//input[@name="loginfmt"]')) {
                web.type('//input[@name="loginfmt"]', 'amakeiv@yes.co.il')
                po.click('//input[@value="Next"]')
                web.type('//input[@name="passwd"]', 'Vv1234567')
                po.click('//input[@value="Sign in"]')

                if (web.isVisible('//div[contains(text(), "Stay signed in?")]')) {
                    po.click('id=KmsiCheckboxField')
                    po.click('//input[@value="Yes"]')
                }
            }
        }

        if (web.isVisible('id=ak-jira-navigation')) {
            web.type('//input[@data-test-id="search-dialog-input"]', xrayTestName)
            po.pressENTER()

            if (web.isVisible(`//a[@href="/browse/${xrayTestName}"]`)) {
                let tries = 30
                while (!web.isVisible('//span[text()="Import" or @aria-label="More"]', po.shortWait)) {
                    web.selectFrame('//iframe[contains(@id, "com.xpandit.plugins.xray__xray-test-details-panel-new")]')
                    if (tries == 0) break
                    else tries--
                }

                let stepsAlreadyExist = web.isVisible('id=test-steps-toolbar', po.shortWait)
                if (stepsAlreadyExist) {
                    po.log('success', `Case ${xrayTestName} already has steps`)
                    return `(i) Case ${xrayTestName} already has steps`
                }

                if (!web.isVisible('//*[@data-testid="xray-loader"]', po.shortWait) && web.isVisible('//span[text()="Import" or @aria-label="More"]', po.shortWait)) {
                    web.scrollToElement('//span[text()="Import" or @aria-label="More"]')
                    po.click('//span[text()="Import" or @aria-label="More"]', true)
                    po.click('//span[contains(text(), "From csv")]', true)
                }

                web.selectFrame('//iframe[contains(@id, "com.xpandit.plugins.xray__manual-steps-import")]')

                let uploadFileAndMapFields = (uploadTries) => {
                    web.fileBrowse('//input[@id="xray-csv-file"]', filePath)
                    let uploadedFile = web.getValue('//input[@id="xray-csv-file"]')
                    if (uploadedFile.includes(`${xrayTestName}.csv`)) {
                        po.log('success', `Case ${xrayTestName} was uploaded successfully`)
                    } else {
                        po.log('error', `There was a problem uploading case ${xrayTestName}`)
                        web.fileBrowse('//input[@id="xray-csv-file"]', filePath)
                    }

                    if (web.isVisible('//input[@name="contains-header" and @value="false"]', po.waitASecond)) {
                        po.click('//input[@name="contains-header" and @value="false"]//..//*[name()="svg"]')
                    }

                    po.click('id=encoding-text-field')
                    for (let i = 0; i < 20; i++) {
                        po.pressBACKSPACE()
                    }

                    po.type('id=encoding-text-field', 'WINDOWS-1255')
                    po.click('//button[@id="next" and not(@disabled)]')

                    if (web.isVisible('id=xray-dialog-container')) {
                        if (web.isVisible('(//span[contains(text(), "�")])[1]', po.shortWait)) {
                            mapFields(uploadTries - 1)
                        }

                        // Action
                        po.click('//div[@id="xray-dialog-container"]//span[contains(text(), "Action")]//..//..//..//div[@name="dropdown"]')
                        po.pressARROW_DOWN()
                        po.pressENTER()
                        
                        // Data
                        po.pressTAB()
                        po.pressSPACE()
                        po.pressARROW_DOWN()
                        po.pressENTER()

                        // Expected Result
                        po.pressTAB()
                        po.pressSPACE()
                        po.pressARROW_DOWN()
                        po.pressENTER()

                        if (web.isVisible('(//div[@id="xray-dialog-container"]//span[contains(text(), "Call Test") or contains(text(), "Call Test Parameters")])[1]', po.shortWait)) {
                            // Call Test
                            po.pressTAB()
                            po.pressSPACE()
                            po.pressARROW_DOWN()
                            po.pressENTER()

                            // Call Test Parameters
                            po.pressTAB()
                            po.pressSPACE()
                            po.pressARROW_DOWN()
                            po.pressENTER()
                        }

                        if (uploadTries == 0) {
                            po.log('error', `Upload file ${xrayTestName} failed`)
                            return `❌ Upload file ${xrayTestName} failed`
                        } else {
                            if (web.isVisible('//div[@id="xray-dialog-container"]//span[contains(text(), "Action")]//..//..//..//div[contains(@class, "singleValue") and text()="Action*"]')
                                && web.isVisible('//div[@id="xray-dialog-container"]//span[contains(text(), "Data")]//..//..//..//div[contains(@class, "singleValue") and text()="Data"]')
                                && web.isVisible('//div[@id="xray-dialog-container"]//span[contains(text(), "Expected Result")]//..//..//..//div[contains(@class, "singleValue") and text()="Expected Result"]')
                            ) {
                                po.click('id=validate')
                            } else {
                                mapFields(uploadTries - 1)
                            }
                        }
                    }
                }
                uploadFileAndMapFields(10)
                
                let message = po.getText('//div[@data-test-id="xray-message-wrapper"]')
                if (message.includes('No problems were found while validating the steps')) {
                    po.click('id=import')
                    web.selectWindow(web.getWindowHandles()[0])
                    web.selectFrame('//iframe[contains(@id, "com.xpandit.plugins.xray__xray-test-details-panel-new")]')
                    if (web.isVisible('id=test-steps-toolbar')) {
                        po.log('success', `Test steps were successfully added to case -> ${xrayTestName}`)
                        return `✔️ Test steps were successfully added to case ${xrayTestName}`
                    }
                } else {
                    po.log('warning', `${message}`)
                    return `⚠️ ${message}`
                }
            }
        }
    } else {
        po.log('error', `${xrayTestName} wasn't downloaded`)
        return `❌ ${xrayTestName} wasn't downloaded`
    }
}
