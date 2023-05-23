# pytest -v -s testCases/test_name.py

import pytest
from datetime import datetime
from selenium import webdriver

from pageObjects.ContactUs import ContactUs

class Test_ContactUs:
    baseURL = 'https://www.paloaltonetworks.com/company/contact-sales'
    firstName = 'Anatoly'
    lastName = 'Makeyev'
    email = 'anatoly.makeyev@cloudbeat.io'
    company = 'cloudbeat'
    jobLevels = ['Individual Contributor', 'Manager', 'Director', 'VP/SVP', 'EVP/Executive Director', 'Board of Directors', 'C-Suite']
    country = 'Israel'
    phone = '0527729974'
    products = ['Network Security', 'Secure Access Service Edge', 'Cloud-Native Security', 'Security Operations', 'Threat Intel & Consulting', 'Work from Home']
    text = 'This is an automated test, if this was sent then there is a problem with the CAPTCHA'

    def test_home_page_title(self, setup):
        self.driver = setup
        self.driver.get(self.baseURL)

        current_page_title = self.driver.title
        if current_page_title == 'Contact Us - Palo Alto Networks':
            self.driver.close()
            assert True
        else:
            now = datetime.now()
            current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
            self.driver.save_screenshot(f'.\\Screenshots\\current_page_title_{current_time}.png')
            self.driver.close()
            assert False

    def test_fill_form(self, setup):
        self.driver = setup
        self.driver.get(self.baseURL)
        self.cu = ContactUs(self.driver)
        self.cu.wait(self.driver, 'XPATH', self.cu.contactSales_form_xpath)
        self.cu.fill_form(self.firstName, self.lastName, self.email, self.company, self.jobLevels[0], self.country, self.phone, self.products[0], self.text)
        self.driver.close()
