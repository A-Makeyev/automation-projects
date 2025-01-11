const caps = {
  "platformName": "iOS",
  "platformVersion": "11.3",
  "deviceName": "Ben’s iPhone",
  "automationName": "XCUITest",
  "udid": "f43828a2271cd529fd24dc525b20f83792c1d4f7",
  "showXcodeLog": true,
  "usePrebuiltWDA": true,
  "bundleId": "com.multlock.entr.alpha-qa",
  "xcodeOrgId": "8R7H6F5AJ6",
  "xcodeSigningId": "iPhone Developer",
  "noReset": true,
  "fullReset": false
};

mob.transaction('Initialize');
mob.init(caps);

mob.transaction('Set automode - Lock settings');
mob.waitForElement("//XCUIElementTypeImage[contains(@name, 'hand')]");
mob.click("//XCUIElementTypeOther[@name='Users']");

mob.transaction('Set automode - Login');
mob.setValue("//XCUIElementTypeApplication[@name='ENTR 2.0 QA']","Qa1234");
mob.click("//XCUIElementTypeButton[@name='Done']");
mob.click("//XCUIElementTypeButton[@name='NEXT']");

if (mob.getValue("//XCUIElementTypeApplication[@name='ENTR 2.0 QA']") == 0) {
   mob.click("//XCUIElementTypeApplication[@name='ENTR 2.0 QA']");
   mob.pause(3 * 1000);
} 

mob.transaction("Open Lock - Initialization");
mob.dragAndDrop("//XCUIElementTypeImage[contains(@name, 'hand')]", 0, 1000);
mob.waitForElement("//XCUIElementTypeStaticText[@name='Unlocked']");

mob.dispose();
