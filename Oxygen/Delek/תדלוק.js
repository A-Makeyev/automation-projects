var capabilities = {
  "deviceName": "ad071702170f42d9a0",
  "platformVersion": "8.0.0",
  "platformName": "Android",
  "appPackage": "led.android.mentaplus",
  "appActivity": "led.android.mentaplus.MainActivity",
  "automationName": "UIAutomator2",
  "autoGrantPermissions": true,
  "noReset": true 
}

twilio.init('XXXXXXX', 'XXXXXXX')
mob.init(capabilities)

let refuel = mob.findElement("/android.view.ViewGroup/android.view.ViewGroup")
refuel.click()

if (mob.isVisible("com.android.packageinstaller:id/permission_allow_button", 5000)) {
  mob.click("com.android.packageinstaller:id/permission_allow_button")
}

let sabbaba = mob.findElement("/android.view.ViewGroup/android.widget.TextView")
sabbaba.click()

let codeBox_1 = mob.findElement("/android.view.ViewGroup[1]/android.widget.EditText")
codeBox_1.setValue("1")

let codeBox_2 = mob.findElement("/android.view.ViewGroup[2]/android.widget.EditText")
codeBox_2.setValue("2")

let codeBox_3 = mob.findElement("/android.view.ViewGroup[3]/android.widget.EditText")
codeBox_3.setValue("3")

let codeBox_4 = mob.findElement("/android.view.ViewGroup[4]/android.widget.EditText")
codeBox_4.setValue("4")

let sms = twilio.getLastSms(false, 30 * 1000, 60 * 1000)
log.info(sms)

mob.pause(10 * 1000)
