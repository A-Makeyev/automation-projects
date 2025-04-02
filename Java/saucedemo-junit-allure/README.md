# Selenium Java JUnit & Allure Example

A Selenium Java JUnit 5 project for testing the Sauce Demo website with Allure reporting.

![Allure Report](https://github.com/cloudbeat-io/examples-java-junit/blob/main/preview/allure-results.jpg?raw=true)

## Prerequisites
- Java 11+
- Maven 3.6+

## Setup
1. Clone or download this project.
2. Navigate to the project directory:  
   ```sh
   cd selenium-saucedemo-tests
   ```
3. Run the following command to install dependencies:  
   ```sh
   mvn clean install
   ```

## Implementing Allure Reporting

### 1. Add Allure Annotations in Page Methods

Import the annotation:
   ```java
   import io.qameta.allure.Step;
   ```

Annotate your methods:
   ```java
   @Step("Open Base URL")
   public void open() {
       driver.get(baseUrl);
   }
   ```

### 2. Extend Allure JUnit5 Support in Test Classes

Import Allure JUnit extension:
   ```java
   import io.qameta.allure.junit5.AllureJunit5;
   ```

Extend the test class with `@ExtendWith`:
   ```java
   import org.junit.jupiter.api.extension.ExtendWith;

   @ExtendWith({ AllureJunit5.class })
   public class LoginTest {
       private WebDriver driver;
       private LoginPage loginPage;

       @BeforeEach
       public void setUp() {
           driver = DriverManager.getDriver();
           loginPage = new LoginPage(driver);
       }
   }
   ```

### 3. Wrap Test Steps with Allure Logging

   ```java
   import io.qameta.allure.Description;
   import io.qameta.allure.Feature;
   import io.qameta.allure.Step;

   @Test
   @Feature("Login Feature")
   @Description("Standard User Login Behaviour")
   public void standardUserLoginBehaviour() {
       step("Open Main Page", () -> {
           loginPage.open();
           loginPage.assertPageOpen();
       });
   }
   ```

## Running Tests with Allure Reporting
- Run tests:  
   ```sh
   mvn test
   ```
- Generate Allure report:  
   ```sh
   mvn allure:report
   ```
- Serve the report:  
   ```sh
   mvn allure:serve
   ```
- Run tests & serve the report
   ```sh
   mvn clean test allure:serve
   ```

## Project Structure
- `src/main/java/com/saucedemo/pages/` - Page Object classes
- `src/main/java/com/saucedemo/utils/` - Utility classes
- `src/test/java/com/saucedemo/tests/` - Test classes