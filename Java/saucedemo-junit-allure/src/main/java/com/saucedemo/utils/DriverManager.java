package com.saucedemo.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import io.qameta.allure.Step;

public class DriverManager {
    private static WebDriver driver;

    @Step("Initialize WebDriver with Chrome")
    public static WebDriver getDriver() {
        if (driver == null) {
            WebDriverManager.chromedriver().clearDriverCache().clearResolutionCache().setup();
            driver = new ChromeDriver();
            driver.manage().window().maximize();
        }
        return driver;
    }

    @Step("Quit WebDriver and clean up")
    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}