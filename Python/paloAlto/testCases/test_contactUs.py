import os
import time
import pytest
from utils import Excel
from random import randrange
from datetime import datetime
from utils.logger import CreateLog
from utils.readProps import ReadConfig
from selenium.webdriver.common.by import By
from pageObjects.ContactUs import ContactUs


class Test_ContactUs:
    usersDataPath = '\\TestData\\Users.xlsx'
    usersDataPath = '..' + usersDataPath if 'testCases' in os.getcwd() else '.' + usersDataPath
    baseURL = f'{ReadConfig.getURL()}/company/contact-sales'
    log = CreateLog.generate_log()
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

    @pytest.mark.sanity
    @pytest.mark.regression
    def test_fill_form(self, setup):
        self.driver = setup
        self.driver.get(self.baseURL)

        self.log.info('🛈 Verifying Contact Us Page Title')
        current_page_title = self.driver.title
        if current_page_title == 'Contact Us - Palo Alto Networks':
            self.log.info(f'✔️ Contact Us Page Title Equals to {current_page_title}')
            assert True
        else:
            self.log.error(f'✖️ Expected Contact Us Page Title To Equal to "Contact Us - Palo Alto Networks"'
                           f' Instead Got: {current_page_title}')
            assert False

        self.log.info('🛈 Verifying Contact Us Form')
        self.cu = ContactUs(self.driver)
        random_product = randrange(len(self.products))

        # using data driven test
        if os.path.exists(self.usersDataPath):
            status_list = []
            rows = Excel.get_count(self.usersDataPath, 'User Data', 'row')
            print(f'\n✔️ Excel exists with: {rows} rows')

            for row in range(2, rows + 1):
                firstName = Excel.read_data(self.usersDataPath, 'User Data', row, 1)
                lastName = Excel.read_data(self.usersDataPath, 'User Data', row, 2)
                company = Excel.read_data(self.usersDataPath, 'User Data', row, 3)
                country = Excel.read_data(self.usersDataPath, 'User Data', row, 4)
                phone = Excel.read_data(self.usersDataPath, 'User Data', row, 5)

                print(f'~~~~~~~~ Row {row - 1} ~~~~~~~~')
                print('First Name: ', firstName)
                print('Last Name: ', lastName)
                print('Company: ', company)
                print('Country: ', country)
                print('Phone: ', phone)

                self.cu.fill_form(firstName, lastName, self.email, company, self.jobLevels[row],
                                  country, phone, self.products[random_product], self.text)

                captcha_iframe = self.driver.find_element(By.XPATH, self.cu.captcha_iframe_xpath)
                submit_button = self.driver.find_element(By.XPATH, self.cu.submitRequest_button_xpath)

                if captcha_iframe.is_displayed():
                    if submit_button.is_enabled():
                        self.driver.execute_script('arguments[0].scrollIntoView();', submit_button)
                        time.sleep(1)
                        now = datetime.now()
                        current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
                        self.driver.save_screenshot(f'.\\Screenshots\\contact_sales_form_{current_time}.png')
                        submit_button.click()

                        try:
                            captcha_error = self.driver.find_element(By.XPATH, self.cu.captcha_error_xpath)
                            if captcha_error.is_displayed():
                                msg = '✔️ Send Form Success - reCAPTCHA is present after trying to send form'
                                self.log.info(f'{msg}')
                                print(f'{msg}')
                        except:
                            msg = '✖️️ Send Form Failed - reCAPTCHA is NOT present after submitting form'
                            self.log.info(f'{msg}')
                            print(f'{msg}')

                        status_list.append(f'✖️️ Send Form Iteration {row - 1} Failed ')
                    else:
                        status_list.append(f'✔️ Send Form Iteration {row - 1} Passed')

            print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            for i in range(len(status_list)):
                self.log.info(status_list[i])
                print((status_list[i]))

            if 'Failed' not in status_list:
                self.log.info(f'✔️ Send Form Passed - reCAPTCHA is NOT present after submitting')
                print(f'✔️ Send Form Passed - reCAPTCHA is NOT present after submitting')
                assert True
            else:
                self.log.info(f'✖️️ Send Form Failed - reCAPTCHA is present after submitting')
                print(f'✖️️ Send Form Failed - reCAPTCHA is present after submitting')
                assert False

        # using default test
        else:
            self.cu.fill_form(self.firstName, self.lastName, self.email, self.company, self.jobLevels[0],
                              self.country, self.phone, self.products[random_product], self.text)

            contact_sales_form = self.driver.find_element(By.XPATH, self.cu.contactSales_form_xpath)
            captcha_iframe = self.driver.find_element(By.XPATH, self.cu.captcha_iframe_xpath)
            submit_button = self.driver.find_element(By.XPATH, self.cu.submitRequest_button_xpath)
            captcha_error = self.driver.find_element(By.XPATH, self.cu.captcha_error_xpath)

            if captcha_iframe.is_displayed():
                if submit_button.is_enabled():
                    self.driver.execute_script('arguments[0].scrollIntoView();', contact_sales_form)
                    time.sleep(1)
                    now = datetime.now()
                    current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
                    self.driver.save_screenshot(f'.\\Screenshots\\contact_sales_form_{current_time}.png')
                    submit_button.click()

                    if captcha_error.is_displayed():
                        msg = '✔️ Send Form Success - reCAPTCHA is present after trying to send form'
                        self.log.info(f'{msg}')
                        print(f'{msg}')
                        assert True
                    else:
                        msg = '✖️️ Send Form Failed - reCAPTCHA is NOT present after submitting form'
                        self.log.info(f'{msg}')
                        print(f'{msg}')
                        assert False

                self.driver.close()
