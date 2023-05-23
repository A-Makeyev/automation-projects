import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

@pytest.fixture()
def setup():
    chrome_options = Options()
    chrome_options.add_argument('--disable-notifications')
    return webdriver.Chrome(options=chrome_options)
