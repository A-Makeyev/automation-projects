package com.saucedemo.pages;

import io.qameta.allure.Step;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;
    private final String baseUrl = "https://www.saucedemo.com";
    private final By usernameField = By.id("user-name");
    private final By passwordField = By.id("password");
    private final By loginButton = By.id("login-button");
    private final By errorMessage = By.cssSelector("[data-test='error']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Step("Open login page")
    public void open() {
        driver.get(baseUrl);
    }

    @Step("Verify login page is displayed")
    public void assertPageOpen() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(loginButton));
    }

    @Step("Enter username: {username}")
    public void enterUsername(String username) {
        WebElement usernameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField));
        usernameElement.click();
        usernameElement.sendKeys(username);
    }

    @Step("Enter password")
    public void enterPassword(String password) {
        WebElement passwordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        passwordElement.click();
        passwordElement.sendKeys(password);
    }

    @Step("Click login button")
    public void pressLoginButton() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
    }

    @Step("Verify successful login")
    public void assertLoginSuccess() {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(loginButton));
    }

    @Step("Verify error message: {expectedMessage}")
    public void assertLoginErrorMessage(String expectedMessage) {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        assert errorElement.getText().equals(expectedMessage) : "Expected error message: " + expectedMessage + ", but got: " + errorElement.getText();
    }
}