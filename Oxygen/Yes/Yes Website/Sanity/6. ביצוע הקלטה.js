po.init('6. ביצוע הקלטה')

web.transaction('03. Open TV Guide Page')
web.point('//header//a[contains(text(), "עולם התוכן")]')
po.click('//header//a[contains(text(), "עולם התוכן")]//..//a[contains(text(), "לוח שידורים")]')

web.transaction('07. Assert That Show Window Opens')
var showElements = '//div[@class="bs-body"]//div[contains(@class, "channel-item")]'
var showElementsCount = web.getElementCount(showElements)

if (showElementsCount == 0) {
    po.log('warning', `${web.getUrl()} TV guide screen was empty on load`)
    web.refresh()
    web.waitForVisible('//div[@class="bs-body"]')
    showElementsCount = web.getElementCount(showElements)
}

var randomIndex = po.getRandomNumber(2, showElementsCount)

web.scrollToElement(`(${showElements})[${randomIndex}]`)
var randomShowName = po.getText(`(${showElements})[${randomIndex}]//div[@class="bs-schedule-item-name"]`)

po.click(`(${showElements})[${randomIndex}]`)
var randomShowElement = `//div[@class='modal-dialog']//*[@id='popupSchedTitle' and contains(text(), '${randomShowName}')]`

// if (web.isVisible(randomShowElement)) {
//     po.log('success', `Window (${randomShowName}) opened`)
// } else {
//     po.log('error', `Window (${randomShowName}) failed to open`)
// }

web.transaction('08. Assert Recording Option')
po.click('//div[@class="modal-dialog"]//*[@id="popupSchedTitle"]//..//..//button[@class="record-page-btn"]')

if (web.isVisible('id=popup-login', po.longWait)) {
    web.transaction(`08.01 Login with ${env.username}`)
    po.loginWithExistingCustomer()
    
    if (web.isVisible('//div[@class="MembershipDetails"]', po.longWait) || web.getUrl().includes('accountdetailes')) {
        po.log('warning', `Redirected to ${web.getUrl()} after login`)
        web.open(`${env.url}/content/tvguide`)
    }
}

if (!web.isVisible('//*[contains(@class, "popup-title") and contains(text(), "הקלטה")]', po.longWait)) {
    po.click(`(${showElements})[${randomIndex}]`)
} else if (web.isVisible('//div[@id="divBeforeRecord"]')) {
    po.log('success', `Recording window of (${randomShowName}) opened`)
    var showBeforeRecording = po.getText('//div[@id="divBeforeRecord"]//div[contains(@class, "popup-info-text ") and contains(text(), "")]')
    po.click('//div[@id="divBeforeRecord"]//input[contains(@id, "radio-button")]')
    po.click('//div[@id="divBeforeRecord"]//button[contains(text(), "אישור")]')
} else {
    po.log('warning', `Recording window of (${randomShowName}) failed to open`)
}

// web.transaction('09. Assert Show Details')
// if (web.isVisible('id=divBeforeRecord')) {
//     var showAfterRecording = po.getText('//div[@id="divBeforeRecord"]//div[contains(@class, "popup-info-text ") and contains(text(), "")]')
//     if (showAfterRecording.includes(randomShowName) && showAfterRecording.includes('בהצלחה')) {
//         po.log('success', showAfterRecording)
//         po.log('success', `Recording of (${showBeforeRecording}) saved`)
//     } else {
//         po.log('error', `Failed to save recording of (${showBeforeRecording})`)
//     }
// }

// web.transaction('10. Open Show Recommendations')
// po.click('//div[@id="divAfterRecord"]//a[contains(text(), "להמלצות צפייה שבועיות")]')
// if (web.isVisible('id=main-content')) {
//     let url = web.getUrl()
//     if (url.includes(`${env.url}/content/main`)) {
//         po.log('success', `Successfully redirected to main content page -> ${url}`)
//     }
// } else {
//     po.log('error', `Failed to redirect to main content page. Current url -> ${url}`)
// }

web.transaction('11. Open TV Guide Page')
web.point('//header//a[contains(text(), "עולם התוכן")]')
po.click('//header//a[contains(text(), "עולם התוכן")]//..//a[contains(text(), "לוח שידורים")]')

web.transaction('07. Assert That Show Window Opens')
var showElements = '//div[@class="bs-body"]//div[contains(@class, "channel-item")]'
var showElementsCount = web.getElementCount(showElements)
var randomIndex = po.getRandomNumber(2, showElementsCount / 2)

web.scrollToElement(`(${showElements})[${randomIndex}]`)
var randomShowName = po.getText(`(${showElements})[${randomIndex}]//div[@class="bs-schedule-item-name"]`)
var randomShowElement = `//div[@class='modal-dialog']//*[@id='popupSchedTitle' and contains(text(), '${randomShowName}')]`

var tries = 5
while (!web.isVisible(randomShowElement, po.shortWait)) {
    po.click(`(${showElements})[${randomIndex + tries}]`)
    if (tries == 0) break
    tries--
}

// if (web.isVisible(randomShowElement)) {
//     po.log('success', `Window (${randomShowName}) opened`)
// } else {
//     po.log('error', `Window (${randomShowName}) failed to open`)
// }

web.transaction('08. Assert Recording Option')
po.click('//div[@class="modal-dialog"]//*[@id="popupSchedTitle"]//..//..//button[@class="record-page-btn"]')

if (web.isVisible('//*[contains(@class, "logintitle")]', po.shortWait)) {
    web.transaction(`08.01 Login with ${env.username}`)
    po.loginWithExistingCustomer()
}

if (!web.isVisible('//*[contains(@class, "popup-title") and contains(text(), "הקלטה")]', po.longWait)) {
    po.click(`(${showElements})[${randomIndex}]`)
} else if (web.isVisible('//div[@id="divBeforeRecord"]', po.longWait)) {
    po.log('success', `Recording window of (${randomShowName}) opened`)
    var showBeforeRecording = po.getText('//div[@id="divBeforeRecord"]//div[contains(@class, "popup-info-text ") and contains(text(), "")]')
    po.click('//div[@id="divBeforeRecord"]//input[contains(@id, "radio-button")]')
    po.click('//div[@id="divBeforeRecord"]//button[contains(text(), "אישור")]')
} else {
    po.log('error', `Recording window of (${randomShowName}) failed to open`)
}

// web.transaction('09. Assert Show Details')
// if (web.isVisible('//div[@id="divBeforeRecord"]')) {
//     var showAfterRecording = po.getText('//div[@id="divBeforeRecord"]//div[contains(@class, "popup-info-text ") and contains(text(), "")]')
//     if (showAfterRecording.includes(randomShowName) && showAfterRecording.includes('בהצלחה')) {
//         po.log('success', showAfterRecording)
//         po.log('success', `Recording of (${showBeforeRecording}) saved`)
//     } else {
//         po.log('error', `Failed to save recording of (${showBeforeRecording})`)
//     }
// }

// web.transaction('10. Open Show Recommendations')
// po.click('//div[@id="divAfterRecord"]//button[contains(text(), "סיום")]')
// if (web.isVisible('id=content')) {
//     let url = web.getUrl()
//     if (url.includes(`${env.url}/content/tvguide`)) {
//         po.log('success', `Successfully redirected to tv guide page -> ${url}`)
//     }
// } else {
//     po.log('error', `Failed to redirect to tv guidet page. Current url -> ${url}`)
// }
