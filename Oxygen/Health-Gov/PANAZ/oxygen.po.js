const objects = {

    adjustURL: (url, user, pass) => {
        if (url.includes('https')) {
            url = url.slice(0, 8) + `${user}:${pass}@` + url.slice(8)
        } else {
            url = url.slice(0, 7) + `${user}:${pass}@` + url.slice(7)
        }
        return url
    },
        
    login: (username, password, url, timeout, validateUser) => {
        web.setTimeout(timeout * 1000)

        web.open(objects.adjustURL(url, username, password))
        objects.functions.closeDialogFrame()

        if (validateUser) {
            if (!objects.functions.getText(objects.nav.currentUser).includes(username)) {
                log.info('Logged in with a wrong user') 
            }
        }

        web.waitForExist(objects.nav.mainNavBar)
        assert.equal(web.isVisible(objects.nav.mainNavBar), true)
    },

    ID: '000000000',
    users: {
        app_user: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_'
        },
        public_inq: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_'
        },
        BO_rep: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!',
        },
        translation_rep: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!'
        },
        amar_rep: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!'
        },
        kvilot: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!'
        },
        moked_rep: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!'
        },
        nurse: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!'
        },
        general_user: {
            username: '_XXXXXXX_',
            password: '_XXXXXXX_!'
        },
    },

    functions: {
        currentDate: () => {
            let today = new Date()
            let dd = String(today.getDate()).padStart(2, "0")
            let mm = String(today.getMonth() + 1).padStart(2, "0")
            let yyyy = today.getFullYear()
            return `${dd}/${mm}/${yyyy}`
        },

        addBusinessDays: (days) => {
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
        },

        getDay: (date) => {
            let day = date.slice(0, 2)
            return day < 10 ? day.substr(1) : day
        },

        getTime: () => {
            return (new Date()).getTime()
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

        getValue: (locator) => {
            let value = web.getValue(locator)
            let loops = 0
            if (value.length < 1) {
                while (value.length < 1) {
                    web.pause(1000)
                    value = web.getValue(locator)
                    loops++
                    if (loops > 15) {
                        break
                    }
                }
            }
            return value
        },

        createPniya: (id, form, type, discription, direction) => {
            const obj = objects
            const cases = obj.cases
            const fun = obj.functions

            var pniya = fun.getText(`${cases.formSelector}//span[@class="ms-crm-FormSelector"]`)
            if (!pniya.includes(form)) {
                obj.click(cases.formSelector)
                obj.click(`//span[@title="${form}"]`)

                if (web.isAlertPresent()) {
                    web.alertAccept()
                }
            } 

            fun.pressENTER()

            // type
            var pniyaType, caseType, contactField, contactInput

            if (form == 'קורונה') {
                pniyaType = cases.pniyaType_corona
                caseType = cases.caseType_corona
                contactField = cases.contactIdField_corona
                contactInput = cases.contactIdInput_corona
            } else {
                pniyaType = cases.pniyaType
                caseType = cases.caseType
                contactField = cases.newContactField
                contactInput = cases.newContactInput
            }

            selectedType = fun.getText(pniyaType)

            while (selectedType !== type) {
                let loops = 0
                if (direction == 'up') {
                    fun.pressARROW_UP()
                } else if (direction == 'down') {
                    fun.pressARROW_DOWN()
                }
                
                selectedType = fun.getText(pniyaType)

                if (selectedType == type) {
                    break
                } else {
                    obj.click(caseType)
                    
                    if (direction == 'up') {
                        fun.pressARROW_UP()
                        fun.pressENTER()
                    } else if (direction == 'down') {
                        fun.pressARROW_DOWN()
                        fun.pressENTER()
                    }
                    
                }
                loops++ 
                if (loops > 5) {
                    break
                }
            }

            obj.click(contactField)
            obj.type(contactInput, id)

            fun.pressTAB()

            obj.click(cases.descriptionField)
            obj.type(cases.descriptionInput, discription)

            fun.pressTAB()

            if (form == 'קורונה') {
                let displayedPhone = fun.getText(cases.mobilePhoneNumber)
                if (displayedPhone.length < 1 || displayedPhone == '0000000000') {
                    obj.click(cases.mobilePhoneField)
                    obj.type(cases.mobilePhoneInput, fun.generatePhone())
                }
            }
        },

        getPniyaNumber: () => {
            var pniyaNumber = objects.functions.getText(objects.cases.pniyaNumber)
            var pniyaIsNumeric = pniyaNumber.match(/\d+/g)

            if (pniyaIsNumeric == null || pniyaIsNumeric.includes('פריט פניה חדש')) {
                let loops = 0
                while (pniyaIsNumeric == null) {
                    pniyaNumber = objects.functions.getText(objects.cases.pniyaNumber)
                    pniyaIsNumeric = pniyaNumber.match(/\d+/g)
                    loops++
                    web.pause(1000)
                    if (loops > 15) {
                        break
                    }
                }
            }
        },

        savePniya: () => {
            web.selectWindow()
            objects.click(objects.ribbonManager.cases._save)
            web.execute(() => {
                document.evaluate(
                    '//span[@command="incident|NoRelationship|Form|Mscrm.SavePrimary"]',
                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue.click()
            })
        },

        resolve: (status) => {
            web.selectWindow()
            objects.click(objects.ribbonManager.cases.resolve)

            web.selectFrame(objects.utils.frames.dialogFrame)
            objects.click(objects.utils.resolveField)

            objects.type(objects.utils.resolveInput, status)
            objects.click(objects.utils.finishDialog)

            log.info('Resolved with status: ' + status)
        },

        closeDialogFrame: () => {
            const t = 5000
            const utils = objects.utils
            if (web.isExist(utils.frames.dialogFrame, t)) {
                web.selectFrame(utils.frames.dialogFrame)
                if (web.isVisible(utils.closeDialog, t)) {
                    objects.click(utils.closeDialog)
                } else {
                    objects.click(utils.closeTourBtn)
                }
                web.pause(2500)
            }
        },

        navigateToCases: () => {
            objects.click(objects.nav.workPlaceArrow)
            objects.click(objects.nav.workPlaceOptions.cases)
        },

        openNewCase: () => {
            objects.click(objects.ribbonManager.cases.newCase)
            web.selectFrame(objects.utils.frames.frame_1)
        },

        openBusinessDaysCalculator: () => {
            objects.click(objects.nav.boards)
            objects.click(objects.ribbonManager.boards.businessDaysCalculator)
            web.selectWindow(businessDaysCalculator.window)
        },

        fillField: (clickLocator, typeLocator, text)  => {
            objects.click(clickLocator)
            objects.type(typeLocator, text)
            objects.functions.pressTAB()
        },
        
        pressTAB: () => {
            web.pause(1000)
            web.sendKeys('\uE004')
            web.pause(1000)
        },
        pressENTER: () => {
            web.pause(1000)
            web.sendKeys('\uE007')
            web.pause(1000)
        },
        pressARROW_DOWN: () => {
            web.pause(500)
            web.sendKeys('\uE015')
            web.pause(500)
        },
        pressARROW_UP: () => {
            web.pause(500)
            web.sendKeys('\uE013')
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
        /* JS loads too slowly
            avoid empty click */
        web.waitForVisible(element)
        web.click(element)
    },
    type: function(element, text) {
        web.waitForVisible(element)
        web.type(element, text)
    },

    /* locators */

    utils: {
        frames: {
            frame_: '//iframe[@id="contentIFrame"]',
            frame_0: '//iframe[@id="contentIFrame0"]',
            frame_1: '//iframe[@id="contentIFrame1"]',
            alertFrame: '//iframe[@id="alertJs-iFrame"]',
            dialogFrame: '//iframe[@id="InlineDialog_Iframe"]',
            dialogFrame_1: '//iframe[@id="InlineDialog1_Iframe"]',
            caseTasksFrame: '//iframe[@id="area_moha_incident_taskFrame"]',
            previousCases: '//iframe[@id="IFRAME_previous_incident"]',
        },
        popUp: '//span[@id="myPopup"]',
        status: '//label[@id="מצב_label"]',
        closeBtn: '//a[@id="closeButton"]',
        finishDialog: '//button[@id="ok_id"]',
        closeDialog: '//button[@id="butBegin"]',
        casesNextBtn: '//a[@id="_nextPageImg"]/img',
        closeTourBtn: '//div[@id="navTourCloseButtonImage"]/img',
        alertJs_X: '//div[@id="alertJs-close"]',
        alertJS_dialogWindow: '//div[@id="alertJs-dialog"]',
        alertJS_dialog_message: '//div[@id="alertJs-message"]/div',
        alertJS_dialog_no: '//div[@id="alertJs-tdDialogFooter"]/button[text()="לא"]',
        alertJS_dialog_yes: '//div[@id="alertJs-tdDialogFooter"]/button[text()="כן"]',
        caseTasks_firstTableRow: '(//div[@id="crmGrid_moha_incident_task_divDataArea"]//a[contains(@id, "gridBodyTable_primaryField")])[1]',
        caseTasks_firstTableRowOpen: '(//div[text()="פתוח"])[1]',
        caseTasks_edit: '//span[@command="task|OneToMany|SubGridAssociated|Mscrm.EditSelectedRecord"]',
        serviceAppointment_nextBtn: '//div[@id="serviceAppointment_crmGridTD"]//img[@title="טען את העמוד הבא"]',
        serviceAppointment_firstResult: '(//table[@id="gridBodyTable"]//tr[@class="ms-crm-List-Row"])[1]',
        serviceAppointment_bookBtn: '//button[@id="BookButton" and not(disabled)]',
        serviceAppointment_searchDateBtn: '//button[@id="SearchButton"]',
        serviceAppointment_subject: '//input[@id="subject"]',
        serviceAppointment_close_status: '//select[@id="statusCode"]',
        resolveField: '//div[@id="resolution_id"]',
        resolveInput: '//input[@id="resolution_id_i"]',
        smsTextArea: '//textarea[@id="message"]',
        sendSmsBtn: '//button[@id="sendSmsBtn"]',
        createSmsCode: '//a[@id="createCodeBtn"]',
        smsAnotherPhone: '//input[@id="changePhoneInput"]',
        sortByPniyaNumber: '//a[contains(@title, "מיין לפי מספר פניה")]',
        consultSubjects_accept: '//button[normalize-space()="אשר"]',
        consultSubjects_decline: '//button[normalize-space()="בטל"]',
        consultSubjects_baby: '(//div[contains(@ng-controller, "treeCtrl")]//input[@ng-model="node.isSelect"])[1]',
        consultSubjects_baby_options: '(//div[contains(@ng-controller, "treeCtrl")]//img[@ng-click="node.collapsed = !node.collapsed"])[1]',
        consultSubjects_pregnantWoman: '(//div[contains(@ng-controller, "treeCtrl")]//input[@ng-model="node.isSelect"])[21]',
        consultSubjects_pregnantWoman_options: '(//div[contains(@ng-controller, "treeCtrl")]//img[@ng-click="node.collapsed = !node.collapsed"])[21]',
        consultSubjects_coronaVirus: '(//div[contains(@ng-controller, "treeCtrl")]//input[@ng-model="node.isSelect"])[37]',
        consultSubjects_coronaVirus_options: '(//div[contains(@ng-controller, "treeCtrl")]//img[@ng-click="node.collapsed = !node.collapsed"])[37]',
        consultSubjects_result: '//a[contains(@id, "gridBodyTable_primaryField")]', // may be more than one --> ()[1]
    },

    nav: {
       mainNavBar: 'id=navTabGroupDiv',
       logo: '//span[@id="navTabLogoTextId"]/img[contains(@alt, "‏‏Microsoft Dynamics CRM")]',
       currentUser: '//span[contains(@class, "navTabButtonUserInfoWorker")]',
       workPlace: '//span[contains(text(), "סביבת עבודה")]',
       boards: '//span[contains(text(), "לוחות מחוונים")]',

       workPlaceArrow: '//img[@alt="סביבת עבודה" and @class="navTabButtonArrowDown"]',
       workPlaceOptions: {
            boards: '//a[@id="nav_dashboards"]/span[contains(text(), "לוחות מחוונים")]',
            activities: '//a[@id="nav_activities"]/span[contains(text(), "פעילויות")]',
            cases: '//a[@id="nav_cases"]/span[contains(text(), "פניות")]',
            kvilot: '//a[@id="el_panaz_incident"]/span[contains(text(), "קבילות")]',
            public_inq: '//a[@id="moha_panaz_incident"]/span[contains(text(), "פניות הציבור")]',
            companies: '//a[@id="nav_accts"]/span[contains(text(), "חברות")]',
            contacts: '//a[@id="nav_conts"]/span[contains(text(), "אנשי קשר")]',
            appointments: '//a[@id="nav_queues"]/span[contains(text(), "תורים")]',
            calendar: '//a[@id="nav_calendar"]/span[contains(text(), "לוח שנה")]',
            duplicates: '//a[@id="nav_duplicatedetectionjobs"]/span[contains(text(), "זיהוי כפילויות")]',
            articles: '//a[@id="nav_answers"]/span[contains(text(), "מאמרים")]',
            updateInfo: '//a[@id="new_moked_updates"]/span[contains(text(), "עדכון מידע למוקד")]',
       },

       pniyaArrow: '//span[@id="TabNode_tab0Tab"]//img',
       pniyaOptions: {
            records: '//a[@id="Node_navKbRecords"]/span[contains(text(), "רשומות מאגר ידע")]',
            activities: '//a[@id="Node_navActivities"]/span[contains(text(), "פעילויות")]',
            activityHistory: '//a[@id="Node_navActivityHistory"]/span[contains(text(), "פעילויות סגורות")]',
            connections: '//a[@id="Node_navConnections"]/span[contains(text(), "חיבורים")]',
            audit: '//a[@id="Node_navAudit"]/span[contains(text(), "היסטוריית ביקורת")]',
            panazIncident: '//a[@id="Node_nav_el_incident_el_panaz_incident"]/span[contains(text(), "קבילות")]',
            emails: '//a[@id="Node_nav_el_incident_email_incident"]/span[contains(text(), "הודעות דואר אלקטרוני")]',
            serviceAppointments: '//a[@id="Node_nav_moha_incident_serviceappointment_incidentId"]/span[contains(text(), "פעילויות שירות")]',
            tasks: '//a[@id="Node_nav_moha_incident_task"]/span[contains(text(), "משימות")]',
            events: '//a[@id="Node_nav_moha_incident_el_incident_event_incident"]/span[contains(text(), "מהלכי טיפול")]',
            subSubjects: '//a[@id="Node_nav_moha_incident_moha_subjectsub_inciden_incident"]/span[contains(text(), "תתי נושאים בפניה")]',
            pniyot: '//a[@id="Node_nav_el_incident_incident"]/span[contains(text(), "פניות")]',
            pniyotHatzibur: '//a[@id="Node_nav_moha_incident_moha_panaz_incident_id_incident"]/span[contains(text(), "פניות הציבור")]',
            asyncOperations: '//a[@id="Node_navAsyncOperations"]/span[contains(text(), "תהליכי רקע")]',
            processSessions: '//a[@id="Node_navProcessSessions"]/span[contains(text(), "תהליכים בזמן אמת")]',
       },

    }, /* end of nav */

    /* sub-nav */
    ribbonManager: {
        moreOptionsBtn: '//img[@class="ms-crm-moreCommand-image"]',

        tasks: {
            _save: '//span[@command="task|NoRelationship|Form|Mscrm.SavePrimary"]',
            _delete: '//span[@command="task|NoRelationship|Form|Mscrm.DeletePrimaryRecord"]',
            dismissTask: '//span[@command="task|NoRelationship|Form|Mscrm.Form.CloseActivity"]',
            markAsComplete: '//span[@command="task|NoRelationship|Form|Mscrm.SavePrimaryActivityAsComplete"]',
            saveAndClose: '//span[@command="task|NoRelationship|Form|Mscrm.SaveAndClosePrimary"]',
            openForm: '//span[@command="task|NoRelationship|Form|Mscrm.FormDesign.OpenFromForm"]',
            sendEmail: '//span[@command="task|NoRelationship|Form|Mscrm.SendShortcutPrimary"]',
            assign: '//span[@command="task|NoRelationship|Form|Mscrm.AssignPrimaryRecord"]',
        },

        service: {
            _save: '//a[@id="service|NoRelationship|Form|Mscrm.Form.service.Save-Large"]',
            saveAndClose: '//a[@id="service|NoRelationship|Form|Mscrm.Form.service.SaveAndClose-Large"]',
            saveAndNew: '//a[@id="service|NoRelationship|Form|Mscrm.Form.service.SaveAndNew-Medium"]',
            _delete: '//a[@id="service|NoRelationship|Form|Mscrm.Form.service.Delete-Medium"]',
            cancel: '//a[@id="service|NoRelationship|Form|Mscrm.Form.service.DeactivateService-Large"]',
            viewHierarchy: '//a[@id="service|NoRelationship|Form|Mscrm.Form.service.ViewHierarchy-Large"]',
        },

        serviceAppointment: {
            _save: '//a[@id="serviceappointment|NoRelationship|Form|moha.serviceappointment.Button2.Button-Large"]',
            saveAndClose: '//a[@id="serviceappointment|NoRelationship|Form|moha.serviceappointment.Button3.Button-Large"]',
            _delete: '//a[@id="serviceappointment|NoRelationship|Form|Mscrm.Form.serviceappointment.Delete-Medium"]',
            addNote: '//a[@id="serviceappointment|NoRelationship|Form|Mscrm.Form.serviceappointment.AddNoteToActivity-Large"]',
            time: '//a[@id="serviceappointment|NoRelationship|Form|el.serviceappointment.Button1.Button-Medium"]',
            returningAppointment: '//a[@id="serviceappointment|NoRelationship|Form|elad.Form.serviceappointment.MainTab.Actions.ReturningAppointment-Large"]',
            assign: '//a[@id="serviceappointment|NoRelationship|Form|Mscrm.Form.serviceappointment.Assign-Large"]',
            viewHierarchy: '//a[@id="serviceappointment|NoRelationship|Form|Mscrm.Form.serviceappointment.ViewHierarchy-Large"]',
            closeAppointment: '//a[@id="serviceappointment|NoRelationship|Form|Mscrm.Form.serviceappointment.Close-Large"]',
        },

        boards: {
            saveAs: '//span[@command="|NoRelationship||Mscrm.DashboardTools.SaveAsCommand"]',
            _new: '//span[@command="|NoRelationship||Mscrm.DashboardTools.New"]',
            setDefault: '//span[@command="|NoRelationship||Mscrm.DashboardTools.SetUserDefaultCommand"]',
            refresh: '//span[@command="|NoRelationship||Mscrm.DashboardTools.RefreshCommand"]',
            businessDaysCalculator: '//span[@command="|NoRelationship||moha.ApplicationRibbon.BusinessDaysCalculatorCommand.Command"]',
        },

        activities: {

        },

        cases: {
            newCase: '//div[@id="crmRibbonManager"]//span[contains(text(), "פניה חדשה")]',
            _save: '//span[@command="incident|NoRelationship|Form|Mscrm.SavePrimary"]',
            saveAndClose: '//span[@command="incident|NoRelationship|Form|Mscrm.SaveAndClosePrimary"]',
            _delete: '//span[@command="incident|NoRelationship|Form|Mscrm.DeletePrimaryRecord"]',
            assignToMoked_BO: '//span[@command="incident|NoRelationship|Form|el.incident.assignToMoked.Command"]',
            assignToNatzig: '//span[@command="incident|NoRelationship|Form|el.incident.assignToNatzig.Command"]',
            assignToTeam: '//span[@command="incident|NoRelationship|Form|el.incident.assignToTeam.Command"]',
            resolve: '//span[@command="incident|NoRelationship|Form|Mscrm.Form.incident.Resolve"]',
            edit: '//span[@command="incident|NoRelationship|HomePageGrid|Mscrm.EditSelectedRecord"]',
            cancel: '//span[@command="incident|NoRelationship|Form|Mscrm.Form.incident.Cancel"]',
            addTask: '//span[@command="incident|NoRelationship|Form|Mscrm.AddTaskToPrimaryRecord"]',
            sendSMS: '//span[@command="incident|NoRelationship|Form|moha.incident.SendSMS.Command"]',

            moreOptions: {
                serviceActivity: '//span[@command="incident|NoRelationship|Form|Mscrm.AddServiceActivityToPrimaryRecord"]',
                showInfo: '//span[@command="incident|NoRelationship|Form|Elad.Form.incident.MainTab.Collaborate.CheckLicenses.Command"]',
                convertKvila: '//span[@command="incident|NoRelationship|Form|moha.incident.ConvertKvila.Command"]',
                panazRecord: '//span[@command="incident|NoRelationship|Form|moha.incident.CreatePanazRecord"]',
            },
        },
    }, /* end of ribbon manager (sub-nav) */

    businessDaysCalculator: {
        window: 'title=מחשבון ימי עסקים',
        startDate: '//input[@id="startDate"]',
        weekToCalculate: '//input[@id="weekToCalculate"]',
        daysToCalculates: '//input[@id="daysToCalculate"]',
        calcTypeCalendrical : '//input[@id="calcTypeCalendrical"]',
        calcTypeBusiness: '//input[@id="calcTypeBusiness"]',
        calculate: '//button[@id="calculateBtn"]',
        dueDate: '//input[@id="dueDate"]',
    },

    cases: {
        caseType: '//div[@id="casetypecode"]',
        caseType_corona: '//td[@id="moha_corona_case_type_d"]',
        pniyaType: '//label[@id="סוג פניה_label"]',
        pniyaType_corona: '//label[@id="סוג פנית קורונה_label"]',
        pniyaNumber: '//div[@id="FormTitle"]/h1',
        mobilePhoneField: '//div[@id="el_mobilephone"]',
        mobilePhoneInput: '//input[@id="el_mobilephone_i"]',
        mobilePhoneNumber: `//label[@id="מס' נייד_label"]`,
        custumerType: '//div[@id="el_b_customerid"]',
        owner: '//span[@id="header_ownerid_lookupValue"]',
        insuranceCompanyField: '//div[@id="moha_insurance_company"]',
        insuranceCompanyInput: '//input[@id="moha_insurance_company_ledit"]',
        insuranceCompanyValue: '//span[@id="moha_insurance_company_lookupValue"]',
        companyName: '//span[@id="el_id_account_lookupValue"]',
        contactName: '//span[@id="el_id_contact_lookupValue"]',
        responsibleContactField: '//div[@id="responsiblecontactid"]',
        responsibleContactInput: '//input[@id="responsiblecontactid_ledit"]',
        medicalType: '//div[@id="el_pl_medical_type"]',
        clinic: '//div[@id="el_pl_clinic"]',
        patientAgreementField: '//div[@id="el_b_patient_agreement_for_the_call"]',
        patientAgreement: '//label[@id="הסכמת המטופל לקיום השיחה_label"]',
        formSelector: '//a[@id="header_crmFormSelector"]',
        selectCase: '//select[@id="casetypecode_i"]',
        selectCase_corona: '//select[@id="moha_corona_case_type_i"]',
        language: '//div[@id="el_pl_language"]',
        languageLabel: '//div[@id="el_pl_language"]//label[@id="שפה_label"]',
        caseSource: '//div[@id="moha_source_incident"]',
        serviceType: '//div[@id="moha_service_type"]',
        contactIdField_corona: '//div[@id="el_contact_id"]',
        contactIdInput_corona: '//input[@id="el_contact_id_i"]',
        newContactField: '(//span[@id="el_id_contact_cl"]//..//..//..//div[contains(@class, "ms-crm-Inline-Lookup")])[1]',
        newContactInput: '//input[@id="el_id_contact_ledit"]',
        newContactSearchBtn: '//img[@id="el_id_contact_i"]',
        addNewContact: '//div[contains(@class, "AddNew")]/a[contains(@title, "איש קשר חדש")]',
        descriptionField: '//div[@id="description"]',
        descriptionInput: '//textarea[@id="description_i"]',
        handlingTeamField: '//div[@id="el_id_team"]',
        handlingTeamInput: '//input[@id="el_id_team_ledit"]',
        handlingTeamName: '//span[@id="el_id_team_lookupValue"]',
        subSubjectField: '//div[@id="el_id_subjectsub_type"]',
        subSubjectInput: '//input[@id="el_id_subjectsub_type_ledit"]',
        subjectField: '//div[@id="el_id_subjectmain_type"]',
        subjectInput: '//input[@id="el_id_subjectmain_type_ledit"]',
        incorrectAssignment: '//input[@id="el_b_incorrect_assignment_i"]',
        assignReasonField: '//div[@id="el_assign_reason"]',
        assignReasonInput: '//input[@id="el_assign_reason_ledit"]',
        reasonDescriptionField: '//div[@id="el_s_incorrect_assign"]',
        reasonDescriptionTextarea: '//textarea[@id="el_s_incorrect_assign_i"]',
        unitField: '//div[@id="el_id_businessunit_status"]',
        unitInput: '//input[@id="el_id_businessunit_status_ledit"]',
        processField: '//div[@id="el_id_process_type"]',
        processInput: '//input[@id="el_id_process_type_ledit"]',
        companyField: '//div[@id="el_id_account"]',
        companyInput: '//input[@id="el_id_account_ledit"]',
        checkList: '//label[@id="צ\'ק ליסט לנציג_label"]',
        serviceTypeField: '//div[@id="el_id_service_type"]',
        serviceTypeInput: '//div[@id="el_id_service_type_ledit"]',
        healthyThought: '//div[@id="moha_exists_healthy_thought"]',
        healthyThoughtTest: '//div[@id="moha_test_healthy_thought"]',
        addSubjectBtn: '//img[@id="sub_subject_grid_addImageButtonImage"]',
        sampleDateField_corona: '//div[@id="moha_sampling_date"]',
        sampleDateInput_corona: '//input[@id="moha_sampling_date_iDateInput"]',
        samplePlaceField_corona: '//div[@id="moha_sampling_place"]',
        samplePlaceInput_corona: '//input[@id="moha_sampling_place_i"]',
        clinicEvac_corona: '//div[@id="moha_is_call_clinic"]',
        familyContactNameField_corona: '//div[@id="moha_ger_contact_name"]',
        familyContactNameInput_corona: '//input[@id="moha_ger_contact_name_i"]',
        familyContactIdField_corona: '//div[@id="moha_ger_contact_id"]',
        familyContactIdInput_corona: '//input[@id="moha_ger_contact_id_i"]',
        familyContactPhoneField_corona: '//div[@id="moha_ger_contact_phone"]',
        familyContactPhoneInput_corona: '//input[@id="moha_ger_contact_phone_i"]',
        familyContactRelationshipField_corona: '//div[@id="moha_ger_relationship"]',
        familyContactRelationshipInput_corona: '//input[@id="moha_ger_relationship_i"]',
        institutionNameField_corona: '//div[@id="moha_id_geriatric_institution"]',
        institutionNameInput_corona: '//input[@id="moha_id_geriatric_institution_ledit"]',
        details_institutionNameField_corona: '//div[@id="moha_id_geriatric_institution1"]',
        details_institutionNameInput_corona: '//input[@id="moha_id_geriatric_institution1_ledit"]',
        continueTreatmentField_corona: '//div[@id="moha_continue_treatment"]',
        continueTreatmentInput_corona: '//input[@id="moha_continue_treatment_ledit"]',
        isolationRreasonField_corona: '//div[@id="moha_id_isolation_reason"]',
        isolationRreasonInput_corona: '//input[@id="moha_id_isolation_reason_ledit"]',
        decisionField_corona: '//div[@id="moha_id_decision1"]',
        decisionInput_corona: '//input[@id="moha_id_decision1_ledit"]',
        handlerField_corona: '//div[@id="moha_id_handler_center"]',
        handlerInput_corona: '//input[@id="moha_id_handler_center_ledit"]',
        smsMobilePhoneField_corona: '//div[@id="moha_sms_mobile_phone"]',
        smsMobilePhoneInput_corona: '//input[@id="moha_sms_mobile_phone_i"]',
    },

    newContactPage: {
        firstNameField: '//div[@id="firstname"]',
        firstNameInput: '//input[@id="firstname_i"]',
        lastNameField: '//div[@id="lastname"]',
        lastNameInput: '//input[@id="lastname_i"]',
        idField: '//div[@id="governmentid"]',
        idInput: '//input[@id="governmentid_i"]', 
        mobileField: '//div[@id="mobilephone"]',
        mobileInput: '//input[@id="mobilephone_i"]',
        emailField: '//div[@id="emailaddress1"]',
        emailInput: '//input[@id="emailaddress1_i"]',
    },


    
    korona: {
        nav: {
            koronaOptionsArrow: '//span[text()="קורונה"]//..//..//..//..//span[@class="navTabButtonArrowDown"]',
            koronaOptions: {
                NCOV: '//span[@class="nav-rowLabel" and contains(text(), "חקירות מקרים NCOV")]',
            }
        },

        ribbonManager: {
            _new: '//span[@command="new_ncoronavinvestigation|NoRelationship|HomePageGrid|Mscrm.NewRecordFromGrid"]',
        },

        utils: {
            errorMsg: '//div[@id="ErrorTitle"]',
        },

        NCOV: {
            newContactHeader: '//div[contains(@id,"quickcreate")]//div[@class="mscrm-globalqc-entityname"]',
            searchInput: '//input[@id="crmGrid_findCriteria"]',
            newContactField: '//div[@id="new_contact"]',
            newContactSearchBtn: '//img[@id="new_contact_i"]',
            addNewContactBtn: '//a[contains(@class, "FooterSection-AddAnchor") and text()="חדש"]',
            newIdentityTypeField: '//div[@id="new_identitytypecode"]',
        },

    }

}

module.exports = objects


/* 

const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const fun = obj.functions
const manager = obj.ribbonManager

web.transaction('Login With Moked Rep & Open Main Page')
startTime = fun.getTime()
obj.login(
    env.users.moked_rep.username,
    env.users.moked_rep.password,
    env.url,
    30
)

web.transaction('Create First Case')
fun.navigateToCases()

endTime = fun.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)

*/