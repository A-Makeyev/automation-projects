//chrome://inspect/#devices

var capabilities = {
  "deviceName": "ad071702170f42d9a0",
  "platformVersion": "8.0.0",
  "platformName": "Android",
  "appPackage": "rates.bankhadoar.co.il",
  "appActivity": "rates.bankhadoar.co.il.MainActivity",
  "automationName": "UIAutomator2",
}

mob.transaction('Initialize Appium')
mob.init(capabilities)
mob.setWebViewContext()
mob.setTimeout(60 * 1000)

function click(element) {
  mob.waitForVisible(element)
  mob.click(element)
}

mob.transaction('Login')
mob.waitForVisible('//div[contains(text(), "כניסה לחשבונך")]')
click('//div[contains(text(), "כניסה לחשבונך")]')

mob.type('//input[@id="UserName"]', 'd6u2575')
mob.type('//input[@id="password"]', 'Trump2024')
click('//button[@id="loginBoxNew"]')
// click('android=new UiSelector().resourceId("loginBoxNew")')

mob.transaction('Open Money Transfer')
click('(//div[contains(text(), "העברה לחשבון בארץ")])[1]')
// click('text=העברה לחשבון בארץ')

mob.transaction('Close Notification')
click('//span[text()="מאשר"]')
// click('text=מאשר')

mob.transaction('Choose Person')
mob.waitForVisible('//a[contains(text(), "בחר מוטבים מהעברות קודמות שלך")]')
click('//a[contains(text(), "בחר מוטבים מהעברות קודמות שלך")]')
click('(//div[@id="table"]//div[@tabindex="0"])[1]')
click('//button[text()="המשך"]')

mob.transaction('Choose Transfer Amount & Reason')
mob.scrollIntoView('//button[text()="הבא"]', true)
click('//button[text()="הבא"]')

mob.type('//input[@id="transferAmount"]', '5')
click('//input[@id="purpose"]')
click('//span[text()="עצמי"]')

mob.transaction('Open Summary Page')
click('//button[text()="הבא"]')
