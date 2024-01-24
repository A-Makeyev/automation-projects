import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# https://googlechromelabs.github.io/chrome-for-testing/
backupDriverPath = '\\BackUpDriver\\chromedriver.exe'
backupDriverPath = '..' + backupDriverPath if 'testCases' in os.getcwd() else '.' + backupDriverPath

@pytest.fixture()
def setup(browser):
    try:
        if browser == 'firefox':
            driver = webdriver.Firefox()
        elif browser == 'chrome' or browser is None:
            chrome_options = Options()
            chrome_options.add_argument('--incognito')
            chrome_options.add_argument('--disable-notifications')
            executable_path = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=executable_path, options=chrome_options)
    except:  # except TimeoutException as ex:
        driver = webdriver.Chrome(service=Service(backupDriverPath))
        print(f'⚠️ Used backup driver from: {backupDriverPath}')

    window_width = driver.execute_script('return window.innerWidth')
    if window_width > 1920:
        driver.set_window_size(1735, 1350)
    else:
        driver.maximize_window()
    return driver

# get values from CLI / hooks
def pytest_addoption(parser):
    parser.addoption('--browser')
    parser.addini("metadata", type="args", help='add metadata', default=[])

# return browser value to setup method
@pytest.fixture()
def browser(request):
    return request.config.getoption('--browser')

# a hook to add environment info in HTML report
def pytest_configure(config):
    for name in config.getini('metadata'):
        config.metadata[name] = 'Palo Alto'

# a hook to delete / modify environment info in HTML report
@pytest.hookimpl(optionalhook=True)
def pytest_metadata(metadata):
    metadata.pop('JAVA_HOME', None)
    metadata.pop('Plugins', None)
