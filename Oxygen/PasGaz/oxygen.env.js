module.exports = {
    
    PROD: {
        name: 'PROD',
        host: 'azure-api.net',
        contentType: 'application/json',
        authorization: 'Basic XXXXXXXXX',
        baseUrl: 'https://azure-api.net/',
        baseUrlLeads: 'https://azure-api.net/prod/manual/paths/invoke',
        ocpApimsubScriptionKey: 'XXXXXXXXXXXXXXXXXXXXXXXX',
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
        host: 'azure-api.net',
        contentType: 'application/json',
        authorization: 'Basic XXXXXXX==',
        baseUrl : 'https://azure-api.net/',
        baseUrlLeads : 'https://azure-api.net/test/manual/paths/invoke',
        ocpApimsubScriptionKey: 'XXXXXXXXXXXXXXXXXXXX',
        ocpApimsubScriptionKeyLeads: 'XXXXXXXXXXXXXXX',
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
