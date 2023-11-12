import os
import time
import pytest
from random import randrange
from datetime import datetime
from utils.logger import CreateLog
from utils.readProps import ReadConfig
from selenium.webdriver.common.by import By
from pageObjects.CreateAccount import CreateAccount


class Test_CreateAccount:
    usersDataPath = '\\TestData\\Users.xlsx'
    usersDataPath = '..' + usersDataPath if 'testCases' in os.getcwd() else '.' + usersDataPath
    baseURL = f'{ReadConfig.getURL()}/login?screenToRender=traditionalRegistration'
    log = CreateLog.generate_log()
    email = ReadConfig.getEmail()
    password = 'S0meP@$$w0rd'
    firstName = 'Anatoly'
    lastName = 'Makeyev'
    company = 'CloudBeat'
    country = 'Israel'
    phone = '0527729974'
    jobLevels = ['Individual Contributor', 'Manager', 'Director', 'VP/SVP',
                 'EVP/Executive Director', 'Board of Directors', 'C-Suite']

    @pytest.mark.sanity
    @pytest.mark.regression
    def test_fill_sign_up_form(self, setup):
        self.driver = setup
        self.driver.get(self.baseURL)
        self.ca = CreateAccount(self.driver)

        self.log.info('🛈 Verifying Sign Up Page Title')
        current_page_title = self.driver.title
        if current_page_title == 'Login - Palo Alto Networks':
            self.log.info(f'✔️ Contact Us Page Title Equals to {current_page_title}')
            assert True
        else:
            self.log.error(f'✖️ Expected Sign Up Page Title To Equal to "Login - Palo Alto Networks"'
                           f' Instead Got: {current_page_title}')
            assert False

        self.log.info('🛈 Verifying Sign Up Form')
        random_job = randrange(len(self.jobLevels))

        self.ca.fill_sign_up_form(self.firstName, self.lastName, self.email, self.password,
                                  self.company, self.jobLevels[random_job], self.phone, self.country)

        captcha_iframe = self.driver.find_element(By.XPATH, self.ca.captcha_iframe_xpath)
        submit_button = self.driver.find_element(By.XPATH, self.ca.signUp_button_xpath)

        if captcha_iframe.is_displayed():
            if submit_button.is_enabled():
                self.driver.execute_script('arguments[0].scrollIntoView();', submit_button)
                time.sleep(1)
                now = datetime.now()
                current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
                self.driver.save_screenshot(f'.\\Screenshots\\sign_up_form_{current_time}.png')
                submit_button.click()

                try:
                    captcha_error = self.driver.find_element(By.XPATH, self.ca.captcha_error_xpath)
                    if captcha_error.is_displayed():
                        msg = '✔️ Sign Up Form Success - reCAPTCHA is present after trying to send form'
                        self.log.info(f'{msg}')
                        print(f'{msg}')
                        assert True
                except:
                    msg = '✖️️ Sign Up Form Failed - reCAPTCHA is NOT present after submitting form'
                    self.log.info(f'{msg}')
                    print(f'{msg}')
                    assert False

            self.driver.close()
