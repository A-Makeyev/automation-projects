        /* test steps */
// login with a user from excel
// create 5 leads for this user
// do the same for each user

var username = '', password = '' 

if (!params.Username) {
    username = env.username
} else {
    username = params.Username
}

if (!params.PASS) {
    password = env.password
} else {
    password = params.PASS
}

// how many users to create for each account
const usersToCreate = 1

// in case of a wrong password define a new one
const oldPassword = params.PASS, newPassword = 'Aa1234567!'

const leads = po.leads
const func = po.functions
const main = po.alphaMainPage

function createNewLead(firstName, lastName, phone) {
    let retry = true
    
    web.transaction('Fill Lead Details')
    if (!web.isVisible(leads.firstName, po.shortWait)) {
        main.closeAllTabs()
        main.openLeads()

        leads.openNewLeadWindow()
        leads.assertLeadWindowError()

        if (!web.isVisible('//strong[contains(text(), "פרטי הליד")]')) {
            func.refresh()
            var tries = 5
            while (!web.isVisible('//strong[contains(text(), "פרטי הליד")]')) {
                func.refresh()
                tries++
                if (tries > 5) {
                    assert.fail('Page was stuck at loading...')
                }
            }
        }
    }

    po.type(leads.firstName, firstName)
    po.type(leads.lastName, lastName)
    po.type(leads.phone, phone) 
    func.pressTAB()

    leads.handlePhoneError()

    if (!web.isVisible('//input[@data-value="YES"]', po.shortWait)) {
        po.click(leads.handlingCompanyBtn)
        if (web.isVisible(leads.handlingCompany.yes)) {
            po.click(leads.handlingCompany.yes)
        }   
    }

    po.click(leads.interestedInBtn)
    po.click(leads.interestedIn.yes)

    if (web.isVisible(leads.customerConfirm, po.shortWait)) 
        po.click(leads.customerConfirm)

    web.transaction('Create Lead')
    web.waitForVisible(leads.finishLead)

    web.execute(() => {
        document.evaluate(
            '//span[contains(text(), "סיום")]', document,
            null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue.click()
    })

    if (web.isVisible(leads.errorContainer)) {
        if (!retry) {
            assert.fail(web.getText(leads.errorContainer))
        }
        createLead(firstName, lastName, phone)
        retry = false
    }

}

web.transaction('Open Main Page & Login')
web.init()
web.open(env.url)

const t = po.shortWait
const registerPhoneHeader = '//h2[contains(text(), "Register Your Mobile Phone")]'
const registerPhoneHeader_hebrew = '//h2[contains(text(), "רשום את הטלפון הנייד שלך")]'
const dontRegister = `//a[contains(text(), "I Don't Want to Register My Phone")]`
const dontRegister_hebrew = '//a[contains(text(), "איני רוצה לרשום את הטלפון שלי")]'
const changePassword = '//h2[contains(text(), "Change Your Password")]'
const changePassword_hebrew = '//h2[contains(text(), "שנה את סיסמתך")]'

if (!(web.isVisible('id=main'))) {
    assert.fail('Page failed to load')
} else {
    po.type('id=username', username)
    po.type('id=password', password) 
    po.click('id=Login')

    if (web.isVisible('//div[@id="error"]', t)) {
        log.info(`The username: ${username} or password: ${password} are not valid`)

        po.type('id=username', env.username)
        po.type('id=password', env.password) 
        po.click('id=Login')
    }

    if (web.isVisible('//span[text()="תחזוקה מתוכננת"]', t)) {
        po.click('//a[text()="הבנתי"]')
    }

    if (web.isVisible(registerPhoneHeader, t) || web.isVisible(registerPhoneHeader_hebrew, t)) {
        if (web.isVisible(dontRegister_hebrew, t)) {
            po.click(dontRegister_hebrew)
        } else if (web.isVisible(dontRegister, t)) {
            po.click(dontRegister)
        }
    } else if (web.isVisible(changePassword, t) || web.isVisible(changePassword_hebrew, t)) {
        // func.changePassword(oldPassword, newPassword)
        web.scrollToElement('id=cancel-button')
        po.click('id=cancel-button')
    }
}

function generatePhone() {
    let pre = ['050', '052']
    return String(
        pre[Math.floor(Math.random() * pre.length)]
        + Math.random().toString().slice(2, 9)
    )
}

for (let iteration = 0; iteration < usersToCreate; iteration++) {
    web.transaction('Create New Leads')
    let phoneNumber = generatePhone()

    web.transaction('Close All Tabs')
    main.closeAllTabs()

    web.transaction('Open Leads Page')
    main.openLeads()

    web.transaction('Open New Lead Form')
    leads.openNewLeadWindow()
    createNewLead('בדיקות', 'אוטומציה', phoneNumber)

    log.info(`Created new lead for number: ${phoneNumber}`)
    web.pause(po.shortWait)
}
