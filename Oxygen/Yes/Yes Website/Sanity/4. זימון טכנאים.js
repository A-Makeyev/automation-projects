po.init('4. זימון טכנאים')

function step1() {
    web.transaction('Open Change Technician Time Page')
    web.point('//header//a[contains(text(), "שירות ותמיכה")]')
    po.click('//header//a[contains(text(), "שירות ותמיכה")]//..//a[contains(text(), "פתרון תקלות וזימון טכנאי")]')

    web.transaction(`Login With ${env.username}`)
    po.click('id=yesSiteLogin')
    po.loginWithExistingCustomer()

    web.transaction('Open Viewing Errors Page')
    po.click('//li[contains(@class, "tv-link")]')
    web.waitForVisible('//*[@class="topic-title" and contains(text(), "תקלות")]')

    if (!web.isVisible('//div[@class="topic-content"]//*[contains(text(), "הממיר לא נדלק")]', po.shortWait)) {
        web.refresh()
        web.doubleClick('//li[contains(@class, "tv-link")]')
        po.log('warning', `אפשרות הממיר לא נדלק לא מופיעה בפעם הראשונה לאחר כניסת משתמש`)
    }

    po.click('//div[@class="topic-content"]//*[contains(text(), "הממיר לא נדלק")]')
    web.selectFrame('id=issueIframe')

    var tries = 5
    while (!web.isVisible('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]', po.longWait)) {
        po.click('//div[@id="treesWrapper"]//button[contains(@title, "המשך")]')
        if (tries == 0) break
        tries--
    }

    web.transaction('Summon Technician')
    if (web.isVisible('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]', po.longWait)) {
        po.click('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]')
    }

    var tabs = web.getWindowHandles()
    for (let x = 0; x < tabs.length; x++) {
        web.selectWindow(tabs[x])
        if (web.isVisible('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]', po.shortWait)) {
            po.click('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]', po.shortWait)
            break
        }
    }
    
    // web.transaction(`Login With ${env.username}`)
    // web.getWindowHandles().length > 1 ? web.selectWindow(web.getWindowHandles()[1]) : web.selectWindow(web.getWindowHandles()[web.getWindowHandles().length - 1])
    // po.loginWithExistingCustomer()

    if (web.isVisible('id=equipment-not-found', po.shortWait)) {
        po.log('error', `Equipment was not found for customer: ${env.username}`)
    }

    if (web.isVisible('//span[contains(@data-edit-scan-key, "work-order-already-exist-title")]', po.shortWait)) {
        web.transaction('Cancel Technician')
        po.click('//a[@data-edit-key="work-order-change-technician-time"]')
        if (web.isVisible('//section[@class="technician-summoned last"]')) {
            po.click('//a[normalize-space()="ביטול תיאום טכנאי"]')
            if (web.isVisible('//section[contains(@id, "technician-message")]')) {
                po.log('success', po.getText('//section[contains(@id, "technician-message")]'))
            } else {
                po.log('error', `There was an error cancelling technician. ${po.getText('//section[contains(@id, "technician-message")]')}`)
            }
        }
        step1()
    }
}

step1()

var tabs = web.getWindowHandles()
for (let x = 0; x < tabs.length; x++) {
    web.selectWindow(tabs[x])
    if (web.isVisible('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]', po.shortWait)) {
        po.click('//div[@id="treesWrapper"]//a[contains(@title, "זימון טכנאי")]')
        po.click('(//table[@class="streamers-table"]//div[contains(@class, "custom-checkbox")])[1]')
        po.click('//section[@id="technician-call"]//button[normalize-space()="להמשך תיאום" and not(contains(@class, "disabled"))]')
    } else if (web.isVisible('(//table[@class="streamers-table"]//div[contains(@class, "custom-checkbox")])[1]', po.shortWait)) {
        po.click('(//table[@class="streamers-table"]//div[contains(@class, "custom-checkbox")])[1]')
        po.click('//section[@id="technician-call"]//button[normalize-space()="להמשך תיאום" and not(contains(@class, "disabled"))]')
    }
}

if (web.isVisible('//div[@class="not-found-img"]', po.shortWait)) {
    assert.fail(po.getText('class="page-text-content font-bold"'))
}

var tries = 5
while (!web.isVisible('(//div[@class="form-timing form-dates"]//div[@class="form-control dates item"])[1]', po.longWait)) {
    if (web.isVisible('//div[@id="treesWrapper"]//button[contains(@title, "המשך")]', po.shortWait)) {
        po.click('//div[@id="treesWrapper"]//button[contains(@title, "המשך")]', po.shortWait)
    }
    po.click('//div[@class="form-control time technician"]//label', po.shortWait)
    if (tries == 0) break
    tries--
}

po.click('(//div[@class="form-timing form-dates"]//div[@class="form-control dates item"])[1]')
po.click('(//div[@class="choose-time forms-container"]//div[@class="form-control hours item"])[1]')

var technicianDate = po.getText('(//div[@class="choose-time forms-container"]//div[@class="form-control hours item"])[1]')
po.click('//button//span[contains(text(), "לסיום התיאום")]')

web.transaction('Assert Technician Coordination')
if (web.isVisible('//section[@id="technician-message"]', po.longWait)) {
    if (web.isVisible('//section[@id="technician-message"]//span[@data-edit-key="technician-coordination-performed-successfully"]', po.shortWait)) {
        po.log('success', po.getText('//section[@id="technician-message"]//span[@data-edit-key="technician-coordination-performed-successfully"]'))
    } else {
        po.log('warning', 'לא מוצגת הודעת תיאום טכנאי בוצע בהצלחה')
    }

    if (web.isVisible('//section[@id="technician-message"]//div[@class="tech-address"]', po.shortWait)) {
        po.log('success', po.getText('//section[@id="technician-message"]//div[@class="tech-address"]'))
    } else {
        po.log('warning', 'לא מוצגת הודעה על כתובת לזימון טכנאי')
    }

    if (web.isVisible('//section[@id="technician-message"]//div[@class="tech-date-time"]', po.shortWait)) {
        let technicianDateMessage = po.getText('//section[@id="technician-message"]//div[@class="tech-date-time"]')
        po.log('success', technicianDateMessage)
        if (!technicianDateMessage.includes(technicianDate)) {
            assert.fail(`Chosen technician date (${technicianDateMessage}) doesn't match the end result date (${technicianDate})`)
        }
    } else {
        po.log('warning', 'לא מוצגת הודעת על תאריך זימון טכנאי')
    }
} else {
   assert.fail('Technician result message is not visible') 
}

web.transaction('Open Change Technician Time Page')
web.point('//header//a[contains(text(), "שירות ותמיכה")]')
po.click('//header//a[contains(text(), "שירות ותמיכה")]//..//a[contains(text(), "שינוי זימון טכנאי")]')

web.transaction('Update Technician Time')
if (web.isVisible('//section[@class="technician-summoned last"]', po.shortWait)) {
    po.click('//a[normalize-space()="עדכון תיאום טכנאי"]')
} else {
    web.transaction(`Login With ${env.username}`)
    po.loginWithExistingCustomer()
    po.click('//a[normalize-space()="עדכון תיאום טכנאי"]')
}

var tries = 5
while (!web.isVisible('(//div[@class="form-timing form-dates"]//div[@class="form-control dates item"])[2]', po.longWait)) {
    po.click('//div[@class="form-control time technician"]//label')
    if (tries == 0) break
    tries--
}

po.click('(//div[@class="form-timing form-dates"]//div[@class="form-control dates item"])[2]')
var technicianDate = po.getText('(//div[@class="choose-time forms-container"]//div[@class="form-control hours item"])[2]')

po.click('(//div[@class="choose-time forms-container"]//div[@class="form-control hours item"])[2]')
var technicianTime = po.getText('(//div[@class="choose-time forms-container"]//div[@class="form-control hours item"])[2]')

po.click('//button//span[contains(text(), "לסיום התיאום")]')

web.transaction('Assert Technician Coordination')
if (web.isVisible('//section[@id="technician-message"]', po.longWait)) {
    if (web.isVisible('//section[@id="technician-message"]//span[@data-edit-key="technician-coordination-performed-successfully"]', po.shortWait)) {
        po.log('success', po.getText('//section[@id="technician-message"]//span[@data-edit-key="technician-coordination-performed-successfully"]'))
    } else {
        po.log('warning', 'לא מוצגת הודעת תיאום טכנאי בוצע בהצלחה')
    }

    if (web.isVisible('//section[@id="technician-message"]//div[@class="tech-address"]', po.shortWait)) {
        po.log('success', po.getText('//section[@id="technician-message"]//div[@class="tech-address"]'))
    } else {
        po.log('warning', 'לא מוצגת הודעה על כתובת לזימון טכנאי')
    }

    if (web.isVisible('//section[@id="technician-message"]//div[@class="tech-date-time"]', po.shortWait)) {
        let technicianDateMessage = po.getText('//section[@id="technician-message"]//div[@class="tech-date-time"]')
        po.log('success', technicianDateMessage)
        if (!technicianDateMessage.includes(technicianDate)) {
            assert.fail(`Chosen technician date (${technicianDateMessage}) doesn't match the end result date (${technicianDate})`)
        }
    } else {
        po.log('warning', 'לא מוצגת הודעת על תאריך זימון טכנאי')
    }
} else {
   assert.fail('Technician result message is not visible') 
}

web.transaction('Open Change Technician Time Page')
web.point('//header//a[contains(text(), "שירות ותמיכה")]')
po.click('//header//a[contains(text(), "שירות ותמיכה")]//..//a[contains(text(), "שינוי זימון טכנאי")]')

if (web.isVisible('//span[contains(@data-edit-scan-key, "work-order-already-exist-title")]', po.shortWait)) {
    web.transaction('Cancel Technician')
    po.click('//a[@data-edit-key="work-order-change-technician-time"]')
    if (web.isVisible('//section[@class="technician-summoned last"]')) {
        po.click('//a[normalize-space()="ביטול תיאום טכנאי"]')
        if (web.isVisible('//section[contains(@id, "technician-message")]')) {
            po.log('success', po.getText('//section[contains(@id, "technician-message")]'))
        } else {
            po.log('error', `There was an error cancelling technician. ${po.getText('//section[contains(@id, "technician-message")]')}`)
        }
    }
}
