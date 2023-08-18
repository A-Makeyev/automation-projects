import os
import pytest
from selenium import webdriver
from selenium.common import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

path = '\\BackUpDriver\\chromedriver.exe'
path = '..' + path if 'testCases' in os.getcwd() else '.' + path


@pytest.fixture()
def setup(browser):
    chrome_options = Options()
    chrome_options.add_argument('--incognito')
    chrome_options.add_argument('--disable-notifications')

    try:
        if browser == 'firefox':
            driver = webdriver.Firefox()
        elif browser == 'chrome':
            service = Service(executable_path=ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
        elif browser is None:
            driver = webdriver.Chrome(options=chrome_options, executable_path=path)
    except TimeoutException as ex:
        print(f'✖️️ Failed To Open Browser - {ex.msg}')

    driver.set_window_size(1735, 1350)
    return driver

# get values from CLI / hooks
def pytest_addoption(parser):
    parser.addoption('--browser')

# return browser value to setup method
@pytest.fixture()
def browser(request):
    return request.config.getoption('--browser')
