const screenshot = (info) => {
    let fs = require('fs')
    let home = require('os').userInfo().homedir

    let folder = `${home}\\desktop\\screenshots`
    if (!fs.existsSync(folder)) fs.mkdir(folder, () => {})

    let ssPath = `${folder}\\${info} - ${getDateAndTime()}.png`
    fs.writeFileSync(ssPath, web.takeScreenshot(), 'base64')
    log.info('Screenshot saved at: ' + ssPath)
 }
 
const getDateAndTime = (format) => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    let hours = today.getHours()
    let minutes = today.getMinutes()
    let seconds = today.getSeconds()

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    if (format == 'date') return `${dd}-${mm}-${yyyy}`
    if (format == 'time') return `${hours}-${minutes}-${seconds}`
    return `${dd}-${mm}-${yyyy} ${hours}-${minutes}-${seconds}`
}

web.init()
web.open('http://www.the-useless.website')
web.click('//a[@href="/go"]')

var handles = web.getWindowHandles()
web.selectWindow(handles[1])
log.info(handles)

var title = web.getTitle().includes('?') ? web.getTitle().replace('?', '') : web.getTitle()
screenshot(`Screenshot From ${title}`)
