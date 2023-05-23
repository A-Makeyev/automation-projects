module.exports = {
    
    PROD: {
        name: 'PROD',
        host: 'pazgas-api.azure-api.net',
        contentType: 'application/json',
        authorization: 'Basic Y3JtOkNybTIwMjAh',
        baseUrl: 'https://pazgas-api.azure-api.net/PazgasGetSiteRequests/prod/manual/paths/invoke',
        baseUrlLeads: 'https://pazgas-api.azure-api.net/PazgasGetLeadsFromSiteRequestProd/prod/manual/paths/invoke',
        ocpApimsubScriptionKey: '396bd22a735846e5b7e432f67768c322',
        ocpApimtrace: 'true',

        url: 'https://www.pazgas.co.il/he/',
        loginUrl: 'https://pazgas.co.il/he/login',
        laundryDryerUrl: 'https://campaigns.pazgas.co.il/laundry_dryer/',
        waterHeaterUrl : 'https://campaigns.pazgas.co.il/water-heater/',
        electricityUrl : 'https://campaigns.pazgas.co.il/ele/',
        waterHeaterHarediUrl : 'https://campaigns.pazgas.co.il/wh-cons/',
        waterHeaterDatiUrl : 'https://campaigns.pazgas.co.il/wh-ref/',
        debtPaymentUrl: 'https://www.pazgas.co.il/he/new-payment/',
    },

    TEST: {
        name: 'TEST',
        host: 'pazgas-api.azure-api.net',
        contentType: 'application/json',
        authorization: 'Basic Y3JtOjEyMzQ1Ng==',
        baseUrl : 'https://pazgas-api.azure-api.net/PazgasGetSiteRequests/test/manual/paths/invoke',
        baseUrlLeads : 'https://pazgas-api.azure-api.net/PazgasGetLeadsFromSiteRequest/test/manual/paths/invoke',
        ocpApimsubScriptionKey: '396bd22a735846e5b7e432f67768c322',
        ocpApimsubScriptionKeyLeads: '396bd22a735846e5b7e432f67768c322',
        ocpApimtrace: 'true',
        
        url: 'https://test.pazgas.co.il/he/',
        loginUrl: 'https://test.pazgas.co.il/he/login',
        orderGasUrl: 'https://test.pazgas.co.il/he/order-gas-now/',
        laundryDryerUrl: 'https://test-campaigns.pazgas.co.il/ldryer/',
        waterHeaterUrl: 'https://test-campaigns.pazgas.co.il/water-heater/',
        electricityUrl: 'https://test-campaigns.pazgas.co.il/electricity/',
        waterHeaterHarediUrl: 'https://test-campaigns.pazgas.co.il/wh-cons/',
        waterHeaterDatiUrl: 'https://test-campaigns.pazgas.co.il/wh-ref/',
        debtPaymentUrl: 'https://test.pazgas.co.il/he/new-payment/',
    },
}
