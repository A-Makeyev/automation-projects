## Installation
python -m venv env
env\Scripts\activate
pip install -r requirements.txt

## Run Commands

### Activate env
env\Scripts\activate

### run everything
pytest 

### run parallel tests
pytest -n 4

### run a single test
pytest -v -s Tests/test_login.py 
