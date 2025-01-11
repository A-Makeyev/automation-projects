function drawLine() {
    log.info('~'.repeat(100))
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

function displayProgress() {
    web.execute(() => {
        var style = document.createElement('style')
        style.innerHTML = 
        `
            .progress-info { position: fixed; top: 0; left: 0; z-index: 100; width: 100%; height: 65px; border: 5px solid #337AB7; color: aliceblue; background: #313131; text-align: center; font-size: x-large; }
            .center { text-align: center; padding: 10px 0; }
            .align-middle { vertical-align: middle; }
            .load-gif { width: 25px; height: 25px; }
        `
        document.querySelector('head').appendChild(style)

        var div = document.createElement('div')
        div.innerHTML = 
        `
            <div class="center">
                <span class="align-middle">Validating Images</span>
                <img class="align-middle load-gif" src="https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif">
            </div>
        `
        div.classList.add('progress-info')
        document.querySelector('body').parentElement.appendChild(div)
    })
}

function writeResults(validArray, invalidArray, emptyAltArray, defaultPictureArray, stillLoadingArray) {
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
    log.info(`>>> Saved file to: ${filePath}`)
}

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

web.init()
web.open('https://www.yes.co.il/')
web.setTimeout(5000)

const fs = require('fs')
const path = require('path')
const folderPath = path.join(__dirname, '../Logs')
const fileName = `yes.co.il Image Results ${getDate()}.txt`
const filePath = `${folderPath}\\${fileName}`

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
    log.info(`>>> Created new folder at: ${folderPath}`)
}

displayProgress()

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
        imgElementsWithDefaultPicture.push(`❌ Locator: ${element} -> ${alt = alt != '' ? `alt: ${alt}` : ''} | src: ${src}`)
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
