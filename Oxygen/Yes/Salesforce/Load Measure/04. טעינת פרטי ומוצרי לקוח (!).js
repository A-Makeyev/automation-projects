/* alpha 360 - hebrew */
// remove trycatch before uploading to cloudbeat

const customers = [
    'C-זאב ליס', 'C-שמואל לוי ערוסי', 'C-יוגב זאוי', 'C-שיינקור - מזוג אויר בעמ',
    'C-ארמונות פאר (משה)', 'C-גורג זכנון', 'C-מרלוב מרלוב','C-תמר גלעד',
    'C-מורן לירן ברדה אביטן', 'קטשינר אנה', 'פנס יוסי', 'סקופ שירי', 'אבזוב ארסן', 
    'איריס אלמועלם', 'שחר הראל', 'יעקב פורבט', 'אפרת פלג', 'מילוא דוד', "יצחק דוצ'ין",
    'אפרת פלג', 'זוחיקה אימאן', 'מוסקנה דוד', 'אפרת פלג', 'רובננקו חגית', 'רובננקו חגית'
]

po.init(env.url, 60)

web.transaction('04. Pick App - Alpha 360')
po.pickApp('Alpha 360')

web.transaction('05. Close All Active Tabs')
po.alphaMainPage.closeAllTabs()

web.transaction('06. Search Customer')
log.info('params: ' + JSON.stringify(params, null, 4))

let searchSuccess = false;
if (params.customer == 'undefined' || params.customer == null) {
    var customer = customers[Math.floor(Math.random() * customers.length) + 1]
    searchSuccess = po.customerDetails360.search(customer, 5000)
    log.info('Customer: ' + customer)
} else {
    searchSuccess = po.customerDetails360.search(params.customer, 5000)
    log.info('Customer: ' + params.customer)
}

assert.equal(searchSuccess, true, 'Could not find any customer');

web.transaction('07. Load Customer Details')
po.click(po.customerDetails360.customerLink)

// --> start loading time
var start = new Date().getTime()

/* wait for header details to load */
try {
    var header = '//*[@data-component-id="alp360HeaderContainer"]//div[contains(@class, "slds-col")]'
    var headerDetails = web.getElementCount(header)
    for (let x = 1; x <= headerDetails; x++) {
        web.waitForVisible(`(${header})[${x}]`)
        log.info(`Checked: ${web.getText(`(${header})[${x}]`)}`)
    }
} catch(e) {
    log.info('Header has failed to load')
}

/* wait for yes details to load */
try {
    var yesTable = '//*[@data-component-id="alp360MainDetailsAdw"]//td'
    if (web.isVisible(yesTable, 500)) {
        var yesTableDetails = web.getElementCount(yesTable)
        for (let x = 1; x <= yesTableDetails; x++) {
            web.waitForVisible(`(${yesTable})[${x}]`)
            log.info(`Checked: ${web.getText(`(${yesTable})[${x}]`)}`)
        }
    }
} catch(e) {
    log.info('Yes details table has failed to load')
}

/* wait for bezeq details */
try {
    var bezeqTable = '//*[@data-component-id="alp360MainDetailsAdw2"]//td'
    if (web.isVisible(bezeqTable, 500)) {
        var bezeqTableDetails = web.getElementCount(bezeqTable)
        for (let x = 1; x <= bezeqTableDetails; x++) {
            web.waitForVisible(`(${bezeqTable})[${x}]`)
            // log.info(`Checked: ${web.getText(`(${bezeqTable})[${x}]`)}`)
        }
    }
} catch(e) {
    log.info('Bezeq details table has failed to load')
}

/* wait for pelephone details */
try {
    var pelephoneTable = '//*[@data-component-id="alp360MainDetailsAdw3"]//td'
    if (web.isVisible(pelephoneTable, 500)) {
        var pelephoneTableDetails = web.getElementCount(pelephoneTable)
        for (let x = 1; x <= pelephoneTableDetails; x++) {
            web.waitForVisible(`(${pelephoneTable})[${x}]`)
            // log.info(`Checked: ${web.getText(`(${pelephoneTable})[${x}]`)}`)
        }
    }
} catch(e) {
    log.info('Pelephone details table has failed to load')
}

// --> finish loading time
var end = new Date().getTime()
log.info(`Customer Details loading time: ${((end - start) / 1000).toFixed(1)} seconds`)
