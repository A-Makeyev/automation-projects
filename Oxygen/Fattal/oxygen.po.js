module.exports = {

    init: () => {
        web.transaction('01. Initialize')
        web.init()
        log.info('Running on ' + env.name)

        web.transaction('02. Open Main Page')
        if (env.name == 'TEST') {
            web.open(env.encodedUrl)
        } else if (env.name == 'PROD') {
            web.open(env.url)
        }
        
    },

    resultsPage: {
        firstResult: '(//div[contains(@class, "result-hotel")])[1]',
        firstResultOriginalPrice: '(//div[contains(@class, "result-hotel")])[1]//div[contains(text(), "מחיר רגיל")]//..//div[contains(@class, "price")]', 
        firstResultSitePrice: '(//div[contains(@class, "result-hotel")])[1]//div[contains(text(), "מחיר באתר")]//..//div[contains(@class, "price")]',
        firstResultClubPrice: '(//div[contains(@class, "result-hotel")])[1]//*[contains(text(), "מחיר מועדון")]//..//..//div[contains(@class, "price")]',
    }

}