po.init(env.url, 65)

const leads = po.leads
const func = po.functions
const main = po.alphaMainPage
const searchPage = po.searchCustomerPage
const alpha360 = po.customerDetails360

var id = func.createTzNumber()
var phone = func.generatePhone()
var email = func.generateEmail()
var firstName = func.generateName()
var lastName = `Automation - ${Math.random().toString().slice(2, 8)}`
var houseNumber = func.generateNumber(1, 9999)
var apartmentNumber = Math.trunc(houseNumber / 2)
var productNumber = env.name == 'PREP' ? '200707' : env.name == 'QA' ? '101994' : ''
var productNumber = '200707'

log.info(`ID: ${id}`)
log.info(`Phone: ${phone}`)
log.info(`Email: ${email}`)
log.info(`First Name: ${firstName}`)
log.info(`Last Name: ${lastName}`)
log.info(`House Number: ${houseNumber}`)
log.info(`Apartment Number: ${apartmentNumber}`)
log.info(`Product Number: ${productNumber}`)

web.transaction('04. Close All Active Tabs')
main.closeAllTabs()

// web.transaction('05. Enter As Rep')
// po.click('//div[@data-aura-class="forceSearchAssistant"]')
// po.type('//div[@data-aura-class="forceSearchAssistantDialog"]//input[contains(@placeholder, "חיפוש")]', 'זהבית גמליאל')

web.transaction('06. Navigate To Leads')
main.openLeads()
leads.openNewLeadWindow()

if (web.isVisible('//p[contains(text(), "Error")]//..//..//slot', po.shortWait * 2)) {
    assert.fail(web.getText('//p[contains(text(), "Error")]//..//..//slot'))
}

web.transaction('07. Type Lead Details')
po.type(leads.firstName, firstName)
po.type(leads.lastName, lastName)
po.type(leads.phone, phone) 
func.pressTAB()

leads.handlePhoneError()

if (!web.getValue(leads.phone).includes(phone)) {
    phone = web.getValue(leads.phone)
    log.info(`Updated phone to: ${phone}`)
}

po.type(leads.id, id) 
func.pressTAB()

if (!web.isVisible('//input[@data-value="YES"]', po.shortWait)) {
    po.click(leads.handlingCompanyBtn)
    if (web.isVisible(leads.handlingCompany.yes)) {
        po.click(leads.handlingCompany.yes)
    }   
}

po.click(leads.interestedInBtn)
po.click(leads.interestedIn.yes)

if (web.isVisible(leads.customerConfirm, po.shortWait)) {
    po.click(leads.customerConfirm)
}

web.transaction('08. Create Lead')
web.waitForVisible(leads.finishLead)

web.execute(() => {
    document.evaluate(
        '//span[contains(text(), "סיום")]', document,
        null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
})

assert.equal(
    web.isVisible(`(//lightning-formatted-phone//a[@href="tel:${phone}"])[1]`), true,
    `New lead did not include the right phone number (${phone})`
)

web.transaction('08. Type Offer Details')
po.type(leads.offerGiven, 'ציוד קצה')
func.pressTAB()

po.type(leads.offerTextArea, 'פירוט על ההצעה שניתנה')
po.click(leads.status.interested)
po.click(leads.rivalCompanies.hot)
po.click(leads.findCustomersBtn)

if (web.isVisible('//*[contains(text(), "YES תוצאות לקוח (0)")]', po.shortWait * 2)) {
    web.transaction('08.01. Create new Customer')
    po.click('//input[contains(@id, "Create_New_Billing_Account")]//..//span[@class="slds-radio_faux"]')
    po.click(leads.finishUpdateLead)

    var orderNumber = web.getText('//div[contains(text(), "הזמנה")]//..//span[@class="uiOutputText"]')
    log.info(`Order Number: ${orderNumber}`)

    po.type('//label[contains(text(), "עיר")]//..//input', 'כפר סבא')
    po.click('//span[contains(text(), "כפר סבא")]')
    po.type('//label[contains(text(), "רחוב")]//..//input', 'גביש')
    po.click('//span[contains(text(), "גביש")]')

    po.click('//*[contains(text(), "האם הלקוח גר בבניין או בבית פרטי")]//..//span[contains(text(), "בניין")]')
    po.type('//label[contains(text(), "Email")]//..//input', email)
    po.type('//label[contains(text(), "מספר דירה")]//..//input', houseNumber)
    po.type('//label[contains(text(), "מספר בית")]//..//input', apartmentNumber)
    po.click('//button[contains(text(), "הבא") and not(@disabled)]')

    if (web.isVisible('//div[contains(@class, "flexipageTabset")]//lightning-formatted-rich-text', po.shortWait * 2)) {
        log.info(web.getText('//div[contains(@class, "flexipageTabset")]//lightning-formatted-rich-text'))
    }

    while (!web.isVisible('//iframe[contains(@id, "vlocityCart")]', po.shortWait * 10)) {
        po.click('//button[contains(text(), "הבא") and not(@disabled)]')
    }
    
    web.transaction('08.02. Assert Cart Frame')
    if (web.isVisible('//iframe[contains(@id, "vlocityCart")]')) {
        web.selectFrame('//iframe[contains(@id, "vlocityCart")]')
        log.info('Selected vlocityCart frame')
        if (web.isExist('id=main-frame-error', po.shortWait)) {
            assert.fail(`${env.url} refused to connect`)
        }
    }

    web.transaction('08.03. Add Product')
    po.type('id=ProductSearchInput', productNumber)
    func.pressENTER()
    web.pause(po.shortWait)

    if (!web.isVisible(`//span[contains(@title, "${productNumber}")]//..//..//..//button[contains(text(), "הוסף לעגלה")]`, po.shortWait)) {
        func.refresh()
        while (!web.isVisible('//iframe[contains(@id, "vlocityCart")]', po.shortWait)) {
            po.click('//button[contains(text(), "הבא") and not(@disabled)]')
        }
    } 

    web.selectFrame('//iframe[contains(@id, "vlocityCart")]')
    po.click(`//span[contains(@title, "${productNumber}")]//..//..//..//button[contains(text(), "הוסף לעגלה")]`)

    /*אין גישה להצעת ציוד 200700  */
   
    var productName = web.getText(`//span[contains(@title, "${productNumber}")]`)
    log.info(`Product Name: ${productName}`)

    if (web.isExist('//iframe[@class="slds-hidden"]', po.shortWait * 2)) {
        web.makeVisible('//iframe[@class="slds-hidden"]')
        log.info('Hidden Frame Found: ' + web.isVisible('//iframe[@class="slds-hidden"]', po.shortWait))
    }

    (function deleteFrames() {
        web.execute(() => {
            let hiddenFramesRemoved = 0
            let iframes = document.querySelectorAll('iframe')
            console.log('<*>'.repeat(50))
            for (let i = 0; i < iframes.length; i++) {
                if (iframes[i] != null && iframes[i].classList.contains('slds-hidden')) {
                    console.log(iframes[i])
                    iframes.parentNode.removeChild(iframes[i])
                    hiddenFramesRemoved++
                }
            }
            console.log(hiddenFramesRemoved >= 1 ? `Removed ${hiddenFramesRemoved} Hidden Frames` : 'No Hidden Frames Were Found')
            // return hiddenFramesRemoved >= 1 ? `Removed ${hiddenFramesRemoved} Hidden Frames` : 'No Hidden Frames Were Found'
        })
    })()

    while (!web.isVisible('//button[not(@disabled="disabled")]//span[contains(text(), "הבא") and @ng-show="records.actions && records.actions.checkout"]')) {
        po.type('id=ProductSearchInput', productNumber)
        func.pressENTER()
        web.pause(po.shortWait)
        po.click(`//span[contains(@title, "${productNumber}")]//..//..//..//button[contains(text(), "הוסף לעגלה")]`)
    }

    web.transaction('08.04. Open Terms Approval')
    web.execute(() => {
        document.evaluate(
            '(//span[text()="הבא"])[1]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue.setAttribute('id', 'next')
    })

    web.pause(po.waitASecond)
    web.clickHidden('id=next')

    web.transaction('08.05. Enter Approval Terms')
    po.click('//label[contains(text(), "האם הצעת ללקוח אינטרנט?")]//..//button[@role="combobox"]')
    po.click('//lightning-base-combobox-item//span[@title="לקוח לא מעוניין"]')

    po.click('//label[contains(text(), "האם הלקוח ממתין להתקנת תשתית?")]//..//button[@role="combobox"]')
    po.click('//lightning-base-combobox-item//span[@title="כן, ממתין להתקנת תשתית בזק"]')

    po.click('//label[contains(text(), "תאריך התקנת בזק")]//..//input')
    po.click(`//span[@class="slds-day" and text()="${func.getDay(func.currentDate())}"]`)

    po.click('//label[contains(text(), "אישור מידע שיווקי למייל ול-SMS")]//..//button[@role="combobox"]')
    po.click('//label[contains(text(), "אישור מידע שיווקי למייל ול-SMS")]//..//button[@role="combobox"]//..//..//lightning-base-combobox-item//span[@title="מאשר"]')

    po.click('//label[contains(text(), "האם הלקוח אישר פרסום דיגיטלי פרסונלי?")]//..//button[@role="combobox"]')
    po.click('//label[contains(text(), "האם הלקוח אישר פרסום דיגיטלי פרסונלי?")]//..//button[@role="combobox"]//..//..//lightning-base-combobox-item//span[@title="מאשר"]')

    po.click('//label[contains(text(), "אישור מכירה באמצעות")]//..//button[@role="combobox"]')
    po.click('//lightning-base-combobox-item//span[@title="מכירה מוקלטת"]')

    po.click('//label[contains(text(), "אופן שליחה")]//..//button[@role="combobox"]')
    po.click('//lightning-base-combobox-item//span[@title="Mail"]')

    po.click('//button[contains(text(), "הבא") and not(@disabled)]')
    if (web.isVisible('//div[@data-key="error"]', po.shortWait)) {
        assert.fail(web.getText('//div[@data-key="error"]'))
    }

    // while (!web.isVisible('//span[@title="שלב בהזמנה"]//..//span[contains(text(), "בחירת מוצרים")]', po.shortWait * 2)) {
    //     po.click('//button[contains(text(), "הבא") and not(@disabled)]')
    //     if (web.isVisible('//div[@data-key="error"]')) {
    //         assert.fail(web.getText('//div[@data-key="error"]'))
    //     }
    // }

}




web.pause(1)
