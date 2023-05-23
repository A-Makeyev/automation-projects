const firstName = po.details.randomName();
const lastName = po.details.randomName();

web.transaction("01, Intilaize selenium")
web.init();

web.transaction("02, Open main page")
web.open("https://www.australiaimmigrationagency.com/")
po.handleCertificate()


web.transaction("03, Open apply page")
po.click("//a[text() ='Register']")
po.handleCertificate()

web.transaction("04, Enter details")
web.selectFrame("#frame1")
po.click("//input[@id='NoPassportRadio']")
web.select("id=level_of_english" , "label=High/advanced")
po.fillDetails(firstName,lastName,po.details.email,po.details.phoneNumber)

web.transaction("05, Select product")
web.waitForVisible("div[id='header2']")

// for mobile view
if (web.isVisible('//div[@id="checkbox1"]//div[@class="RadioOuter"]', 5000))
    po.click('//div[@id="checkbox1"]//div[@class="RadioOuter"]')

else if (web.isVisible('//div[@id="col1"]//div[@class="RadioInner"]', 5000))
    po.click('//div[@id="col1"]//div[@class="RadioInner"]')


po.click("div[data-translate='Payment_btnSubmit']")
web.waitForVisible("//input[@id='ContentPlaceHolder3_PaymentOptionsNew_CreditCardTab_firstName']")

web.transaction("06, Submit payment")
po.addPayment(po.details.cardName, po.details.cardNumber, po.getYear())

po.click("input[id='ContentPlaceHolder3_PaymentOptionsNew_CreditCardTab_Button2']")

web.transaction("07, Assert login to application")
web.waitForVisible("div[id='welcomeMessegeText']")
po.click("a[data-translate='loginAppBtn'")

web.selectWindow()
assert.equal(web.getText("#view2 > .topHeader"),"Dear " + firstName + " " + lastName, "Error")

web.transaction("08, Clear Lead")
po.clearData()