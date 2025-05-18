package com.saucedemo.pages;

import java.util.List;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.cloudbeat.common.annotation.CbStep;

public class ProductsPage {
    private final WebDriver driver;
    private final WebDriverWait wait;
    private final By addToCartButtons = By.xpath("//button[text()='Add to cart']");
    private final By removeButtons = By.xpath("//button[text()='Remove']");
    private final By priceBars = By.className("pricebar");

    public ProductsPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @CbStep("Get Add To Cart Buttons")
    public List<WebElement> getAddToCartButtons() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(addToCartButtons));
    }

    @CbStep("Get Remove Buttons")
    public List<WebElement> getRemoveButtons() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(removeButtons));
    }

    @CbStep("Get Prices")
    public List<WebElement> getPriceBars() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(priceBars));
    }

    @CbStep("Assert Products Count")
    public void assertProductsCount(int expectedCount) {
        int actualCount = getAddToCartButtons().size();
        assert actualCount == expectedCount : "Expected " + expectedCount + " products, but found " + actualCount;
    }

    @CbStep("Assert Price")
    public void assertPriceBarButtonText(int priceBarIndex, String expectedText) {
        WebElement priceBar = getPriceBars().get(priceBarIndex);
        WebElement button = priceBar.findElement(By.tagName("button"));
        wait.until(ExpectedConditions.textToBePresentInElement(button, expectedText));
        assert button.getText().equals(expectedText) : "Expected button text: " + expectedText + ", but got: " + button.getText();
    }

    @CbStep("Add To Cart")
    public void clickAddToCartButton(int buttonIndex) {
        getAddToCartButtons().get(buttonIndex).click();
    }

    @CbStep("Remove Items")
    public void clickRemoveButton(int buttonIndex) {
        getRemoveButtons().get(buttonIndex).click();
    }
}