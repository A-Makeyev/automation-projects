import java.awt.*;
import java.awt.event.KeyEvent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class TypingCode {
    public static void main(String[] args) throws Exception {

    WebDriver driver = new ChromeDriver();

    driver.manage().window().maximize();
    driver.get("https://makeyka.github.io/onlineCodeEditor/");

// id: htmlCode => html text area

// id: cssCode => css text area

// id: jsCode => js text area

// id: run => run code button

// xpath:   //*//ul//li[@class='toggle' and text()='HTML']          => toggle html

// xpath:   //*//ul//li[@class='toggle' and text()='CSS']           => toggle css

// xpath:   //*//ul//li[@class='toggle' and text()='JAVASCRIPT']    => toggle js

// xpath: //*//ul[@id='toggle']//li[@class='toggle selected' and contains(text(), 'CSS')]   => toggle css SELECTED

// xpath: //*//ul[@id='toggle']//li[@class='toggle selected' and contains(text(), 'JAVASCRIPT')]   => toggle js SELECTED

        Robot robot = new Robot();

        // Close JS text area
        driver.findElement(By.xpath("//*//ul//li[@class='toggle' and text()='JAVASCRIPT']")).click();

        Thread.sleep(1000);

        // Close CSS text area
        driver.findElement(By.xpath("//*//ul//li[@class='toggle' and text()='CSS']")).click();

        Thread.sleep(1000);

        /* HTML AREA */

        WebElement htmlArea = driver.findElement(By.id("htmlCode"));

        htmlArea.sendKeys("<div id='wrapper'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<div><img src='images/makeyka.png' id='logo'></div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<div id='title'>CREATE A MAKEYKA ACCOUNT</div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Form

        htmlArea.sendKeys("<form method='post'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // First Name

        htmlArea.sendKeys("<label for='first-name'>First Name</label>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<div class='inputs'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<input type='text' name='first-name' id='first-name' placeholder='Enter your name..'  onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Enter your name..'\" required> <br> </div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Last Name

        htmlArea.sendKeys("<label for='last-name'>Last Name</label>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<div class='inputs'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<input type='text' name='last-name' id='last-name' placeholder='Enter your last name..' onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Enter your last name..'\" required> <br>\n" +
                "</div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Email Address

        htmlArea.sendKeys("<label for='email'>Email Address</label>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<div class='inputs'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        htmlArea.sendKeys("<input type='email' name='email' id='email' placeholder='Enter your email..' onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Enter your email..'\" required> <br>\n" +
                "</div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Checking results so far and adding css html & logo

        /* CSS AREA */

        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//*//ul[@id='toggle']//li[@class='toggle selected' and contains(text(), 'CSS')]")).click();
        Thread.sleep(2000);

        driver.findElement(By.id("cssCode")).sendKeys("html {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     background-color: skyblue;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("#logo {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     width: 100px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     height: 75px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     margin-left: -5px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     animation: spin 6s infinite;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");

        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);

        /* HTML AREA */

        // Password

        driver.findElement(By.id("htmlCode")).sendKeys("<label for='pass'>Password</label>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("htmlCode")).sendKeys("<div class='inputs'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("htmlCode")).sendKeys("<input type='password' name='pass' id='pass' placeholder='Enter your password..' onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Enter your password..'\" required> <br> </div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Confirm Password

        driver.findElement(By.id("htmlCode")).sendKeys("<label for='confirm'>Confirm Password</label>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("htmlCode")).sendKeys("<div class='inputs'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("htmlCode")).sendKeys("<input type='password' name='confirm' id='confirm' placeholder='Confirm password' onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Confirm password'\" required> <br>\n" +
                "</div>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Submit

        driver.findElement(By.id("htmlCode")).sendKeys("<input type='submit' id='submit' value='SIGN UP'>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("htmlCode")).sendKeys("</form>");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("htmlCode")).sendKeys("</div>");

        Thread.sleep(2000);
        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);

        /* CSS AREA */

        // Wrapper

        driver.findElement(By.id("cssCode")).click();
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("#wrapper {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     color: rgb(30, 30, 30);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     font-family: verdana;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     font-size: 1.1em;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     text-align: center;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     margin: 35px 0 0 15px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     background-color: lightgray;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     padding: 30px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     width: 20%;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     height: 76%;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     border: 1px solid black;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     border-radius: 5px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Title

        driver.findElement(By.id("cssCode")).sendKeys("#title {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     margin-top: 10px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     color: #3995BF;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Run code

        Thread.sleep(2000);
        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);

        // input

        driver.findElement(By.id("cssCode")).sendKeys("input {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     outline: 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     padding: 5px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     margin: 10px 0 20px 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     border: 1px solid skyblue;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     text-align: center;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     cursor: pointer;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Label

        driver.findElement(By.id("cssCode")).sendKeys("label {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     margin: 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Form

        driver.findElement(By.id("cssCode")).sendKeys("form {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     margin-top: 30px;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Run code

        Thread.sleep(2000);
        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);

        // Animation

        driver.findElement(By.id("cssCode")).sendKeys("@keyframes spin {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     0% {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     transform: rotate(0deg);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     50% {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     transform: rotate(360deg);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     100% {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     transform: rotate(-360deg);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("     }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("cssCode")).sendKeys("}");

        // Run code

        Thread.sleep(2000);
        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);

        /* JS AREA */

        driver.findElement(By.xpath("//*//ul[@id='toggle']//li[@class='toggle selected' and contains(text(), 'JAVASCRIPT')]")).click();
        Thread.sleep(2000);

        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById(\"submit\").onmouseover = function() {\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("this.style.background = \"lightgreen\";\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById(\"submit\").onmouseleave =\n" +
                "function() {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("this.style.background=\"#EBEBEB\";\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('submit').onclick = function() {\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('wrapper').innerHTML = 'Signed Up Successfully!';\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('wrapper').style.color = 'green';\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('wrapper').style.height = '20px';\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('wrapper').style.border = 'green';\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('wrapper').style.background = 'skyblue';\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Filling the new Form

        // Identifiers

        driver.findElement(By.id("jsCode")).sendKeys("/* Filling the new form */\n");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var firstName_input = document.getElementById('first-name');");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var lastName_input = document.getElementById('last-name');");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var email_input = document.getElementById('email');");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var pass_input = document.getElementById('pass');");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var confirm_input = document.getElementById('confirm');");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Indexes

        driver.findElement(By.id("jsCode")).sendKeys("var index_firstName = 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var index_lastName = 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var index_email = 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var index_pass = 0;");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Values

        driver.findElement(By.id("jsCode")).sendKeys("var type_firstName = \"Anatoly\";");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var type_lastName = \"Makeyev\";");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var type_email = \"anatoly.makeyev@gmail.com\";");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("var type_pass = \"password\";");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Functions

        // First name

        driver.findElement(By.id("jsCode")).sendKeys("window.set_firstName = function() {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    if (index_firstName <= type_firstName.length) {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        firstName_input.value = type_firstName.substr(0, index_firstName++);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        setTimeout(\"set_firstName()\", 50);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("set_firstName();");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Last name

        driver.findElement(By.id("jsCode")).sendKeys("window.set_lastName = function() {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    if (index_lastName <= type_lastName.length) {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        lastName_input.value = type_lastName.substr(0, index_lastName++);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        setTimeout(\"set_lastName()\", 50);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("set_lastName();");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Email

        driver.findElement(By.id("jsCode")).sendKeys("window.set_email = function() {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    if (index_email <= type_email.length) {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        email_input.value = type_email.substr(0, index_email++);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        setTimeout(\"set_email()\", 50);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("set_email();");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Password

        driver.findElement(By.id("jsCode")).sendKeys("window.set_pass = function() {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    if (index_pass <= type_pass.length) {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        pass_input.value = type_pass.substr(0, index_pass++);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        setTimeout(\"set_pass()\", 50);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("set_pass();");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Confirm password

        driver.findElement(By.id("jsCode")).sendKeys("window.set_confirm = function() {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    if (index_pass <= type_pass.length) {");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        confirm_input.value = type_pass.substr(0, index_pass++);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("        setTimeout(\"set_confirm()\", 50);");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("    }");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("}");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        driver.findElement(By.id("jsCode")).sendKeys("set_confirm();");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);


        // Run code

        Thread.sleep(2000);
        driver.findElement(By.id("run")).click();
        Thread.sleep(4000);

        /* JS AREA */

        driver.findElement(By.id("jsCode")).sendKeys("document.getElementById('submit').click();");
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.delay(500);
        robot.keyRelease(KeyEvent.VK_ENTER);

        // Run code

        driver.findElement(By.id("run")).click();
        Thread.sleep(2000);

        /* JS AREA */

        driver.findElement(By.id("jsCode")).sendKeys("alert(' \\n\\n                THANKS FOR WATCHING! \\n\\n <~~ Click on Makeyka for more details');");

        // Run code

        Thread.sleep(2000);
        driver.findElement(By.id("run")).click();



    Thread.sleep(5000);

    }
}

