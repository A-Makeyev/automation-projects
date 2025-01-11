var cloudbeat = false
var mac = false
var filePath

/* change to true when uploading to cloudbeat */

if (cloudbeat) {
    filePath = 'C:\\cloudbeat\\test_files\\Vaccination-Certificate.pdf'
} else {
    if (mac) {
        filePath = '/Users/anatolymakeyev/Desktop/test-automation/OXYGEN/'
        + 'Health-Gov/UI-LOAD-TEST/Data/Vaccination-Certificate.pdf'
    }
    filePath = 'C:\\Users\\Makeyev\\Desktop\\test-automation\\OXYGEN' 
    + '\\Health-Gov\\UI-LOAD-TEST\\Data\\Vaccination-Certificate.pdf'
}

var date = new Date()
date = po.formatDate(date)
log.info(date)

const flights = po.ramzor.flights

web.transaction('01. Initialize')
web.init()
web.setTimeout(10 * 1000)

web.transaction('02. Open Main Flights Page')
web.open(po.ramzor.url + '/flights')
web.waitForExist('id=main')

if (web.isVisible('//div[contains(@class, "error-conatiner")]', 5000)) {
    assert.fail(
        'The page has failed to load: ' +
        web.getText('//div[contains(@class, "error-text")]')
    )
}

web.transaction('03. Open Form')
po.click(flights.startForm_button)
 
po.click('//label[@for="customRadioAvia"]')
po.click(flights.submit)

web.transaction('04. Type Personal Details')
po.type(flights.firstName_input, 'אנטולי')
po.type(flights.lastName_input, 'מקייב')

po.type(flights.id_input, '999999212')
po.type(flights.passport_input, '21299999')

// date
po.type('id=date_main_birthdate', '1')
po.type('id=date1_main_birthdate', '7')
po.type('id=month_main_birthdate', '0')
po.type('id=month1_main_birthdate', '8')
po.type('id=year_main_birthdate', '1')
po.type('id=year1_main_birthdate', '9')
po.type('id=year2_main_birthdate', '9')
po.type('id=year3_main_birthdate', '3')

po.type(flights.phoneCode_input, '972')
po.click(flights.israelPhoneCode)

po.type(flights.phoneNumber_input, '0525252525')
po.type(flights.email_input, po.emailAddress)

web.transaction('05. Submit Form')
po.click(`(${flights.submit})[2]`)

web.transaction('06. Submit Health Declaration')
po.click('//label[@for="customRadioWhiteList0"]')
po.click('//input[@name="health_declarartion"]//..//label')
//po.click(`(${flights.submit})[3]`)

web.transaction('07. Type Travel Details')
po.click('//input[@id="checkpoints"]')
po.click('//a[contains(@class,"dropdown-item")]//b[contains(text(), "מעבר נתב")]')

po.type('//input[@name="airline"]', 'RYANAIR')
po.pressENTER()

po.type('//input[@name="flight_number"]', '123')
po.click('//input[@name="depart_country_text"]')
po.pressARROW_DOWN()
po.pressENTER()

web.select('//select[@id="depart_date"]', `label=${date}`)
web.select('//select[@id="landing_date"]', `label=${date}`)

po.type('//input[@name="arrive_min"]', '10')
po.type('//input[@name="arrive_hour"]', '10')

po.click(`(${flights.submit})[3]`)
po.click(`(${flights.submit})[4]`)

web.transaction('08. Add Another Passenger')
po.click('//*[@onclick="addPassengerStep()"]')

web.transaction('09. Type Another Passenger Details')
po.type(flights.addPassenger_firstName_input, 'אסטבון')
po.type(flights.addPassenger_lastName_input, 'ויללון')

po.type(flights.addPassenger_id_input, '040135907')
po.type(flights.addPassenger_passport_input, '12199999')

po.type('id=date_add_passenger_9_birthdate', '0')
po.type('id=date1_add_passenger_9_birthdate', '8')
po.type('id=month_add_passenger_9_birthdate', '0')
po.type('id=month1_add_passenger_9_birthdate', '7')
po.type('id=year_add_passenger_9_birthdate', '1')
po.type('id=year1_add_passenger_9_birthdate', '9')
po.type('id=year2_add_passenger_9_birthdate', '9')
po.type('id=year3_add_passenger_9_birthdate', '1')

po.type(flights.addPassenger_phoneCode_input, '972')
po.click(`//input[@id="add_passenger_9_phoneCode"]//..${flights.israelPhoneCode}`)
po.type(flights.addPassenger_phone_input, '0525252525')

web.transaction('10. Submit Passengers')
po.click(`(${flights.submit})[7]`)
po.click('(//*[contains(text(), "קיבלתי חיסון או החלמתי בישראל")])[2]')
po.click('(//*[contains(text(), "אישור שכל הפרטים שמסרתי נכונים לזמן החתימה על ההצהרה")])[2]')

po.click(`(${flights.submit})[8]`)
po.click('//*[@id="submit_passengers"]')

web.transaction('11. Add Isolation Details')
po.type('//input[@name="isolation_city_text"]', 'ירושלים')
po.click('//a[text()="ירושלים"]')

po.click('//input[@name="isolation_street_text"]')
po.click('//a[contains(text(), "זוהור")]')

po.type('//input[@name="isolation_house_num"]', '1')
po.type('//input[@name="isolation_total_members"]', '2')
po.type('//input[@name="isolation_total_rooms"]', '3')

po.click('//input[@name="isolation_disclaimer_signed"]//..//label')
po.click('//*[text()="לסיום"]')

web.transaction('12. Assert Passengers Details')
web.waitForVisible('id=pdf_template')

assert.equal(
    web.isVisible(
        '//div[@id="pdf_template"]'
        + '//*[@class="title" and contains(text(), "אנטולי מקייב")]'
        + '//strong[text()="999999212"]'
    ), true,
    `אנטולי מקייב לא מופיע בסיום הטופס`
)

assert.equal(
    web.isVisible(
        '//div[@id="pdf_template"]'
        + '//*[@class="title" and contains(text(), "אסטבון ויללון")]'
        + '//strong[text()="040135907"]'
    ), true,
    `אסטבון ויללון לא מופיע בסיום הטופס`
)

if (!web.isVisible('//*[contains(text(), "להורדת סטטוס")]')) {
    assert.fail('כפתור "להורדת סטטוס" אינו מופיע')
} else {
    // assert pdf?
}
