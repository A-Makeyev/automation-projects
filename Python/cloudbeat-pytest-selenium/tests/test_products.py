from pages.login import LoginPage
from pages.products import ProductsPage
from utils.logger import CreateLog
from utils.readProps import ReadConfig


class TestProductsSauceDemo:
    BASE_URL = ReadConfig.getURL()
    standard_user = ReadConfig.getStandardUser()
    password = ReadConfig.getPassword()
    log = CreateLog.generate_log()

    def test_add_and_remove_products(self, setup):
        self.driver = setup
        login_page = LoginPage(self.driver)
        products_page = ProductsPage(self.driver)

        self.log.info(f'01. Open {self.BASE_URL} and login')
        self.driver.get(self.BASE_URL)
        login_page.enter_username(self.standard_user)
        login_page.enter_password(self.password)
        login_page.press_login_button()
        login_page.assert_login_success()

        self.log.info('02. Verify product listing')
        products_page.assert_products_count(6)

        self.log.info('03. Add product to cart')
        products_page.click_add_to_cart_button(0)
        products_page.assert_price_bar_button_text(0, "Remove")

        self.log.info('04. Remove product from cart')
        products_page.click_remove_button(0)
        products_page.assert_price_bar_button_text(0, "Add to cart")
        