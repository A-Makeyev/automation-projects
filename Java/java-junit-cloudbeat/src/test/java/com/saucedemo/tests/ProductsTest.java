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
import io.cloudbeat.common.annotation.CbStep;
import io.cloudbeat.junit.CbJunitExtension;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.io.IOException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

@ExtendWith({CbJunitExtension.class}) 
public class ProductsTest {
    private WebDriver driver;
    private LoginPage loginPage;
    private ProductsPage productsPage;

    public void takeScreenshot(String stepName) {
        CbJunitExtension.step("Take Screenshot", () -> {
            byte[] screenshotData = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            CbJunitExtension.attachScreenshot(screenshotData, true);

            try {
                Path screenshotDir = Path.of("screenshots");
                if (!Files.exists(screenshotDir)) {
                    Files.createDirectories(screenshotDir);
                }

                String timestamp = new SimpleDateFormat("d.M.yy~HH_mm_ss").format(new Date());
                Path screenshotPath = screenshotDir.resolve(stepName + "_" + timestamp + ".png");
                Files.write(screenshotPath, screenshotData);

                System.out.println("Screenshot saved to file: " + screenshotPath.toAbsolutePath());
            } catch (IOException e) {
                System.err.println("Failed to save screenshot: " + e.getMessage());
            }
        });
    }

    @CbStep
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

        takeScreenshot("Add to cart");
    }

    @CbStep
    @AfterEach
    public void tearDown() {
        CbJunitExtension.startStep("Close Browser");
        DriverManager.quitDriver();
        CbJunitExtension.endLastStep();
    }
}