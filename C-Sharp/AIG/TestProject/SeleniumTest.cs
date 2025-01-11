using System;
using OpenQA.Selenium;
using System.Threading;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using CloudBeat.Frameworks.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

// var options = new ChromeOptions();
// options.AddArguments("--start-maximized");
// options.AddArguments("--disable-web-security");
// options.AddArguments("--allow-insecure-localhost");
// options.AddArguments("--ignore-urlfetcher-cert-requests");
// IWebDriver _driver = new ChromeDriver(options);

// Link to the test in cloudbeat
// http://eqa.cloudbeat.io/#/cases/805/52715

namespace TestProject {
    [TestClass]
    public class SeleniumTest : CBTest {

        const string LAST_NAME = "מקייב";
        const string FIRST_NAME = "אנטולי";
        const string URL = @"https://www.aig.co.il";

        static string generatePhone() {
            Random rand = new Random();
            var number = rand.Next(0, 1000000);
            return "0502" + number.ToString("000000");
        }

        static void click(string type, string locator) {
            WebDriverWait wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(60));
            wait.IgnoreExceptionTypes(typeof(NoSuchElementException));

            try {
                switch (type) {
                    case "XPath":
                        wait.Until(e => e.FindElement(By.XPath(locator)));
                        if (_driver.FindElement(By.XPath(locator)).Displayed) {
                            _driver.FindElement(By.XPath(locator)).Click();
                        }
                        break;

                    case "ID":
                        wait.Until(e => e.FindElement(By.Id(locator)));
                        if (_driver.FindElement(By.Id(locator)).Displayed) {
                            _driver.FindElement(By.Id(locator)).Click();
                        }
                        break;
                }

            } catch(Exception) {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Element " + locator + " was not found");
            }
        }

        public SeleniumTest() : base() { }
        
        [TestMethod]
        [TestCategory("Car Insurance")]
         public void CarInsurance() {

            WebDriverWait wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(60));
            wait.IgnoreExceptionTypes(typeof(NoSuchElementException));

            // locators 
            string startCarForm = "//div[@class='bttn' and text()='רכב']";
            string mainHeader = "//div[@class='wpb_wrapper']//h1";
            string onlineOffer = "//a[contains(text(), 'לחצו כאן להצעה אונליין')]";
            string carOwnerHeader = "//h1[text()='בעל הרכב']";


            StartStep("Open AIG Main Page");

            _driver.Navigate().GoToUrl(URL);
            _driver.Manage().Window.Maximize();

            EndStep("Open AIG Main Page");


            StartStep("Open Car Insurance Form");
            click("XPath", startCarForm);

            wait.Until(e => e.FindElement(By.XPath(mainHeader)));
            Assert.AreEqual(_driver.FindElement(By.XPath(mainHeader)).Text, "ביטוח רכב ב-AIG");

            EndStep("Open Car Insurance Form");


            StartStep("Open Car Insurance Offer");

            click("XPath", onlineOffer);
            click("ID", "btn-get-offer");

            wait.Until(e => e.FindElement(By.XPath(carOwnerHeader)));
            Assert.IsTrue(_driver.FindElement(By.XPath(carOwnerHeader)).Displayed);

            EndStep("Open Car Insurance Offer");


            StartStep("Fill Insurance Details");

            click("ID", "img-male");
            click("ID", "insuranceDate_1");

            wait.Until(e => e.FindElement(By.Id("lastName")));
            _driver.FindElement(By.Id("lastName")).SendKeys(LAST_NAME);

            Thread.Sleep(500);
            _driver.FindElement(By.Id("lastName")).SendKeys(Keys.Tab);

            wait.Until(e => e.FindElement(By.Id("firstName")));
            _driver.FindElement(By.Id("firstName")).SendKeys(FIRST_NAME);

            click("ID", "continue-btn");
            _driver.FindElement(By.Id("mobilePhone")).SendKeys(generatePhone());
            click("ID", "continue-btn");

            // CAPTCHA!

            EndStep("Fill Insurance Details");


            Thread.Sleep(3003);
            _driver.Quit();
        } 
        

        [TestMethod]
        [TestCategory("House Insurance")]
        public void HouseInsurance() {

            WebDriverWait wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(60));
            wait.IgnoreExceptionTypes(typeof(NoSuchElementException));

            // locators 
            string startHouseForm = "//div[@class='bttn' and text()='דירה']";
            string mainHeader = "//h1[contains(text(), 'ביטוח דירה')]";
            string onlineOffer = "//a[contains(text(), 'לחצו כאן להצעה אונליין')]";
            string firstProduct = "(//a[contains(@id, 'productType')])[1]";


            StartStep("Open AIG Main Page");

            _driver.Navigate().GoToUrl(URL);
            _driver.Manage().Window.Maximize();

            EndStep("Open AIG Main Page");


            StartStep("Open House Insurance Info");

            click("XPath", startHouseForm);

            EndStep("Open House Insurance Info");


            StartStep("Open House Insurance Form");

            click("XPath", onlineOffer);

            wait.Until(e => e.FindElement(By.XPath(mainHeader)));
            Assert.AreEqual(_driver.FindElement(By.XPath(mainHeader)).Displayed, true);

            Thread.Sleep(1500);
            click("ID", "action-btn");

            EndStep("Open House Insurance Form");


            StartStep("Fill Insurance Details");

            click("XPath", firstProduct);

            wait.Until(e => e.FindElement(By.Id("lastName")));
            _driver.FindElement(By.Id("lastName")).SendKeys(LAST_NAME);

            Thread.Sleep(500);
            _driver.FindElement(By.Id("lastName")).SendKeys(Keys.Tab);

            wait.Until(e => e.FindElement(By.Id("firstName")));
            _driver.FindElement(By.Id("firstName")).SendKeys(FIRST_NAME);

            click("ID", "action-btn");
            _driver.FindElement(By.Id("mobilePhone")).SendKeys(generatePhone());
            click("ID", "action-btn");

            // CAPTCHA!

            EndStep("Fill Insurance Details");


            Thread.Sleep(3003);
            _driver.Quit();

        }
    }
}
