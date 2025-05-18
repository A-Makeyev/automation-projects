package com.saucedemo.utils;

import io.cloudbeat.junit.CbJunitExtension;
import io.cloudbeat.selenium.CbWebDriverListener;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.events.EventFiringDecorator;

public class DriverManager {
    private static WebDriver driver;

    public static WebDriver getDriver() {
        if (driver == null) {
            // CbJunitExtension.startStep("Initialize Browser");
            WebDriverManager.chromedriver().clearDriverCache().clearResolutionCache().setup();
            driver = new ChromeDriver();
            driver.manage().window().maximize();

            // ChromeDriver chromeDriver = new ChromeDriver();
            // chromeDriver.manage().window().maximize();
            // CbJunitExtension.endLastStep();
            // WebDriverListener listener = CbJunitExtension.wrapWebDriver(chromeDriver);
            // CbWebDriverListener listener = CbJunitExtension.getWebDriverListener(chromeDriver);
            // driver = new EventFiringDecorator(listener).decorate(chromeDriver);
        }
        return driver;
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}