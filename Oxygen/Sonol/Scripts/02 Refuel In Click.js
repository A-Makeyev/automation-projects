const utils = po.utils
const lg = po.loginScreen
const phoneNumber = '0999999999'

po.init(env.name)
//utils.getAppSource()

mob.transaction('03. Type Login Details')
lg.enterNumber(phoneNumber)
mob.type('(//android.widget.EditText)[1]', '0')
mob.type('(//android.widget.EditText)[2]', '0')
mob.type('(//android.widget.EditText)[3]', '0')
mob.type('(//android.widget.EditText)[4]', '0')

if (!mob.isVisible('text=הבא', utils.longWait)) {
  mob.type('//android.widget.EditText[contains(@content-desc, "שם פרטי")]', 'אנטולי')
  mob.type('//android.widget.EditText[contains(@content-desc, "שם משפחה")]', 'מקייב')
  mob.click('//android.widget.CheckBox[contains(@content-desc, "מאשר/ת בזאת את התקנון ומדיניות הפרטיות בחירה")]')
  mob.click('//android.widget.Button[contains(@content-desc, "הבא") and not(contains(@content-desc, "הבא לא פעיל"))]')
  mob.type('//android.widget.EditText[contains(@content-desc, "מספר רכב")]', '666666')
  mob.click('//android.widget.Button[contains(@content-desc, "הבא") and not(contains(@content-desc, "הבא לא פעיל"))]')
  mob.click('(//android.view.ViewGroup[@content-desc="כפתור רדיו"])[1]') // 95
  mob.click('//android.widget.Button[contains(@content-desc, "הבא") and not(contains(@content-desc, "הבא לא פעיל"))]')

  mob.transaction('04. Add Payment Details')
  // close image
  mob.click('(//android.widget.ImageView//..//android.view.ViewGroup)[1]')
  // press skip
  mob.click('text=אולי אחר כך')
  mob.click('text=הבא')
  mob.click('text=לדף הבית')
} else {
  mob.click('text=הבא')
  mob.click('text=לדף הבית')
}

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
