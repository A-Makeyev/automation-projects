module.exports = {

    cityCodeHifa: '9999999999',
    cityCodeNetaya: '9999999999',
    cityCoderamle: '9999999999',
    salesForceLead_City: 'נתניה',
    priorityLead_City: 'חיפה',
    prioriyEmailLead_City: 'רמלה',

    init: (url, mobileView) => {
        web.transaction(`1. Initialize on ${env.name}`)
        web.init()
        if (mobileView) {
            web.setWindowSize(360, 740)
        } else {
            let windowWidth = web.execute(() => { return window.innerWidth })
            let windowHeight = web.execute(() => { return window.innerHeight })
            windowWidth > 1920 && web.setWindowSize(1700, windowHeight)
        }

        web.transaction(`2. Open ${env.name}`)
        web.open(url)

        if (web.isVisible(po.general.offerCloseButton, po.utils.shortWait)) {
            web.click(po.general.offerCloseButton)
        }

        if (url == env.url) {
            assert.equal(
                web.isVisible('id=wrapper'), true,
                'Home Page Failed To Load'
            )
        }

        if (url == env.laundryDryerUrl) {
            assert.equal(
                web.isVisible('id=RootBack'), true,
                'Home Page Failed To Load')
        }

        if (url == env.waterHeaterUrl) {
            assert.equal(
                web.isVisible('id=RootBack'), true,
                'Home Page Failed To Load'
            )
        }

        web.transaction('03. Close Ad Popup')
        po.utils.closeImageAd()
    },

    utils: {
        shortWait: 5000,
        longWait: 20000,
        waitASecond: 1000,

        closeImageAd: () => {
            if (web.isVisible('//*[contains(@id, "ZA")]', po.utils.shortWait)) {
                let closedAd = false
                let startTime = Date.now()
                let timeLimit = 1 * 60 * 1000
                while (((Date.now() - startTime) < timeLimit) && !closedAd) {
                    closedAd = web.execute((c) => {
                        let ads = document.getElementsByClassName('za_reset')
                        if (ads != null) {
                            for (let i = 0; i < ads.length; i++) {
                                if (ads[i] != null) ads[i].remove()
                            }
                        }

                        let zcc = document.getElementById('ZA_CAMP_CONTAINER')
                        let zcd = document.getElementById('ZA_CAMP_DIV_1')
                        let zcb = document.getElementById('ZA_CAMP_BG')
                        if (zcc != null) zcc.remove()
                        if (zcd != null) zcd.remove()
                        if (zcb != null) zcb.remove()
                        if (!zcc && !zcd && !zcb) {
                            c = true
                        }
                        return c
                    }, closedAd)
                    web.pause(1000)
                }
                closedAd ? log.info('✔️ Ad closed') : log.info('❌ Unable to close ad')
                return closedAd
            }
        },

        assertRedirectedPage: () => {
            if (web.isVisible(po.general.main)) {
                let currentUrl = web.getUrl()
                if (!currentUrl.includes(env.url)) {
                    assert.fail(`Expected the page to redirect to ${env.url} after finishing the form, instead redirected to ${currentUrl}`)
                }
                log.info(`✅ Successfully redirected to ${env.url} after finishing the form`)
                assert.pass()
            } else if (web.isExist(po.general.accessDeniedPage, po.utils.shortWait)) {
                log.info('*'.repeat(50))
                log.info(`❌ Unable to open ${env.url}`)
                log.info(web.getText(po.general.accessDeniedPageHeader))
                log.info(web.getText(po.general.accessDeniedPageSection))
                assert.pass()
            } 
        },

        getRandomNumber: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },

        waitForSalesForceResponse: (minutesToWait) => {
            let duration = minutesToWait * 60000
            let time = po.utils.getDateAndTime('time')
            log.info('Waiting For Sales Force Response. Started at: ' + time)
            web.pause(duration)
        },

        getDateAndTime: (format) => {
            let today = new Date()
            let dd = String(
                today.getDate()).padStart(2, "0")
            let mm = String(today.getMonth() + 1).padStart(2, "0")
            let yyyy = today.getFullYear()
            let hours = today.getHours()
            let minutes = today.getMinutes()
            let seconds = today.getSeconds()

            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            if (format == 'date') return `${dd}-${mm}-${yyyy}`
            if (format == 'time') return `${hours}:${minutes}:${seconds}`
            return `ש-${hours}:${minutes}:${seconds} י-${dd}-${mm}-${yyyy}`
        },

        makeId: (length) => {
            let result = ''
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            let charactersLength = characters.length
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            return result
        },

        getMonthAndDayNames: () => {
            let today = new Date()
            today = today.toDateString()
            let dd = today.slice(0, 7)
            dd = dd.concat(' ', po.utils.makeId(3))
            return dd
        },

        getPhone: () => {
            let pre = ['050', '051', '052', '053', '054']
            return String(
                pre[Math.floor(Math.random() * pre.length)]
                + Math.random().toString().slice(2, 9)) 
        },

        getEmail: () => {
            let domains = ['gmail', 'hotmail', 'yahoo', 'live']
            let names = ['hodaya', 'donald', 'anatoly', 'victoria']
            return names[Math.floor(Math.random() * domains.length)]
                + '@' + domains[Math.floor(Math.random() * domains.length)] + '.com'
        },

        pressEnter: () => {
            web.pause(po.utils.waitASecond)
            web.sendKeys('\uE007')
        },

        pressTab: () => {
            web.pause(po.utils.waitASecond)
            web.sendKeys('\uE004')

        },

        pressArrowUp: () => {
            web.pause(po.utils.waitASecond)
            web.sendKeys('\uE013')
        },

        pressArrowDown: () => {
            web.pause(po.utils.waitASecond)
            web.sendKeys('\uE015')
        },

        // prevent empty text
        getText: (locator) => {
            let loops = 0
            let text = web.isVisible(locator) ? web.getText(locator) : ''
            while (!text.trim()) {
                if (loops == 15) break
                text = web.getText(locator)
                web.pause(500)
                loops++
            }
            return text
        },

        // prevent empty clicks
        click: (element) => {
            web.pause(po.utils.waitASecond)
            web.click(element)
        },

        // prevent empty types
        type: (element, string) => {
            po.utils.click(element)
            web.type(element, string)
        },  

    },

    general: {
        main: 'id=main',
        headerNew: 'id=header-new',
        header: '//div[contains(@id, "header")]',
        chatApp: '//div[contains(@id, "chatApp")] ',
        headline: '//div[@class="contentContainer"]//h1',
        accessDeniedPage: '//title[contains(text(), "Access denied")]',
        accessDeniedPageHeader: '//div[@id="cf-error-details"]//header',
        accessDeniedPageSection: '//div[@id="cf-error-details"]//section',

        form: {
            wrapper: '//form[@class="formProductContact" or contains(@id, "gform")]',
            fullNameInput: '//label[contains(text(), "שם מלא")]//..//input',
            cityInput: '//label[contains(text(), "עיר מגורים") or contains(text(), "יישוב")]//..//input',
            phoneInput: '//label[contains(text(), "טלפון")]//..//input',
            emailInput: '//label[contains(text(), "אי-מייל")]//..//input',
            addressInput: '//label[contains(text(), "כתובת")]//..//input',
            customerNumberInput: '//label[contains(text(), "מספר צרכן")]//..//input',
            subjectSelect: '//label[contains(text(), "נושא הפנייה")]//..//select',
            descriptionInput: '//label[contains(text(), "תיאור")]//..//textarea',
            existingPasgazCustomer_Yes: '//label[contains(text(), "לקוחות קיימים בפזגז?")]//..//label[text()="כן"]',
            customerIdButton: '//label[contains(text(), "תעודת זהות")]',
            customerNumberOrIdInput: '(//label[contains(text(), "מספר צרכן") or contains(text(), "תעודת זהות")]//..//..//..//..//..//input[contains(@id, "input")])[2]',
            existingPasgazCustomer_No: '//label[contains(text(), "לקוחות קיימים בפזגז?")]//..//label[text()="לא"]',
            orderingGasBalloon_Yes: '//label[contains(text(), "מזמינים בלוני גז?")]//..//label[text()="כן"]',
            orderingGasBalloon_No: '//label[contains(text(), "מזמינים בלוני גז?")]//..//label[text()="לא"]',
            sendFormButton: '//*[@aria-label="שלח" or @aria-label="Submit" or @aria-label="התחילו לחסוך" or @objname="submitButton" or @value="שלח" or @value="שלח פנייה" or @value="להמשך תשלום"]',
        },

        sendContactDetails: (name, phone, city) => {
            let utils = po.utils
            utils.click('//cf-radio-button//*[contains(text(), "פנייה לנציג")]')
            if (web.isVisible('//*[@class="contact-form-heading"]')) {
                utils.type('id=full_name', name)
                utils.type('id=phone', phone)
                utils.type('id=city', city)
                utils.click(`//div[@class="ui-menu-item-wrapper" and contains(text(), "${city}")]`)
            }
            utils.click('//cf-radio-button//*[contains(text(), "אישור")]')
            if (web.isVisible('//*[contains(text(), "קיבלנו את פרטיך, נציג יחזור בהקדם להשלמת הטיפול בפניה")]')) {
                log.info(web.getText('(//span[@class="contact-form-thankyou"])[1]'))
                utils.click('//cf-radio-button//*[contains(text(), "סיום")]')
            }
        }
    },

    paymentWindow: {
        cardDetails: {
            secretCode: '6181',
            ownerId: '890108558',
            customerNumber: '20002466',
            number: '5326105300985853',
            expYear: '2026',
            expMonth: '04',
            cvv: '934',
        },

        chatbotPaymentFrame: '//iframe[@id="chatbot-payment-iframe"]',
        paymentFrame: '//iframe[@id="pelecard_iframe"]',
        idNumberInput: '//input[@id="id_number_input"]',
        creditCardNumberInput: '//input[@id="credit_card_number_input"]',
        cardExpMonthSelect: '//select[@id="date_month_input"]',
        cardExpYearSelect: '//select[@id="date_year_input"]',
        cardCvvInput: '//input[@id="cvv_input"]',
        totalPriceInput: '//input[@id="totalAll"]',
        numberOfPaymentsSelect: '//select[@id="num_of_payments"]',
        submitPaymentButton: '//button[@id="submitBtn"]',
        acceptedPaymentMessage: '//span[@class="payment-accepted"]',

        createPayment: () => {
            let window = po.paymentWindow
            let card = po.paymentWindow.cardDetails

            web.selectFrame(po.paymentWindow.chatbotPaymentFrame)
            utils.type(window.creditCardNumberInput, card.number)
            web.select(window.cardExpMonthSelect, `label=${card.expMonth}`)
            web.select(window.cardExpYearSelect, `label=${card.expYear}`)
            utils.type(window.idNumberInput, card.ownerId)
            utils.type(window.cardCvvInput, card.cvv)
            web.click(window.submitPaymentButton)

            if (!web.isVisible(window.acceptedPaymentMessage)) {
                web.selectWindow(web.getWindowHandles()[0])

                if (web.isVisible(window.acceptedPaymentMessage)) {
                    let status = po.utils.getText(window.acceptedPaymentMessage)
                    let approvalNumber = status.replace(/\D/g, '')
                    log.info('✔️ Payment Status: ' + status)
                    log.info('✔️ Approval Number: ' + approvalNumber)
                    return approvalNumber
                }
            }
            return undefined
        },

    },

    debtPayment: {
        mainInput: '//div[@class="inputWrapper"]//input',
    },

}
