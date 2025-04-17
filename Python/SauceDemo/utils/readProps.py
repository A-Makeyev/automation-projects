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
    def getStandardUser():
        return config.get('global data', 'standardUser')
    
    @staticmethod
    def getLockedUser():
        return config.get('global data', 'lockedUser')
    
    @staticmethod
    def getInvalidUser():
        return config.get('global data', 'invalidUser')
    
    @staticmethod
    def getPassword():
        return config.get('global data', 'password')
