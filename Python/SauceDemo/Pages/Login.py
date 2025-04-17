from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils.readProps import ReadConfig  

class LoginPage:
    WINDOW_TITLE = 'Swag Labs'
    MAIN_PAGE = (By.ID, 'login-button')
    USERNAME_FIELD = (By.ID, 'user-name')
    PASSWORD_FIELD = (By.ID, 'password')
    LOGIN_BUTTON = (By.ID, 'login-button')
    ERROR_MESSAGE = (By.CSS_SELECTOR, '[data-test="error"]')
    BASE_URL = ReadConfig.getURL()  

    def __init__(self, driver):
        self.driver = driver

    def wait_for_element(self, by, locator):
        return WebDriverWait(self.driver, 30).until(
            EC.presence_of_element_located((by, locator))
        )

    def click(self, by, locator):
        element = self.wait_for_element(by, locator)
        element.click()

    def type(self, by, locator, value):
        element = self.wait_for_element(by, locator)
        element.clear()
        element.send_keys(value)

    def enter_username(self, username):
        self.type(*self.USERNAME_FIELD, username)

    def enter_password(self, password):
        self.type(*self.PASSWORD_FIELD, password)

    def press_login_button(self):
        self.click(*self.LOGIN_BUTTON)

    def assert_login_success(self):
        WebDriverWait(self.driver, 10).until_not(EC.presence_of_element_located(self.LOGIN_BUTTON))
        print(f'\n✔️  Login successful - login button no longer visible')

    def assert_login_error_message(self, expected_message):
        error_message = self.wait_for_element(*self.ERROR_MESSAGE).text.strip()
        assert error_message == expected_message, f"Expected error '{expected_message}', but got '{error_message}'"
        print(f'\n🛈  Error message displayed -> {error_message}')
        