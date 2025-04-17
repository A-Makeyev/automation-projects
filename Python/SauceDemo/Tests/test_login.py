from Pages.Login import LoginPage
from utils.logger import CreateLog
from utils.readProps import ReadConfig

class Test_Login_SauceDemo:
    BASE_URL = ReadConfig.getURL() 
    standard_user = ReadConfig.getStandardUser()
    locked_user = ReadConfig.getLockedUser()
    invalid_user = ReadConfig.getInvalidUser()
    password = ReadConfig.getPassword()
    log = CreateLog.generate_log()

    def test_standard_user_login(self, setup):
        self.driver = setup
        login_page = LoginPage(self.driver)

        self.log.info(f'01. Open {self.BASE_URL}')
        self.driver.get(self.BASE_URL)

        self.log.info('02. Enter valid credentials')
        login_page.enter_username(self.standard_user)
        login_page.enter_password(self.password)

        self.log.info('03. Submit login and verify success')
        login_page.press_login_button()
        login_page.assert_login_success()

    def test_locked_out_user_login(self, setup):
        self.driver = setup
        login_page = LoginPage(self.driver)

        self.log.info(f'01. Open {self.BASE_URL}')
        self.driver.get(self.BASE_URL)

        self.log.info('02. Enter locked out user credentials')
        login_page.enter_username(self.locked_user)
        login_page.enter_password(self.password)

        self.log.info('03. Submit login and verify error')
        login_page.press_login_button()
        login_page.assert_login_error_message("Epic sadface: Sorry, this user has been locked out.")

    def test_invalid_user_login(self, setup):
        self.driver = setup
        login_page = LoginPage(self.driver)

        self.log.info(f'01. Open {self.BASE_URL}')
        self.driver.get(self.BASE_URL)

        self.log.info('02. Enter invalid credentials')
        login_page.enter_username(self.invalid_user)
        login_page.enter_password("invalid_password")

        self.log.info('03. Submit login and verify error')
        login_page.press_login_button()
        login_page.assert_login_error_message("Epic sadface: Username and password do not match any user in this service")