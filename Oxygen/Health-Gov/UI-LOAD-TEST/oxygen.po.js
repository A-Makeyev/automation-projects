module.exports = {

    city: 'חוסנייה',
    lastName: 'מן',
    firstName: 'טסט',
    ID: '000000000',
    passport:  'XXXXXXXXX',
    phoneNumber: '999999999',
    emailPassword: 'XXXXXXX',
    emailAddress: 'cloudbeat.health.gov@gmail.com',
    shortWait: 1000,
    waitASecond: 5000,

    pressTAB: () => { web.sendKeys('\uE004') },
    pressENTER: () => { web.sendKeys('\uE007') },
    pressARROW_UP: () => { web.sendKeys('\uE013') },
    pressARROW_DOWN: () => { web.sendKeys('\uE015') },

    getText: (locator) => {
        let text = web.getText(locator)
        let loops = 0
        if (text.length < 1) {
            while (text.length < 1) {
                web.pause(po.waitASecond)
                text = web.getText(locator)
                loops++
                if (loops > 15) {
                    break
                }
            }
        }
        return text
    },

    formatDate: (date) => {
        let dd = String(date.getDate()).padStart(2, "0")
        let mm = String(date.getMonth() + 1).padStart(2, "0")
        let yyyy = date.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    },

    click: (element) => {
        if (web.isVisible(element, po.shortWait)) {
            web.click(element)
        } else {
            web.pause(po.waitASecond)
            web.makeVisible(element)
            web.clickHidden(element)
        } 
    },

    type: (element, text) => {
        if (web.isVisible(element, po.shortWait)) {
            web.type(element, text)
        } else {
            web.waitForVisible(element)
            web.pause(po.waitASecond)
            web.type(element, text)
        }
    },

    braini: {
        url: 'http://braini-test.moh.health.gov.il/Pages/default.aspx',
        username: 'XXXXX',
        password: 'XXXXX!',

        nav: {
            topNavBar: '//div[contains(@id, "TopNavigationMenu")]',
            marvad: "//div[contains(@id, 'TopNavigationMenu')]//a[text()='מרב\"ד']",
            vaccines: '//div[contains(@id, "TopNavigationMenu")]//a[text()="חיסונים"]',
            departments: '//div[contains(@id, "TopNavigationMenu")]//a[text()="יחידות - ארצי ומחוזי"]',
            certificationAndExams: '//div[contains(@id, "TopNavigationMenu")]//a[text()="הסמכות תעודות ובחינות"]',
            registrationAndProducts: '//div[contains(@id, "TopNavigationMenu")]//a[text()="רישום ורישוי מוצרים"]',
            guidelinesAndPurchasing: '//div[contains(@id, "TopNavigationMenu")]//a[text()="הנחיות, רכש, רקמות, קנאביס"]',
        },
        
        mainPage: {
            treeHeader: '(//div[@class="boxTop"]//h2)[1]',
            treeWrapper: '//div[@id="SiteTreeViewWrapper"]',
            treeElements: '//div[contains(@id, "SiteTreeView")]//a[contains(@class, "WebPartManager")]',

            loadWindow: (window) => {
                const startTime = new Date().getTime()
                const mp = po.braini.mainPage
                web.click(`${po.braini.nav.topNavBar}//a[contains(text(), '${window}')]`)

                if (window == 'הסמכה תעודות ובחינות') {
                    assert.equal(web.isVisible('//div[@class="boxTop"]//h2[text()="הסמכה, תעודות ובחינות"]'), true)
                } else if (window == 'מרב"ד') {
                    assert.equal(web.isVisible("//div[@class='boxTop']//h2[text()='מרב\"ד']"), true)

                } else {
                    /* assert tree wrapper & header */
                    assert.equal(web.isVisible(mp.treeWrapper), true)
                    assert.equal(web.getText(mp.treeHeader).includes(window), true)
                }

                /* wait for tree elements to load */
                let treeElements = web.getElementCount(mp.treeElements)
                for (let i = 1; i <= treeElements; i++) {
                    web.waitForVisible(`(${mp.treeElements})[${i}]`)
                }

                const endTime = new Date().getTime()
                log.info(
                    'window ' + window + ' loaded in ' +
                    parseFloat((endTime - startTime) / po.waitASecond).toFixed(1) + ' seconds'
                )
            },
        },
    }, /* end of braini */

    ramzor: {
        url: 'https://corona.health.gov.il',
        test_url: 'https://coronatest.back.health.gov.il',

        flights: {
            startForm_button: '//button[@data-levelcompleted="introduction"]',
            submit: '//*[contains(@id, "submit")]',

            /* personal details page */
            firstName_input: 'name=firstName',
            lastName_input: 'name=lastName',
            citizenship_input: 'name=citizenship_text',
            israelCode: '//a[@class="dropdown-item active" and text()="ישראל"]',
            israelPhoneCode: '//a[contains(@class,"dropdown-item") and contains(text(), "ישראל - 972")]',
            id_input: 'name=id_number',
            passport_input: 'name=passportNumber',
            birthDate_input: 'id=main_birthdate',
            phoneCode_input: 'name=phone_code_text',
            phoneNumber_input: 'name=phone',
            email_input: 'name=email',
            reportingAgent_select: 'name=reporting_agent',

            /* declarations page */
            fileUploadInput: '//input[@id="declerationFile"]',
            declarationsConfirm_checkbox: 'name=greenDecleration_8',
            passengerDeclarations_checkbox: '//input[@name="passenger-declaration-8"]',
            secondaryFileUploadInput: 'id=add_passenger_8_healthDeclaration',

            /* flight details page */
            airline_input: 'name=airline',
            airlineName_elAl: '//a[contains(text(), "LY - EL AL ISRAEL AIRLINES")]',
            flightNumber_input: 'name=flight_number',
            flightNumber_610: '//a[@class="dropdown-item active"]//b[text()="610"]',
            departCountry_input: 'name=depart_country_text',
            departCountry_uganda: '//a[text()="254 - אוגנדה"]',
            departDate_input: 'id=depart_date',
            landingDate_input: 'id=landing_date',
            arriveTimeMinutes_input: 'name=arrive_min',
            arriveTimeHours_input: 'name=arrive_hour',
            connectionFlight_checkbox: 'name=connection_flight',
            connectionFlightCountry_input: 'name=connection_flight_country_1_text',
            connectionFlightCountry_swiss: '//a[text()="520 - שווייץ"]',
            connectionFlightDepartDate_input: 'id=connection_flight_depart_date_1',
            connectionFlightDuration_12hours_checkbox: 'name=connection_flight_duration_1',
            connectionFlightExited_checkbox: 'name=connection_flight_exited_1',

            /* passenger details page */
            addPassenger_button: '//span[text()="הוספת נוסע נוסף"]//..//..//a[@class="btn-add"]',
            addPassenger_firstName_input: 'id=add_passenger_9_firstName',
            addPassenger_lastName_input: 'id=add_passenger_9_lastName',
            addPassenger_citizenship_input: 'id=add_passenger_8_citizenship',
            addPassenger_id_input: 'id=add_passenger_9_idNumber',
            addPassenger_passport_input: 'id=add_passenger_9_passport',
            addPassenger_phoneCode_input: 'id=add_passenger_9_phoneCode',
            addPassenger_phone_input: 'id=add_passenger_9_phone',

            /* isolation details page */
            isolationCity_input: 'name=isolation_city_text',
            isolationStreet_input: 'name=isolation_street_text',
            isolationHouseNumber_input: 'name=isolation_house_num',
            isolationAptNumber_input: 'name=isolation_apt_num',
            isolationZipcode_input: 'name=isolation_zipcode',
            isolationTotalMembers_input: 'name=isolation_total_members',
            isolationTotalRooms_input: 'name=isolation_total_rooms',
            isolationDisclaimerSigned_checkbox: 'name=isolation_disclaimer_signed',
        },

    },

}


