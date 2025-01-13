import os
import pytest
import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

script_dir = os.path.dirname(os.path.abspath(__file__))
BACKUP_DRIVER_PATH = os.path.join(script_dir, 'Data', 'chromedriver.exe')
META_MASK_EXTENSION_PATH = os.path.join(os.path.dirname(script_dir), 'Data', 'metamask_12.9.3_0')

@pytest.fixture()
def setup(browser, keep_open):
    try:
        if browser == 'chrome' or browser is None:
            # options = webdriver.ChromeOptions()
            options = uc.ChromeOptions() 
            options.add_argument(f'--load-extension={os.path.abspath(META_MASK_EXTENSION_PATH)}') 
            executable_path = Service(ChromeDriverManager().install())
    except Exception as e: 
        # options = webdriver.ChromeOptions()
        options = webdriver.ChromeOptions() 
        options.add_argument(f'--load-extension={os.path.abspath(META_MASK_EXTENSION_PATH)}')
        executable_path = Service(BACKUP_DRIVER_PATH)
        print(f'⚠️ Used backup driver from: {BACKUP_DRIVER_PATH}. Error -> {e}')
    
    # driver = webdriver.Chrome(service=executable_path, options=options)
    driver = uc.Chrome(service=executable_path, options=options, enable_cdp_events=True if keep_open else False)
    driver.set_page_load_timeout(10)
    driver.implicitly_wait(30)
    
    window_width = driver.execute_script('return window.innerWidth')
    if window_width > 1920:
        driver.set_window_size(1500, 1250)
    else:
        driver.maximize_window()
    return driver

# get values from CLI / hooks
def pytest_addoption(parser):
    parser.addoption('--browser', action='store', default='chrome', help='Browser to use for tests')
    parser.addoption('--keep-open', action='store_true', help='Enable debug mode to keep browser window open')
    parser.addini("metadata", type="args", help='add metadata', default=[])

# return browser value to setup method
@pytest.fixture()
def browser(request):
    return request.config.getoption('--browser')

@pytest.fixture()
def keep_open(request):
    return request.config.getoption('--keep-open')

# a hook to add environment info in HTML report
def pytest_configure(config):
    for name in config.getini('metadata'):
        config.metadata[name] = 'Coti'

# a hook to delete / modify environment info in HTML report
@pytest.hookimpl(optionalhook=True)
def pytest_metadata(metadata):
    metadata.pop('JAVA_HOME', None)
    metadata.pop('Plugins', None)
    