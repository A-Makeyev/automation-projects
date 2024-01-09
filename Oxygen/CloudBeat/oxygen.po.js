module.exports = {

    longWait: 10000,
    shortWait: 5000,
    waitASecond: 1000,
    waitTwoMinutes: 120 * 1000,

    click: (e) => {
        web.pause(po.waitASecond)
        web.isVisible(e) ? web.click(e) : web.clickHidden(e)
    },

    type: (e, text) => {
        po.click(e)
        web.type(e, text)
    },

    login: (url, user, pass) => {
        const login = po.loginPage

        web.transaction('01. Initialize')
        web.init()
        log.info(`--> Env: ${env.name}`)

        let windowWidth = web.execute(() => { return window.innerWidth })
        let windowHeight = web.execute(() => { return window.innerHeight })
        windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

        web.transaction('02. Open Login Page')
        web.open(url)
        web.waitForText(login.header, 'Sign In')

        web.transaction('03. Login')
        web.type(login.emailInput, user)
        web.type(login.passwordInput, pass)
        po.click(login.submitBtn)

        let tries = 5
        while (!web.isVisible(po.nav.header, po.shortWait) || tries == 0) {
            po.click(login.demoAccount)
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

        generateNumber: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },

        generateEmail: () => {
            let names = ['talyla', 'anatoly', 'victoria', 'gali']
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
                po.click('//div[@title="Location"]')
                web.pause(po.shortWait)

                po.click('//li[@label="EQA2"]')
                po.click('(//div[normalize-space()="EQA2"]//..//span[@class="ant-checkbox-inner"])[1]')
            } else {
                po.click(
                    '(//span[normalize-space()="' + browser + '"]'
                    + '//..//..//div[text()="' + env + '"]'
                    + '//..//..//span[@class="ant-checkbox-inner"])[1]'
                )
            }
        },
    }, /* end of functions */

    /* locators */

    loginPage: {
        emailInput: 'id=login_form_email',
        passwordInput: 'id=login_form_password',
        submitBtn: 'id=log-in-btn',
        header: '//div[contains(@class, "header")]//span',
        demoAccount: '//section[@id="loginForm"]//a[contains(text(), "Demo")]',
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
            projectsLink: 'id=go-to-projects',
            environmentsLink: 'id=go-to-environments',
            releasesLink: 'id=go-to-releases',
        },

        monitors: {
            monitorsLink: 'id=go-to-monitors',
        },

        reports: {
            projectsLink: 'id=go-to-reports-projects',
            environmentsLink: 'id=go-to-reports-environments',
            releasesLink: 'id=go-to-reports-releases',
        },
        
    }, /* end of nav */

    projectsPage: {
        newProjectNameInput: 'id=new-proj-name',
        gitProjectBtn: '//input[@name="Git"]',
        gitUrlInput: 'id=URL',
        gitBranchInput: 'id=Branch name',
        gitNameInput: 'id=name',
        gitPasswordInput: 'id=password',
        gitSyncBtn: '//button/span[text()="Git synchronization"]',
        testProjects: '//span[@class="nodeText" and contains(@title, "* Test Project")]',
        projectNode: (projectName) => { return `//span[@class="nodeText" and @title="${projectName}"]` },
        confirmDeleteBtn: (projectName) => { return `//span[@title="${projectName}"]//..//..//..//..//span[@id="context-delete"]` }
    },

    environmentsPage: {
        nameInput: 'id=add_suite_form_str',
        projectRow: '//div[contains(@class, "project-row")]',
        savedSuccessfullyMessage: '//span[@class="table-save-success-notify" and contains(text(), "Saved successfully")]',
        dataRowAndCellInput: (row, cell) => { return `//table[@class="table table-bordered"]//tr[${row}]/td[${cell}]` },
        projectItem: (projectName) => { return `//li[contains(@class, "project-item") and text()="${projectName}"]` },
    },

    monitorsPage: {
        webMode: '//div[@title="Web"]',
        testModeSelectInput: '//div[@name="testMode"]',
        addMonitorBtn: '//span[contains(text(), "Add Monitor")]',
        addNewMonitorHeader: '//div[contains(text(), "Add New Monitor")]',
        monitorNameInput: 'id=add_monitor_form_name',
        projectSelectInput: '//div[@name="projectId"]',
        projectSelectOptions: '//div[@class="ant-select-item-option-content"]',
        deleteMonitorBtn: '//span[contains(text(), "Delete Monitor")]',
        addNewMonitorBtn: '//div[contains(text(), "Add New Monitor")]//..//..//span[contains(text(), "Add")]',
        editMonitorBtn: '//h2[contains(@class, "title")]//..//*[name()="svg" and @class="suites-and-cases__icon fake-link"]',
        newGeneralSlaBtn: '//span[contains(text(), "New General SLA")]',
        newSlaHeader: '//div[contains(text(), "New SLA")]', 
        newSlaNameInput: 'id=addedit_sla_form_name',
        newSlaNormalInput: '//label[contains(text(), "Normal")]//..//..//input',
        newSlaWarningInput: '//label[contains(text(), "Warning")]//..//..//input',
        projectSelectOptions: '//div[@class="ant-select-item-option-content"]',
        saveNewSlaBtn: '//div[contains(text(), "New SLA")]//..//..//span[contains(text(), "Save")]',
        newPolicyBtn: '//span[contains(text(), "New Policy")]',
        newPolicyHeader: '//h2[contains(text(), "Add Incident Policy")]',
        newPolicyNameInput: 'id=add_edit_policy_form_name',
        newPolicyRangeInput: 'id=add_edit_policy_form_rangeValue',
        newPolicyThresholdInput: 'id=add_edit_policy_form_thresholdValue',
        saveNewPolicyBtn: '//form[@id="add_edit_policy_form"]//span[contains(text(), "Save")]',
        incidentSeveritySelectInput: '//label[contains(text(), "Incident Severity")]//..//div[@class="ant-select-selector"]',
        testMonitors: '//div[@class="monitor-search-wrap__list-item"]//a[contains(text(), "* Test Monitor")]',
        generalSlaHeader: '//span[@class="ui-section-header-text" and contains(text(), "General SLA")]',
        policyListNoResultsText: '//span[contains(text(), "Incident Policy List")]//..//td[contains(text(), "No results")]',
        newPolicyRangeType: (type) => { return `//div[@id="add_edit_policy_form_rangeType"]//span[contains(text(), "${type}")]` },
        incidentSeverityOption: (option) => { return `//div[@id="add_edit_policy_form_severity_list"]//..//div[@class="ant-select-item-option-content" and text()="${option}"]` },
        monitorHeader: (monitorName) => { return `//h2[contains(@class, "title")]//span[contains(text(), "${monitorName}")]` },
        monitorListItem: (monitorName) => { return `//div[@class="monitor-search-wrap__list-item"]//a[contains(text(), "${monitorName}")]` },
        projectSelectOption: (projectName) => { return `//div[@class="ant-select-item-option-content" and contains(text(), "${projectName}")]` },
        generalSlaNameDataCell: (slaName) => { return `${po.monitorsPage.generalSlaHeader}//..//td[text()="${slaName}"]` },
        generalSlaGoalDataCell: (slaName, goal) => { return `${po.monitorsPage.generalSlaHeader}//..//td[text()="${slaName}"]//..//td[contains(text(), "${goal}")]` },
        generalSlaValues: (slaName, normalValue, warningValue) => { return `${po.monitorsPage.generalSlaNameDataCell(slaName)}//..//span[contains(text(), "OK > ${normalValue}% | Warning > ${warningValue}% | Critical <= ${warningValue}%")]` },
        policyItem: (policyName, rangeType, metric, threshold, severity) => { return `//a[text()="${policyName}"]//..//..//td[contains(text(), "${rangeType}")]//..//td[contains(text(), "${metric}") and contains(., "${threshold}")]//..//td[text()="${severity}"]` },
        policyItemName: (policyName) => { return `//a[text()="${policyName}"]` },
        policyItemRangeType: (policyName, rangeType) => { return `${po.monitorsPage.policyItemName(policyName)}//..//..//td[contains(text(), "${rangeType}")]` },
        policyItemMetricAndThreshold: (policyName, rangeType, metric, threshold) => { return `${po.monitorsPage.policyItemRangeType(policyName, rangeType)}//..//td[contains(text(), "${metric}") and contains(., "${threshold}")]` },
        policyItemSeverity: (policyName, rangeType, metric, threshold, severity) => { return `${po.monitorsPage.policyItemMetricAndThreshold(policyName, rangeType, metric, threshold)}//..//td[text()="${severity}"]` },
        deletePolicyItemBtn: (policyItem) => { return `${policyItem}//..//span[@class="anticon anticon-delete"]` },
    },

    utils: { 
        tabList: {
            results: '//div[@class="ant-tabs-tab-btn" and text()="Results"]',
            notifications: '//div[@class="ant-tabs-tab-btn" and text()="Notifications"]',
            schedule: '//div[@class="ant-tabs-tab-btn" and text()="Schedule"]',
            parameters: '//div[@class="ant-tabs-tab-btn" and text()="Parameters"]',
            reportsAndAlerts: '//div[@class="ant-tabs-tab-btn" and text()="Reports & Alerts"]',
            browsers: '//div[@class="ant-tabs-tab-btn" and text()="Browsers"]',
            script: '//div[@class="ant-tabs-tab-btn" and text()="Script"]',
            cases: '//div[@class="ant-tabs-tab-btn" and text()="Cases"]',
            settings: '//div[@class="ant-tabs-tab-btn" and text()="Settings"]',
            details: '//div[@class="ant-tabs-tab-btn" and text()="Details"]',
            casesOrTags: '//div[@class="ant-tabs-tab-btn" and text()="Cases or Tags"]',
            sla: '//div[@class="ant-tabs-tab-btn" and text()="SLA"]',
            runtime: '//div[@class="ant-tabs-tab-btn" and text()="Runtime"]',
            tags: '//div[@class="ant-tabs-tab-btn" and text()="Tags"]',
            policies: '//div[@class="ant-tabs-tab-btn" and text()="Policies"]',            
        },

        runCaseOrSuite: 'id=run-now-btn',
        add: '//button/span[text()="Add"]',
        next: '//button/span[text()="Next"]',
        close: '//button/span[text()="Close"]',
        deleteBtn: '//button/span[text()="Delete"]',
        confirm: '//div[contains(text(), "Confirm")]',
        saveEnv: '//button[@id="env-save-changes-btn"]',
        saveChanges: '//button/span[text()="Save Changes"]',
        finish: '//button/span[contains(text(), "Finish")]',
        addProject: '//button[contains(@class, "add-proj")]',
        addEnvironment: '//button[@id="add-environment-btn"]',
        addCasesBtn: '//button//span[contains(text(), "Add Cases")]',
        confirmWindowHeader: '//div[contains(text(), "Please Confirm")]',
        editCaseBtn: '//span[text()="Edit"]',
        viewLinesBtn: '//div[contains(@class, "view-lines")]',
        caseStatusLabel: '(//span[contains(@class,"ui-label")])[1]',
        caseStatusPending: '//div[contains(text(), "Pending")]',
        stopRunBtn: '//button[contains(@class, "btn-danger")]',
        projectSelectRow: '//div[contains(@class, "project-row")]',
        newFolderBtn: '//a[contains(text(), "new folder")]',
        newFolderNameInput: 'id=new_folder_form_str',
        createWebCaseBtn: 'id=context-add-web',
        newCaseOrSuiteNameInput: 'id=add_suite_form_str',
        caseOrSuiteTitle: '//h2[@class="ant-typography suites-and-cases__title"]',
        environmentSelectBtn: '//span[text()="Environments"]//..//span[@class="ant-select-selection-item"]',
        addCasesWindowHeader: '//div[contains(text(), "Add Cases")]',
        addSelectedCasesBtn: '//div[@class="ant-modal-content"]//button//span[contains(text(), "Add")]',
        runMonitorBtn: '//span[@class="ant-dropdown-menu-title-content"]//span[contains(text(), "Run")]',
        confirmYesBtn: '//div[contains(text(), "Please Confirm")]//..//..//button//span[contains(text(), "Yes")]',
        casesAndMonitorsMenu: '//div[@class="suites-and-cases__btn-wrapper"]//button[contains(@class, "ant-dropdown-trigger")]',
        noticeMessage: '//div[@class="ant-message-notice-content"]',
        folderItem: (folderName) => { return `//span[text()="${folderName}"]` },
        projectItemOption: (projectName) => { return `//li[contains(@class, "project-item") and text()="${projectName}"]` },
        addCaseCheckbox: (caseName) => { return `//div[@class="ant-tree-list-holder"]//span[contains(text(), "${caseName}")]//..//..//span[@class="ant-tree-checkbox-inner"]` },
        caseItem: (caseName) => { return `//tr[@class="draggable-case"]//a[contains(text(), "${caseName}")]` },
        caseItemCheckbox: (caseName) => { return `(${po.utils.caseItem(caseName)}//..//..//span[contains(@class, "ant-checkbox")])[1]`},
        caseItemIsChecked: (caseName) => { return `(${po.utils.caseItem(caseName)}//..//..//span[contains(@class, "ant-checkbox-checked")])[1]` },
        caseItemIncludeNotificationsIsChecked: (caseName) => { return `(${po.utils.caseItem(caseName)}//..//..//td[contains(@title, "case notifications")]//span[contains(@class, "ant-checkbox-checked")])[1]` },

        selectEnvironment: (environmentName) => {
            po.click('//span[text()="Environments"]//..//span[@class="ant-select-selection-item"]')
            po.click(`//div[@title="${environmentName}"]`)
        },
    },

    resultsPage: {
        expectedMonitorElement: (monitorName) => { 
            return '//td[@class="test-name"]//a[contains(text(), "' + monitorName + '")]' +
            '//..//..//td[contains(text(), "Scheduler")]//..//td[contains(text(), "Monitor")]//..//td[@class="stop-action"]' 
        }
    },

}
