module.exports = {
    
    init: (envName) => {
        mob.init({
            "deviceName": "Pixel XL API 33",
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
    },

    loginScreen: {
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
            if (mob.isVisible('//android.widget.TextView[contains(@text, "Choose environment")]', po.utils.longWait)) {
                mob.click(`text=${envName}`)
                mob.click('//android.widget.Button//android.widget.TextView[contains(@text, "GO")]')
            }
        },

        enterPhoneNumber: (str) => {
            if (mob.isVisible(po.loginScreen.phoneInput, po.shortWait)) {
                mob.type(po.loginScreen.phoneInput, str)
                // mob.type(po.loginScreen.phoneNumberPrefixInput, str.substr(0, 3))
                // mob.type(po.loginScreen.phoneNumberInput, str.substr(3, str.length))
            }
        },

        enterOtpNumber: (str) => {
            if (mob.isVisible('text=מה הקוד שקיבלת?', po.shortWait)) {
                let arr = str.split('')
                po.utils.click('//android.widget.EditText[@content-desc="שדה קלט ראשון"]')
                for (let x = 0; x < arr.length; x++) {
                    mob.sendKeys(str[x])
                    mob.pause(po.utils.waitASecond)
                }
            }
        },

        loginWithPhoneNumber: (phone, otp) => {
            let tries = 10
            while (!mob.isVisible(po.homePage.profileButton, po.utils.shortWait)) {
                if (mob.isVisible(po.loginScreen.phoneInput)) {
                    po.loginScreen.enterPhoneNumber(phone)
                    po.loginScreen.enterOtpNumber(otp)
                } 
                mob.pause(po.utils.shortWait)
                if (mob.isVisible(po.loginScreen.nextButton)) {
                    po.utils.click(po.loginScreen.nextButton)
                    po.utils.click(po.loginScreen.goToHomePageButton)
                }
                if (tries == 0) break
                else tries--
            }
        },

    }, // end of loginScreen

    profilePage: {
        fullName: '(//android.widget.TextView[contains(@content-desc, "שם ומשפחה")]//..//android.widget.TextView)[1]',
        level: '(//android.widget.TextView[contains(@content-desc, "שם ומשפחה")]//..//android.widget.TextView)[2]',
        goods: '(//android.widget.TextView[contains(@content-desc, "שם ומשפחה")]//..//android.widget.TextView)[3]',
        editFullNameInput: '(//android.widget.TextView[contains(@content-desc, "שם ומשפחה")]//..//android.widget.EditText)[1]',
        gender: '//android.view.ViewGroup[contains(@content-desc, "מין")]//android.widget.TextView',
        email: '//android.view.ViewGroup[contains(@content-desc, "אימייל")]//android.widget.TextView',
        personalDetailsButton: '//android.widget.Button[@content-desc="אמצעי תשלום"]',
        editDetailsButton: '//android.widget.Button[@content-desc="ערוך פרטים"]',
        acceptButton: '//android.widget.Button[@content-desc="אישור"]',
        cancelButton: '//android.widget.Button[@content-desc="ביטול"]',
        editEmailInput: '//android.widget.EditText[contains(@content-desc, "אימייל")]',

        editCarButton: (carNumber) => { return `//android.widget.Button[@content-desc="ערוך פרטי רכב מספר ${carNumber.split('-').join('')}"]` },
        deleteCarButton: (carNumber) => { return `//android.widget.Button[@content-desc="מחק רכב מספר ${carNumber.split('-').join('')} פתיחת הודעת פופאפ"]` },

    }, // end of profilePage

    homePage: {
        profileButton: '//android.widget.Button[@content-desc="עמוד פרופיל"]',
        finishButton: '//android.widget.TextView[@text="סיום"]',
        menuButton: '//android.view.View[@content-desc="תפריט פעולות נוספות"]//android.view.ViewGroup',
        stationsButton: '//android.view.View[contains(@content-desc, "עמוד תחנות")]',

    }, // end of homePage

    stationsPage: {
        searchInput: '//android.widget.EditText[contains(@content-desc, "בחר מהתוצאות המוצגות")]',
        firstStation: '(//android.widget.TextView[contains(@text, "שעות פעילות")])[1]',
        firstStationPhoneButton: '(//android.view.View[contains(@content-desc, "טלפון")])[1]',
        firstStationWazeButton: '(//android.view.View[contains(@content-desc, "ווייז")])[1]',
        firstStationAppleMapsButton: '(//android.view.View[contains(@content-desc, "אפל מפות")])[1]',

    }, // end of stationsPage

}
