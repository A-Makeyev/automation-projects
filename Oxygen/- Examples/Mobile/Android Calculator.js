var capabilities = {
  /*
      to find deviceName run: adb devices
      to find appPackage & appActivity
      1) run: adb shell
      2) run: dumpsys window windows | grep -E "mCurrentFocus" 
  */
  "deviceName": "ad071702170f42d9a0",
  "platformVersion": "8.0.0",
  "platformName": "Android",
  "appPackage": "com.sec.android.app.popupcalculator",
  "appActivity": "com.sec.android.app.popupcalculator.Calculator",
  "automationName": "UIAutomator2"
}

mob.transaction("Initialize App");
mob.init(capabilities);
mob.setTimeout(30 * 1000);

mob.transaction("Type 111");
mob.waitForVisible("~Calculator input field");
mob.findElement("~Calculator input field").setValue("111");

mob.transaction("Tap on Multiplication");
mob.findElement("id=com.sec.android.app.popupcalculator:id/bt_mul").click();

mob.transaction("Tap on 6");
mob.findElement("id=com.sec.android.app.popupcalculator:id/bt_06").click();

mob.transaction("Tap on Equal");
mob.findElement("//android.widget.Button[@content-desc='Equal']").click();

mob.transaction("Assert Displayed Number");
let result = mob.getText("~Calculator input field")
assert.contain(
  result,
  "666"
)

mob.transaction("Close App");
mob.closeApp()
