import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.util.concurrent.TimeUnit;

public class Main {
    public static void main(String[] args) {

        System.setProperty(
                "webdriver.chrome.driver",
                "C:\\Users\\Makeyev\\Desktop\\OnlineShop\\webdrivers\\chromedriver.exe"
                // download the newest chromedriver -> https://chromedriver.chromium.org/downloads
        );

        WebDriver driver = new ChromeDriver();

        driver.get("https://google.com");
        driver.manage().window().maximize();

        WebDriverWait wait = new WebDriverWait(driver, 30);


        driver.close();
    }
}
