import time
import requests
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class treasury_page:
    WINDOW_TITLE = 'COTI Treasury'
    MAIN_PAGE = (By.ID, 'root')
    CONNECT_BUTTON = (By.XPATH, '//div[contains(@class, "WalletConnectButton")]//button')
    META_MASK_AGREEMENT_CHECKBOX = (By.XPATH, '//div[text()="MetaMask"]//..//span[contains(@class, "CheckBox")]')
    META_MASK_SELECT_BUTTON = (By.XPATH, '//div[text()="MetaMask"]//..//..//button[text()="SELECT" and not (@disabled)]')
    CONFIRM_BUTTON = (By.XPATH, '//button[text()="Confirm"]')
    MODAL_ERROR_TEXT = (By.XPATH, '//div[contains(@class, "UnauthorizedCountryModal")]//*[contains(text(), "This service is unavailable in your jurisdiction")]')
    CLOSE_MODAL_BUTTON = (By.XPATH, '//div[contains(@class, "UnauthorizedCountryModal")]//*[text()="Close"]')
    DEPOSIT_BUTTON = (By.XPATH, '//a[@href="/deposits"]')
    DEPOSIT_NOW_BUTTON = (By.XPATH, '//div[text()="Deposit Now"]')
    AMOUNT_INPUT = (By.XPATH, '//span[text()="Amount"]//..//..//..//input[@type="text"]')
    
    def __init__(self, driver):
        self.driver = driver

    def take_screenshot(self, description):
        now = datetime.now()
        current_time = now.strftime("%d-%m-%Y_%H-%M-%S")
        self.driver.save_screenshot(f'.\\Screenshots\\{description}_{current_time}.jpg')

    def wait_for_element(self, by, locator):
        return WebDriverWait(self.driver, 30).until(
            EC.presence_of_element_located((by, locator))
        )

    def click(self, by, locator):
        element = self.wait_for_element(by, locator)
        element.click()

    def get_text(self, by, locator):
        end_time = time.time() + 5
        while time.time() < end_time:
            try:
                element = self.wait_for_element(by, locator)
                text = element.text.strip()
                if text:
                    return text
            except Exception as e:
                print(f'Unable to get text from element located by {by}, "{locator}". Error -> {e}')
                break
            time.sleep(0.5)
        return ''

    def type(self, by, locator, value):
        element = self.wait_for_element(by, locator)
        element.clear()
        element.send_keys(value)

    def load_page(self):
        self.wait_for_element(*self.MAIN_PAGE)

    def focus_window(self, timeout=10):
        target_title = self.WINDOW_TITLE
        start_time = time.time()
        while time.time() - start_time < timeout:  
            handles = self.driver.window_handles
            
            for handle in handles:
                self.driver.switch_to.window(handle)
                if self.driver.title == target_title:
                    print(f'\n✔️  Selected window -> {target_title}')
                    return
            time.sleep(0.5)
        raise TimeoutError(f'\n❌  Window {target_title} was not found')

    def close_tabs(self, keep_open_tabs=1, timeout=30):
        WebDriverWait(self.driver, timeout).until(
            lambda driver: len(driver.window_handles) > keep_open_tabs,
            message='No extra tabs were opened'
        )

        handles = self.driver.window_handles
        while len(handles) != 1:
            self.driver.switch_to.window(handles[-1])
            self.driver.close()
            handles = self.driver.window_handles
        self.driver.switch_to.window(handles[0])

    def get_title(self):
        return self.driver.title

    def connect_wallet(self):
        self.click(*self.CONNECT_BUTTON)

    def check_agreement(self):
        self.click(*self.META_MASK_AGREEMENT_CHECKBOX)

    def select_metamask_account(self): 
        self.click(*self.META_MASK_SELECT_BUTTON)
    
    def assert_error_modal(self):
        error = self.wait_for_element(*self.MODAL_ERROR_TEXT)
        self.take_screenshot('Modal Status')
        if error.is_displayed():
            error_message = self.get_text(*self.MODAL_ERROR_TEXT)
            print(f'\n🛈  Modal error is displayed -> {error_message}')
            self.click(*self.CLOSE_MODAL_BUTTON)

    def open_deposits(self):
        self.click(*self.DEPOSIT_BUTTON)
        
    def deposit_now(self):
        self.click(*self.DEPOSIT_NOW_BUTTON)
        
    def enter_amount(self, amount): 
        self.type(*self.AMOUNT_INPUT, amount)
        
    def send_deposits(self):
        url = 'https://treasury-proxy-api.coti.io/api/estimation/deposit-preview'
        data = {
            "lock": 0,
            "amount": 5000,
            "leverage": 1,
            "currency": "COTI"
        }
        
        res = requests.post(url, json = data)
        print(res)
        