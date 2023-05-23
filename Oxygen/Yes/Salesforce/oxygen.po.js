module.exports = {

    shortWait: 5000,
    waitASecond: 1000,

    init: (url, t) => {    
        web.transaction('01. Initialize ChromeDriver')
        web.init({
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
                    '--incognito',
                    '--disable-notifications',
                    '--enable-strict-powerful-feature-restrictions'
                ]
            }
        })

        web.setTimeout(t * 1000)
        let waitForInitialLoad = 10 * 1000

        log.info(env.name != 'default' ? `>>> Environment: ${env.name}` : '')

        web.transaction('02. Open Login Page')
        web.open(url)

        if (web.isVisible('id=main', waitForInitialLoad)) {
            web.transaction('03. Login')    
            po.type('id=username', env.username)
            po.type('id=password', env.password) 

            if (web.isVisible('id=Login')) {
                web.pause(po.waitASecond)
                web.execute(() => {
                    var loginButton = document.evaluate(
                        '//*[@id="Login"]', document, null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null
                    ).singleNodeValue

                    if (loginButton !== null) {
                        if (window.getComputedStyle(loginButton).display !== 'none') {
                            loginButton.click()
                        }
                    }
                })
            } 
        } else {
            log.info(`Skipped login at ${env.name} environment`)
        }
        
        if (web.isVisible('id=error', waitForInitialLoad)) {
            assert.fail(web.getText('id=error'))
        } else if (web.isVisible('//span[text()="תחזוקה מתוכננת"]', po.shortWait / 2)) {
            log.info(web.getText('//div[@id="message"]'))
        } else if (web.isVisible('//a[contains(@href, "AddPhoneNumber")]', po.shortWait / 2)) {
            po.click('//a[contains(@href, "AddPhoneNumber")]')
        } else if (web.isVisible('//*[@id="header" and contains(text(), "שנה את סיסמתך")]', po.shortWait / 2)) {
            log.info(`נדרש לשנות את הסיסמה ליוזר ${env.username}`)
            assert.pass()
        }
        
        if (!web.isVisible('id=oneHeader', waitForInitialLoad)) {
            for (let x = 0; x < 10; x++) {
                po.functions.refresh()
                if (!web.isVisible('id=oneHeader', waitForInitialLoad))
                    continue
                
                assert.equal(
                    web.isVisible('id=oneHeader'), true,
                    `Main page has failed to load at ${env.name} environment`
                )
                break
            }
        }
    },

    /* functions */
    
    functions: {
        // Create Israeli ID Number
        createTzNumber: () => {
            var tzNumber
            while (true) {
                var tz = []
                for (var i = 0; i < 9; i++) {
                    tz.push(Math.floor(Math.random() * 10))
                }

                var weights = []
                var mul = 1
                for (var i = 0; i < 9; i++) {
                    weights.push(mul)
                    mul = mul == 1 ? 2 : 1
                }

                var tzWeighted = []
                for (var i = 0; i < 9; i++) {
                    tzWeighted.push(tz[i] * weights[i])
                }

                for (var i = 0; i < 9; i++) {
                    var num = tzWeighted[i].toString()
                    if (num.length === 2) {

                        var d1 = parseInt(num.substring(0, 1))
                        var d2 = parseInt(num.substring(1))
                        tzWeighted[i] = d1 + d2
                    }
                }

                var sum = 0
                for (var i = 0; i < 9; i++) {
                    sum += tzWeighted[i]
                }

                if (sum % 10 === 0) {
                    tzNumber = tz.join('')
                    break
                }
            }
            return tzNumber
        },

        currentDate: () => {
            let today = new Date()
            let dd = String(today.getDate()).padStart(2, "0")
            let mm = String(today.getMonth() + 1).padStart(2, "0")
            let yyyy = today.getFullYear()
            log.info(`${dd}/${mm}/${yyyy}`)
            return `${dd}/${mm}/${yyyy}`
        },

        getDay: (date) => {
            let day = date.slice(0, 2)
            return day < 10 ? day.substr(1) : day
        },

        generateNumber: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min
        },

        generatePhone: () => {
            let pre = ['050', '052', '054']
            return String(
                pre[Math.floor(Math.random() * pre.length)]
                + Math.random().toString().slice(2, 9)
            )
        },

        generateEmail: () => {
            let domains = ['gmail', 'hotmail', 'yahoo', 'live', 'gmx']
            return po.functions.generateName()
                   + '@' + domains[Math.floor(Math.random() * domains.length) + 1]
                   + '.com'
        },

        generateName: () => {
            let capitalize = (string) => {
                return string.charAt(0).toUpperCase() + string.slice(1)
            }
            let randomNumber = (min, max) => {
                return Math.floor(Math.random() * (max - min)) + min
            }
            let names = ['Estabon', 'Stephan', 'Ivanka', 'Achilles', 'Naomi',
                        'Villalon', 'Muskuvich', 'Gates', 'Scott', 'Peachey']
            return capitalize(names[randomNumber(0, names.length)]) 
        },

        convertDateWithTimeFromDB: (date) => {
            date = date.slice(0, 10)
            let day = date.slice(8, 10)
            let month = date.slice(5, 7)
            let year = date.slice(0, 4)

            switch (month) {
                case 'JAN':
                    month = '01'
                    break
                case 'FEB':
                    month = '02'
                    break
                case 'MAR':
                    month = '03'
                    break
                case 'APR':
                    month = '04'
                    break
                case 'MAY':
                    month = '05'
                    break
                case 'JUN':
                    month = '06'
                    break
                case 'JUL':
                    month = '07'
                    break
                case 'AUG':
                    month = '08'
                    break
                case 'SEP':
                    month = '09'
                    break
                case 'OCT':
                    month = '10'
                    break
                case 'NOV':
                    month = '11'
                    break
                case 'DEC':
                    month = '12'
                    break
                default: 
                    month = month
                    break
            }
            return day + '/' + month + '/' + year
        },

        convertDateFromDB: (date) => {
            let day = date.slice(0, 2)
            let month = date.slice(3, 6)
            let year = date.slice(7)

            switch (month) {
                case 'JAN':
                    month = '01'
                    break
                case 'FEB':
                    month = '02'
                    break
                case 'MAR':
                    month = '03'
                    break
                case 'APR':
                    month = '04'
                    break
                case 'MAY':
                    month = '05'
                    break
                case 'JUN':
                    month = '06'
                    break
                case 'JUL':
                    month = '07'
                    break
                case 'AUG':
                    month = '08'
                    break
                case 'SEP':
                    month = '09'
                    break
                case 'OCT':
                    month = '10'
                    break
                case 'NOV':
                    month = '11'
                    break
                case 'DEC':
                    month = '12'
                    break
                default: 
                    month = month
                    break
            }
            return day + '/' + month + '/' + year
        },

        pressENTER: () => {
            web.pause(po.waitASecond)
            web.sendKeys('\uE007')
            web.pause(po.waitASecond)
        },

        pressTAB: () => {
            web.pause(po.waitASecond)
            web.sendKeys('\uE004')
            web.pause(po.waitASecond)
        },

        pressARROW_DOWN: () => {
            web.pause(po.waitASecond)
            web.sendKeys('\uE015')
            web.pause(po.waitASecond)
        },

        refresh: () => {
            web.pause(po.waitASecond)
            web.refresh()
            web.pause(po.waitASecond)
        },

    }, /* end of functions */

    /* override click & type */ 
    // wait for JS to load

    click: (element) => {
        web.pause(po.waitASecond)
        web.click(element)
    },

    type: (element, text) => {
        web.pause(po.waitASecond)
        web.type(element, text)
    },

    /* Elements */

    loginScreen: {
        loginBtn: 'id=Login',
        usernameField: 'id=username',
        passwordField: 'id=password',
        addPhoneNumber: '//h2[contains(text(), "רשום את הטלפון הנייד שלך")]',
        changePassword: '//div[contains(@class, "change-password")]',
    },

    /* alpha 360 */
    alphaMainPage: {

        customerId: '301292892',
        customerName: 'כפיר ואלינה מדמוני',
        accountNumber: '6086284',
        phoneNumber: '0545644404',
        device: 'A76559450000BE3F',

        leadsTab: '//a[@title="לידים"]',
        mainSearchInput: '//div[contains(@class, "forceSearchInput")]//input',
        closeTabButton: '//span[@title="אלפא"]//..//..//..//..//..//button[contains(@title, "Close") or contains(@title, "סגור")]',
        errorToastMessage: '//div[@data-key="error" and @data-aura-class="forceToastMessage"]',

        appMenuBtn: '//div[@role="navigation"]//button',
        appMenuOptions: {
            salesConsole: '//div[contains(@class, "appLauncherMenu")]//*[contains(text(), "Sales Console")]',
        },

        navigationBtn: '//button[contains(@title, "תפריט ניווט")]', 
        navigationOptions: {
            home: '//span[text()="בית"]',
            customers: '//span[text()="איתור לקוח"]',
            leads: '//span[text()="לידים"]',
            contacts: '//span[text()="אנשי קשר"]',
            accounts: '//span[text()="חשבונות"]',
        },

        closeAllTabs: () => {
            const closeTabButton = po.alphaMainPage.closeTabButton

            if (web.isVisible(closeTabButton, po.shortWait * 2)) {
                var initialTabs = web.getElementCount(closeTabButton)
                var TABS = initialTabs
                log.info('Open TABS: ' + TABS)
            } else {
                return false
            }

            if (TABS == 1) {
                po.click(`(${closeTabButton})[1]`)
                log.info('~~> closed 1 tab')
                return true
            } else if (TABS >= 1) {
                while (TABS >= 1) {
                    po.click(`(${closeTabButton})[1]`)
                    web.pause(po.waitASecond)
                    TABS = web.getElementCount(closeTabButton)
                }
                if (!web.isVisible(closeTabButton, po.shortWait)) {
                    log.info(`~~> closed ${initialTabs} tabs`)
                    return true
                }
            }
            return false
        },

        openSearchPage: () => {
            let main = po.alphaMainPage

            if (web.isVisible(main.navigationBtn, po.shortWait)) {
                po.click(main.navigationBtn)
                po.click(main.navigationOptions.customers)
            } else {
                po.click(main.appMenuBtn)
                po.click(main.appMenuOptions.salesConsole)
                po.click(main.navigationBtn)
                po.click(main.navigationOptions.customers)
            }

            if (web.isVisible(po.searchCustomerPage.header, po.shortWait)) {
                return
            } else {
                po.click(main.navigationBtn)
                po.click(main.navigationOptions.customers)
                assert.equal(web.isVisible(po.searchCustomerPage.header), true)
            }
        },

        openLeads: () => {
            let main = po.alphaMainPage
            po.click(main.navigationBtn)
            po.click(main.navigationOptions.leads)
        },
    },

    /* customer details 360 */
    customerDetails360: {
        customerDetails: '//li[@title="פרטי לקוח"]',
        generalDetails: '//li[@title="פרטים כלליים"]',
        openInquiries: '//li[@title="פרטי לקוח"]//..//a[@data-label="פניות פתוחות"]',
        customerLink: '(//span[@title="מסך משותף 360"]//..//..//..//a[contains(@class, "forceOutputLookup")])[1]',
        products: '//a[@data-label="מבצע ומוצרי לקוח"]',
        content: '//a[@data-label="תכנים בהזמנה"]', 
        pakaList: `//a[@data-label='פק"עות וכתובות']`,
        productsHistory: '//strong[contains(text(), "היסטורית מוצרים")]',
        futureActions: '//strong[contains(text(), "הוספות/ הסרות  עתידיות")]',
        activeProducts: '//strong[contains(text(), "מוצרים פעילים")]',
        noDetailsToShow: '//..//..//..//..//p[contains(text(), "אין נתונים להציג")]',
        removalStatus : '//*[contains(text(), "הסרת הערוץ")]//..//..//..//div[contains(@class, "slds-modal__content")]',

        pakaTableHeader: {
            filterArrowDisplayed: "//*[name()='svg' and @data-key='arrowdown']",
            pakaNumber: `//span[@title='מספר פק"ע']`,
            taskType: "//span[@title='סוג משימה']",
            pakaType: `//span[@title='סוג פק"ע']`,
            deliveryType: "//span[@title='שיטת משלוח']",
            status: "//span[@title='סטטוס']",
            dateCoordination: "//span[@title='תאריך תאום']",
            hourCoordination: "//span[@title='שעת תיאום']",
            timeWindow: "//span[@title='חלון הזמן לאיחור']",
            team: "//span[@title='צוות / קבלן']",
            technician: "//span[@title='טכנאי']",
            openDate: "//span[@title='תאריך פתיחה']",
        },

        extraPakaInfoTable: {
            headers: {
                jobs: `//a[@data-label="ג'ובים"]`,
                closingReason: `//a[@data-label="סיבת סגירה"]`,
                notes: `//a[@data-label="הערות"]`,
                history: `//a[@data-label="היסטוריה"]`,
            },
            tabs: {
                jobs: `//li[@title="ג'ובים" and contains(@class, "is-active")]//..//..//..//lightning-tab[contains(@aria-labelledby, "Jobs")]`,
                closingReason: `//li[@title="סיבת סגירה" and contains(@class, "is-active")]//..//..//..//lightning-tab[contains(@aria-labelledby, "FaultReasons")]`,
                notes: `//li[@title="הערות" and contains(@class, "is-active")]//..//..//..//lightning-tab[contains(@aria-labelledby, "Notes")]`,
                history: `//li[@title="היסטוריה" and contains(@class, "is-active")]//..//..//..//lightning-tab[contains(@aria-labelledby, "History")]`, 
            },
        },
        
        isChartOpen: (chart) => { 
            // if the arrow is facing down the chart is open, returns true
            return web.isVisible(`//*[name()="svg" and @data-key="chevrondown"]//..//..//..//*[contains(text(), "${chart}")]`)
        },

        isChartEmpty: (chart) => {
            return web.isVisible(`//strong[contains(text(), "${chart}")]//..//..//..//..//..//*[contains(text(), "לא קיימים נתונים להצגה")]`)
        },

        openProducts: (accountNumber) => {
            const openDetails = () => {
                web.pause(po.shortWait)
                po.click(po.customerDetails360.products)
                web.waitForVisible(po.customerDetails360.products)
            }

            if (web.isVisible(`//a[contains(@data-account-id, "")]//div[contains(text(), "${accountNumber}")]`, po.shortWait * 2)) {
                po.click(`//a[contains(@data-account-id, "")]//div[contains(text(), "${accountNumber}")]`)
                openDetails()

            } else if (web.isVisible(`//*[@c-alp360searchconsumer_alp360searchconsumer and contains(text(), "${accountNumber}")]`, po.shortWait * 2)) { 
                po.click(`//div[@class="slds-truncate"]//*[contains(text(), "${accountNumber}")]`)
                po.click(`//a[contains(@data-account-id, "")]//div[contains(text(), "${accountNumber}")]`)
                openDetails()

            } else if (web.isVisible(`//a[text()="${accountNumber}"]//..//..//div[@class="bezeq-notify-warning"]`, po.shortWait * 2)) {
                po.click(`//div[@class="bezeq-notify-warning"]//..//..//a[text()="${accountNumber}"]`)
                openDetails()

            } else if (web.isVisible(po.searchCustomerPage.customerNotFoundMsg, po.shortWait * 2)) {
                assert.fail(`לא נמצאו תוצאות עבור לקוח מספר: ${accountNumber}`)
            }  
        },

        loadCustomerDetails: () => {
            /* header details */
            var header = '//*[@data-component-id="alp360HeaderContainer"]//div[contains(@class, "slds-col")]'
            var headerDetails = web.getElementCount(header)
            if (headerDetails > 0) {
                for (let x = 1; x <= headerDetails; x++) {
                    assert.equal(
                        web.isExist(`(${header})[${x}]`), true,
                        `Header element did not load properly at: (${header})[${x}]`
                    )
                }
            }

            /* yes details */
            var yesTable = '//*[@data-component-id="alp360MainDetailsAdw"]//td'
            var yesTableDetails = web.getElementCount(yesTable)
            if (yesTableDetails > 0) {
                for (let x = 1; x <= yesTableDetails; x++) {
                    assert.equal(
                        web.isExist(`(${yesTable})[${x}]`), true,
                        `Yes table element did not load properly at: (${yesTable})[${x}]`
                    )
                }
            }
        },

        assertDataRows: () => {
            assert.equal(web.isVisible(po.customerDetails360.activeProducts), true, 'טבלת מוצרים פעילים אינה מופיעה')
            assert.equal(web.isVisible(po.customerDetails360.productsHistory), true, 'טבלת היסטורית מוצרים אינה מופיעה')
            assert.equal(web.isVisible(po.customerDetails360.futureActions), true, 'טבלת הוספות/ הסרות עתידיות אינה מופיעה')
        },

        changeOfferWithOutlet_M: (offerId) => {
                if (!web.isVisible(`//a[text()="${offerId}"]`, po.shortWait * 2)) {

                // if the offer id from the query does not appear, find a new one with the same outlet
                let otherOffersWithOutlet = '//lightning-base-formatted-text[contains(text(), "M0")]//..//..//..//..//..//a'
                let offerCount = web.getElementCount(otherOffersWithOutlet)

                if (offerCount > 1) {
                    log.warn(`Offer ${offerId} was not displayed, available offers:`)

                    for (let offer = 1; offer <= offerCount; offer++) {
                        if (web.isVisible(`(${otherOffersWithOutlet})[${offer}]`, po.shortWait)) {
                            log.info(web.getText(`(${otherOffersWithOutlet})[${offer}]`))
                        }
                    }
                }

                let randomOfferNumber = po.functions.generateNumber(1, offerCount)
                offerId = web.getText(`(${otherOffersWithOutlet})[${randomOfferNumber}]`)
                return offerId
            }
        }, 
    }, /* end of customer details 360 */

    /* Search Customer Page */
    searchCustomerPage: {
        header: '//app_flexipage-header//*[contains(text(), "איתור לקוח")]',
        searchBtn: '//button[@title="חפש"]',
        customerLink: '(//c-alp360-event-link-type)[1]',
        customerNotFoundMsg: '//strong[contains(text(), "לא נמצאו תוצאות")]',
        loadingDataError :'//*[contains(text(), "שגיאה בטעינת הנתונים")]',
        
        searchParametersBtn: '//*[@name="searchParam"]',
        parameters: {
            id: '//span[@title="מספר מזהה"]',
            phone: '//span[@title="מספר טלפון"]',
            name: '//span[@title="שם פרטי ומשפחה"]',
            caseNumber: '//span[@title="מספר פניה"]',
            deviceNumber: '//span[@title="מספר ממיר/ כרטיס"]',
            accountNumber: '//span[@title="מספר לקוח"]',
        },

        idInput: '//input[@name="id"]',
        phoneInput: '//input[@name="phone_number"]',
        firstNameInput: '//input[@name="first_name"]',
        lastNameInput: '//input[@name="last_name"]',
        caseNumberInput: '//input[@name="case_number"]',
        deviceNumberInput: '//input[@name="device_number"]',
        accountNumberInput: '//input[@name="billing_account_number"]',

        searchCustomerByAccount: (number) => {
            let searchPage = po.searchCustomerPage

            po.alphaMainPage.openSearchPage()
            po.click(searchPage.searchParametersBtn)
            po.click(searchPage.parameters.accountNumber)
            po.type(searchPage.accountNumberInput, number)
            po.click(searchPage.searchBtn)
            
            if (web.isVisible(`//a[contains(@data-account-id, "")]//div[contains(text(), "${number}")]`, po.shortWait)
            || web.isVisible(`//*[@c-alp360searchconsumer_alp360searchconsumer and contains(text(), "${number}")]`, po.shortWait)) {
                log.info('✔ Account ' + number + ' exists')
                return true
            } else if (web.isVisible(searchPage.customerNotFoundMsg, po.shortWait)) {
                log.info('לא נמצאו תוצאות למספר לקוח: ' + number)
                return false
            } else if (web.isVisible(searchPage.loadingDataError, po.shortWait)) {
                let error = web.getText(searchPage.loadingDataError)
                log.info('✘ ' + error)
            }
            return false
        },
    },

    leads: {
        searchMenuArrow: '//a[@title="בחר תצוגת רשימה"]//*[name()="svg" and @data-key="down"]',
        phoneError: '//div[contains(text(), "מספר טלפון לא תקין")]',
        all: '(//span[@class=" virtualAutocompleteOptionText" and text()="All"])[1]',
        all_hebrew: '(//span[@class=" virtualAutocompleteOptionText" and text()="כל הלידים הפתוחים"])[1]',
        recentlyViewed: '//span[@data-aura-class="uiOutputText" and contains(text(), "הוצגו לאחרונה")]',
        leadsInProgress: '(//span[text()="לידים בטיפולי"])[1]',
        moreActionsArrow: '//li[contains(@class, "oneActionsDropDown")]//lightning-icon',
        createNewLead: '//div[@title="יצירת ליד חדש"]',
        newLeadBtn: '//div[@title="חדש/ה" or @title="יצירת ליד חדש"]',
        firstName: '//label[@aria-label="שם פרטי"]//..//..//input',
        lastName: '//label[@aria-label="שם משפחה"]//..//..//input',
        phone: '//label[@aria-label="מספר טלפון"]//..//..//input',
        id: '//label[@aria-label="מספר זיהוי"]//..//..//input',
        finishLead: '//span[text()="סיום"]',
        finishUpdateLead: '//button[@name="סיים"]',
        findCustomers: '//button[@title="מצא לקוחות"]',
        createNewBillingAccount: '//input[contains(@id, "Create_New_Billing_Account")]',
        deleteLead: '//a[@title="מחיקה"]',
        confirmDelete: '//button[contains(@class, "forceActionButton")]/span[text()="מחיקה"]',
        customerConfirm: '//span[contains(text(), "אישור לקוח להעברת פרטים")]//..//span[contains(@class, "slds-checkbox_faux") or contains(@class, "slds-radio_faux")]',
        assignLeadToMeBtn: '//*[contains(text(), "הקצה ליד אליי")]',
        errorContainer: '//div[contains(@class, "record-layout-load-error-container")]',

        handlingCompanyBtn: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]',
        handlingCompany: { 
            bezeqInternational: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]//..//..//..//span[text()="Bezeq International"]',
            pelephone: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]//..//..//..//span[text()="Pelephone"]',
            yes: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]//..//..//..//span[text()="Yes"]',
            bezeqInternational_hebrew: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]//..//..//..//span[text()="בזק בינלאומי"]',
            pelephone_hebrew: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]//..//..//..//span[text()="פלאפון"]',
            yes_hebrew: '(//span[text()="חברה מטפלת"]//..//..//..//input)[1]//..//..//..//span[text()="יס"]',
        },

        interestedInBtn: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]',
        interestedIn: {
            upgrade: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="שדרוג ציוד"]',
            yes: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="yes"]',
            sting: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="sting"]',
            package: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="חבילה משולבת"]',
            content: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="תוכן"]',
            internet: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="אינטרנט"]',
            newSubmobilization: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="ניוד מנוי חדש"]',
            addNewSub: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="הוספת מנוי חדש"]',
            equipment: '(//span[text()="מעוניין ב"]//..//..//..//input)[1]//..//..//..//span[text()="ציוד קצה"]',
        },

        offerGiven: '(//label[text()="הצעה שניתנה"]//..//..//input)[1]',
        offerGivenOptions: {
            yesUltimate: '(//label[text()="הצעה שניתנה"]//..//..//input)[1]//..//option[@value="yes ultimate"]',
            sting: '(//label[text()="הצעה שניתנה"]//..//..//input)[1]//..//option[@value="STING"]'
        },

        offerTextArea: '//label[text()="פירוט הצעה שניתנה"]//..//textarea',
        emailInput: '//label[text()="אימייל"]//..//input',
        idInput: '//label[text()="מספר זיהוי"]//..//input',
        findCustomersBtn: '//button[@title="מצא לקוחות"]',

        status: {
            interested: '//legend[contains(text(), "סטטוס")]//..//span[text()="מעוניין"]',
            continueTreatment: '//legend[contains(text(), "סטטוס")]//..//span[text()="המשך טיפול"]',
            denial: '//legend[contains(text(), "סטטוס")]//..//span[text()="סירוב"]',
            noAnswer: '//legend[contains(text(), "סטטוס")]//..//span[text()="אין מענה"]',
            wrongLead: '//legend[contains(text(), "סטטוס")]//..//span[text()="ליד שגוי"]',
        },

        reason: {
            price: '//legend[contains(text(), "סיבה")]//..//span[text()="מחיר"]',
            product: '//legend[contains(text(), "סיבה")]//..//span[text()="מוצר"]',
            didNotDecide: '//legend[contains(text(), "סיבה")]//..//span[text()="לא החליט"]',
        },

        rivalCompanies: {
            hot: '//span[text()="HOT"]//..//..//label[contains(@class, "slds-radio_button")]', 
            partner: '//span[text()="פרטנר"]//..//..//label[contains(@class, "slds-radio_button")]', 
            netflix: '//span[text()="Netflix"]//..//..//label[contains(@class, "slds-radio_button")]', 
            next: '//span[text()="Next"]//..//..//label[contains(@class, "slds-radio_button")]', 
            other: '//span[text()="אחר"]//..//..//label[contains(@class, "slds-radio_button")]', 
            triple_C: '//span[text()="טריפל C"]//..//..//label[contains(@class, "slds-radio_button")]', 
            idanPlus: '//span[text()="עידן +"]//..//..//label[contains(@class, "slds-radio_button")]', 
            rimon: '//span[text()="רימון"]//..//..//label[contains(@class, "slds-radio_button")]', 
        },

        openNewLeadWindow: () => {
            if (web.isVisible(po.leads.newLeadBtn, po.shortWait))
                po.click(po.leads.newLeadBtn)
            else
                po.click(po.leads.createNewLead)
        },

        assertLeadWindowError: () => {
            if (web.isVisible('//p[text()="Error"]', po.shortWait)) {
                assert.fail(web.getText('//p[text()="Error"]'))
            } else if (web.isVisible('//div[@data-aura-class="oneApplicationError"]', po.shortWait)) {
                log.info(web.getText('//div[@data-aura-class="oneApplicationError"]'))
                po.click('//span[contains(text(), "עניינים טכניים")]')
                if (web.isVisible('//div[@class="details-ctr expanded"]')) {
                    log.info(web.getText('//div[@class="details-ctr expanded"]//textarea'))
                    web.click('//div[@class="details-ctr expanded"]//..//..//..//button[@title="אישור"]')
                    po.functions.refresh()
                }
            }
        },

        handlePhoneError: () => {
            if (web.isVisible(po.leads.phoneError, po.shortWait)) {
                web.clear(po.leads.phone)
                po.type(po.leads.phone, po.functions.generatePhone())
                po.functions.pressTAB()
                po.leads.handlePhoneError()
            }      
        },
    }, /* end of leads */

    cases: {
        nextBtn: '//*[(text()="הבא")]',
        saveBtn : '//span[text()="שמור"]',
        modalSaveBtn: '//footer//span[text()="שמור"]',
        createCaseBtn: '//button[contains(text(), "צור פנייה")]',
        openTaskBtn: '//button[@name="Case.Open_Task"]',
        createTaskBtn: '//button[@name="Case.Create_Task"]',
        makeMeOwnerBtn: '//button[@name="Case.Make_Me_Owner"]',
        closeCaseBtn: '//button[@name="Case.Close_Case"]',
        transferToLegacyBtn: '//button[@name="Case.Transfer_to_Legacy"]',
        issueReportingComponent: '//*[@data-component-id="issueReporting"]',
        leadStatusUpdateComponent: '//*[@data-component-id="leadStatusUpdate"]',
        activityTimelineComponent: '//*[@data-component-id="timeline_activityTimeline"]',
        refreshActivityTimeline: '//*[@data-component-id="timeline_activityTimeline"]//button[@title="Refresh Data"]',
        assistCaseCheckbox: '//span[text()="פניית תפעול ותמיכה"]//..//..//input[@name="recordTypeId"]',
        infoCaseCheckbox: '//span[text()="פניית מתן מידע"]//..//..//input[@name="recordTypeId"]',

        expertConsultingBtn: '//button[contains(@name, "Case.Expert_Consulting")]',
        expertConsultingInput: '//span[contains(text(), "התייעצות בכיר")]//..//..//input',
        expertConsultingMainReasonInput: '//span[contains(text(), "נושא ראשי")]//..//..//input',
        expertConsultingSecondaryReasonBtn: '//span[contains(text(), "נושא משני")]//..//..//a',

        newIssueBtn: '//span[contains(text(), "תקלה חדש")]',
        issueInput: '//span[contains(text(), "תקלה")]//..//..//input',
        newIssueSaveBtn: '//h2[contains(text(), "צור תקלה")]//..//..//span[(text()="שמור")]',

        incidentInput: '//span[contains(text(), "מקרה")]//..//..//input',
        newIncidentBtn: '//span[contains(text(), "מקרה חדש")]',
        incidentFirstResult: '(//ul[contains(@class, "lookup__list") and contains(@class, "visible")]//li//a)[1]',
        newIncidentFirstRadioBtn: '(//h2[contains(text(), "מקרה חדש")]//..//..//div[contains(@class, "changeRecordTypeOption")]//span)[1]',
        newIncidentSaveBtn: '//h2[contains(text(), "מקרה חדש")]//..//..//span[(text()="שמור")]',

        expertConsultingReasons: {
            helpWithWizard: '//a[@title="סיוע במערכת Wizard"]',
            helpWithYes360: '//a[@title="סיוע במערכת Yes360"]',
        },

        createNewIncident: () => {
            let cases = po.cases
            po.click(cases.incidentInput)
            po.click(cases.newIncidentBtn)
            po.click(cases.newIncidentFirstRadioBtn)
            po.click(cases.nextBtn)
            po.click(cases.newIncidentSaveBtn)
        },

    }, /* end of cases */

}
