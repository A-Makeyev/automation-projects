var capabilities = {
  "deviceName": "ad071702170f42d9a0",
  "platformVersion": "8.0.0",
  "platformName": "Android",
  "appPackage": "led.android.mentaplus",
  "appActivity": "led.android.mentaplus.MainActivity",
  "automationName": "UIAutomator2",
  "autoGrantPermissions": true,
  "noReset": false // create account
}

const CARD_NUMBER = '7777777777777777',
		  CARD_EXP = '0000',
		  CARD_CODE = '000',
		  ID = '999999999',

web.transaction('Initialize Twilio')
twilio.init('XXXXXXX', 'XXXXXXX')
const twilioNumber = '0555555555'

web.transaction('Initialize App')
const startTime = new Date().getTime()
mob.init(capabilities)

let el1 = mob.findElement("/android.view.ViewGroup/android.widget.TextView")
el1.click()

let el2 = mob.findElement("/android.view.ViewGroup/android.widget.EditText")
el2.setValue('0527729974')
mob.sendKeys(["Enter"])

let el3 = mob.findElement("/android.view.ViewGroup[2]/android.widget.TextView")
el3.click()

let el4 = mob.findElement("/android.view.ViewGroup/android.widget.EditText")
el4.setValue("anatoly")

let el5 = mob.findElement("/android.view.ViewGroup/android.widget.EditText")
el5.setValue("makeyev")

let el6 = mob.findElement("/android.view.ViewGroup/android.widget.EditText")
el6.setValue("AM@gmail.com")
mob.sendKeys(["Enter"])

let el7 = mob.findElement("/android.widget.TextView")
el7.click()

let el8 = mob.findElement("/android.view.ViewGroup/android.widget.EditText")
el8.setValue("69222258")
mob.sendKeys(["Enter"])

mob.pause(10 * 1000)
