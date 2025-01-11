var capabilities = {
    "deviceName": "ad071702170f42d9a0",
    "platformVersion": "8.0.0",
    "platformName": "Android",
    "appPackage": "com.moblin.totowiner",
    "appActivity": "com.moblin.totowiner.MainActivity",
    "automationName": "UIAutomator2",
    "autoGrantPermissions": true
}

mob.transaction('01. Initialize Appium')
const shortWait = 20 * 1000
mob.init(capabilities)

mob.getDriver().setGeoLocation({
    latitude: 32.816004746283284,
    longitude: 35.11222191289247,
    altitude: 18.0
})

mob.transaction('02. Allow Permissions')
if (web.isVisible('text=השתדרגנו! על מנת להמשיך ליהנות מאפליקציית Winner עליך לעדכן גרסה')) {
    log.info('השתדרגנו! על מנת להמשיך ליהנות מאפליקציית Winner עליך לעדכן גרסה')
    assert.pass()
}

if (mob.isVisible('text=ALLOW', shortWait)) {
    mob.click('text=ALLOW')
}

mob.transaction('03. Check Connection Warning')
if (mob.isVisible('~ניסיון נוסף', shortWait)) {
    mob.click('~ניסיון נוסף')
    if (mob.isVisible('~ניסיון נוסף', shortWait)) {
        assert.fail('בעיית קליטה - לא ניתן לפתוח את האפליקציה')
    }
}

mob.transaction('04. Accept Conditions')
mob.click('//android.widget.CheckBox[@content-desc="קראתי ואני מאשר את תנאי השימוש ואת מדיניות הפרטיות"]/android.widget.CheckBox')
mob.click('//android.widget.Button[@content-desc="עדכן"]')

mob.waitForVisible('(//android.view.View[contains(@content-desc,"בשעה")])[1]')

mob.transaction('05. Open Football Results')
mob.click('text=כדורגל')
mob.waitForExist('//android.widget.Button[@content-desc="WinnerLine "]//..//..//android.widget.ScrollView')

mob.transaction('06. Open Basketball Results')
mob.click('text=כדורסל')
mob.waitForExist('//android.widget.Button[@content-desc="WinnerLine "]//..//..//android.widget.ScrollView')
