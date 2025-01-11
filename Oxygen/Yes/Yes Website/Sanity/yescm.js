const currentDate = () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    let min = today.getMinutes()
    let sec = today.getSeconds()
    return `${dd}.${mm}.${yyyy}-${min}m-${sec}s`
}

const os = require('os')
const fs = require('fs')
const fileName = 'פעילות משתמשים.xlsx'
const newFileName = `פעילות משתמשים_${currentDate()}.csv`
const downloadsPath = os.userInfo().homedir + '\\downloads'
const downloadedReportFile = downloadsPath + '\\' + fileName
const destinationFolder = '\\\\filesrv05\\infashared\\kms'
const destinationFile = destinationFolder + '\\' + newFileName
// const newDownloadedReportFile = downloadsPath + '\\' + newFileName

if (fs.existsSync(downloadedReportFile)) fs.unlinkSync(downloadedReportFile)

web.transaction('Open YESCM')
web.init()
web.open('https://yesinsight.lighthouse-cloud.com/Insight/Login')

web.transaction('Login')
web.type('id=txtUsername', 'Eperetz')
web.type('id=txtPassword', 'Lighthouse1')
web.click('id=btnLogin')

web.transaction('Open Page Editor')
web.click('(//div[@id="mySliderTabs"]//a[text()="פעילות משתמשים"])[1]')

web.transaction('Change Filter To Weekly')
web.click('id=LB1261Cell0')

web.transaction('Save Report')
if (!web.isVisible('//div[@class="pov_Loading" and contains(@style, "display: none")]', 5000)) {
    web.point('id=button_export')
    web.clickHidden('id=excel_icon')
    web.selectFrame('id=dialogIframeExport')

    if (web.isVisible('//label[@id="lblUpperCaption" and contains(text(), "להוריד את הקובץ")]')) {
        web.click('//div[@id="linkHolder"]//a')
    }
}

web.pause(10 * 1000)

if (!fs.existsSync(downloadedReportFile)) {
    log.info('✖ הקובץ לא ירד בלחיצה הראשונה')
    web.point('id=button_export')
    web.clickHidden('id=excel_icon')
    web.selectFrame('id=dialogIframeExport')

    if (web.isVisible('//label[@id="lblUpperCaption" and contains(text(), "להוריד את הקובץ")]')) {
        web.click('//div[@id="linkHolder"]//a')
    } 

    web.pause(10 * 1000)
}

if (fs.existsSync(downloadedReportFile)) {
    web.transaction(`Convert ${fileName} To CSV`)
    const xlsxData = utils.readXlsx(downloadedReportFile)
    const headers = Object.keys(xlsxData[0])
    const csvRows = []

    csvRows.push(headers.join(','))
    xlsxData.forEach(item => {
    const values = headers.map(header => item[header])
    csvRows.push(values.join(','))
    })

    const csvString = '\uFEFF' + csvRows.join('\n')
    fs.writeFileSync(destinationFile, csvString, { encoding: 'utf8' })

    if (fs.existsSync(destinationFile)) {
        log.info(`✔ קובץ נשמר בהצלחה ${destinationFile}`)
        fs.unlinkSync(downloadedReportFile)
    } else {
        assert.fail(`הקובץ לא הועבר לנתיב ${destinationFolder}`)
    }
} else {
    assert.fail('הקובץ לא נשמר')
}

// if (fs.existsSync(downloadedReportFile)) {
//     fs.renameSync(downloadedReportFile, newDownloadedReportFile)
//     fs.copyFileSync(newDownloadedReportFile, destinationFile)
//     if (fs.existsSync(destinationFile)) {
//         log.info(`קובץ נשמר בהצלחה ${destinationFile}`)
//         fs.unlinkSync(newDownloadedReportFile)
//     } else {
//         assert.fail(`הקובץ לא הועבר לנתיב ${destinationFolder}`)
//     }
// } else {
//     assert.fail('הקובץ לא נשמר')
// }
