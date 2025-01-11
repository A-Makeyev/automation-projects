module.exports = {
    createNewWebSuite: (projectName, environmentName, suiteName, caseName, folderName) => {
        const nav = po.nav
        const utils = po.utils
        const func = po.functions

        po.click(nav.tests.suites)
        po.click(utils.projectSelectRow)
        po.click(utils.projectItemOption(projectName))

        po.click(utils.newFolderBtn)
        po.type(utils.newFolderNameInput, folderName)
        po.click(utils.add)

        // create case
        web.rightClick(utils.folderItem(folderName))
        web.clickHidden(utils.createWebCaseBtn) 

        po.type(utils.newCaseOrSuiteNameInput, suiteName)
        po.click(utils.add) 

        if (!web.getText(utils.caseOrSuiteTitle).includes(suiteName)) {
            log.info(`❌ Suite name (${suiteName}) doesn't appear in the title`)
        }
        
        func.chooseBrowser('Chrome', env.browser)

        web.clickHidden(utils.tabList.settings) 
        web.pause(1000)
        po.click(utils.environmentSelectBtn)
        web.pause(1000)
        po.click(`//div[@title="${environmentName}"]`)

        web.clickHidden(utils.tabList.details)
        po.type('id=notes', 'Details about the suite')
    
        po.click(utils.tabList.casesOrTags)
        po.click(utils.addCasesBtn)

        if (!web.isVisible(utils.addCasesWindowHeader)) {
            log.info('❌ Failed to open Add Cases to Suites window')
        } else {
            po.click(utils.addCaseCheckbox(caseName))
            po.click(utils.addSelectedCasesBtn)

            if (web.isVisible(utils.caseItem(caseName), po.shortWait)) {
                log.info(`✔️ Added case ${caseName} to suite`)

                if (web.isVisible(utils.caseItemIncludeNotificationsIsChecked(caseName), po.shortWait)) {
                    po.click(utils.caseItemIncludeNotificationsIsChecked(caseName))
                }

                let checkCaseTries = 10
                while (!web.isVisible(utils.caseItemIsChecked(caseName), po.shortWait)) {
                    po.click(utils.caseItemCheckbox(caseName))
                    web.pause(po.shortWait)
                    if (checkCaseTries > 0) break
                    else checkCaseTries--
                }

            } else {
                assert.fail(`❌ Failed to add case ${caseName} to suite ${suiteName}`)
            }
        }

        po.click(utils.saveChanges)
        log.info(`✔️ Created ${suiteName}`)
    },

    runSuite: (suiteName, caseName) => {
        const utils = po.utils

        if (!web.isVisible(utils.caseItemIsChecked(caseName), po.shortWait)) {
            po.click(utils.caseItemCheckbox(caseName))
            if (web.isVisible(utils.saveChanges, po.shortWait)) {
                po.click(utils.saveChanges)
            }
        }

        po.click(utils.runCaseOrSuite)
        log.info(`Running ${suiteName}`)

        log.info('*************************')
        log.info('* Test Inside CloudBeat *')
        log.info('*************************')

        if (web.isVisible('//div[@class="value initializing"]', po.longWait)) {
            log.info(`*      ${web.getText('//div[@class="value initializing"]')}     *`)
            log.info('*************************')
        }
            
        if (web.isVisible('//div[@class="value running"]', po.longWait)) {
            log.info(`*        ${web.getText('//div[@class="value running"]')}        *`)
            log.info('*************************')
        }

        if (web.isVisible('//div[@class="value pending"]', po.longWait)) {
            if (web.isVisible('//div[@class="value pending"]')) {
                log.info(`*        ${web.getText('//div[@class="value pending"]')}        *`)
                log.info('*************************')
                log.info(`The case is stuck at pending for over ${web.getText('//span[text()="Duration"]//..//div[@class="value"]')}`)
            }
        }
            
        if (web.isVisible('//td[text()="No data"]', po.longWait)) {
            web.refresh()
            if (web.isVisible('//td[text()="No data"]')) {
                log.info(`*        ${web.getText('//td[text()="No data"]')}        *`)
                log.info('The case failed to execute')
                log.info('*************************')
            }
        }

        if (web.isVisible(utils.runCaseOrSuite, po.waitTwoMinutes)) {
            if (web.isVisible(utils.caseStatusLabel, po.shortWait)) {
                var caseStatus = web.getText(utils.caseStatusLabel)
            }
        } 

        if (caseStatus == 'PASSED') {
            log.info('*      Test Passed      *')
            log.info('*************************')
        } else if (caseStatus == 'FAILED') {
            log.info('*      Test Failed      *')
            log.info('*************************')
        } else if (web.isVisible(utils.caseStatusPending, po.shortWait)) {
            log.info('⚠️ Case is stuck at pending')
        } 

        if (web.isVisible(utils.stopRunBtn, po.shortWait)) {
            po.click(utils.stopRunBtn)
        }
    },

}