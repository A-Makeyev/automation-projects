import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class metamask_page:
    WINDOW_TITLE = 'MetaMask'
    MAIN_PAGE = (By.ID, 'app-content')
    AGREEMENT_TERMS_CHECKBOX = (By.XPATH, '//input[@data-testid="onboarding-terms-checkbox"]')
    ONBORDING_CREATE_WALLET_BUTTON = (By.XPATH, '//button[@data-testid="onboarding-create-wallet" and not(@disabled)]')
    RREFUSE_METRICS_BUTTON = (By.XPATH, '//button[@data-testid="metametrics-no-thanks"]')
    CREATE_NEW_PASSWORD_INPUT = (By.XPATH, '//input[@data-testid="create-password-new"]')
    CONFIRM_NEW_PASSWORD_INPUT = (By.XPATH, '//input[@data-testid="create-password-confirm"]')
    PASSWORD_TERMS_CHECKBOX = (By.XPATH, '//input[@data-testid="create-password-terms"]')
    CREATE_WALLET_BUTTON = (By.XPATH, '//button[@data-testid="create-password-wallet" and not(@disabled)]')
    SKIP_SECURITY_BUTTON = (By.XPATH, '//button[contains(text(), "Remind me later")]')
    SKIP_SECURITY_CONFIRM_CHECKBOX = (By.XPATH, '//input[@data-testid="skip-srp-backup-popover-checkbox"]')
    SKIP_BUTTON = (By.XPATH, '//button[@data-testid="skip-srp-backup"]')
    ONBORDING_DONE_BUTTON = (By.XPATH, '//button[@data-testid="onboarding-complete-done"]')
    SUCCESS_MESSAGE = (By.XPATH, '//*[contains(text(), "Your MetaMask install is complete")]')
    NEXT_BUTTON = (By.XPATH, '//button[@data-testid="pin-extension-next"]')
    EXTENSION_DONE_BUTTON = (By.XPATH, '//button[@data-testid="pin-extension-done"]')
    NEW_ACCOUNT_BUTTON = (By.XPATH, '//span[contains(text(), "Account 1")]')
    CONFIRM_CONNECT_BUTTON = (By.XPATH, '//button[@data-testid="confirm-btn"]')
    SIGNATURE_REQUEST_FROM_DIV = (By.XPATH, '//p[text()="Request from"]//..//..//..//..//div[contains(@class, "confirm-info-row")]')
    SIGNATURE_MESSAGE_DIV = (By.XPATH, '(//p[text()="Message"]//..//..//..//..//div)[1]')
    FINAL_CONFIRM_BUTTON = (By.XPATH, '//button[@data-testid="confirm-footer-button"]')

    def __init__(self, driver):
        self.driver = driver

    def wait_for_element(self, by, locator):
        time.sleep(0.5)
        return WebDriverWait(self.driver, 30).until(
            EC.visibility_of_element_located((by, locator))
        )

    def click(self, by, locator):
        element = self.wait_for_element(by, locator)
        element.click()

    # def get_text(self, by, locator):
    #     element = self.wait_for_element(by, locator)
    #     end_time = time.time() + 10

    #     while time.time() < end_time:
    #         try:
    #             text = element.text.strip()
    #             if text:
    #                 return text
    #         except Exception as e:
    #             print(f'\n❌  Unable to get text from element located by {by}, "{locator}". Error -> {e}')
    #             break
    #         time.sleep(1)
    #     return ''

    def get_text(self, by, locator):
        retries = 5
        for _ in range(retries):
            try:
                element = self.wait_for_element(by, locator)
                text = element.text.strip()
                if text:
                    return text
            except Exception:
                # If element is not found, continue to the next try
                continue
        # Return None if text wasn't found after 5 tries
        return None


    def type(self, by, locator, value):
        element = self.wait_for_element(by, locator)
        element.clear()
        element.send_keys(value)

    def load_page(self):
        self.wait_for_element(*self.MAIN_PAGE)

    def focus_window(self, timeout=10):
        if self.driver.title == self.WINDOW_TITLE:
            return
        
        start_time = time.time()
        while time.time() - start_time < timeout:  
            handles = self.driver.window_handles
            
            for handle in handles:
                self.driver.switch_to.window(handle)
                if self.driver.title == self.WINDOW_TITLE:
                    print(f'\n✔️  Selected window -> {self.WINDOW_TITLE}')
                    self.driver.maximize_window()
                    return
            time.sleep(1)
        raise TimeoutError(f'\n❌  Window {self.WINDOW_TITLE} was not found')

    def onbording_check_agreement_terms(self):
        self.click(*self.AGREEMENT_TERMS_CHECKBOX)

    def onbording_create_new_wallet(self): 
        self.click(*self.ONBORDING_CREATE_WALLET_BUTTON)

    def refuse_metrics(self): 
        self.click(*self.RREFUSE_METRICS_BUTTON)

    def enter_password(self, password): 
        self.type(*self.CREATE_NEW_PASSWORD_INPUT, password)

    def confirm_password(self, password): 
        self.type(*self.CONFIRM_NEW_PASSWORD_INPUT, password)

    def check_agreement_terms(self): 
        self.click(*self.PASSWORD_TERMS_CHECKBOX)

    def create_new_wallet(self): 
        self.click(*self.CREATE_WALLET_BUTTON)

    def skip_security(self): 
        self.click(*self.SKIP_SECURITY_BUTTON)
        self.click(*self.SKIP_SECURITY_CONFIRM_CHECKBOX)
        self.click(*self.SKIP_BUTTON)

    def finish_onbording(self): 
        self.click(*self.ONBORDING_DONE_BUTTON)

    def wait_for_success_message(self):
        self.wait_for_element(*self.SUCCESS_MESSAGE)

    def next_step(self): 
        self.click(*self.NEXT_BUTTON)

    def finish_installation(self): 
        self.click(*self.EXTENSION_DONE_BUTTON)

    def assert_new_account(self):
        try:
            self.wait_for_element(*self.NEW_ACCOUNT_BUTTON)
            account = self.get_text(*self.NEW_ACCOUNT_BUTTON)
            print(f'\n✔️  Created new account -> "{account}"')
        except Exception as e:
            print(f'\n❌  Failed to create account was not found -> {e}')

    def confirm_connect(self):
        self.click(*self.CONFIRM_CONNECT_BUTTON)

    def get_connection_info(self):
        signature_details = self.get_text(*self.SIGNATURE_REQUEST_FROM_DIV)
        signature_message = self.get_text(*self.SIGNATURE_MESSAGE_DIV)
        
        assert signature_details, '❌ Signature request details are empty'
        assert signature_message, '❌ Signature message is empty'

        print(f'\n✔️  Signature Request Details: {signature_details.replace('\n', ' ')}')
        print(f'\n✔️  Signature Message: {signature_message.replace('\n', ' ')}')

    def finish_connecting_process(self):
        self.click(*self.FINAL_CONFIRM_BUTTON)
