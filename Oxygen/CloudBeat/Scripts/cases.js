module.exports = {
    createNewWebCase: (projectName, environmentName, caseName, folderName) => {
        const nav = po.nav
        const utils = po.utils
        const func = po.functions

        web.pause(po.shortWait)
        po.click(nav.tests.cases)

        // choose the current project
        po.click(utils.projectSelectRow)
        po.click(utils.projectItemOption(projectName))

        // create folder
        po.click(utils.newFolderBtn)
        po.type(utils.newFolderNameInput, folderName)
        po.click(utils.add)

        // create case
        web.rightClick(utils.folderItem(folderName))
        web.clickHidden(utils.createWebCaseBtn) 

        po.type(utils.newCaseOrSuiteNameInput, caseName)
        po.click(utils.add) 

        if (!web.getText(utils.caseOrSuiteTitle).includes(caseName)) {
            log.info(`❌ Case name (${caseName}) doesn't appear in the title`)
        }

        function initializeCase() {
            // choose browser
            func.chooseBrowser('Chrome', env.browser)

            // create script
            web.clickHidden(utils.tabList.script)
            po.click(utils.editCaseBtn)
            po.click(utils.viewLinesBtn)

            let loginScript =
            `
                web.transaction('Open Main Page')
                web.init()
                web.open(env.url)
                web.transaction('Log In')

                web.type('id=login_form_email', env.username)
                web.type('id=login_form_password', env.password)
                web.click('id=log-in-btn')
                web.click('//section[@id="loginForm"]//a[contains(text(), "Demo")]')
                
                web.transaction('Assert User')
                web.waitForVisible('//span[contains(@class, "ant-avatar")]//..//span[contains(@class, "ant-typography")]')
                var user = web.getText('//span[contains(@class, "ant-avatar")]//..//span[contains(@class, "ant-typography")]')
                if (!user.includes('${env.name == 'prod' ? 'Anatoly' : 'Roman'}')) assert.fail('Expected logged in user to be "Roman" instead got: ' + user)
                else assert.pass(user + ' logged in successfully')
            `
            
            let httpRequestScript = 
            `
                const url = 'https://jsonplaceholder.typicode.com/posts'
                const headers = { 'Content-type': 'application/json; charset=UTF-8' }

                web.transaction('GET Request')
                var getResponse = http.get(url, headers)
                http.assertStatusOk()
                http.assertStatus(200)
                http.assertHeader('Content-type', 'application/json; charset=UTF-8')

                var user = getResponse.body[0]
                assert.contain(String(user.userId), '1', 'Expected userId to be 1, instead got: ' + user.userId)

                log.info('First User:')
                log.info(user)
                log.info('*'.repeat(50))

                const data = { title: 'foo', body: 'bar', userId: getResponse.body.length + 1 }

                web.transaction('POST Request')
                var postResponse = http.post(url, data, headers)
                http.assertStatus(201)
                http.assertHeader('Content-type', 'application/json; charset=UTF-8')

                var newUser = postResponse.body
                assert.contain(String(newUser.userId), '101', 'Expected new userId to be 101, instead got: ' + newUser.userId)

                log.info('New User:')
                log.info(newUser)
                log.info('*'.repeat(50))

                web.transaction('PUT Request')
                var putResponse = http.put(url + '/1', data, headers)
                http.assertStatus(200)
                var updatedUser = putResponse.body
                assert.contain(updatedUser.title, 'foo', 'Expected updated title to be foo, instead got: ' + updatedUser.title)
                assert.contain(updatedUser.body, 'bar', 'Expected updated body to be bar, instead got: ' + updatedUser.body)

                log.info('Updated First User:')
                log.info(updatedUser)
                log.info('*'.repeat(50))

                web.transaction('PATCH Request')
                const patchData = { title: 'patched' }
                var patchResponse = http.patch(url + '/1', patchData, headers)
                http.assertStatus(200)
                var patchedUser = patchResponse.body
                assert.contain(patchedUser.title, 'patched', 'Expected patched title to be patched, instead got: ' + patchedUser.title)

                log.info('Patched User:')
                log.info(patchedUser)
                log.info('*'.repeat(50))

                web.transaction('DELETE Request')
                var deleteResponse = http.delete(url + '/1')
                http.assertStatus(200)
                var deletedUser = deleteResponse.body

                if (!Object.keys(deletedUser).length === 0) assert.fail('DELETE Request to ' + url + '/1 Failed')

                log.info('Deleted First User:')
                log.info(deletedUser)
                assert.pass()
            `

            web.sendKeys(loginScript)
            // web.sendKeys(httpRequestScript)

            // configure environment
            web.clickHidden(utils.tabList.settings) 
            web.pause(po.waitASecond)
            po.click(utils.environmentSelectBtn)
            web.pause(po.waitASecond)
            po.click(`//div[@title="${environmentName}"]`)

            // details
            web.clickHidden(utils.tabList.details)
            po.type('id=notes', 'Details about the case')

            // save
            po.click(utils.saveChanges)
            log.info(`✔️ Created ${caseName}`)
        }
        initializeCase()

        if (web.isVisible('//div[contains(@class, "network_fetch_errors")]', po.shortWait)) {
            log.info(web.getText('//div[contains(@class, "network_fetch_errors")]'))
            po.click('//span[contains(text(), "Reload")]')
            initializeCase()
        }
    },

    runCase: (caseName) => {
        const utils = po.utils

        po.click(utils.runCaseOrSuite)
        log.info(`Running ${caseName}`)

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
