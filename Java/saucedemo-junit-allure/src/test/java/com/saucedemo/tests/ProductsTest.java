package com.saucedemo.tests;

import com.saucedemo.pages.LoginPage;
import com.saucedemo.pages.ProductsPage;
import com.saucedemo.utils.DriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import io.qameta.allure.*;

@Feature("Products Page Functionality")
public class ProductsTest {
    private WebDriver driver;
    private LoginPage loginPage;
    private ProductsPage productsPage;

    @BeforeEach
    @Step("Set up test environment")
    public void setUp() {
        driver = DriverManager.getDriver();
        loginPage = new LoginPage(driver);
        productsPage = new ProductsPage(driver);
    }

    @Test
    @DisplayName("Add And Remove Products From Cart")
    @Story("Cart Management")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verifies that products can be added to and removed from the cart successfully")
    public void addAndRemoveProductsFromCart() {
        loginPage.open();
        loginPage.assertPageOpen();

        loginPage.enterUsername("standard_user");
        loginPage.enterPassword("secret_sauce");
        loginPage.pressLoginButton();
        loginPage.assertLoginSuccess();

        productsPage.assertProductsCount(6);
        productsPage.clickAddToCartButton(0);
        productsPage.assertPriceBarButtonText(0, "Remove");
        productsPage.clickRemoveButton(0);
        productsPage.assertPriceBarButtonText(0, "Add to cart");
    }

    @AfterEach
    @Step("Clean up test environment")
    public void tearDown() {
        DriverManager.quitDriver();
    }
}