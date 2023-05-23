function drawLine() {
    log.info('~ '.repeat(99))
}

function getDate() {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    let hours = today.getHours()
    let minutes = today.getMinutes()
    let seconds = today.getSeconds()
    return `${dd}-${mm}-${yyyy}_${hours}-${minutes}-${seconds}`
}

function writeResults(validArray, invalidArray, emptyAltArray, defaultPictureArray, stillLoadingArray) {
    const fs = require('fs')
    const os = require('os')
    const fileName = `yes.co.il Image Results ${getDate()}.txt`
    const folderPath = `${os.userInfo().homedir}\\desktop\\Validate Images`
    const filePath = `${folderPath}\\${fileName}`

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
        log.info(`>>> Created new folder at: ${folderPath}`)
    }

    const file = fs.createWriteStream(filePath)
    file.on('error', () => { 
        assert.fail('There was a problem creating the file') 
    })

    file.write('~~~~~~~~~~~~~~~~~~~~~~~~ \n')
    file.write('yes.co.il Image Results \n')
    file.write('~~~~~~~~~~~~~~~~~~~~~~~~ \n\n')

    if (validArray.length > 0) {
        file.write('~~~~~~~~~~~~~ \n')
        file.write('Valid Images: \n')
        file.write('~~~~~~~~~~~~~ \n\n')
        validArray.forEach((i) => { file.write(i + '\n') })
        file.write('\n')
    }

    if (invalidArray.length > 0) {
        file.write('~~~~~~~~~~~~~~~ \n')
        file.write('Invalid Images: \n')
        file.write('~~~~~~~~~~~~~~~ \n\n')
        invalidArray.forEach((i) => { file.write(i + '\n') })
        file.write('\n')
    }

    if (emptyAltArray.length > 0) {
        file.write('~~~~~~~~~~~~~~~~~~~~~~ \n')
        file.write('Images With Empty Alt: \n')
        file.write('~~~~~~~~~~~~~~~~~~~~~~ \n\n')
        emptyAltArray.forEach((i) => { file.write(i + '\n') })
        file.write('\n')
    }

    if (defaultPictureArray.length > 0) {
        file.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n')
        file.write('Images With Default Picture: \n')
        file.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n\n')
        defaultPictureArray.forEach((i) => { file.write(i + '\n') })
        file.write('\n')
    }

    if (stillLoadingArray.length > 0) {
        file.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n')
        file.write('Images That Are Still Loading: \n')
        file.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n\n')
        stillLoadingArray.forEach((i) => { file.write(i + '\n') })
        file.write('\n')
    }

    drawLine()
    log.info(`>>> Created new file at: ${filePath}`)
}

web.init()
web.setTimeout(10 * 1000)
web.open('https://www.yes.co.il/')

function imagePresent(xpath) {
    return web.execute((xpath) => {
        let element = document.evaluate(
            xpath, document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue
        return element.complete 
        && element.naturalWidth > 0
        && typeof element.naturalWidth != 'undefined' 
    }, xpath)
}

var validImgElements = []
var invalidImgElements = []
var imgElementsWithEmptyAlt = []
var imgElementsWithDefaultPicture = []
var imgElementsThatAreStillLoading = []

var imgElements = '//a//img[@alt]'
var imgCount = web.getElementCount(imgElements)

for (let x = 1; x <= imgCount; x++) {
    let element = `(${imgElements})[${x}]`
    let alt = web.getAttribute(element, 'alt')
    let src = web.getAttribute(element, 'src')

    if (alt == '' && !src.includes('svg')) {
        imgElementsWithEmptyAlt.push(`⚠️ Locator: ${element} -> src: ${src}`)
    } else if (src.includes('default')) {
        imgElementsWithDefaultPicture.push(`⚠️ Locator: ${element} -> ${alt = alt != '' ? `alt: ${alt}` : ''} | src: ${src}`)
    } else if (web.isVisible(`(//div[@class="swiper-lazy-preloader"]${imgElements})[${x}]`)) {
        imgElementsThatAreStillLoading.push(`⚠️ Locator: ${element} -> ${alt = alt != '' ? `alt: ${alt}` : ''} | src: ${src}`)
    } else {
        web.scrollToElement(element)
        if (imagePresent(element)) {
            validImgElements.push(`✔️ Locator: (${imgElements})[${x}] -> alt: ${alt} | src: ${src}`)
        } else {
            invalidImgElements.push(`❌ Image ${alt = alt != '' ? alt : ''} at: ${element} with src: ${src}`)
        } 
    }
}

if (validImgElements.length > 0) {
    drawLine()
    log.info(`Valid Img Elements (${validImgElements.length}):`)
    log.info(validImgElements)
}

if (invalidImgElements.length > 0) {
    drawLine()
    log.info(`Img Elements That don't Appear In The Page (${invalidImgElements.length}):`)
    log.info(invalidImgElements)
}

if (imgElementsWithEmptyAlt.length > 0) {
    drawLine()
    log.info(`Img Elements With Empty alt (${imgElementsWithEmptyAlt.length}):`)
    log.info(imgElementsWithEmptyAlt)
}

if (imgElementsWithDefaultPicture.length > 0) {
    drawLine()
    log.info(`Img Elements With Default Picture (${imgElementsWithDefaultPicture.length}):`)
    log.info(imgElementsWithDefaultPicture)
}

if (imgElementsThatAreStillLoading.length > 0) {
    drawLine()
    log.info(`Img Elements That Are Still Loading (${imgElementsThatAreStillLoading.length}):`)
    log.info(imgElementsThatAreStillLoading)
}

writeResults(
    validImgElements, 
    invalidImgElements, 
    imgElementsWithEmptyAlt, 
    imgElementsWithDefaultPicture, 
    imgElementsThatAreStillLoading
)
