package com.saucedemo.tests;

import com.saucedemo.pages.LoginPage;
import com.saucedemo.utils.DriverManager;
import io.qameta.allure.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;

@Feature("Login Functionality")
public class LoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeEach
    @Step("Test setup")
    public void setUp() {
        driver = DriverManager.getDriver();
        loginPage = new LoginPage(driver);
    }

    @Test
    @DisplayName("Standard User Login Behaviour")
    @Story("Successful Login")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verifies that a standard user can login successfully with valid credentials")
    public void standardUserLoginBehaviour() {
        loginPage.open();
        loginPage.assertPageOpen();
        loginPage.enterUsername("standard_user");
        loginPage.enterPassword("secret_sauce");
        loginPage.pressLoginButton();
        loginPage.assertLoginSuccess();
    }

    @Test
    @DisplayName("Locked Out User Login Behaviour")
    @Story("Login Restrictions")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verifies that a locked out user receives appropriate error message")
    public void lockedOutUserLoginBehaviour() {
        loginPage.open();
        loginPage.assertPageOpen();
        loginPage.enterUsername("locked_out_user");
        loginPage.enterPassword("secret_sauce");
        loginPage.pressLoginButton();
        loginPage.assertLoginErrorMessage("Epic sadface: Sorry, this user has been locked out.");
    }

    @Test
    @DisplayName("Invalid User Login Behaviour")
    @Story("Login Validation")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verifies that invalid credentials show correct error message")
    public void invalidUserLoginBehaviour() {
        loginPage.open();
        loginPage.assertPageOpen();
        loginPage.enterUsername("invalid_user");
        loginPage.enterPassword("invalid_password");
        loginPage.pressLoginButton();
        loginPage.assertLoginErrorMessage("Epic sadface: Username and password do not match any user in this service");
    }

    @AfterEach
    @Step("Test cleanup")
    public void tearDown() {
        DriverManager.quitDriver();
    }
}