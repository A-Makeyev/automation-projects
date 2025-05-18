package com.saucedemo.tests;

import com.saucedemo.pages.LoginPage;
import com.saucedemo.pages.ProductsPage;
import com.saucedemo.utils.DriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;
import io.cloudbeat.junit.CbJunitExtension;

@ExtendWith({CbJunitExtension.class}) 
public class ProductsTest {
    private WebDriver driver;
    private LoginPage loginPage;
    private ProductsPage productsPage;

    @BeforeEach
    public void setUp() {
        driver = DriverManager.getDriver();
        loginPage = new LoginPage(driver);
        productsPage = new ProductsPage(driver);
    }

    @Test
    @DisplayName("Add And Remove Products From Cart")
    public void addAndRemoveProductsFromCart() {
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

        CbJunitExtension.startStep("Add And Remove Products From Cart");
        productsPage.assertProductsCount(6);
        productsPage.clickAddToCartButton(0);
        productsPage.assertPriceBarButtonText(0, "Remove");
        productsPage.clickRemoveButton(0);
        productsPage.assertPriceBarButtonText(0, "Add to cart");
        CbJunitExtension.endLastStep();
    }

    @AfterEach
    public void tearDown() {
        CbJunitExtension.startStep("Close Browser");
        DriverManager.quitDriver();
        CbJunitExtension.endLastStep();
    }
}