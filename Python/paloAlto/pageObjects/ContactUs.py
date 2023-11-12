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
    captcha_error_xpath = '//div[@class="capture_tip_error" and contains(text(), "Captcha is required")]'

    def __init__(self, driver):
        self.driver = driver

    @staticmethod
    def wait(driver, findBy, locator):
        return WebDriverWait(driver, 25).until(
            expected_conditions.presence_of_element_located((
                By.ID if findBy == 'ID' else By.XPATH if findBy == 'XPATH' else By.CSS_SELECTOR, locator)
            )
        )

    def send_keys(self, driver, findBy, locator, value):
        self.wait(driver, findBy, locator)
        findElementBy = By.ID if findBy == 'ID' else By.XPATH if findBy == 'XPATH' else By.CSS_SELECTOR
        driver.find_element(findElementBy, locator).clear()
        driver.find_element(findElementBy, locator).send_keys(value)

    def fill_form(self, firstName, lastName, email, company, jobLevel, country, phone, product, text):
        self.wait(self.driver, 'XPATH', self.contactSales_form_xpath)
        self.send_keys(self.driver, 'ID', self.firstName_input_id, firstName)
        self.send_keys(self.driver, 'ID', self.lastName_input_id, lastName)
        self.send_keys(self.driver, 'ID', self.email_input_id, email)
        self.send_keys(self.driver, 'ID', self.company_input_id, company)
        self.send_keys(self.driver, 'ID', self.phone_input_id, phone)
        self.send_keys(self.driver, 'ID', self.howCanWeHelp_textarea_id, text)

        jobLevel_field = self.driver.find_element(By.ID, self.jobLevel_select_id)
        Select(jobLevel_field).select_by_value(jobLevel)

        country_field = self.driver.find_element(By.ID, self.country_select_id)
        Select(country_field).select_by_value(country)

        productInterested_field = self.driver.find_element(By.ID, self.productInterested_select_id)
        Select(productInterested_field).select_by_value(product)
