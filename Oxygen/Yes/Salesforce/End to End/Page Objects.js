const objects = {

    init: (url, t) => {    
        web.transaction('01. Initialize')
        web.init()
        web.setTimeout(t * 1000)

        web.transaction('02. Open Login Page')
        web.open(url)
        web.assertExist('id=main')
        assert.equal(web.isVisible('id=main'), true)

        web.transaction('03. Login')       
        objects.type('id=username', env.username)
        objects.type('id=password', env.password)
        /* remember me? */// objects.click('id=rememberUn') 
        objects.click('id=Login')
            
        assert.equal(web.isVisible(objects.utils.appName), true)
    },

    pickApp: (app) => {
        checkApp = () => {
            let loops = 0
            if (!web.isVisible(objects.utils.appName, 10 * 1000)) {
                loops++
                if (loops > 10) {
                    assert.fail('There was a problem loading the app')
                }  
                web.refresh()
                checkApp()
            } 
        }
        checkApp()
        
        let currentApp = web.getText('//*[contains(@class, "appName")]/span')
        log.info('Current App: ' + currentApp)

        if (app == currentApp) 
            return

        if ((app == 'Alpha 360' || app == 'אלפא') && (currentApp == 'לידים'  ||currentApp == 'Sales')) {
            objects.click('//one-app-launcher-header/button')
            objects.type('//input[contains(@placeholder, "חפש יישומים ופריטים")]', 'אלפא')
            objects.functions.pressENTER()
        }

        if ((app == 'לידים'  ||app == 'Sales')  && (currentApp == 'Alpha 360' || currentApp == 'אלפא')) {
            objects.click('//button[contains(@class, "salesforceIdentityAppLauncherHeader")]')
            objects.type('//input[contains(@placeholder, "חפש יישומים ופריטים")]', 'לידים')
            objects.functions.pressENTER()
            web.waitForExist('//a[@title="לידים"]')
        }

    },

    /* functions */
    
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

        generateNumber: () => {
            return Math.random().toString().slice(2, 11)
        },

        generatePhone: () => {
            let pre = ['050', '052', '054']
            return String(
                pre[Math.floor(Math.random() * pre.length)]
                + Math.random().toString().slice(2, 9)
            )
        },

        generateEmail: () => {
            let name = ''
            let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let domains = ['gmail', 'hotmail', 'yahoo', 'live', 'gmx']
            for(let x = 0; x < Math.floor(Math.random() * 9) + 1; x++) { 
                name += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            //return `${name}@${domains[Math.floor(Math.random() * domains.length) + 1]}.com`
            return name + '@' + domains[Math.floor(Math.random() * domains.length) + 1] + '.com'
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

        getGreenMessage: () => {
            let message = '//span[contains(@class, "forceActionsText")]'
            web.waitForVisible(message)
            if (web.getText(message).length < 1) {
                let loops = 0
                while (web.getText(message).length < 1) {
                    web.getText(message)
                    loops++
                    if (loops > 15) {
                        break
                    }
                }
                return web.getText(message)
            }
            return 'Message was not found'  
        },

        // note: this doesn't delete the new account
        createAccount: (name) => { 
            const new_account = objects.accounts.newAccount
            web.waitForVisible(objects.home.nav.accounts)
            objects.click(objects.home.nav.accounts)
            
            // new account (billing)
            web.waitForVisible(objects.utils.newBtn)
            po.click(objects.utils.newBtn)
            // choose account type
            web.waitForVisible(new_account.billingBtn)
            po.click(new_account.billingBtn)
            po.click(objects.utils.nextBtn)
            // fill account details
            web.waitForVisible(new_account.accountName)
            po.type(new_account.accountName, name)
            po.click(objects.utils.save)
            web.pause(2500)
            // assert account
            web.waitForVisible('(//span[@class="custom-truncate uiOutputText"])[1]')
            if (!web.isExist(`(//span[@class="custom-truncate uiOutputText" and text()="${name}"])[1]`)) {
                assert.fail(`${name} was not created`)
            }
        },

        createNewNote: (title, text) => {
            const obj = objects
            const notes = obj.notes

            web.waitForVisible(obj.home.nav.notes)
            web.execute(() => {
                getElementByXPath = (xpath) => {
                    return document.evaluate(
                        xpath, 
                        document, 
                        null, 
                        XPathResult.FIRST_ORDERED_NODE_TYPE, 
                        null
                    ).singleNodeValue
                }
                getElementByXPath('//a[@href="/lightning/o/ContentNote/home"]').click()
            })

            obj.click(obj.utils.newBtn)
            web.pause(2500)
            obj.type(notes.title, title)
            obj.click(notes.textArea)
            web.pause(2500)
            obj.type(notes.textArea, text)
            web.pause(2500)

            obj.functions.pressENTER()

            if (!web.isVisible(`//h2[contains(@class, "title")]/span[text()="${title}"]`)) {
                obj.click(notes.share)
                web.pause(2500)
                if (!web.isVisible(notes.done)) {
                    web.waitForVisible(notes.done)
                }
                obj.click(notes.done)
            }
        },

        confirmDelete: () => {
            web.waitForVisible(objects.utils.popUpDeleteBtn)
            objects.click(objects.utils.popUpDeleteBtn)
            web.pause(2500)
        },

        changePassword: (oldPass, newPass) => {
            let obj = objects
            obj.type('id=currentpassword', oldPass)
            obj.type('id=newpassword', newPass)
            obj.type('id=confirmpassword', newPass)
            obj.type('id=answer', 'answer')
            obj.click('id=password-button')
        },

        navigateToLeads: () => {
                web.pause(1000)
                web.execute(() => {
                document.evaluate(
                    '//a[@href="/lightning/o/Lead/home"]', document,
                    null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue.click()
            })
        },

        pressENTER: () => {
            web.pause(1000)
            web.sendKeys('\uE007')
            web.pause(1000)
        },

        pressTAB: () => {
            web.pause(1000)
            web.sendKeys('\uE004')
            web.pause(1000)
        },

        pressARROW_DOWN: () => {
            web.pause(1000)
            web.sendKeys('\uE015')
            web.pause(1000)
        },

        refresh: () => {
            web.pause(1000)
            web.refresh()
            web.pause(1000)
        },

    }, /* end of functions */
    
    /* override click & type */ 
    click: function(element) {
        web.pause(1000)
        /* wait for JS to load */
        web.waitForVisible(element)
        po.click(element)
    },
    type: function(element, text) {
        web.waitForVisible(element)
        po.type(element, text)
    },


    /* Elements */

    loginScreen: {
        loginBtn: 'id=Login',
        usernameField: 'id=username',
        passwordField: 'id=password',
        addPhoneNumber: '//h2[contains(text(), "רשום את הטלפון הנייד שלך")]',

        changePasswordScreen: {
            changePasswordHeader: '//h2[text()="שנה את סיסמתך"]',
            currentPasswordInput: '//input[@id="currentpassword"]',
            newPasswordInput: '//input[@id="newpassword"]',
            confirmPasswordInput: '//input[@id="confirmpassword"]',
            answerInput: '//input[@id="answer"]',
            changePasswordBtn: '//button[@name="save" and not(@disabled)]',
            cancelButton: '//button[@name="cancel"]',
        }
    },

    /* Sales App */
    home: {
        mainInputField: '//input[contains(@class, "uiInputTextForAutocomplete")]',
        helpBtn: '//button[contains(@class, "forceHeaderButton oneHelpAndTrainingExperience")]',
        globalActionsBtn: '//a[contains(@class, "globalCreateTrigger")]',
        globalActions: {
            newTask: '//span[text()="New Task"]',
            newEvent: '//span[text()="New Event"]',
            logCall: '//span[text()="Log a Call"]',
            newNote: '//span[text()="New Note"]',
            newContact: '//span[text()="New Contact"]',
            newOpportunity: '//span[text()="New Opportunity"]',
            newLead: '//span[text()="New Lead"]'
        },

        nav: {
            navbar: '//div[@class="slds-context-bar"]',
            home: '//a[@href="/lightning/page/home"]',
            gettingStarted: '//a[contains(@href, "Getting_Started")]',
            accounts: '//a[@href="/lightning/o/Account/home"]',
            contacts: '//a[@href="/lightning/o/Contact/home"]',
            leads: '//a[@href="/lightning/o/Lead/home"]',
            opportunity: '//a[@href="/lightning/o/Opportunity/home"]',
            tasks: '//a[@href="/lightning/o/Task/home"]',
            calendar: '//a[@href="/lightning/o/Event/home"]',
            dashboard: '//a[@href="/lightning/o/Dashboard/home"]',
            notes: '//a[@href="/lightning/o/ContentNote/home"]',
            reports: '//a[@href="/lightning/o/Report/home"]',
            groups: '//a[@href="/lightning/o/CollaborationGroup/home"]',
            forecasts: '//a[@title="Forecasts"]',
            files: '//a[@href="/lightning/o/ContentDocument/home"]',
            listEmails: '//a[@href="/lightning/o/ListEmail/home"]',
            quotes: '//a[@href="/lightning/o/Quote/home"]',
            chatter: '//a[@href="/lightning/page/chatter"]',
            ACC: '//a[contains(@href, "Additional_Communication_Channel")]', // Additional Communication Channels
            enrollment: '//a[contains(@href, "/lightning/o/Enrollment")]',
            productCategories: '//a[contains(@href, "Product_Categories")]',
            campaigns: '//a[@href="/lightning/o/Campaign/home"]',
            moreBtn: '//nav[@aria-label="Global Navigation"]//span[text()="More"]',
            
            moreOptions: {
                cities: '//a[contains(@href, "City")]',
                leadCapacity: '(//a[contains(@href, "Lead_Capacity")])[2]',
                leadRouting: '(//a[contains(@href, "Lead_Routing")])[2]'
            }
        },
    },

    utils: {
        appName: '//*[contains(@class, "appName")]/span',
        newBtn: '(//a[@title="New"])[1]',
        importBtn: '//a[@title="Import"]',
        edit: '//a[@title="Edit"]',
        follow: '//span[@title="Follow"]',
        newContact: '//a[@title="New Contact"]',
        newOpportunity: '//a[@title="New Opportunity"]',
        listSearchField: '//input[@placeholder="Search this list..."]',
        refresh: '//button[@name="refreshButton"]',
        changeStatus: '//a[@title="Change Status"]',
        changeOwner: '//a[@title="Change Owner"]',
        newEvent: '//button[contains(text(), "New Event")]',
        newDashboard: '//a[@title="New Dashboard"]',
        newFolder: '(//button[contains(text(), "New Folder")])[2]',
        newReport: '//a[@title="New Report"]',
        newReportClassic: '//a[@title="New Report (Salesforce Classic)"]',
        uploadFiles: '//a[@title="Upload Files"]',
        editList: '//lightning-helptext[@title="Edit List"]',
        showMoreActions: '//span[contains(text(), "Show more actions")]',
        moreActions_delete: '//span[text()="Delete"]',
        save: '//div[contains(@class, "button-container")]//span[text()="Save"]',
        saveAndNew: '//span[contains(text(), "Save & New")]',
        saveAndNext: '//span[contains(text(), "Save & Next")]',
        nextBtn: '//div[@class="forceChangeRecordTypeFooter"]//span[contains(text(), "Next")]',
        deleteBtn: '//div[contains(@class, "actionsContainer")]//div[@title="Delete"]',
        popUpDeleteBtn: '//div[contains(@class, "modal-footer")]//span[text()="Delete"]',
        showActions: '//a[contains(@class, "rowActionsPlaceHolder")]',
        showActions_delete: '//div[@title="Delete"]',
        closeTAB: '//li[@data-aura-class="oneConsoleTabItem"]//button[contains(@title, "סגור")]',
    },

    accounts: {
        moreActionsArrow: '//div[@class="uiPopupTrigger"]//span[contains(text(), "actions")]',
        moreActions: {
            newLead: '//a[@title="New Lead"]',
            newNote: '//a[@title="New Note"]',
            changeOwner: '//a[@title="Change Owner"]',
            changeRecordType: '//a[@title="Change Record Type"]',
            deleteAccount: '//a[@title="Delete"]',
            viewHierarchy: '//a[@title="View Account Hierarchy"]',
            checkNewData: '//a[@title="Check for New Data"]',
            printableView: '//a[@title="Printable View"]'
        },

        newAccount: {
            billingBtn: '(//span[@class="slds-radio--faux"])[1]',
            billingAggregatorBtn: '(//span[@class="slds-radio--faux"])[2]',
            businessBtn: '(//span[@class="slds-radio--faux"])[3]',
            consumerBtn: '(//span[@class="slds-radio--faux"])[4]',
            otherBtn: '(//span[@class="slds-radio--faux"])[5]',
            serviceBtn: '(//span[@class="slds-radio--faux"])[6]',
            serviceAggregatorBtn: '(//span[@class="slds-radio--faux"])[7]',
            accountName: '//span[contains(text(), "Account Name")]//..//..//input[@aria-required="true"]',
            parentAccount: '//span[contains(text(), "Parent Account")]//..//..//input',
            phoneField: '(//span[contains(text(), "Phone")])[2]//..//..//input',
            searchAddress: '//span[contains(text(), "Search Address")]//..//..//button',
            
            statusBtn: '//span[contains(text(), "Status")]//..//..//a[contains(text(), "--None--")]',
            status: {
                active: '//a[text()="Active"]',
                inactive: '//a[text()="Inactive"]',
                expired: '//a[text()="Expired"]',
                pending: '//a[text()="Pending"]',
                suspended: '//a[text()="Suspended"]'
            },

            slaBtn: '//span[contains(text(), "SLA")]//..//..//a[contains(text(), "--None--")]',
            sla: {
                gold: '//a[text()="Gold"]',
                silver: '//a[text()="Silver"]',
                platinum: '//a[text()="Platinum"]',
                bronze: '//a[text()="Bronze"]'
            },
            
        },

    },

    contacts: {
        newContact: {
            salutationBtn: '//span[text()="Salutation"]//..//..//a',
            salutation: {
                mr: '//a[@title="Mr."]',
                ms: '//a[@title="Ms."]',
                mrs: '//a[@title="Mrs."]',
                dr: '//a[@title="Dr."]',
                prof: '//a[@title="Prof."]',
            },

            firstName: '//input[contains(@class, "firstName")]',
            middleName: '//input[contains(@class, "middleName")]',
            lastName: '//input[contains(@class, "lastName")]',
            suffix: '//input[contains(@class, "suffix")]',
            accountName: '//input[@title="Search Accounts"]',
            title: '//span[contains(text(), "Title")]//..//..//input',
            email: '(//span[contains(text(), "Email")]//..//..//input)[2]',
            phone: '(//span[contains(text(), "Phone")]//..//..//input)[2]',
            mobile: '//span[contains(text(), "Mobile")]//..//..//input',
            reportsTo: '//span[contains(text(), "Reports To")]//..//..//input',
            department: '//span[contains(text(), "Department")]//..//..//input',
            fax: '//span[contains(text(), "Fax")]//..//..//input'
        }

    },

    leads: {
        newLead: {
            leadStatusBtn: '((//span[contains(text(), "Lead Status")])[2]//..//..//a)[1]',
            leadStatus: {
                unqualified: '//a[@role="menuitemradio" and @title="Unqualified"]',
                _new: '//a[@role="menuitemradio" and @title="New"]',
                working: '//a[@role="menuitemradio" and @title="Working"]',
                nurturing: '//a[@role="menuitemradio" and @title="Nurturing"]',
                qualified: '//a[@role="menuitemradio" and @title="Qualified"]',
                continueHandling: '//a[@role="menuitemradio" and @title="Continue Handling"]',
                decline: '//a[@role="menuitemradio" and @title="Decline"]',
                convertedToOrder: '//a[@role="menuitemradio" and @title="Converted To Order"]',
                closedLost: '//a[@role="menuitemradio" and @title="Closed Lost"]',
            },

            salutationBtn: '//span[text()="Salutation"]//..//..//a',
            salutation: {
                mr: '//a[@title="Mr."]',
                ms: '//a[@title="Ms."]',
                mrs: '//a[@title="Mrs."]',
                dr: '//a[@title="Dr."]',
                prof: '//a[@title="Prof."]',
            },

            id: '(//span[text()="Id Number"]//..//../input)[1]',
            firstName: '//input[contains(@class, "firstName")]',
            middleName: '//input[contains(@class, "middleName")]',
            lastName: '//input[contains(@class, "lastName")]',
            suffix: '//input[contains(@class, "suffix")]',
            title: '//span[contains(text(), "Title")]//..//..//input',
            email: '(//span[contains(text(), "Email")]//..//..//input)[2]',
            phone: '(//span[contains(text(), "Phone")]//..//..//input)[2]',
            mobile: '//span[contains(text(), "Mobile")]//..//..//input',
            website: '(//span[text()="Website"]//..//..//input)[1]',
            company: '(//span[text()="Company"]//..//../input)[1]',
            
            ratingBtn: '(//span[text()="Rating"]//..//..//a)[1]',
            rating: {
                hot: '//a[@title="Hot"]',
                warm: '//a[@title="Warm"]',
                cold: '//a[@title="Cold"]'
            }

        },

    },

    opportunities: {
        newOpportunity: {
            name: '//span[contains(text(), "Opportunity Name")]//..//../input',
            accountName: '//input[@placeholder="Search Accounts..."]',
            closeDate: '(//span[contains(text(), "Close Date")])[2]//..//..//input',

            stageBtn: '(//span[contains(text(), "Stage")])[2]//..//..//a',
            stage: {
                qualification: '//a[@title="Qualification"]',
                needsAnalysis: '//a[@title="Needs Analysis"]',
                proposal: '//a[@title="Proposal"]',
                negotiation: '//a[@title="Negotiation"]',
                closedWon: '//a[@title="Closed Won"]',
                closedLost: '//a[@title="Closed Lost"]'
            },

        },

    },
    
    tasks: {
        newTask: {
            moreOptionsBtn: '//a[@title="Show one more action"]',
            _new: '//li[@class="uiMenuItem"]//a[@title="New Task"]',
            subject: '//label[contains(text(), "Subject")]//..//input',

            priorityBtn: '//span[contains(text(), "Priority")]//..//..//a',
            priority: {
                high: '//a[@title="High"]',
                normal: '//a[@title="Normal"]'
            },

            statusBtn: '//span[contains(text(), "Status")]//..//..//a',
            status: {
                open: '//a[@title="Open"]',
                completed: '//a[@title="Completed"]'
            },

        },

    },
    
    calendar: {
        deleteBtn: '//a[@class="forceActionLink" and @title="Delete"]',

        newEvent: {
            subject: '//label[contains(text(), "Subject")]//..//input',
            startDate: '(//legend[contains(text(), "Start")]//..//input)[1]',
            endDate: '(//legend[contains(text(), "End")]//..//input)[1]',
            startTime: '(//label[contains(text(), "Time")]//..//input)[1]',
            endTime: '(//label[contains(text(), "Time")]//..//input)[2]'
        },

    },

    notes: {
        title: '//input[@class="inputText notesTitle flexInput input"]',
        textArea: '//div[@data-placeholder="Enter a note..."]/p',
        share: '//span[contains(text(), "Share")]',
        addToRecords: '//span[contains(text(), "Add to Records")]',
        deleteBtn: '//span[contains(text(), "Delete")]',
        viewHistory: '//button[contains(text(), "View Version History")]',
        done: '(//span[contains(text(), "Done")])[2]'
    },

    reports: {
        frame: '//iframe[@class="isEdit reportsReportBuilder"]',
        newReport: '//a[@title="New Report"]',
        newReportClassic: '//a[@title="New Report (Salesforce Classic)"]',
        newFolder: '//button[@title="New Folder"]',
        continueBtn: '//button[contains(@class, "report-type-continue")]',
        run: '//button[text()="Run"]',
        saveAndRun: '//button[contains(text(), "Save & Run")]',
        close: '//button[text()="Close"]',

        moreActionsArrow: '//span[contains(text(), "More Actions")]',
        moreActions: {
            saveBtn: '//span[contains(text(), "Save")]',
            exportBtn: '//span[contains(text(), "Export")]',
            deleteBtn: '//span[contains(text(), "Delete")]'
        },

        save: {
            nameInput: '//input[@id="reportName"]',
            saveBtn: '//button[contains(text(), "Save")]'
        },

    },

    files: {
        upload: '//a[@title="Upload Files"]',
        list: '(//div[@data-aura-class="forceInlineEditGrid"])[2]',
        ownedByMe: '//a[contains(text(), "Owned by Me")]',
        sharedWithMe: '//a[contains(text(), "Shared with Me")]',
        recent: '//a[contains(text(), "Recent")]',
        following: '//a[contains(text(), "Following")]',
        libraries: '//a[contains(text(), "Libraries")]',

        panel: {
            input: '(//div[contains(@class, "notesTitle")])[2]//input',
            done: '//div[contains(@class, "slds-is-open")]//span[text()="Done"]',
            addToRecords: '//div[contains(@class, "slds-is-open")]//span[text()="Add to Records"]',
            share: '//div[contains(@class, "slds-is-open")]//span[text()="Share"]',
            _delete: '//div[contains(@class, "slds-is-open")]//span[text()="Delete"]'
        }
    },

    chatter: {
        openInput: '//button[@title="Share an update..."]',
        inputArea: '//div[@data-placeholder="Share an update..."]',
        share: '//button[contains(text(), "Share") and not(@disabled="true")]'
    },

    // Additional Communication Channels
    ACC: {
        billingAccount: '//span[contains(text(), "Billing Account")]//..//..//input',
        legacyID: '//span[contains(text(), "Channel Legacy Id")]//..//..//input',
        channelNumber: '//span[contains(text(), "Channel Number")]//..//..//input',
        legacyExternalID: '//span[contains(text(), "Legacy Channel External Id")]//..//..//input',

        channelTypeSelect: '//span[contains(text(), "Channel Type")]//..//..//a',
        channelTypes: {
            M: '//a[@title="M"]',
            C: '//a[@title="C"]',
            MF: '//a[@title="MF"]',
            F: '//a[@title="F"]',
            O: '//a[@title="O"]',
            W: '//a[@title="W"]',
            H: '//a[@title="H"]',
            MB: '//a[@title="MB"]',
            CB: '//a[@title="CB"]',
            FB: '//a[@title="FB"]'
        }
    },

    enrollment: {
        nameField: '(//span[contains(text(), "Enrollment Name")]//..//..//input)[2]',
        handlingQueue: '(//span[contains(text(), "Handling Queue")])[1]//..//..//input',

        handlingCompanyBtn: '(//span[contains(text(), "Handling Company")])[1]//..//..//a',
        handlingCompanies: {
            bezeqInternational: '//a[@title="Bezeq International"]',
            pelephone: '//a[@title="pelephone"]',
            yes: '//a[@title="yes"]',
        },

        queueTypeBtn: '(//span[contains(text(), "Queue Type")])[1]//..//..//a',
        queueTypes: {
            first: '//a[@title="First Queue"]',
            middle: '//a[@title="Middle Queue"]',
            last: '//a[@title="Last Queue"]'
        },
    },

    productCategories: {
        nameField: '(//span[contains(text(), "Category Name")]//..//..//input)[2]',
        
        handlingCompanyBtn: '(//span[contains(text(), "Handling Company")])[1]//..//..//a',
        handlingCompanies: {
            bezeqInternational: '//a[@title="Bezeq International"]',
            pelephone: '//a[@title="Pelephone"]',
            yes: '//a[@title="Yes"]',
        },
    },

    campaigns: {
        controlsBtn: '//button[@title="List View Controls"]',
        controls: {
            newBtn: '//span[contains(text(), "New")]',
            _new: {
                listName: '(//input[contains(@id, "input")])[3]',
                // listName: '//label[contains(text(), "List Name")]//..//input[@id="input-142" or(@pattern=".*S.*")]',
                listApiName: '(//input[contains(@id, "input")])[4]',
                // listApiName: '//label[contains(text(), "List API Name")]//..//input[@id="input-143" or(@name="developerName")]',
                save: '//div[contains(@class, "modal-footer")]/button/span[text()="Save"]'
            },

            clone: '//span[contains(text(), "Clone")]',
            rename: '//span[contains(text(), "Rename")]',
            sharingSettings: '//span[contains(text(), "Sharing Settings")]',
            showListFilters: '//span[contains(text(), "Show List Filters")]',
            fieldsToDisplay: '//span[contains(text(), "Select Fields to Display")]',
            _delete: '//span[contains(text(), "Delete")]',
            resetColumnWidth : '//span[contains(text(), "Reset Column Width")]'
        },

        save: '//button[contains(text(), "Save")]',
        addFilter: '//a[text()="Add Filter"]',
        addFilterLogic: '//a[text()="Add Filter Logic"]',
        removeAll: '//a[text()="Remove All"]'
    },

    cities: {
        cityName: '(//span[text()="City Name"])[2]//..//..//input',
        cityCode: '(//span[text()="City Code"])[1]//..//..//input',
        D2D_Manager: '(//span[text()="D2D Manager"])[1]//..//..//input',
    },


    /* Sales App in hebrew has different locators */
    hebrew: {
        leads: {
            all: '(//span[@class=" virtualAutocompleteOptionText" and text()="All"])[1]',
            all_hebrew: '(//span[@class=" virtualAutocompleteOptionText" and text()="כל הלידים הפתוחים"])[1]',
            recentlyViewed: '//span[@data-aura-class="uiOutputText" and contains(text(), "הוצגו לאחרונה")]',
            moreActionsArrow: '//li[contains(@class, "oneActionsDropDown")]//lightning-icon',
            createNewLead: '//a[@title="יצירת ליד חדש"]',
            newLeadBtn: '//div[@title="חדש/ה"]',
            firstName: '(//label[@aria-label="שם פרטי"]//..//..//input)[1]',
            lastName: '(//label[@aria-label="שם משפחה"]//..//..//input)[1]',
            phone: '(//label[@aria-label="מספר טלפון"]//..//..//input)[1]',
            id: '(//label[@aria-label="מספר זיהוי"]//..//..//input)[1]',
            finishLead: '//button[text()="סיום"]',
            finishUpdateLead: '//button[@name="סיים"]',
            findCustomers: '//button[@title="מצא לקוחות"]',
            createNewBillingAccount: '//input[contains(@id, "Create_New_Billing_Account")]',
            deleteLead: '//a[@title="מחיקה"]',
            confirmDelete: '//button[contains(@class, "forceActionButton")]/span[text()="מחיקה"]',
            customerConfirm: '//span[contains(text(), "אישור לקוח להעברת פרטים")]//..//span[@class="slds-checkbox_faux"]',

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

            offerGivenBtn: '(//label[text()="הצעה שניתנה"]//..//..//input)[1]',
            offerGiven: {
                yes_99: '(//label[text()="הצעה שניתנה"]//..//..//input)[1]//..//option[@value="YES 99"]',
                sting_90: '(//label[text()="הצעה שניתנה"]//..//..//input)[1]//..//option[@value="STING 90"]'
            },

            status: {
                interested: '//legend[contains(text(), "סטטוס")]//..//span[text()="מעוניין"]',
                continueTreatment: '//legend[contains(text(), "סטטוס")]//..//span[text()="המשך טיפול"]',
                denial: '//legend[contains(text(), "סטטוס")]//..//span[text()="סירוב"]',
                noAnswer: '//legend[contains(text(), "סטטוס")]//..//span[text()="אין מענה"]',
                wrongLead: '//legend[contains(text(), "סטטוס")]//..//span[text()="ליד שגוי"]',
            },

            rivalCompanies: {
                hot: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="HOT"]',
                netflix: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="Netflix"]',
                next: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="Next"]',
                other: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="אחר"]',
                triple_C: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="טריפל C"]',
                idanPlus: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="עידן +"]',
                rimon: '//legend[contains(text(), "חברה מתחרה")]//..//span[text()="רימון"]',
            }

        }

    },
    

    /* hebrew alpha 360 */
    alphaMainPage: {

        customerName: 'ליאור וייסמן',
        accountNumber: '2361818',
        phoneNumber: '0526455282',
        device: 'A7655945000078FB',

        navigationBtn: '//button[contains(@title, "תפריט ניווט")]',
        navigationOptions: {
            home: '//span[text()="בית"]',
            customers: '//span[text()="איתור לקוח"]',
            leads: '//span[text()="לידים"]',
            contacts: '//span[text()="אנשי קשר"]',
            accounts: '//span[text()="חשבונות"]',
        },

    },

    /* Search Customer Page */
    searchCustomerPage: {
        header: '//h2[text()="איתור לקוח"]',
        searchBtn: '//button[@title="חפש"]',

        searchParametersBtn: '//input[@name="searchParam"]',
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
    },

    /* customer details 360 */
    customerDetails360: {
        elements: {
            customerLink: '(//span[@title="מסך משותף 360"]//..//..//..//a[contains(@class, "forceOutputLookup")])[1]',
            closeTabButton: '//button[contains(@title, "Close") or contains(@title, "סגור")]',
        },
        
        search: (customer, timeout = 60 * 1000) => {
            const customerLink = po.customerDetails360.elements.customerLink

            po.click(po.home.mainInputField)
            po.type(po.home.mainInputField, customer)
            po.functions.pressENTER()

            if (!web.isVisible(customerLink, timeout)) {
                let loops = 0
                while (!web.isVisible(customerLink, timeout)) {
                    po.type(po.home.mainInputField, customer)
                    po.functions.pressENTER()
                    loops++
                    if (loops > 15) {
                        assert.fail(`ללקוח ${customer} לא קיים מסך משותף 360`)
                        return false
                    } 
                }
            }    
            return true
        },

        closeAllTabs: () => {
            
            web.pause(2000) // page opens with several tabs, but then another tab adds up
            const closeTabButton = po.customerDetails360.elements.closeTabButton

            if (web.isVisible(closeTabButton, 5000)) {
                var TABS = web.getElementCount(closeTabButton)
            }

            if (TABS === 1) {
                while (web.isVisible(closeTabButton)) {
                    po.click(closeTabButton)
                    if (!web.isVisible(closeTabButton)) {
                        log.info('~~~> closed 1 tab')
                        break
                    }    
                }
            } else if (TABS > 1) {
                log.info('~~~> total tabs: ' + TABS)
                while (web.isVisible(`(${closeTabButton})[1]`)) {
                    po.click(`(${closeTabButton})[1]`)
                    if (!web.isVisible(closeTabButton, 2500)) {
                        break
                    } 
                }
                // for (let tab = TABS; tab >= TABS; tab--, TABS--) {
                //     if (tab == 0) { break }
                //     while (web.isVisible(`(${closeTabButton})[${tab}]`)) {
                //         web.clickHidden(`(${closeTabButton})[${tab}]`)
                //         if (!web.isVisible(closeTabButton)) {
                //             log.info('~~~> closed tab: ' + tab)
                //             break
                //         } 
                //     }
                // }
            }
        },

        loadCustomerDetails: () => {
            try { /* header details */
                var header = '//*[@data-component-id="alp360HeaderContainer"]//div[contains(@class, "slds-col")]'
                var headerDetails = web.getElementCount(header)
                for (let x = 1; x <= headerDetails; x++) {
                    web.waitForVisible(`(${header})[${x}]`)
                    // log.info(`Checked: ${web.getText(`(${header})[${x}]`)}`)
                }
            } catch(e) {
                log.info('Header has failed to load')
            }

            try { /* yes details */
                var yesTable = '//*[@data-component-id="alp360MainDetailsAdw"]//td'
                if (web.isVisible(yesTable, 500)) {
                    var yesTableDetails = web.getElementCount(yesTable)
                    for (let x = 1; x <= yesTableDetails; x++) {
                        web.waitForVisible(`(${yesTable})[${x}]`)
                        // log.info(`Checked: ${web.getText(`(${yesTable})[${x}]`)}`)
                    }
                }
            } catch(e) {
                log.info('Yes details table has failed to load')
            }
        },

    }, /* end of customer details 360 */


}

module.exports = objects