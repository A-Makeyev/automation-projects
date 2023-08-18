import time
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions


class ContactUs:
    contactSales_form_xpath = '//form[@name="contact_sales"]'
    firstName_input_id = 'field0'
    lastName_input_id = 'field1'
    email_input_id = 'field2'
    company_input_id = 'field3'
    jobLevel_select_id = 'field4'
    country_select_id = 'field6'
    phone_input_id = 'field5'
    productInterested_select_id = 'field16'
    howCanWeHelp_textarea_id = 'field13'
    submitRequest_button_xpath = '//button[@value="Submit Request"]'
    captcha_iframe_xpath = '//iframe[@title="reCAPTCHA"]'

    def __init__(self, driver):
        self.driver = driver

    def fill_form(self, firstName, lastName, email, company, jobLevel, country, phone, product, text):
        self.driver.find_element(By.ID, self.firstName_input_id).send_keys(firstName)
        self.driver.find_element(By.ID, self.lastName_input_id).send_keys(lastName)
        self.driver.find_element(By.ID, self.email_input_id).send_keys(email)
        self.driver.find_element(By.ID, self.company_input_id).send_keys(company)

        jobLevel_field = self.driver.find_element(By.ID, self.jobLevel_select_id)
        Select(jobLevel_field).select_by_value(jobLevel)

        country_field = self.driver.find_element(By.ID, self.country_select_id)
        Select(country_field).select_by_value(country)

        self.driver.find_element(By.ID, self.phone_input_id).send_keys(phone)

        productInterested_field = self.driver.find_element(By.ID, self.productInterested_select_id)
        Select(productInterested_field).select_by_value(product)

        self.driver.find_element(By.ID, self.howCanWeHelp_textarea_id).send_keys(text)

        contact_sales_form = self.driver.find_element(By.XPATH, self.contactSales_form_xpath)
        captcha_iframe = self.driver.find_element(By.XPATH, self.captcha_iframe_xpath)
        submit_button = self.driver.find_element(By.XPATH, self.submitRequest_button_xpath)

        if captcha_iframe.is_displayed():
            if submit_button.is_enabled():
                self.driver.execute_script('arguments[0].scrollIntoView();', contact_sales_form)
                time.sleep(1)
                now = datetime.now()
                current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
                self.driver.save_screenshot(f'.\\Screenshots\\contact_sales_form_{current_time}.png')
                submit_button.click()
                self.driver.close()
                assert False
            else:
                assert True

    @staticmethod
    def wait(driver, findBy, locator):
        return WebDriverWait(driver, 25).until(
            expected_conditions.presence_of_element_located((
                By.ID if findBy == 'ID' else By.XPATH if findBy == 'XPATH' else By.CSS_SELECTOR, locator)
            )
        )
