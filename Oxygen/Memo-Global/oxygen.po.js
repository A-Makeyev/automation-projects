var randomNum = Math.floor(Math.random() * (999999 - 9) + 9)

module.exports = {

    click: (element) => {
        web.pause(1000)
        web.click(element)
    },

    getYear: () => {
        return date.now('YYYY')
    },

    handleCertificate: () => {
        if (web.isVisible('//button[@id="details-button"]', 2500)) {
            po.click('//button[@id="details-button"]')
            po.click('//a[@id="proceed-link"]')
        }
    },

    handleThankYouPage: (domain,sub,uniqueNum,password) => {
        if (web.isVisible('//div[@id="title" and contains(text(), "Dear")]', 5000)) {
            po.clearData()
            web.pause(5000)
            web.open(po.SUB.setUrl(domain,sub,uniqueNum,password))
            po.handleCertificate()
            po.fillHalfDetails()
        }
    },

    handleSecondThankYouPage: (domain,sub,uniqueNum,password) => {
        if (web.isVisible('//div[@id="title" and contains(text(), "Dear")]', 5000)) {
            po.handleThankYouPage(domain,sub,uniqueNum,password)
            web.waitForVisible("//div[@id='header2']")
            web.pause(5000)
            web.waitForVisible('//div[@id="col1"]//div[@data-translate="Payment_btnSubmit"]')
            web.clickHidden('//div[@id="col1"]//div[@data-translate="Payment_btnSubmit"]')
            web.waitForVisible("//input[@id='ContentPlaceHolder3_PaymentOptionsNew_CreditCardTab_firstName']")

            po.addPayment(po.details.cardName, po.details.cardNumber, po.getYear())
            po.click("//input[@id='ContentPlaceHolder3_PaymentOptionsNew_CreditCardTab_Button2']")
        }
    },

    fillDetails: (firstName, lastName,email,phoneNumber) => {
        web.waitForVisible("//input[@id='Fname']")
        web.type("//input[@id='Fname']" , firstName)
        web.type("//input[@id='Lname']" , lastName)

        web.select("//select[@id='birth_day']", "value=12")
        web.select("//select[@id='birth_month']" , "value=7")
        web.select("//select[@id='birth_year']", "value=1990")

        web.select("//select[@id='marital_status_select']" , "label=Married") 
        web.select("//select[@id='occupation']","label=Animal Trainer") 
        web.select("//select[@id='education_level']" , "label=Bachelor\'s Degree")
        web.select("//select[@id='birth_country']" , "label=Cuba")

        web.type("//input[@id='Email']",email)

        web.select("//select[@id='phone_code']","label=New Zealand (+64)")
        web.type("//input[@id='phone']" , phoneNumber)

        po.click("//div[@id='submitBTN']")
    },

    fillHalfDetails: () => {
        web.selectFrame("#frame1")
        po.click("//input[@id='NoPassportRadio']")
        web.select("//select[@id='birth_day']", "value=15")
        web.select("//select[@id='birth_month']" , "value=9")
        web.select("//select[@id='birth_year']", "value=1995")

        if(web.isVisible("id=level_of_english", 3000)) {
            web.select("id=level_of_english" , "label=High/advanced")
        }

        if(web.isVisible("id=education_level", 3000)) {
            web.select("//select[@id='education_level']" , "label=Higher Diploma")
            web.select("//select[@id='marital_status_select']" , "label=Single")
            web.select("//select[@id='occupation']" , "label=Book Editor")
        }

        web.clickHidden("//div[@id='submitBTN']")
    },

    addPayment: (cardName, cardNumber, paymentYear) => {
        web.type('//input[contains(@id, "CreditCardTab_firstName")]', cardName)
        web.type('//input[contains(@id, "CreditCardTab_CcNumber")]', cardNumber)
        web.type('//input[contains(@id, "CreditCardTab_CvvCode")]', '111')
        web.select('//select[contains(@id, "CreditCardTab_ExpMonth")]', 'value=12')
        web.select('//select[contains(@id, "CreditCardTab_ExpYear")]', `value=${paymentYear}`)
        web.clickHidden('//div[@id="checkbox"]')
    },

    USAFIS: {
        handlePopUp: () => {
            if (web.isVisible('//div[@id="_prompt_overlay"]', 2500)) {
                po.click('//*[@id="webpushr-deny-button"]')
            }
            if (web.isVisible('//button[@id="AnswerPopupBTN"]', 2500)) {
                po.click('//button[@id="AnswerPopupBTN"]')
                web.waitForVisible("div[id='PackagePage']")
                po.click('(//button[contains(text(), "Buy Now")])[1]')
            }
        },
    },
    
    details: {
         email: 'XXXXXXXX' + randomNum + '@qa-test.com',
         password: 'XXXXXXXXX!@',
         cardName: 'XXXXXXXXXXX',
         cardNumber: '777777777777',
         phoneNumber: '77777777',
         randomName: () => { 
            let name = ''
            let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            for (let x = 0; x < Math.floor(Math.random() * 9) + 1; x++)
                name += chars.charAt(Math.floor(Math.random() * chars.length))
            return "CloudBeat"+name
          },
    },

    clearData:() =>  {
        http.get('https://nodejs.shopping-basket.biz/cloudbeat')
        http.assertStatus(200)
    },

    SUB: {
        setUrl: (domain, sub, uniqueId, pass) => {
            return 'https://payments.' + domain + '/Handlers/registerHandler.ashx' 
            + '?utm_outsource=1&utm_sub=' + sub + '&ccopen=1&utm_cid=4&utm_u=' + uniqueId + '&utm_p=' + pass 
            + '&utm_af=_emaoff15_170518&utm_source=skylist&utm_medium=email&utm_term=lp_payment&utm_campaign' 
            + '=[-MAILINGID-]&utm_content=aip_spring_sale_2017'
        },
    },

}