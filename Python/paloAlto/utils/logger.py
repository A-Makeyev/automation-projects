import os
import logging

path = '\\Logs\\automation.log'
path = '..' + path if 'testCases' in os.getcwd() else '.' + path


class CreateLog:
    @staticmethod
    def generate_log():
        fh = logging.FileHandler(filename=path, mode='a', encoding='utf-8')
        formatter = logging.Formatter('%(asctime)s: %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')
        log = logging.getLogger()
        log.setLevel(logging.INFO)
        fh.setFormatter(formatter)
        log.addHandler(fh)
        return log
