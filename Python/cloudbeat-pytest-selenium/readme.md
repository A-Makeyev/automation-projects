## Standard Installation
cd pytest-selenium
python -m venv env
env\Scripts\activate
pip install -r requirements.txt

### Activate env
cd pytest-selenium
env\Scripts\activate

## Installation using UV
uv venv
uv pip install -r requirements.txt

### Set path
set PYTHONPATH=src

## Run your tests
### run everything
```sh
pytest 

# using UV
uv run pytest 
```

### run parallel tests
```sh
pytest -n 4

# using UV
uv run pytest -n 4
```

### run a single test
```sh
pytest -v -s Tests/test_login.py 

# using UV
uv run pytest -v -s Tests/test_login.py 
```
