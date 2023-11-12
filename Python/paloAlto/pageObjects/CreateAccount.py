from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions


class CreateAccount:
    createAccount_form_id = 'capture_traditionalRegistration_registrationForm'
    firstName_input_id = 'capture_traditionalRegistration_First_Name__c'
    lastName_input_id = 'capture_traditionalRegistration_Last_Name__c'
    email_input_id = 'capture_traditionalRegistration_Business_Email'
    desiredPassword_input_id = 'capture_traditionalRegistration_newPassword'
    company_input_id = 'capture_traditionalRegistration_Company'
    jobLevel_select_id = 'capture_traditionalRegistration_Job_Level__c'
    businessPhone_input_id = 'capture_traditionalRegistration_Business_Phone'
    country_select_id = 'capture_traditionalRegistration_Country'
    speakWithSpecialist_checkbox_id = 'capture_traditionalRegistration_Want_to_speak_to_Specialist_registration'
    emailMeOffers_checkbox_id = 'capture_traditionalRegistration_Subscribe_To_All_Categories__c'
    signUp_button_xpath = '//input[@value="Sign up for a research account"]'
    captcha_iframe_xpath = '//div[@id="capture_traditionalRegistration__recaptcha_container"]//iframe[@title="reCAPTCHA"]'
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

    def click(self, driver, findBy, locator):
        self.wait(driver, findBy, locator)
        findElementBy = By.ID if findBy == 'ID' else By.XPATH if findBy == 'XPATH' else By.CSS_SELECTOR
        driver.find_element(findElementBy, locator).click()

    def send_keys(self, driver, findBy, locator, value):
        self.wait(driver, findBy, locator)
        findElementBy = By.ID if findBy == 'ID' else By.XPATH if findBy == 'XPATH' else By.CSS_SELECTOR
        driver.find_element(findElementBy, locator).clear()
        driver.find_element(findElementBy, locator).send_keys(value)


    def fill_sign_up_form(self, firstName, lastName, email, password, company, job, phone, country):
        self.wait(self.driver, 'ID', self.createAccount_form_id)
        self.send_keys(self.driver, 'ID', self.firstName_input_id, firstName)
        self.send_keys(self.driver, 'ID', self.lastName_input_id, lastName)
        self.send_keys(self.driver, 'ID', self.email_input_id, email)
        self.send_keys(self.driver, 'ID', self.desiredPassword_input_id, password)
        self.send_keys(self.driver, 'ID', self.company_input_id, company)
        self.send_keys(self.driver, 'ID', self.businessPhone_input_id, phone)

        jobLevel_field = self.driver.find_element(By.ID, self.jobLevel_select_id)
        Select(jobLevel_field).select_by_value(job)

        country_field = self.driver.find_element(By.ID, self.country_select_id)
        Select(country_field).select_by_value(country)

        self.click(self.driver, 'ID', self.speakWithSpecialist_checkbox_id)
        self.click(self.driver, 'ID', self.emailMeOffers_checkbox_id)
