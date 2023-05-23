module.exports = {

    suites: [
        // {
        //     name: 'Database Tests',
        //     cases: [
        //         { path: './Database Tests/01. הצעה משנית הסטורית.js' },
        //         { path: './Database Tests/02. הצעה ראשית מאוקטבת לקוח יס.js' },
        //         { path: './Database Tests/03. הצעות משניות הוספה CH.js' },
        //         { path: './Database Tests/04. הצעות משניות הסרה DS.js' },
        //         { path: './Database Tests/05. הצעות ציוד הסטוריות.js' },
        //         { path: './Database Tests/06. טבלה היסטורית מוצרים - תצוגה.js' },
        //         { path: './Database Tests/07. לקוח מנותק מעל חצי שנה - מסך משותף.js' },
        //         { path: './Database Tests/08. מסך משותף - טיפול פיננסי בטחון.js' },
        //         { path: './Database Tests/09. מסך משותף אינדיקצית WELCOME.js' },
        //         { path: './Database Tests/10. פרטי לקוח.js' },
        //         { path: './Database Tests/11. תצוגה.js' },
        //         { path: './Database Tests/12. תצוגה הצעות עתידיות & מאוקטבות ללקוח.js' },
        //         { path: './Database Tests/13. תצוגת פקע.js' },
        //         { path: './Database Tests/14. הסרת הצעה מיידית.js' },
        //         { path: './Database Tests/15. הסרה עתידית.js' },
        //     ]
        // },
        {
            name: 'Create Leads',
            cases: [
                { path: './Leads/01. המרת ליד.js' },
                { path: './Leads/02. יצירת לידים ממשתמשים שונים - YES.js' },
                { path: './Leads/03. יצירת לידים ממשתמשים שונים - BBL.js' },
                { path: './Leads/04. יצירת לידים ממשתמשים שונים - Pelephone.js' },
                { path: './Leads/05. הקמת ליד וסגירתו בסטטוס סירוב.js' },
                { path: './Leads/06. הקמת ליד והמרה שלו להזמנה.js' },
            ]
        }, 
        {
            name: 'Load Measure',
            cases: [
                { path: './Load Measure/01. טעינת פרטי לקוח.js' },
                { path: './Load Measure/02. טעינת פרטי VOD.js' },
                { path: './Load Measure/03. טעינת פרטי פקע.js' },
            ]
        },
        {
            name: 'Search Customers',
            cases: [
                { path: './Search Customers/01. חיפוש לקוח - טלפון.js' },
                { path: './Search Customers/02. חיפוש לקוח - מספר לקוח.js' },
                { path: './Search Customers/03. חיפוש לקוח - מספר ממיר.js' },
                { path: './Search Customers/04. חיפוש לקוח - מספר פנייה.js' },
                { 
                   path: './Search Customers/05. חיפוש לקוח - שם.js', 
                   iterations: 1,
                   load: {
                      threads: 50,        
                      rampup: 100,     // seconds
                      duration: 300    // seconds
                   }
                },
            ]
        },
    ],

    
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. 
    // If "concurrency" value is greater than 1, tests with different capabilities will be executed in parallel.
    //
    // capabilities: [{
    //     browserName: 'chrome',
    //     'goog:chromeOptions': {
    //         // to run chrome headless the following flags are required
    //         // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
    //         args: [
    //             '--headless', 
    //             '--no-sandbox',
    //             '--disable-gpu',
    //             '--disable-extensions',
    //             '--disable-dev-shm-usage',
    //             '--ignore-certificate-errors',
    //             '--window-size=1920,1080',
    //             'disable-infobars',
    //         ], 
    //     }
    // }],
          
    seleniumUrl: 'http://autoload01:4444/wd/hub',
    modules: ['web', 'assert', 'log', 'db', 'http'],
    framework: 'oxygen',

    reporting: {
        //outputDir: path.join(__dirname, 'reports'),
        reporters: ['csv', 'es'],
    },

    elasticOpts: {
        node: 'http://autoload03:9200',
    },


    // =====
    // Hooks
    // =====
    // Oxygen provides several hooks that can be used to interfere with the test
    // execution process. 
    //
    // hooks: {
    //     //
    //     // Hook that gets executed before the test starts.
    //     // At this point, Oxygen has been already initialized, so you
    //     // can access Oxygen via 'ox' global variable. 
    //     //
    //     beforeTest: function(runId, options, caps) {

    //     },
    //     beforeCase: function(suiteDef) {

    //     },
    //     beforeSuite: function(caseDef) {
       
    //     },
    //     beforeCommand: function(cmdDef) {

    //     },
    //     afterCommand: function(cmdResult) {

    //     },
    //     afterCase: function(caseDef, caseResult) {

    //     },
    //     afterSuite: function(suiteDef, suiteResult) {
            
    //     },
    //     afterTest: function(runId, testResult) {

    //     }
    // }
}
