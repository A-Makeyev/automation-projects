function click(element) {
    web.pause(500)
    web.click(element)
}

function getDate() {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    return `${dd}/${mm}/${yyyy}`
}

function getDay (date) {
    return date.slice(0, 2) < 10 ?
        date.slice(0, 2).substr(1) : date.slice(0, 2)
}

const day = getDay(getDate()) 
const date = getDate()

log.info('Day: ' + day)
log.info('Date: ' + date)

web.transaction('01. Initialize Selenium')
web.init()
web.setTimeout(180 * 1000)

web.transaction('02. Open Main Page')
web.open('https://www-400.aig.co.il/auto')
web.waitForVisible('//h1[@id="title"]')

web.transaction('03. Open Offer Page')
click('//button[@id="btn-get-offer"]')
web.waitForVisible('//h3[@id="page-title"]')

web.transaction('04. Choose Car Owner (Male)')
click('//button[@id="maleButton"]')

web.transaction('06. Choose Start Date')
click('//button[contains(text(), "מתאריך אחר")]')
click(`//td[contains(@class, "mat-calendar-body-cell") and not(@aria-disabled="true")]//div[contains(text(), "${day}")]`)
web.waitForVisible(`//div[@class="date-chosen" and contains(text(), "יום תחילת הביטוח: ${date}")]`)

web.transaction('06. Continue To Name')
click('//button[@id="continue-btn"]')

web.transaction('07. Enter Full Name')
web.type('//input[@id="firstName"]', 'גאמל')
web.type('//input[@id="lastName"]', 'חביב')

web.transaction('08. Continue To Phone')
click('//button[@id="continue-btn"]')

web.transaction('09. Enter Phone Number')
web.type('//input[@id="mobilePhone"]', '0528029575')

web.transaction('10. Continue To Birth Date')
click('//button[@id="continue-btn"]')


/*! capcha !*/
web.pause(1)


web.transaction('11. Enter Birth Date')
web.type('//input[@id="birthDateDay"]', '01')
web.type('//input[@id="birthDateMonth"]', '01')
web.type('//input[@id="birthDateYear"]', '1980')

web.transaction('12. Continue To Address')
click('//button[@id="continue-btn"]')

web.transaction('13. Choose City')
web.type('//input[@id="city_input"]', 'יהוד')
click('(//span[@class="mat-option-text" and contains(text(), "יהוד")])[1]')

web.transaction('14. Continue To Marital Status')
click('//button[@id="continue-btn"]')

web.transaction('15. Choose Married Status')
click('//button[@id="familyStatus_2"]')

web.transaction('16. Choose Primary Driver')
click('//button[@id="driverType_3"]')
web.type('//input[@id="driverFirstName"]', 'גאמל')
web.type('//input[@id="driverLastName"]', 'חביב')

web.transaction('17. Continue To Primary Driver Birth Date')
click('//button[@id="continue-btn"]')

web.transaction('18. Enter Primary Driver Birth Date')
web.type('//input[@id="driverBirthDataDay"]', '01')
web.type('//input[@id="driverBirthDateMonth"]', '01')
web.type('//input[@id="driverBirthDateYear"]', '1985')

web.transaction('19. Continue To Primary Driver ID')
click('//button[@id="continue-btn"]')

web.transaction('20. Enter Primary Driver ID')
web.type('//input[@id="driverIdOtherNumber"]', '999151681')

web.transaction('21. Continue To Primary Driver City')
click('//button[@id="continue-btn"]')

web.transaction('22. Choose Primary Driver City')
click('//button[@id="cityOther_6600"]')

web.transaction('23. Choose Primary Driver Married Status')
click('//button[@id="familyStatusOther_1"]')

web.transaction('24. Choose Primary Driver Licence Year')
web.type('//input[@id="licenseYearFull"]', '2004')

web.transaction('25. Continue To Number of Drivers')
click('//button[@id="continue-btn"]')

web.transaction('26. Choose Primary Driver and Another Driver')
click('//button[@id="numberOfDrivers_5"]')

web.transaction('27. Enter Other Driver Name')
web.type('//input[@id="fullNameAdditional"]', 'חמודי מנשה')

web.transaction('25. Continue To Other Driver ID')
click('//button[@id="continue-btn"]')

web.transaction('26. Enter Other Driver ID')
web.type('//input[@id="additionalDriverId"]', '999375777')

web.transaction('27. Continue To Other Driver Birth Date')
click('//button[@id="continue-btn"]')

web.transaction('28. Enter Other Driver Birth Date')
web.type('//input[@id="day"]', '01')
web.type('//input[@id="month"]', '01')
web.type('//input[@id="year"]', '1981')

web.transaction('29. Continue To New Driver Screen')
click('//button[@id="continue-btn"]')

web.transaction('30. Choose Not a New Driver')
click('//button[@id="newDriverType_0"]')

web.transaction('31. Enter Children Information')
click('//button[@id="hasChildrenButton"]')
web.type('//input[@id="youngestChildAge"]', '12')

web.transaction('32. Continue To Previous Insurance Details Part 1')
click('//button[@id="continue-btn"]')

web.transaction('33. Enter Previous Insurance Details Part 1')
click('//button[@id="notInsuredButton"]')
click('//button[@id="insuranceOption0_1"]')
click('//button[@id="insuranceOption1_0"]')
click('//button[@id="insuranceOption2_0"]')

web.transaction('34. Continue To Insurance Details Part 2')
click('//button[@id="continue-btn"]')

web.transaction('35. Enter Insurance Details Part 2')
click('//button[@id="notRefusedButton"]')
click('//button[@id="propertyInjuredButton"]')
click('//button[@id="pastClaimsOption0_1"]')

web.transaction('36. Continue To Insurance Details Part 3')
click('//button[@id="continue-btn"]')

web.transaction('37. Enter Insurance Details Part 3')
click('//button[@id="yesBodyClaims"]')
click('//button[@id="pastClaimsOption0_1"]')
click('//button[@id="pastClaimsOption1_0"]')
click('//button[@id="pastClaimsOption2_0"]')

web.transaction('38. Continue To Insurance Details Part 4')
click('//button[@id="continue-btn"]')

web.transaction('39. Enter Insurance Details Part 4')
click('//button[@id="neverHadSuspensionButton"]')

web.transaction('40. Open Previous Car Options')
click('//a[contains(text(), "אפשר למלא את פרטי הרכב")]')

web.transaction('41. Enter Previous Car Details Part 1')
click('//mat-select[@id="manufacturersSelect"]')
click('//span[@class="mat-option-text" and contains(text(), "סובארו")]')

web.pause(1000)
click('//mat-select[@id="yearsSelect"]')
click('//span[@class="mat-option-text" and contains(text(), "2018")]')

web.pause(1000)
click('//mat-select[@id="modelsSelect"]')
click('//span[@class="mat-option-text" and contains(text(), "סובארו STI")]')

web.transaction('42. Continue to Previous Car Details Part 2')
web.pause(5000) /* avoid empty click */
click('//button[@id="continue-btn"]')

web.transaction('43. Enter Previous Car Details Part 2')
click('//button[@id="vehicleHand_2"]')
click('//button[@id="previousOwmer_0"]')
click('//button[@id="range-1"]')
click('//button[@id="numberOfVehicles_2"]')
click('//button[@id="secondCar_1"]')

web.type('//input[@id="driverIdNumber"]', '999420862')

web.transaction('44. Continue to Offer')
click('//button[@id="continue-btn"]')

web.transaction('45. Continue To Car Details Part 1')
web.pause(5000) /* avoid empty click */
click('//button[@id="continue-btn"]')

web.transaction('46. Enter Car Details Part 1')
web.type('//input[@id="carNum"]', '1255530')

web.transaction('47. Continue To Car Details Part 2')
click('//button[@id="continue-btn"]')

web.transaction('48. Enter Car Details Part 2')
click('//button[contains(@class, "myCar")]')
click('//button[@id="range-1"]')
click('//button[@id="numberOfVehicles_2"]')
click('//button[@id="secondCar_1"]')

web.transaction('49. Continue to Updated Offer')
click('//button[@id="continue-btn"]')

web.transaction('50. Continue to Final Page')
web.pause(5000) /* avoid empty click */
click('//button[@id="continue-btn"]')


if (web.isVisible('//div[@class="error-page-img"]', 5000)) {
    log.info(
        `There was an error with the form: ${web.getText('//div[@class="error-page-img"]//h4')}`
    )
}
