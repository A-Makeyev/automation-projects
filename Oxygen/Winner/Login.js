var capabilities = {
    "deviceName": "ad071702170f42d9a0",
    "platformVersion": "8.0.0",
    "platformName": "Android",
    "appPackage": "com.moblin.totowiner",
    "appActivity": "com.moblin.totowiner.MainActivity",
    "automationName": "UIAutomator2",
}

mob.transaction('01. Initialize Appium')
mob.init(capabilities)

mob.transaction('02. Allow Permission')
let allowPermission = "id=com.android.packageinstaller:id/permission_allow_button"
if (mob.isVisible(allowPermission)) {
    mob.click(allowPermission)
}

mob.transaction('03. Accept Conditions')
let conditions = "//android.widget.CheckBox[@content-desc=\"קראתי ואני מאשר את תנאי השימוש ואת מדיניות הפרטיות\"]/android.widget.CheckBox"
if (mob.isVisible(conditions)) {
    mob.click(conditions)
    mob.click("~עדכן")
}

mob.transaction('04. Login')
mob.click('text=התחבר')

mob.type('//*[@content-desc="שם משתמש, "]', 'tototest')
mob.type('//*[@content-desc="סיסמה, "]', 'Lolo4321')
mob.click('//*[@content-desc="התחבר"]')
