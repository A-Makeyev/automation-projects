import os
import logging


relative_log_path = os.path.join("logs", "automation.log")
if "tests" in os.getcwd().lower():
    path = os.path.join("..", relative_log_path)
else:
    path = os.path.join(".", relative_log_path)

log_dir = os.path.dirname(path)
os.makedirs(log_dir, exist_ok=True)

if not os.path.exists(path):
    with open(path, 'w', encoding='utf-8') as f:
        pass 


class CreateLog:
    @staticmethod
    def generate_log():
        fh = logging.FileHandler(filename=path, mode='a', encoding='utf-8')
        formatter = logging.Formatter('%(asctime)s: %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')
        log = logging.getLogger()
        log.setLevel(logging.INFO)

        if not any(isinstance(h, logging.FileHandler) and h.baseFilename == os.path.abspath(path) for h in log.handlers):
            fh.setFormatter(formatter)
            log.addHandler(fh)

        return log
