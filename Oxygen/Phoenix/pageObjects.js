const pageObjects = {
    // URLS
    drivePageUrl: 'https://fnx.co.il/',
    // Main Page
    mainPage: {
        submitBtn: '//button[@id="submit" and not(disabled)]'
    },
    // Form
    form: { 
        slider: '//input[@class="slider"]',
        checkBoxes: {
        approvedTerms: 'id=approvedTerms',
        approvedHonesty: 'id=approvedHonesty',
        iAmHuman: '//span[contains(text(), "אני בן או בת אדם")]//..//..//input'
        },
        firstName: 'id=firstName',
        phoneNumber: 'id=number-section-phoneNumber',
        carPlate: 'id=carPlate'
    },
}

module.exports = pageObjects