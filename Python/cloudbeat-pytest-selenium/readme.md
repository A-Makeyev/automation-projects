## Installation
cd pytest-selenium
python -m venv env
env\Scripts\activate
pip install -r requirements.txt

## Cloudbeat modules installation
pip install -e C:\Users\User\Desktop\Code\examples-pytest-main\cb-kit-python-main\cb-kit-common
pip install -e C:\Users\User\Desktop\Code\examples-pytest-main\cb-kit-python-main\cb-kit-selenium
pip install -e C:\Users\User\Desktop\Code\examples-pytest-main\cb-kit-python-main\cb-kit-pytest

### Activate env
cd pytest-selenium
env\Scripts\activate

### Set path
set PYTHONPATH=src

### run everything
pytest 

### run parallel tests
pytest -n 4

### run a single test
pytest -v -s tests/test_login.py 
