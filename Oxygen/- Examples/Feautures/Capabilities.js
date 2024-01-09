// https://peter.sh/experiments/chromium-command-line-switches
const chrome_capabilities = {
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: [
            '--headless',
            '--no-sandbox',
            '--disable-notifications',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--ignore-certificate-errors',
            '--disable-cookie-encryption',
            'disable-infobars',
        ],
    }
}


// https://developer.mozilla.org/en-US/docs/Web/WebDriver/Capabilities/firefoxOptions
const firefox_capabilities = {
    browserName: 'firefox',
    'moz:firefoxOptions': {
        args: [
            '-headless',
            '-no-sandbox',
            '-disable-notifications',
            '-disable-dev-shm-usage',
            '-disable-extensions',
            '-disable-gpu',
            '-window-size=1920,1080',
            '-ignore-certificate-errors',
            'disable-infobars',
        ],
    }
}

web.init(chrome_capabilities)
web.open('https://google.com')