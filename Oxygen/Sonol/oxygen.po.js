module.exports = {

    init: (envName) => {
        mob.init({
            "deviceName": "Pixel 3a",
            "platformVersion": "13.0",
            "platformName": "Android",
            "appPackage": "com.sonol.mobileapp",
            "appActivity": "com.sonol.mobileapp.MainActivity",
            "automationName": "UIAutomator2",
            "autoGrantPermissions": true
        })
        po.loginScreen.chooseEnv(envName)
    },

    utils: {
        shortWait: 5000,
        waitASecond: 1000,
        longWait: 15 * 1000,

        getAppSource: () => {
            require('fs').writeFileSync(
                `${require('os').userInfo().homedir}\\Desktop\\src.txt`, mob.getSource()
            )
        },

        click: (el) => {
            mob.pause(po.utils.waitASecond)
            mob.findElement(el).click()
        },

        randomName: (length) => {
            let characters = 'קראטוןםפשדגכעיחלךףזסבהנמצתץ', counter = 0, first = '', second = '' 
            while (counter < length) {
                first += characters.charAt(Math.floor(Math.random() * characters.length))
                second += characters.charAt(Math.floor(Math.random() * characters.length))
                counter ++
            }
            return first + ' ' + second
        },
    }, // end of utils

    general: {
        nextButton: '//android.widget.TextView[@text="הבא"]',
        finishButton: '//android.widget.TextView[@text="סיום"]',
    }, // end of general

    loginScreen: {
        chooseEnvHeader: '//android.widget.TextView[contains(@text, "Choose environment")]',
        goButton: '//android.widget.Button//android.widget.TextView[contains(@text, "GO")]',
        otpFirstInput: '//android.widget.EditText[@content-desc="שדה קלט ראשון"]',
        phoneInput: '//android.widget.EditText[contains(@content-desc, "מספר נייד")]',
        nextButton: '//android.widget.TextView[@text="הבא"]',
        goToHomePageButton: '//android.widget.TextView[@text="לדף הבית"]',
        headingText: '//android.view.View[@text="התחברות"]',
        continueAsGuestButton: '//android.widget.TextView[@text="היכנסו כאורח"]',
        continueButton: 'text=הבא',
        homePageButton: 'text=לדף הבית',
        phoneNumberPrefixInput: '(//android.widget.EditText[contains(@content-desc, "מספר נייד")])[1]',
        phoneNumberInput: '(//android.widget.EditText[contains(@content-desc, "מספר נייד")])[2]',

        chooseEnv: (envName) => {
            if (mob.isVisible(po.loginScreen.chooseEnvHeader, po.utils.longWait)) {
                po.utils.click(`text=${envName}`)
                po.utils.click(po.loginScreen.goButton)
            }
        },

        enterPhoneNumber: (str) => {
            if (mob.isVisible(po.loginScreen.phoneInput, po.shortWait)) {
                mob.type(po.loginScreen.phoneInput, str)
            } else {
                mob.type(po.loginScreen.phoneNumberPrefixInput, str.substr(0, 3))
                mob.type(po.loginScreen.phoneNumberInput, str.substr(3, str.length))
            }
        },

        enterOtpNumber: (str) => {
            if (mob.isVisible('text=מה הקוד שקיבלת?', po.shortWait)) {
                let arr = str.split('')
                po.utils.click(po.loginScreen.otpFirstInput)
                for (let x = 0; x < arr.length; x++) {
                    mob.sendKeys(str[x])
                    mob.pause(po.utils.waitASecond)
                }
            }
        },

        loginWithPhoneNumber: (phone, otp) => {
            let tries = 10
            while (!mob.isVisible(po.homePage.profileButton, po.utils.shortWait)) {
                if (mob.isVisible(po.loginScreen.phoneInput, po.utils.shortWait)) {
                    po.loginScreen.enterPhoneNumber(phone)
                    po.loginScreen.enterOtpNumber(otp)
                } 
                if (mob.isVisible(po.loginScreen.nextButton, po.utils.shortWait)) {
                    po.utils.click(po.loginScreen.nextButton)
                    po.utils.click(po.loginScreen.goToHomePageButton)
                }
                if (tries == 0) break
                else tries--
            }
            po.homePage.assertHomePage()
        },

    }, // end of loginScreen

    homePage: {
        profileButton: '//android.view.ViewGroup[contains(@content-desc, "תמונת פרופיל")]',
        goodsCollected: '//android.widget.TextView[contains(@text, "צברת")]//..//android.widget.TextView[contains(@text, "goods")]',
        benefitsMessage: '//android.widget.TextView[@text="הטבות שוות מסונול!"]',
        homeButton: '//android.widget.TextView[@text="בית"]',
        stationsButton: '//android.widget.TextView[@text="תחנות"]',
        fuelingButton: '//android.widget.Button[@content-desc="תדלוק בקליק"]/android.widget.ImageView',
        storePayButton: '//android.widget.Button[contains(@content-desc, "תשלום בחנות")]',
        actionsAndInfoButton: '//android.widget.TextView[@text="עוד"]',
        
        assertHomePage: () => {
            assert.equal(
                mob.isVisible(po.homePage.fuelingButton), true,
                'לא מופיע כפתור תדלוק בקליק'
            )

            assert.equal(
                mob.isVisible(po.homePage.benefitsMessage), true,
                'לא מופיע הודעת הטבות'
            )

            if (mob.isVisible(po.homePage.goodsCollected)) {
                log.info('צברת ' + mob.getText(po.homePage.goodsCollected))
            }
        },
    }, // end of homePage

    profilePage: {
        fullName: '//android.widget.TextView[contains(@text, "אוטומצי")]',
        editProfileButton: '//android.widget.TextView[@text="עריכה"]',
        goods: '//android.widget.TextView[contains(@text, "goods")]',
        myCarsButton: '//android.widget.TextView[@text="הרכבים שלי"]',
        creditCardsButton: '//android.widget.TextView[@text="אמצעי תשלום"]',
        securityButton: '//android.widget.TextView[@text="אמצעי אבטחה"]',
        paymentHistoryButton: '//android.widget.TextView[@text="הסטוריית תשלומים"]',
        settingsButton: '//android.widget.TextView[@text="הגדרות"]',
        
        editProfileScreen: {
            editFullNameInput: '//android.widget.TextView[@text="שם מלא"]//..//android.widget.EditText',
            editEmailInput: '//android.widget.TextView[@text="כתובת מייל"]//..//android.widget.EditText',
            editDateOfBirthButton: '//android.widget.TextView[@text="תאריך לידה"]',
            selectGenderHeader: '//android.widget.TextView[@text="איך לפנות אליך?"]',
            maleGenderButton: '//android.widget.TextView[@text="זכר"]',
            femaleGenderButton: '//android.widget.TextView[@text="נקבה"]',
            otherGenderButton: '//android.widget.TextView[@text="אחר"]',
            saveButton: '//android.widget.Button[@content-desc="שמירה"]',
        },

        editMyCarsScreen: {
            addCarButton: '//android.widget.TextView[@text="הוספת רכב"]', 

        },

        editCarButton: (carNumber) => { return `//android.widget.Button[@content-desc="ערוך פרטי רכב מספר ${carNumber.split('-').join('')}"]` },
        deleteCarButton: (carNumber) => { return `//android.widget.Button[@content-desc="מחק רכב מספר ${carNumber.split('-').join('')} פתיחת הודעת פופאפ"]` },

    }, // end of profilePage

    actionsAndInfo: {
        howItWorksButton: '//android.widget.TextView[@text="איך זה עובד?"]',
        questionsAndAnswersButton: '//android.widget.TextView[@text="שאלות ותשובות"]',
        contactButton: '//android.widget.TextView[@text="צור קשר"]',
        policyButton: '//android.widget.TextView[@text="תקנון ומדיניות פרטיות"]',
        tipsButton: '//android.widget.TextView[@text="טיפים לחסכון בדלק"]',
        accessibilityButton: '//android.widget.TextView[@text="נגישות"]',
        sonolEVIButton: '//android.widget.TextView[@text="סונול EVI"]',
        sonolGasButton: '//android.widget.TextView[@text="סונול גז+"]',
        fleetManagerButton: '//android.widget.TextView[@text="כניסה למנהל צי רכב"]',
        dalkanFuelRequestButton: '//android.widget.TextView[@text="בקשת אישור תדלוק דלקן"]',
    }, // end of actionsAndInfo

    stationsPage: {
        searchInput: '//android.widget.EditText[contains(@content-desc, "בחר מהתוצאות המוצגות")]',
        firstStation: '(//android.widget.TextView[contains(@text, "שעות פעילות")])[1]',
        firstStationPhoneButton: '(//android.view.View[contains(@content-desc, "טלפון")])[1]',
        firstStationWazeButton: '(//android.view.View[contains(@content-desc, "ווייז")])[1]',
        firstStationAppleMapsButton: '(//android.view.View[contains(@content-desc, "אפל מפות")])[1]',

    }, // end of stationsPage

}
