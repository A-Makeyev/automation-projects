mob.transaction('01. Initialize App')
mob.init({
  "deviceName": "Nexus 5X API 31",
  "platformVersion": "12.0",
  "platformName": "Android",
  "appPackage": "com.tranzmate",
  "appActivity": "com.moovit.app.home.HomeActivity",
  "automationName": "UIAutomator2",
  "autoGrantPermissions": true
})

const shortWait = 5000

function closeAd() {
  const closeButtonElement = '//android.view.View[@resource-id="close-button-container" or (@resource-id="abgcp")]'
  let tries = 10
  while (mob.isVisible(closeButtonElement, shortWait)) {
    if (tries == 0) break
    else tries--
    mob.click(closeButtonElement)
  }
}

mob.transaction('02. Close Ads')
mob.click('id=com.tranzmate:id/submit_button')
mob.click('text=Maybe later')
closeAd()

mob.transaction('03. Add Addresses')
mob.click('id=com.tranzmate:id/search_proxy') 
mob.type('id=com.tranzmate:id/search_src_text', 'Haifa')
mob.click('(//android.view.ViewGroup[contains(@content-desc, "Haifa")])[2]')
mob.click('id=com.tranzmate:id/origin_container')

mob.type('id=com.tranzmate:id/search_src_text', 'Tel Aviv')
mob.click('(//android.view.ViewGroup[contains(@content-desc, "Tel Aviv")])[2]')

mob.transaction('03. Search Routes')
mob.click('id=com.tranzmate:id/search_button')

if (mob.isVisible('text=Trip plan error', shortWait)) 
  log.info(`Trip plan error: ${mob.getText('id=com.tranzmate:id/subtitle')}`) 
mob.pause(shortWait)
