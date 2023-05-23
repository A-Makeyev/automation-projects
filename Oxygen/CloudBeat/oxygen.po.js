module.exports = {
    
    shortWait: 3000,
    longWait: 9000,
    
    login: (url, t, user, pass) => {
        web.transaction('01. Initialize')
        web.init()
        web.setTimeout(t * 1000)
        log.info(`>>> Env: ${env.name}`)

        let windowWidth = web.execute(() => { return window.innerWidth })
        let windowHeight = web.execute(() => { return window.innerHeight })
        windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

        web.transaction('02. Open Login Page')
        web.open(url)
        web.waitForText(po.loginPage.header, 'Sign In')

        web.transaction('03. Login')
        web.type(po.loginPage.emailInput, user)
        web.type(po.loginPage.passwordInput, pass)
        web.click(po.loginPage.submitBtn)

        let tries = 5
        while (!web.isVisible(po.nav.header, po.shortWait) || tries == 0) {
            web.click('(//section[@id="loginForm"]//li//a)[1]')
            tries--
        }
    },

    functions: {
        currentDate: () => {
            let today = new Date()
            let dd = String(today.getDate()).padStart(2, "0")
            let mm = String(today.getMonth() + 1).padStart(2, "0")
            let yyyy = today.getFullYear()
            return `${dd}/${mm}/${yyyy}`
        },

        getDay: (date) => {
            let day = date.slice(0, 2)
            return day < 10 ? day.substr(1) : day
        },

        getTime: () => {
            return (new Date()).getTime()
        },

        generateNumber: () => {
            return Math.random().toString().slice(2, 7)
        },

        generateEmail: () => {
            let names = ['adrian', 'donald', 'anatoly', 'victoria', 'cody', 'gali']
            let domains = ['gmail', 'hotmail', 'yahoo', 'live', 'gmx']
            return names[Math.floor(Math.random() * domains.length)]
            + '@' + domains[Math.floor(Math.random() * domains.length)] + '.com' 
        },

        pressTAB: () => {
            web.sendKeys('\uE004')
        },
        pressENTER: () => {
            web.sendKeys('\uE007')
        },
        pressARROW_DOWN: () => {
            web.sendKeys('\uE015')
        },
        pressARROW_UP: () => {
            web.sendKeys('\uE013')
        },
        pressBACKSPACE: () => {
            web.sendKeys('\uE003')
        },

        chooseBrowser: (browser, env) => {
             web.clickHidden('//div[text()="Browsers"]')

            if (env == 'EQA2') {
                web.click('//div[@title="Location"]')
                web.pause(po.shortWait)

                web.click('//li[@label="EQA2"]')
                web.click('(//div[normalize-space()="EQA2"]//..//span[@class="ant-checkbox-inner"])[1]')
            } else {
                web.click(
                    '(//span[normalize-space()="' + browser + '"]'
                    + '//..//..//div[text()="' + env + '"]'
                    + '//..//..//span[@class="ant-checkbox-inner"])[1]'
                )
            }
        },

        deleteProject(project) {
            web.clickHidden(po.nav.projects.projects)
            web.rightClick(`//span[@class="nodeText" and @title="${project}"]`)
            web.click(`//span[@title="${project}"]//..//..//..//..//span[@id="context-delete"]`)

            web.waitForVisible(po.utils.confirm)
            web.click(po.utils.Delete)
            web.pause(po.shortWait)
            
            if (!web.isVisible(`//span[@class="nodeText" and @title="${project}"]`)) {
                log.info(`Deleted ${project}`)
            } else {
                log.info(`There was a problem with deleting ${project}`)
            }
        }
    }, /* end of functions */

    /* locators */

    loginPage: {
        emailInput: 'id=login_form_email',
        passwordInput: 'id=login_form_password',
        submitBtn: 'id=log-in-btn',
        header: '//div[contains(@class, "header")]//span',
    },

    nav: {
        header: '//header[contains(@class, "the-header")]',

        menuList: (list) => {
            return `//span[@class="the-menu__list-text" and text()="${list}"]`
        },

        menuItem: (item, index) => {
            return `(//li[@class="ant-menu-item"]/a[text()="${item}"])[${index}]`
        },

        tests: {
            cases: 'id=go-to-cases',
            suites: 'id=go-to-suites',
            activeRuns: 'id=go-to-runs',
            results: 'id=go-to-results',
            apps: 'id=go-to-apps',
        },

        projects: {
            projects: 'id=go-to-projects',
            environments: 'id=go-to-environments',
            releases: 'id=go-to-releases',
        },

        reports: {
            projects: 'id=go-to-reports-projects',
            environments: 'id=go-to-reports-environments',
            releases: 'id=go-to-reports-releases',
        },
        
    }, /* end of nav */

    projectsPage: {
        gitProjectBtn: '//input[@name="Git"]',
        gitUrlInput: 'id=URL',
        gitBranchInput: 'id=Branch name',
        gitNameInput: 'id=name',
        gitPasswordInput: 'id=password',
        gitSyncBtn: '//button/span[text()="Git synchronization"]',
    },

    utils: {
        run: '//span[@id="run-now-btn"]',
        add: '//button/span[text()="Add"]',
        next: '//button/span[text()="Next"]',
        close: '//button/span[text()="Close"]',
        Delete: '//button/span[text()="Delete"]',
        confirm: '//div[contains(text(), "Confirm")]',
        saveEnv: '//button[@id="env-save-changes-btn"]',
        saveChanges: '//button/span[text()="Save Changes"]',
        finish: '//button/span[contains(text(), "Finish")]',
        addProject: '//button[contains(@class, "add-proj")]',
        addEnvironment: '//button[@id="add-environment-btn"]',
    }

}
