web.transaction('01. Initialize')
web.init()

web.transaction('02. Open Appointments Page')
web.open('https://my.health.gov.il/')

web.waitForVisible('//h1[contains(text(), "איתור טיפות חלב וזימון תורים")]')

web.transaction('03. Type ID & Birth Date')
web.type('//input[@id="personalId"]', '999999999')

web.click('//input[@placeholder="יום"]')
web.type('//input[@placeholder="יום"]', '01')

web.click('//input[@placeholder="חודש"]')
web.type('//input[@placeholder="חודש"]', '01')

web.click('//input[@placeholder="שנה"]')
web.type('//input[@placeholder="שנה"]', '1990')

web.pause(2000) /* avoid empty click */
web.click('//div[@name="SelectedAppointmentType"]')
web.click('//span[@class="ui-select-choices-row-inner"]//span[contains(text(), "ביקור ראשון בטיפת חלב")]')

web.transaction('04. Fetch Personal Details Form')
web.click('//a[@id="gobut"]')

web.transaction('05. Enter Personal Details')
web.type('//input[@name="FirstName"]', 'איוונקה')
web.type('//input[@name="LastName"]', 'טראמפ')

web.click('//label[text()="קופת חולים"]//../div')
web.click('//div[@id="ui-select-choices-row-1-0"]')

web.click('//label[contains(text(), "ישוב")]//../div/div')
web.click(`//span[text()="${po.city}"]`)

web.pause(po.waitASecond) /* avoid empty click */
web.click('//label[contains(text(), "רחוב")]/div/../../div')

web.pause(po.waitASecond) /* avoid empty click */
web.click(`(//span[contains(text(), "${po.city}")])[2]`)

web.transaction('05. Open City Search Page')
web.click('//a[@id="gobut"]')

web.transaction('06. Select City')
web.click(`(//div[contains(text(), "${po.city}")])[1]`)

web.transaction('07. Open Appointment Page')
web.click('//a[@id="gobut"]')

/* gapcha */