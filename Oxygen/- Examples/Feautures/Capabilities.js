// https://peter.sh/experiments/chromium-command-line-switches
const chrome_capabilities = {
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: [
		    '--headless',
			'--incognito',
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
		prefs: {
			  'download.default_directory': os.platform() === 'win32' ? path.join(os.userInfo().homedir, 'Downloads') : '/home/selenium/Downloads',
			  'download.prompt_for_download': false,  // Disable the 'Save As' dialog
			  'profile.default_content_settings.popups': 0,  // Disable pop-ups
			  'download.directory_upgrade': true,
			  'download.extensions_to_open': '',  // Prevent any extension from opening
			  'safebrowsing.enabled': true, // Enable safe browsing to avoid any security prompts,
			  'plugins.always_open_pdf_externally': true // if we don't specify true, then PDFs will be opened in browser instead of downloaded
		  }
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