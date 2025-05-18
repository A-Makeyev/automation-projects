package com.saucedemo.tests;

import com.saucedemo.pages.LoginPage;
import com.saucedemo.utils.DriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;
import io.cloudbeat.junit.CbJunitExtension;

@ExtendWith({ CbJunitExtension.class })
public class LoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeEach
    public void setUp() {
        driver = DriverManager.getDriver();
        loginPage = new LoginPage(driver);
    }

    @Test
    @DisplayName("Standard User Login Behaviour")
    public void standardUserLoginBehaviour() {
        CbJunitExtension.startStep("Open Main Page");
        loginPage.open();
        loginPage.assertPageOpen();
        CbJunitExtension.endLastStep();

        CbJunitExtension.startStep("Login");
        loginPage.enterUsername("standard_user");
        loginPage.enterPassword("secret_sauce");
        loginPage.pressLoginButton();
        loginPage.assertLoginSuccess();
        CbJunitExtension.endLastStep();
    }

    @Test
    @DisplayName("Locked Out User Login Behaviour")
    public void lockedOutUserLoginBehaviour() {
        CbJunitExtension.startStep("Open Main Page");
        loginPage.open();
        loginPage.assertPageOpen();
        CbJunitExtension.endLastStep();

        CbJunitExtension.startStep("Login With Locked Out User");
        loginPage.enterUsername("locked_out_user");
        loginPage.enterPassword("secret_sauce");
        loginPage.pressLoginButton();
        loginPage.assertLoginErrorMessage("Epic sadface: Sorry, this user has been locked out.");
        CbJunitExtension.endLastStep();
    }

    @Test
    @DisplayName("Invalid User Login Behaviour")
    public void invalidUserLoginBehaviour() {
        CbJunitExtension.startStep("Open Main Page");
        loginPage.open();
        loginPage.assertPageOpen();
        CbJunitExtension.endLastStep();

        CbJunitExtension.startStep("Login With Invalid User");
        loginPage.enterUsername("invalid_user");
        loginPage.enterPassword("invalid_password");
        loginPage.pressLoginButton();
        loginPage.assertLoginErrorMessage("Epic sadface: Username and password do not match any user in this service");
        CbJunitExtension.endLastStep();
    }

    @AfterEach
    public void tearDown() {
        CbJunitExtension.startStep("Close Browser");
        DriverManager.quitDriver();
        CbJunitExtension.endLastStep();
    }
}