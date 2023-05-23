web.transaction('00. Initialize')
web.init({
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: [
            '--no-sandbox',
            'disable-infobars',
            '--disable-extensions',
            '--disable-notifications',
        ],
    }
})

web.transaction('01. Open Main Page')
web.open('https://freecodecamp-projects.netlify.app/responsivewebdesignprojects/surveyform/')

web.transaction('02. Type Details')
web.type('id=name', params.name)
web.waitForValue('id=name', params.name)
log.info(params.name)

web.type('id=email', params.email)
web.waitForValue('id=email', params.email)
log.info(params.email)

web.type('id=age', params.age)
web.waitForValue('id=age', params.age)
log.info(params.age)

web.transaction('03. Submit Form')
web.click('id=submit')

web.pause(1)