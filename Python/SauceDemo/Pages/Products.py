from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class ProductsPage:
    WINDOW_TITLE = 'Swag Labs'
    ADD_TO_CART_BUTTONS = (By.XPATH, "//button[text()='Add to cart']")
    REMOVE_BUTTONS = (By.XPATH, "//button[text()='Remove']")
    PRICE_BARS = (By.CLASS_NAME, 'pricebar')

    def __init__(self, driver):
        self.driver = driver

    def wait_for_element(self, by, locator):
        return WebDriverWait(self.driver, 30).until(
            EC.presence_of_element_located((by, locator))
        )

    def click(self, by, locator):
        element = self.wait_for_element(by, locator)
        element.click()

    def get_add_to_cart_buttons(self):
        return WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.ADD_TO_CART_BUTTONS)
        )

    def get_remove_buttons(self):
        return WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.REMOVE_BUTTONS)
        )

    def get_price_bars(self):
        return WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.PRICE_BARS)
        )

    def assert_products_count(self, expected_count):
        buttons = self.get_add_to_cart_buttons()
        assert len(buttons) == expected_count, f"Expected {expected_count} products, found {len(buttons)}"
        print(f'\n✔️  Verified product count: {expected_count}')

    def assert_price_bar_button_text(self, price_bar_index, expected_text):
        price_bars = self.get_price_bars()
        button = price_bars[price_bar_index].find_element(By.TAG_NAME, "button")
        actual_text = button.text
        assert actual_text == expected_text, f"Expected button text '{expected_text}', got '{actual_text}'"
        print(f'\n✔️  Verified button text at index {price_bar_index}: {expected_text}')

    def click_add_to_cart_button(self, button_index):
        buttons = self.get_add_to_cart_buttons()
        buttons[button_index].click()

    def click_remove_button(self, button_index):
        buttons = self.get_remove_buttons()
        buttons[button_index].click()
        