module.exports = {

    open: function(url, t) {
        web.init()
        web.open(url)
        web.setTimeout(t)
    },

    surveyPage: {
        nameInput: '//input[@id="name"]',
        emailInput: '//input[@id="email"]',
        ageInput: '//input[@id="age"]',
        genderDropdown: '//select[@id="dropdown"]',
        submitBtn: '//button[@id="submit"]'
    },

}