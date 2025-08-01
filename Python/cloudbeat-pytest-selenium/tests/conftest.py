import uuid
import pytest
from selenium import webdriver
from cloudbeat_common.models import CbConfig
from cloudbeat_common.reporter import CbTestReporter
from cloudbeat_selenium.wrapper import CbSeleniumWrapper


@pytest.fixture(scope="module")
def cb_config():
    """Prepare configuration class for further CB reporter initialization."""
    config = CbConfig()
    config.run_id = str(uuid.uuid4())
    config.instance_id = str(uuid.uuid4())
    config.project_id = str(uuid.uuid4())
    config.capabilities = {"browserName": "chrome"}
    return config


@pytest.fixture(scope="module")
def cb_reporter(cb_config):
    reporter = CbTestReporter(cb_config)
    return reporter


@pytest.fixture()
def setup(cb_reporter):
    driver = webdriver.Chrome()
    wrapper = CbSeleniumWrapper(cb_reporter)
    wrapped_driver = wrapper.wrap(driver)
    yield wrapped_driver
    driver.quit()
