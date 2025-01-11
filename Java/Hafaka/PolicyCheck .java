import java.awt.*;
import java.awt.event.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.support.ui.*;


public class PolicyCheck {
    public static void main(String[] args) throws Exception {

        // Console colors
        final String ANSI_YELLOW = "\u001B[33m";
        final String ANSI_GREEN = "\u001B[32m";
        final String ANSI_BLUE = "\u001B[34m";
        final String ANSI_RESET = "\u001B[0m";
       

        // Initializing
        String loginScreen = "https://hafaka-frontend-npcqa.menora.co.il/login";

        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Robota\\Desktop\\webdrivers\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.get(loginScreen);
        driver.manage().window().maximize();

        // Actions & Elements

        String  usernameField = "input-login-user",
                passwordField = "input-login-password",
                loginButton = "(//button[@class=\"btn btn-primary btn-lg btn-block mt-3\"])[1]",
                actionSelect = "action",
                policyField = "policyId",
                dataButton = "//button[contains(text(), 'נתוני חיתום')]",
                nextButton = "//button[contains(text(), 'הבא')]",
                backButton = "//button[contains(text(), 'חזור' )]",
                expandButton = "//button[contains(text(), 'הרחב סעיפים')]",
                shrinkButton = "//button[contains(text(), 'כווץ סעיפים')]",
                finishButton = "finishClausesBtn",
                exitButton = "(//button[@class='btn btn-sm clause-btn clause-btn-exit'])[1]";


        Robot robota = new Robot();
        WebDriverWait wait = new WebDriverWait(driver,30);



        try {
            // Login Page
            driver.findElement(By.id(usernameField)).sendKeys("k90fis1");
            driver.findElement(By.id(passwordField)).sendKeys("fis1");
            driver.findElement(By.xpath(loginButton)).click();

            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(actionSelect)));

            // Policy Page
            WebElement actionDropDown = driver.findElement(By.id(actionSelect));
            Select dropdown = new Select(actionDropDown);
            dropdown.selectByIndex(3);

            Thread.sleep(1000);

            driver.findElement(By.id(policyField)).sendKeys("043358972819700");
            robota.keyPress(KeyEvent.VK_TAB);
            robota.keyRelease(KeyEvent.VK_TAB);
            Thread.sleep(3000);


            // Data
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(dataButton)));
            driver.findElement(By.xpath(dataButton)).click();
            Thread.sleep(3000);


            for (int x = 0; x < 2; x++) {
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(nextButton)));
                driver.findElement(By.xpath(nextButton)).click();
                Thread.sleep(1500);
            }


            // Sections Page
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(expandButton)));
            driver.findElement(By.xpath(expandButton)).click();
            Thread.sleep(3000);
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(shrinkButton)));
            driver.findElement(By.xpath(shrinkButton)).click();
            Thread.sleep(3000);
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(finishButton)));
            driver.findElement(By.id(finishButton)).click();
            Thread.sleep(3000);
            // Conclusion Page
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(backButton)));
            driver.findElement(By.xpath(backButton)).click();
            Thread.sleep(3000);

            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(exitButton)));
            driver.findElement(By.xpath(exitButton)).click();

            System.out.println(ANSI_BLUE + "\n >>> Part 1: Passed" + ANSI_RESET);

            // Car Policy
            Thread.sleep(3000);
            Select carPolicyAction = new Select(driver.findElement(By.xpath("//select[@id='action']")));
            carPolicyAction.selectByIndex(3);

            Thread.sleep(3000);
            driver.findElement(By.xpath("//input[@id='policyId']")).sendKeys("040303476319000");
            robota.keyPress(KeyEvent.VK_TAB);
            robota.keyRelease(KeyEvent.VK_TAB);
            Thread.sleep(3000);
            driver.findElement(By.xpath("//button[contains(text(), 'נתוני חיתום')]")).click();

            // Declaration
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("checkedApproveId")));
            driver.findElement(By.id("checkedApproveId")).click();

            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), 'המשך') and not(@disabled)]")));
            driver.findElement(By.xpath("//button[contains(text(), 'המשך') and not(@disabled)]")).click();
            Thread.sleep(3000);

            // Next
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), 'הבא')]")));
            driver.findElement(By.xpath("//button[contains(text(), 'הבא')]")).click();
            Thread.sleep(3000);
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), 'הבא')]")));
            driver.findElement(By.xpath("//button[contains(text(), 'הבא')]")).click();
            Thread.sleep(3000);

            // Close error message
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//app-button[@id='modalCloseBtn']//button")));
            driver.findElement(By.xpath("//app-button[@id='modalCloseBtn']//button")).click();
            Thread.sleep(3000);


            driver.findElement(By.xpath("//label[@for='confirmation']")).click();
            Thread.sleep(3000);


            // Next
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(nextButton)));
            driver.findElement(By.xpath(nextButton)).click();
            Thread.sleep(1000);


            // Sections

            // Expand
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(expandButton)));
            driver.findElement(By.xpath(expandButton)).click();
            Thread.sleep(3000);

            // Exit
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(exitButton)));
            driver.findElement(By.xpath(exitButton)).click();


            System.out.println(ANSI_GREEN + "\n >>> Test Completed Successfully");
            driver.quit();

        } catch (Exception e) {
            // Log out
            driver.findElement(By.id(("dropdownBasic1"))).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), 'יציאה')]")));
            driver.findElement(By.xpath("//button[contains(text(), 'יציאה')]")).click();
            driver.findElement(By.xpath("//button[contains(text(), 'כן')]")).click();
            System.err.println(ANSI_YELLOW + e + "\n\n >>> Test Failed");
            System.out.println("\n >>> Logged out");
            driver.quit();
        }
    }
}