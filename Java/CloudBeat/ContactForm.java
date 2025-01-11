import java.awt.*;
import org.openqa.selenium.By;
import java.awt.event.KeyEvent;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;


public class ContactForm {
    public static void main(String[] args) throws Exception {

        WebDriver driver = new ChromeDriver();

        // Opens Google on the Chrome browser and maximizes the window
        driver.get("http://www.google.com");
        driver.manage().window().maximize();

        // Types CloudBeat at the search box
        driver.findElement(By.name("q")).sendKeys("CloudBeat");

        // Using Robot to press enter
        Robot robot = new Robot();

        robot.keyPress(KeyEvent.VK_ENTER);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.delay(300);


        driver.findElement(By.className("LC20lb")).click();


        // Clicking on the contact button
        driver.findElement(By.xpath("//*[@id=\"topmenu\"]/nav/ul/li[5]/a")).click();

        // Making a slight delay to assure the page has loaded correctly
        Thread.sleep(1000);

        WebElement[] form = new WebElement[3];


            form[0] = driver.findElement(By.name("name"));
            form[0].sendKeys("Anatoly Makeyev");

            form[1] = driver.findElement(By.name("email"));
            form[1].sendKeys("Anatoly.Makeyev@gmail.com");

            form[2] = driver.findElement(By.name("message"));
            form[2].sendKeys("I would love to apply for a QA automation position! :) ");


        // Send form
        driver.findElement(By.xpath("//*[@id=\"wpcf7-f13-o1\"]/form/div[5]/input")).click();

    }
}