# pytest -v -s testCases/test_contactUs.py

from random import randrange
from datetime import datetime
from utils.logger import CreateLog
from utils.readProps import ReadConfig
from pageObjects.ContactUs import ContactUs
from selenium.common import TimeoutException


class Test_ContactUs:
    log = CreateLog.generate_log()
    baseURL = f'{ReadConfig.getURL()}/company/contact-sales'
    email = ReadConfig.getEmail()
    firstName = 'Anatoly'
    lastName = 'Makeyev'
    company = 'CloudBeat'
    country = 'Israel'
    phone = '0527729974'
    text = 'This is an automated test, if this was sent then there is a problem with the CAPTCHA'
    jobLevels = ['Individual Contributor', 'Manager', 'Director', 'VP/SVP',
                 'EVP/Executive Director', 'Board of Directors', 'C-Suite']
    products = ['Network Security', 'Secure Access Service Edge', 'Cloud-Native Security',
                'Security Operations', 'Threat Intel & Consulting', 'Work from Home']

    def test_home_page_title(self, setup):
        self.log.info('🛈 Verifying Contact Us Page Title')
        self.driver = setup
        self.driver.get(self.baseURL)

        current_page_title = self.driver.title
        if current_page_title == 'Contact Us - Palo Alto Networks':
            self.log.info(f'✔️ Contact Us Page Title Equals to {current_page_title}')
            self.driver.close()
            assert True
        else:
            now = datetime.now()
            current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
            self.driver.save_screenshot(f'.\\Screenshots\\current_page_title_{current_time}.png')
            self.log.error(f'✖️ Expected Contact Us Page Title To Equal to "Contact Us - Palo Alto Networks"'
                           f' Instead Got: {current_page_title}')
            self.driver.close()
            assert False

    def test_fill_form(self, setup):
        self.log.info('🛈 Verifying Contact Us Form')
        self.driver = setup
        self.driver.get(self.baseURL)
        self.cu = ContactUs(self.driver)
        self.cu.wait(self.driver, 'XPATH', self.cu.contactSales_form_xpath)
        random_product = randrange(len(self.products))
        try:
            self.cu.fill_form(self.firstName, self.lastName, self.email, self.company, self.jobLevels[0],
                              self.country, self.phone, self.products[random_product], self.text)
            self.log.info('✔️ Form Filled Successfully - reCAPTCHA is present')
        except TimeoutException as ex:
            self.log.error(f'✖️️ Failed To Fill Form - {ex.msg}')
        self.driver.close()
