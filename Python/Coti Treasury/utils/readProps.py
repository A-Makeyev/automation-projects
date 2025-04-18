import os
import configparser

path = '\\Configuration\\config.ini'
path = '..' + path if 'Tests' in os.getcwd() else '.' + path
config = configparser.RawConfigParser()
config.read(path)


class ReadConfig():
    @staticmethod
    def getURL():
        return config.get('global data', 'baseURL')

    @staticmethod
    def getEmail():
        return config.get('global data', 'email')
    
    @staticmethod
    def getPassword():
        return config.get('global data', 'password')
