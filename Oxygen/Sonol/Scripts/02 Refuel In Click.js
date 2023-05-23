var capabilities = {
  "deviceName": "Nexus 5 API 30",
  "platformVersion": "11.0",
  "platformName": "Android",
  "appPackage": "com.sonol.mobileapp",
  "appActivity": "com.sonol.mobileapp.MainActivity",
  "automationName": "UIAutomator2",
  "autoGrantPermissions": true
}

mob.transaction('01. Initialize App')
const utils = po.utils
const lg = po.loginScreen
const phoneNumber = '0589999999'

mob.init(capabilities)
// utils.getAppSource()

mob.transaction('02. Choose Environment')
lg.chooseEnv('staging')

mob.transaction('03. Type Login Details')
mob.waitForVisible('//android.view.View[@text="התחברות"]')

lg.enterNumber(phoneNumber)
mob.click('//android.widget.Button[contains(@content-desc, "להמשך")]')

mob.type('//android.widget.EditText[contains(@text, "שם פרטי")]')
mob.type('//android.widget.EditText[contains(@text, "שם משפחה")]')
mob.type('//android.widget.EditText[contains(@text, "מייל")]')
mob.type('//android.widget.EditText[contains(@text, "מספר רכב")]')

mob.click('//android.widget.TextView[contains(@text, "יש לבחור סוג דלק")]')
mob.click('//android.widget.Button[@content-desc=" גולד 95"]')
mob.click('(//android.widget.Button[@content-desc=" גולד 95"]//..//android.widget.ImageView)[1]')
mob.click('//android.widget.TextView[contains(@text, "יש לי דלקן")]//..//android.widget.TextView[@text="לא"]')
mob.click('//android.widget.TextView[@text="זכר"]')
mob.click('//android.view.ViewGroup[@content-desc="בחירה undefined  לא נבחר"]') // מאשר/ת בזאת את תנאי השימוש
mob.click('//android.widget.Button[contains(@content-desc,"סיום")]/android.view.ViewGroup')

mob.transaction('04. Login')
if (mob.isVisible(`//android.widget.TextView[@text="הקוד נשלח אל  ${phoneNumber}"]`)) {
  lg.enterNumber('7777')
  mob.findElement(lg.continueButton).click() 
}

mob.transaction('05. Open Refuel-In-Click Screen')
var swipeStart_X = mob.getLocation('text=תחנת דלק').x
var swipeStart_Y = mob.getLocation('text=תחנת דלק').y

var tries = 20
while(!mob.isVisible('text=תדלוק בקליק', utils.shortWait)) {
  if (mob.isVisible(lg.continueAsGuestButton, utils.shortWait)) {
    mob.click(lg.continueAsGuestButton)
  }
  mob.swipeScreen(swipeStart_X, swipeStart_Y, swipeStart_X + 500, swipeStart_Y)
  if (tries == 0) break
  else tries--
}

mob.click('text=תדלוק בקליק')
mob.pause(utils.shortWait)



mob.pause(utils.longWait)

// cc -> 4580080113180592  01/24  151
// cc -> 4580080113180576  01/24  237
// id -> 000966424
