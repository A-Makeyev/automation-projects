module.exports = {

/*  
    Test Element:
    document.evaluate('', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
    document.evaluate('', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
*/

    login: (user, pass, url, t) => {
        if (url.includes('https')) {
            url = url.slice(0, 8) + `${user}:${pass}@` + url.slice(8)
        } else {
            url = url.slice(0, 7) + `${user}:${pass}@` + url.slice(7)
        }

        web.transaction('Login & Open Main Page')
        web.init()
        web.open(url)
        web.setTimeout(t * 1000)
    },

    init: (url, t) => {
        web.transaction('Open Main Page')
        web.init()
        web.open(url)
        web.setTimeout(t * 1000)
    },

    url: 'https://moh.health.gov.il/Marvad/main.aspx',
    deceased_patient_ID: '999999999',
    non_existent_ID: '999999999',
    valid_ID: '999999999',

    users: {
        admin: {
            username: 'XXXXXXXXXXX',
            password: 'XXXXXXXXXXX'
        },
        representative: {
            username: 'XXXXXX',
            password: 'XXXXXX',
        }
    },

    functions: {
        getTime: () => {
            return (new Date()).getTime()
        },

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

        generatePhone: () => {
            let pre = ['050', '051', '052', '053', '054']
            return String(
                pre[Math.floor(Math.random() * pre.length)]
                + Math.random().toString().slice(2, 9)
            ) 
        },

        generateEmail: () => {
            let names = ['adrian', 'donald', 'anatoly', 'victoria', 'cody', 'gali']
            let domains = ['gmail', 'hotmail', 'yahoo', 'live', 'gmx']
            return names[Math.floor(Math.random() * domains.length)]
            + '@' + domains[Math.floor(Math.random() * domains.length)] + '.com' 
        },

        generateFirstName: () => {
            let names = ['אנטולי', 'נועם', 'ערן', 'לירן', 'נעמי', 'נטלי', 'גלי', 'ויקי']
            let random = (min, max) => { return Math.floor(Math.random() * (max - min)) + min }
            return names[random(0, names.length)]
        },

        generateLastName: () => {
            let names = ['מקייב', 'בירדמן', 'דמלין', 'לירן', 'גור', 'טייסון', "שבצ'נקו", 'קוטוב']
            let random = (min, max) => { return Math.floor(Math.random() * (max - min)) + min }
            return names[random(0, names.length)]
        },

        getText: (locator) => {
            let text = web.getText(locator)
            let loops = 0
            if (text.length < 1) {
                while (text.length < 1) {
                    web.pause(1000)
                    text = web.getText(locator)
                    loops++
                    if (loops > 15) {
                        break
                    }
                }
            }
            return text
        },

        navigateToNewReferral: () => {
            web.transaction('Navigate To New Referral')
            po.click(po.sub_nav.menu.referrals)
            po.functions.refresh()
            
            if (!web.isVisible(po.referrals.headerText)) {
                while (!web.isVisible(po.referrals.headerText)) {
                    web.pause(2000)
                    po.click(po.sub_nav.menu.referrals) 
                }
            }
            po.click(po.sub_nav._new)
        },

        createNewReferral: (id, type, reason) => {
            web.transaction('Create New Referral')
            const obj = po
            const utils = obj.utils
            const referrals = obj.referrals

            obj.type(referrals.idInput, id)
            obj.type(referrals.referralType, type)

            obj.click(utils.searchResult)
            obj.type(referrals.mainReason, reason)

            obj.click(utils.searchResult)
            obj.click(referrals.referralDate)

            obj.click(
                '//div[contains(@class, "dayIsFocused")]//span[text()="'
                + obj.functions.getDay(obj.functions.currentDate()) + '"]'
            )

            obj.click(obj.sub_nav.findPatient)
            if (web.isVisible(utils.dialogAccept, 5000))
                obj.click(utils.dialogAccept)

            obj.type(referrals.rishuiOfficeArea, 'חיפה')
            obj.click(utils.searchResult)

            obj.click(utils.bottomSaveButton)
        },

        assertErrorMessage: () => {
            if (web.isVisible(po.utils.dialogHeader)) {
                web.transaction('Assert Treatment Already Exists Message')
                const message = po.functions.getText(po.utils.dialogHeader)
                if (message.includes('לנבדק קיים טיפול ניהולי פעיל') || message.includes('שמירה מתבצעת')) {
                    po.click(po.utils.dialogCancel)
                } 
            }
        },

        navigateToCurrentPatient: () => {
            web.transaction('Navigate To The Current Patient')
            const func = po.functions

            po.click(po.sub_nav.menuBtn)

            for (let x = 0; x < 2; x++)
                func.pressTAB()

            func.pressARROW_DOWN()
            func.pressSPACE()

            func.pressARROW_DOWN()
            func.pressENTER()

            let loops = 0
            while (!web.isVisible('//span[contains(text(), "נבדק: נבדק- תצוגה מאוחדת")]', 5000)) {
                po.click(po.main_nav.home)
                navigateToPatient()

                loops++
                if (loops > 15) {
                    assert.fail('There was a problem loading the patient page')
                }
            }
        },

        dismissTreatment: () => {
            po.click(po.sub_nav.menu.treatments)
            if (web.isVisible('id=dialogTitleText', 5000)) {
                po.click(po.utils.dialogConfirm)
            }

            if (web.isVisible('//span[contains(text(), "אין נתונים זמינים")]', 5000)) {
                log.info('לא קיימים טיפולים ניהוליים')
            } else {
                web.doubleClick('(//div[@data-id="grid-cell-container"])[1]')
                po.click(po.sub_nav.closeTreatment)
                po.click(po.utils.dialogConfirm)
                po.type('//input[@data-id="resolution_id.fieldControl-text-box-text"]', 'נפתר')
                po.click(po.utils.dialogResolve)
            }
        },

        pressTAB: () => {
            web.pause(500)
            web.sendKeys('\uE004')
            web.pause(500)
        },
        pressENTER: () => {
            web.pause(500)
            web.sendKeys('\uE007')
            web.pause(500)
        },
        pressBACKSPACE: () => {
            web.pause(500)
            web.sendKeys('\uE003')
            web.pause(500)
        },
        pressSPACE: () => {
            web.pause(500)
            web.sendKeys('\uE00D')
            web.pause(500)
        },
        pressARROW_DOWN: () => {
            web.pause(500)
            web.sendKeys('\uE015')
            web.pause(500)
        },
        refresh: () => {
            web.pause(500)
            web.refresh()
            web.pause(500)
            web.selectWindow()
        },
        
    }, /* end of functions */

    /* override click & type */
    click: function(element) {
        web.pause(1500) 
        // avoid empty click 
        web.waitForVisible(element)
        web.click(element)
    },
    type: function(element, text) {
        web.waitForVisible(element)
        web.type(element, text)
    },

    /* locators */
    utils: {
        searchResult: '(//*[contains(@id, "resultsContainer_0_0")])[1]',
        inputErrorMessage: '//label[contains(@id, "errorMessage")]',
        bottomSaveButton: '//button[@data-id="edit-form-save-btn"]',
        dialogWindow: '//div[@id="modalDialogContentContainer"]',
        dialogHeader: '//div[@id="modalDialogHeader"]//h2',
        dialogMessage: '//span[@id="dialogMessageText"]',
        dialogConfirm: '//button[@id="confirmButton"]',
        dialogResolve: '//button[@aria-label="פתור"]',
        dialogCancel: '//button[@id="cancelButton"]',
        dialogAccept: '//button[@id="okButton"]',
        dialogAcceptText: '//button[@id="okButtonText"]',
    },

    main_nav: {
        home: '//img[contains(@src, "logo")]',
        magen: '//span[text()="מגן"]',
        marvad: '//span[text()="מרב"ד"]',
    },

    sub_nav: {
        _X_: '//button[@id="id-14"]/span/span', // -> close menu

        menuBtn: '//button[@id="id-3" or(@data-id="navbutton")]',
        menu: {
            marvad: '//button[@data-id="quick-launch-mru-btn"]',
            boards: '//li[@data-text="לוחות מחוונים"]',
            patients: '//li[@data-text="נבדקים"]',
            referrals: '//li[@data-text="הפניות"]',
            treatments: '//li[@data-text="טיפולים ניהולים"]',
            tasks: '//li[@data-text="משימות"]'
        },

        showChart: '//span[contains(text(), "הצג תרשים")]',
        _new: '//span[contains(text(), "חדש")]',
        _delete: '//span[contains(text(), "מחק")]',
        refresh: '//span[contains(text(), "רענן")]',
        findPatient: '//span[contains(text(), "אתר נבדק")]',
        saveAndClose: '//button[contains(@data-id, "SaveAndClose")]',
        closeTreatment: '//span[contains(text(), "סגירת טיפול ניהולי")]',
    },

    referrals: {
        patient: '//li[contains(@id, "mirs_patient")]/label',
        createdAt: '//div[@id="createdon"]/div[contains(text(), "נוצר ב:")]',
        idInput: '//label[contains(text(), "מספר זיהוי")]//..//..//..//..//input',
        referralType: '//label[contains(text(), "מקור מפנה")]//..//..//..//..//input',
        mainReason: '//label[contains(text(), "סיבת הפניה ראשית")]//..//..//..//..//input',
        headerText: '//span[contains(@id, "ViewSelector") and contains(text(), "הפניות")]',
        referralDate: '//label[contains(text(), "תאריך קבלת הפניה")]//..//..//..//..//input',
        identificationSelect: '//label[contains(text(), "סוג זיהוי")]//..//..//..//..//select',
        rishuiOfficeArea: '//label[contains(text(), "אזור משרד רישוי")]//..//..//..//..//input',
    },

    patients: {
        list: {
            details: '//ul[@id="tablist"]//li[@aria-label="פרטים דמוגרפיים"]',
            contactDetails: '//ul[@id="tablist"]//li[@aria-label="פרטי התקשרות"]',
            drivers: '//ul[@id="tablist"]//li[@aria-label="מסך נהגים"]',
            certificates: '//ul[@id="tablist"]//li[@aria-label="תעודות יושר"]',
            referralsAndTreatments: '//ul[@id="tablist"]//li[@aria-label="הפניות וטיפולים ניהוליים"]',
            documents: '//ul[@id="tablist"]//li[@aria-label="מסמכים"]',
            specialRequests: '//ul[@id="tablist"]//li[@aria-label="בקשות מיוחדות"]',
            cases: '//ul[@id="tablist"]//li[@aria-label="פניות"]',
            management: '//ul[@id="tablist"]//li[@aria-label="ניהול"]',
        },

        patientName: '//label[contains(text(), "שם נבדק")]//..//..//..//..//input',
        addNewStandard_reference: '//button[@data-id="mirs_reference|NoRelationship|SubGridStandard|Mscrm.SubGrid.mirs_reference.AddNewStandard"]',
        addNewStandard_incident: '//button[@data-id="incident|NoRelationship|SubGridStandard|Mscrm.SubGrid.incident.AddNewStandard"]',
        requestedLicense: '//input[contains(@id, "requested_license")]',
    },

    treatments: {
        status: '//label[@data-id="header_mirs_case_status.fieldControl-LookupResultsDropdown_mirs_case_status_selected_tag_text"]',
        patient: '//li[@data-id="customerid.fieldControl-LookupResultsDropdown_customerid_selected_tag"]//label',
        caseType: '//label[contains(text(), "סוג תיק")]//..//..//..//..//input',
    },

}