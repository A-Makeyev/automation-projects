const username = 'XXXX'
const password = 'XXXX-9999'
const startDate = params.startDate ? params.startDate : currentDateTime().split('_')[0].replace(/-/g, '/')
const manufactureYear = params.manufactureYear ? params.manufactureYear : '2022'
const carCode = params.carCode ? params.carCode : '555555'
const roadYear = params.roadYear ? params.roadYear : '01/2022'
const allowedToDriver = params.allowedToDriver ? params.allowedToDriver : 'כל נהג'
const youngDriverAge = params.youngDriverAge ? params.youngDriverAge : '24'
const youngDriverSeniorityYears = params.youngDriverSeniorityYears ? params.youngDriverSeniorityYears : '4'
const primaryDriverAge = params.primaryDriverAge ? params.primaryDriverAge : '24'
const primaryDriverSeniorityYears = params.primaryDriverSeniorityYears ? params.primaryDriverSeniorityYears : '4'
const postalCode = params.postalCode ? params.postalCode : '4800000'
const lastYearInsuranceType = params.lastYearInsuranceType ? params.lastYearInsuranceType : 'מקיף'
const lastYearClaims = params.lastYearClaims ? params.lastYearClaims : '1'
const lastTwoYearsInsuranceType = params.lastTwoYearsInsuranceType ? params.lastTwoYearsInsuranceType : 'מקיף'
const lastTwoYearsClaims = params.lastTwoYearsClaims ? params.lastTwoYearsClaims : '1'
const lastThreeYearsInsuranceType = params.lastThreeYearsInsuranceType ? params.lastThreeYearsInsuranceType : 'מקיף'
const lastThreeYearsClaims = params.lastThreeYearsClaims ? params.lastThreeYearsClaims : '1'
const ownership = params.ownership ? params.ownership : 'פרטית'
const valueDrop = params.valueDrop ? params.valueDrop : '1.5%'

function currentDateTime() {
    let today = new Date()
	let	day = String(today.getDate()).padStart(2, "0")
	let	month = String(today.getMonth() + 1).padStart(2, "0")
	let	year = today.getFullYear()
    let	hours = today.getHours()
    let	minutes = today.getMinutes()
    let seconds = today.getSeconds()
    return `${day}-${month}-${year}_${hours}H-${minutes}M-${seconds}S`
}

function displayLoader(path) {
    web.execute((path) => {
        var style = document.createElement('style')
        style.innerHTML = 
        `
            .loader { position: fixed; top: 0; left: 0; z-index: 10; width: 100%; height: 95px; border: 5px solid #337AB7; color: aliceblue; background: #313131; text-align: center; font-size: x-large; }
            .center { text-align: center; padding: 5px 0; }
            .align-middle { vertical-align: middle; }
            .load-gif { width: 25px; height: 25px; }
        `
        document.querySelector('head').appendChild(style)

        var div = document.createElement('div')
        div.innerHTML = 
        `
            <div class="center">
                <span class="align-middle">
                    Writing Table Data 
                    <i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>
                </span>
                <br>
                <span class="align-middle">${path}</span>
            </div>
        `
        div.classList.add('loader')
        document.querySelector('body').style.cursor = 'progress'
        document.querySelector('#resultContainer').parentElement.appendChild(div)
    }, path)
}

web.init()
web.setTimeout(30 * 1000)
web.open('https://bafi.co.il/')

const windowWidth = web.execute(() => { return window.innerWidth })
const windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

web.click('//span[text()="כניסה לבאפי"]')
web.selectFrame('//embed[@class="bafi-login"]')

web.pause(1500)
web.click('//input[@id="username"]')
web.type('//input[@id="username"]', username)
web.click('//input[@id="password"]')
web.type('//input[@id="password"]', password)
web.click('//button[@id="bafi_login" and not(@disabled)]')
web.click('//span[text()="הסימולטור החדש"]')

if (web.isVisible('id=SysAlertWindow', 5000)) {
    log.info(web.getText('//div[@id="SysAlertWindow"]//div[@class="x-window-body"]//div'))
    web.click('//div[@id="SysAlertWindow"]//button[text()="סגור"]')
}

web.selectFrame('//iframe[@id="if_cars_bafix_cars_bafix"]')

if (web.isVisible('//div[contains(@class, "modal-dialog")]//span[contains(text(), "שגיאה!")]', 5000)) {
    log.info(web.getText('(//div[contains(@class, "modal-dialog")]//div[@data-modal-body])[2]'))
    web.click('//div[contains(@class, "modal-dialog")]//button[@data-close="סגור"]')
}

let tries = 0
while (!web.isVisible('(//span[@id="chooseDateInsSpetial"]//..//div[@class="calendar-table"])[1]', 1500)) {
    web.click('//span[@id="chooseDateInsSpetial"]')
    if (tries == 10) break
    tries++
}

web.click('//input[@id="datepicker-policyStartDate_id"]')
web.type('//input[@id="datepicker-policyStartDate_id"]', startDate)
web.click('//label[contains(text(), "תחילת הביטוח")]//..//div[@class="calendar-table"]//td[contains(@class, "active")]')

try {
    web.select('id=manufYear', `value=${manufactureYear}`)
} catch(e) {
    web.click('//span[@id="select2-manufYear-container"]')
    web.click(`//li[@class="select2-results__option"]//div[text()="${manufactureYear}"]`)
}

web.click('id=select2-carFreeSearch-container')
web.type('//span[contains(@class, "select2-search--dropdown")]//input', carCode)
web.click(`//ul[@id="select2-carFreeSearch-results"]//div[contains(text(), "${carCode}")]`)

web.click('//select[@id="sim_up_date"]')
web.click(`(//select[@id="sim_up_date"]//option[contains(@value, "${roadYear}")])[1]`)

web.click('//select[@id="sim_driversCanDriveSelect"]')
web.click(`//select[@id="sim_driversCanDriveSelect"]//option[contains(text(), "${allowedToDriver}")]`)

web.type('id=youngDriverAge', youngDriverAge)
web.type('name=youngDriverSeniority', youngDriverSeniorityYears)
web.type('id=primaryDriverAge', primaryDriverAge)
web.type('name=primaryDriverSeniority', primaryDriverSeniorityYears)

web.type('//div[@id="drivers"]//input[@placeholder="הקלד מיקוד הנהג"]', postalCode)

web.click('//label[contains(text(), "שנה אחרונה")]//..//select[@id="sim_pastIns1Select"]')
web.click(`//label[contains(text(), "שנה אחרונה")]//..//select[@id="sim_pastIns1Select"]//option[contains(text(), "${lastYearInsuranceType}")]`)
web.type('//label[contains(text(), "שנה אחרונה")]//..//input', lastYearClaims)

web.click('//label[contains(text(), "לפני שנתיים")]//..//select[@id="sim_pastIns2Select"]')
web.click(`//label[contains(text(), "לפני שנתיים")]//..//select[@id="sim_pastIns2Select"]//option[contains(text(), "${lastTwoYearsInsuranceType}")]`)
web.type('//label[contains(text(), "לפני שנתיים")]//..//input', lastTwoYearsClaims)

web.click('//label[contains(text(), "לפני 3 שנים")]//..//select[@id="sim_pastIns3Select"]')
web.click(`//label[contains(text(), "לפני 3 שנים")]//..//select[@id="sim_pastIns3Select"]//option[contains(text(), "${lastThreeYearsInsuranceType}")]`)
web.type('//label[contains(text(), "לפני 3 שנים")]//..//input', lastThreeYearsClaims)

web.select('id=sim_ownershipSelect', 'label=' + ownership)
web.select('id=sim_valueDDSelect', 'label=' + valueDrop)

const carTitle = web.getAttribute('id=select2-sim_manufacturersItem-container', 'title')
web.scrollToElement('id=resultContainer', true)

var sendDataTries = 0
while (!web.isVisible('(//div[@id="resultContainer"]//tbody[@ng-show="resultRowShow(companyResult)"])[1]', 1500)) {
    web.click('//button[@ng-click="canSendData()"]')
    if (sendDataTries == 5) break
    sendDataTries++
}

const fs = require('fs')
const path = require('path')
const folder = path.join(__dirname, `./Results`)
if (!fs.existsSync(folder)) fs.mkdirSync(folder)
const filePath =  `${folder}\\${carTitle}_coverage_prices_${currentDateTime()}.xls`

if (web.isVisible('//div[contains(text(), "מציג") and contains(text(), "תוצאות")]')) { 

    let startTime = Date.now()
    let timeLimit = 1 * 60 * 1000
    let sortedData = web.getAttribute('//th[@name="kasko_hova_col"]', 'data-sorted')

    while (((Date.now() - startTime) < timeLimit) && sortedData == 'asc') {
        web.pause(500)
        web.click('//th[@name="kasko_hova_col"]')
        sortedData = web.getAttribute('//th[@name="kasko_hova_col"]', 'data-sorted')
    }
    
    if (web.isVisible('//th[@name="kasko_hova_col" and @data-sorted="desc"]')) {
        const companies = '//tbody[@ng-show="resultRowShow(companyResult)"]'
        const companiesCount = web.getElementCount(companies)        
        var header = '' 
        var data = []

        let rowTitles = '//thead[@id="sim_results_thead"]//th'
        let rowTitlesCount = web.getElementCount(rowTitles)
        for (let z = 1; z <= rowTitlesCount; z++) {
            let rowTitle = web.getText(`(//thead[@id="sim_results_thead"]//th)[${z}]`)
            rowTitle = rowTitle.trim() == '' ? 'הודעה' : rowTitle
            header += rowTitle + '\t'
        }

        header += '\n'
        let headerUTF16 = Buffer.from(`\ufeff${header}`, 'utf16le')
        fs.writeFileSync(filePath, headerUTF16)
        displayLoader(filePath)

        for (let x = 1; x <= companiesCount; x++) {
            let companyTitle = web.getAttribute(`(${companies})[${x}]//img`, 'title').trim()
            let companyName = web.getAttribute(`(//img[@title="${companyTitle}"]//..//..//..//..//tbody[@ng-show="resultRowShow(companyResult)"]/tr[1])[${x}]`, 'data-company')
            let companyDataCells = `//tr[@data-company="${companyName}"]//td`
            let kaskoHova = web.getText(`(${companyDataCells})[2]`).trim().replace(',', '')
            let finalBase = web.getText(`(${companyDataCells})[3]`).trim().replace(',', '')
            let hova = web.getText(`(${companyDataCells})[4]`).trim().replace(',', '')
            let base = web.getText(`(${companyDataCells})[5]`).trim().replace(',', '')
            let discounts = web.getText(`(${companyDataCells})[6]`).trim().replace(',', '')
            let additions = web.getText(`(${companyDataCells})[7]`).trim().replace(',', '')
            let migun = web.getText(`(${companyDataCells})[8]`).trim().replace(',', '')
            let comments = web.getText(`(${companyDataCells})[9]`).trim().replace(',', '')
            let message = web.getText(`(${companyDataCells})[10]`).trim().replace(',', '')

            data.push({
                'companyTitle': companyTitle,
                'kaskoHova': kaskoHova,
                'finalBase': finalBase,
                'hova': hova,
                'base': base,
                'discounts': discounts,
                'additions': additions,
                'migun': migun,
                'comments': comments,
                'message': message
            })

            for (let x = 0; x < data.length; x++) {
                let row = ''
                for (let y = 0; y <= data.length; y++) {
                    let key = Object.keys(data[x])[y]
                    let value = data[x][key]
                    row += value + '\t'        
                }
                row += '\n'
                writeStream.write(row)
            }
            
            let row = companyTitle + '\t' + kaskoHova + '\t' + finalBase + '\t' + hova + '\t' + base + '\t' + discounts + '\t' + additions + '\t' + migun + '\t' + comments + '\t' + message + '\n'
            let rowUTF16 = Buffer.from(`\ufeff${row}`, 'utf16le')
            fs.appendFileSync(filePath, rowUTF16)
            log.info(`${x}. ${companyTitle} ✓`)
        }
        data.length > 0 && log.info(data)
    }
}
