package com.saucedemo.pages;

import java.util.List;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.qameta.allure.Step;

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

    @Step("Get all 'Add to Cart' buttons")
    public List<WebElement> getAddToCartButtons() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(addToCartButtons));
    }

    @Step("Get all 'Remove' buttons")
    public List<WebElement> getRemoveButtons() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(removeButtons));
    }

    @Step("Get all price bars")
    public List<WebElement> getPriceBars() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(priceBars));
    }

    @Step("Verify product count is {expectedCount}")
    public void assertProductsCount(int expectedCount) {
        int actualCount = getAddToCartButtons().size();
        assert actualCount == expectedCount : "Expected " + expectedCount + " products, but found " + actualCount;
    }

    @Step("Verify price bar button text at index {priceBarIndex} is '{expectedText}'")
    public void assertPriceBarButtonText(int priceBarIndex, String expectedText) {
        WebElement priceBar = getPriceBars().get(priceBarIndex);
        WebElement button = priceBar.findElement(By.tagName("button"));
        wait.until(ExpectedConditions.textToBePresentInElement(button, expectedText));
        assert button.getText().equals(expectedText) : "Expected button text: " + expectedText + ", but got: " + button.getText();
    }

    @Step("Click 'Add to Cart' button at index {buttonIndex}")
    public void clickAddToCartButton(int buttonIndex) {
        getAddToCartButtons().get(buttonIndex).click();
    }

    @Step("Click 'Remove' button at index {buttonIndex}")
    public void clickRemoveButton(int buttonIndex) {
        getRemoveButtons().get(buttonIndex).click();
    }
}