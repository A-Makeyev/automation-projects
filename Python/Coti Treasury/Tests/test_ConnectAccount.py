import pytest
from utils.logger import CreateLog
from utils.readProps import ReadConfig
from Pages.Treasury import treasury_page
from Pages.MetaMask import metamask_page

class Test_Connect_Metamask_Account:
    baseURL = ReadConfig.getURL()
    email = ReadConfig.getEmail()
    password = ReadConfig.getPassword()
    log = CreateLog.generate_log()

    @pytest.mark.sanity
    @pytest.mark.regression
    def test_connect_account(self, setup):
        self.driver = setup
        treasury = treasury_page(self.driver)
        metamask = metamask_page(self.driver)

        self.log.info(f'01. Open {self.baseURL}')
        self.driver.get(self.baseURL)
        treasury.focus_window()
        treasury.load_page()
        
        self.log.info('02. Create MetaMask Account')
        metamask.focus_window()
        metamask.load_page()
        metamask.onbording_check_agreement_terms()
        metamask.onbording_create_new_wallet()
        metamask.refuse_metrics()
        metamask.enter_password(self.password)
        metamask.confirm_password(self.password)
        metamask.check_agreement_terms()
        metamask.create_new_wallet()
        metamask.skip_security()
        metamask.finish_onbording()
        metamask.wait_for_success_message()
        metamask.next_step()
        metamask.finish_installation()
        metamask.assert_new_account()
        self.driver.close()

        self.log.info('03. Connect MetaMask To Coti Treasury')
        treasury.focus_window()
        treasury.connect_wallet()
        treasury.check_agreement()
        treasury.select_metamask_account()

        self.log.info('04. Login To MetaMask')
        metamask.focus_window()
        metamask.confirm_connect()
        metamask.get_connection_info()
        metamask.finish_connecting_process()

        self.log.info('05. Assert Connection Status')
        treasury.focus_window()
        treasury.assert_error_modal()
        self.driver.quit()
        
        # Requires VPN
        # self.log.info('06. Enter Deposit')
        # treasury.open_deposits()
        # treasury.deposit_now()
        # treasury.enter_amount(5000)
        # treasury.send_deposits()
