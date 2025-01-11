var capabilities = {
    "deviceName": "ad071702170f42d9a0",
    "platformVersion": "8.0.0",
    "platformName": "Android",
    "appPackage": "clalit.android",
    "appActivity": "clalit.android.MainActivity",
    "automationName": "UIAutomator2",
    "noReset": false
}

mob.transaction('Init')
mob.init(capabilities)
mob.setTimeout(120 * 1000)

const ID = '999999999', code = 'XXXXXXX', password = 'XXXXXXX'

mob.transaction('Skip Add')
mob.click("id=clalit.android:id/button_skip")

mob.swipeScreen(130,130,30,1900)
mob.swipeScreen(130,130,30,1900)

let el1 = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.widget.ListView[1]/android.view.View[2]/android.widget.Image")
el1.click()

mob.click('text=כניסה רגילה')

let el2 = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[4]/android.view.View[3]/android.view.View/android.view.View[2]/android.view.View[2]/android.view.View/android.view.View/android.view.View/android.widget.ListView/android.view.View[2]/android.widget.EditText")
mob.type(el2,ID)

let el3 = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[4]/android.view.View[3]/android.view.View/android.view.View[2]/android.view.View[2]/android.view.View/android.view.View/android.view.View/android.widget.ListView/android.view.View[3]/android.widget.EditText")
mob.type(el3, code)

let el4 = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[4]/android.view.View[3]/android.view.View/android.view.View[2]/android.view.View[2]/android.view.View/android.view.View/android.view.View/android.widget.ListView/android.view.View[4]/android.widget.EditText")
mob.type(el4, password)

mob.swipeScreen(970, 645, 970, 200)

let el5 = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[4]/android.view.View[3]/android.view.View/android.view.View[2]/android.view.View[2]/android.view.View/android.view.View/android.widget.Button")
mob.click(el5)

// wait for screen to load
mob.waitForVisible('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[3]/android.view.View[1]/android.view.View[4]/android.view.View/android.view.View[3]/android.view.View[2]')

for (let x = 0; x < 4; x++) {
    mob.swipeScreen(900, 1700, 1000, 70)
}

let doctors = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[3]/android.view.View[1]/android.view.View[6]/android.view.View[1]/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[2]/android.widget.TabWidget/android.view.View[6]")
mob.click(doctors)

let chooseProf = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[3]/android.view.View[1]/android.view.View[6]/android.view.View[1]/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[2]/android.widget.TabWidget/android.view.View[6]/android.view.View[5]/android.view.View[3]/android.view.View/android.widget.Spinner")
mob.click(chooseProf)

let xray = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ListView/android.widget.CheckedTextView[2]")
mob.click(xray)

let appointment = mob.findElement("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View[3]/android.view.View[1]/android.view.View[6]/android.view.View[1]/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[2]/android.widget.TabWidget/android.view.View[6]/android.view.View[5]/android.view.View[10]/android.view.View/android.view.View")
mob.click(appointment)

mob.pause(10 * 1000)
