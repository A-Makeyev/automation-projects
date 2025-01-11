// change to false for local testing
var cloudbeat = false
var capabilities

if (cloudbeat) {
  capabilities = {
        "autoGrantPermissions": true,
        "automationName": "UIAutomator2"
  }
} else {
  capabilities = {
    "deviceName": "ad071702170f42d9a0",
    "platformVersion": "8.0.0",
    "platformName": "Android",
    "appPackage": "com.davidshield.app",
    "appActivity": "com.tns.NativeScriptActivity",
    "automationName": "UIAutomator2",
  }
}

var username = 'xxxxxxxx'
var password = 'xxxxxxxx'
var shortWait = 5000

function closeRandomAttentionPopUp() {
  if (mob.isVisible('id=android:id/button1', shortWait)) {
      mob.click('id=android:id/button1')
  }
}

mob.transaction('01. Initialize Appium')
mob.init(capabilities)
mob.pause(shortWait)

mob.transaction('02. Login')
mob.click('~Log in')
closeRandomAttentionPopUp()

mob.type('class=android.widget.EditText', username)
mob.click('~Log in with my password')

mob.type('//android.widget.TextView[@content-desc="Password"]//..//android.widget.EditText', password)
mob.click('//android.widget.TextView[@content-desc="Forgot your password?"]//..//..//android.widget.ImageView')

if (mob.isVisible('text=No Thanks', shortWait)) {
    mob.click('text=No Thanks')
}

mob.transaction('03. Allow Location')
// Press NO THANKS in the "To continue, turn on device location, which uses Google’s location service" popup

if (mob.isVisible('id=android:id/button2', shortWait)) {
  mob.click('id=android:id/button2')
}

if (mob.isVisible('id=com.android.packageinstaller:id/permission_allow_button', shortWait)) {
  mob.click('id=com.android.packageinstaller:id/permission_allow_button')
}

mob.transaction('04. Open My Plan')
closeRandomAttentionPopUp()

mob.click('~My Plan')
mob.click('~will smith')

mob.transaction('05. Open What\'s Covered Info')
mob.click(`(//android.widget.TextView[@content-desc="See all"])[1]`)

mob.transaction('06. Assert Covered Info')
assert.equal(
  mob.isVisible('~Emergency Room & Urgent Care Center Visits'), true,
  '"Emergency Room & Urgent Care Center Visits" is not covered'
)

assert.equal(
  mob.isVisible('~Ambulance Service'), true,
  '"Ambulance Service" is not covered'
)

assert.equal(
  mob.isVisible('~Medical Evacuation'), true,
  '"Medical Evacuation" is not covered'
) 

var scrollView = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView';

mob.scrollIntoElement(
   scrollView,
   '(//android.widget.TextView[@content-desc="Maternity Care & Childbirth"])[2]'
)

assert.equal(
  mob.isVisible('(//android.widget.TextView[@content-desc="Maternity Care & Childbirth"])[1]'), true,
  '"First Maternity Care & Childbirth" is not covered'
)

assert.equal(
  mob.isVisible('(//android.widget.TextView[@content-desc="Maternity Care & Childbirth"])[2]'), true,
  '"Second Maternity Care & Childbirth" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '~Routine check up / Wellness'
)

assert.equal(
  mob.isVisible('~Routine Care of Baby and Child including inoculations'), true,
  '"Routine Care of Baby and Child including inoculations" is not covered'
)

assert.equal(
  mob.isVisible('~Routine check up / Wellness'), true,
  '"Routine check up / Wellness" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '(//android.widget.TextView[@content-desc="Diagnostic Tests"])[1]'
)

assert.equal(
  mob.isVisible('~Physician Services - General'), true,
  '"Physician Services - General" is not covered'
)

assert.equal(
  mob.isVisible('(//android.widget.TextView[@content-desc="Diagnostic Tests"])[1]'), true,
  '"First Diagnostic Tests" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '(//android.widget.TextView[@content-desc="Diagnostic Tests"])[2]'
)

assert.equal(
  mob.isVisible('(//android.widget.TextView[@content-desc="Diagnostic Tests"])[2]'), true,
  '"Second Diagnostic Tests" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '~Office visit DSIC'
)

assert.equal(
  mob.isVisible('~DSIC - Inpatient'), true,
  '"DSIC - Inpatient" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '~Physical Therapy'
)

assert.equal(
  mob.isVisible('~Office visit DSIC'), true,
  '"Office visit DSIC" is not covered'
)

assert.equal(
  mob.isVisible('~Physical Therapy'), true,
  '"Physical Therapy" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '~Pregnancy and Childbirth'
)

assert.equal(
  mob.isVisible('~Medication'), true,
  '"Medication" is not covered'
)

assert.equal(
  mob.isVisible('~Pregnancy and Childbirth'), true,
  '"Pregnancy and Childbirth" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '~Home Nursing'
)

assert.equal(
  mob.isVisible('(//android.widget.TextView[@content-desc="Wellness/ Routine Check Up"])[1]'), true,
  '"Wellness/ Routine Check Up" is not covered'
)

assert.equal(
  mob.isVisible('~Home Nursing'), true,
  '"Home Nursing" is not covered'
)

mob.scrollIntoElement(
  scrollView,
  '~Emergency Dental Treatment'
)

assert.equal(
  mob.isVisible('~Emergency Dental Treatment'), true,
  '"Emergency Dental Treatment" is not covered'
)

mob.transaction('07. Open What\'s Not Covered Info')
mob.click('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.widget.ImageView')
mob.pause(shortWait)

mob.scrollIntoElement(
  '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup',
  '(//android.widget.TextView[@content-desc="See all"])[2]'
)

mob.click('(//android.widget.TextView[@content-desc="See all"])[2]')

mob.transaction('08. Assert What\'s Not Covered Info')
assert.equal(
  mob.isVisible('~Mental'), true,
  '"Mental" is Not Inside "Not Covered"'
)
