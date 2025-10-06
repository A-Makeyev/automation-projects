using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;

namespace AppiumTests
{
    public class SettingsTest
    {
        private AndroidDriver? driver;
        private const string AppiumServerUrl = "http://127.0.0.1:4723/";

        [SetUp]
        public void Setup()
        {
            try
            {
                var options = new AppiumOptions();
                options.PlatformName = "Android";
                options.DeviceName = "emulator-5554";
                options.AutomationName = "UiAutomator2";
                options.AddAdditionalAppiumOption("appPackage", "com.android.settings");
                options.AddAdditionalAppiumOption("appActivity", "com.android.settings.Settings");
                options.AddAdditionalAppiumOption("newCommandTimeout", 60);
                options.AddAdditionalAppiumOption("noReset", true);

                driver = new AndroidDriver(
                    new Uri(AppiumServerUrl),
                    options,
                    TimeSpan.FromSeconds(60)
                );
                Console.WriteLine("Driver initialized successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to initialize driver: {ex.GetType().Name} - {ex.Message}");
                throw;
            }
        }

        [Test]
        public void OpenSettingsTest()
        {
            Assert.IsNotNull(driver, "Driver failed to initialize");
            
            try
            {
                driver!.StartActivity("com.android.settings", "com.android.settings.Settings");

                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                var settingsTitle = wait.Until(ExpectedConditions.ElementIsVisible(
                    MobileBy.XPath("//android.widget.TextView[@text='Settings']")
                ));

                Assert.IsNotNull(settingsTitle, "Settings title not found");

                var el1 = driver.FindElement(MobileBy.Id("com.android.settings:id/search_action_bar"));
                el1.Click();
            }
            catch (Exception ex)
            {
                TestContext.WriteLine($"Test failed: {ex.GetType().Name} - {ex.Message}");
                throw;
            }
        }

        [TearDown]
        public void TearDown()
        {
            try
            {
                driver?.Quit();
            }
            catch (Exception ex)
            {
                TestContext.WriteLine($"Error during teardown: {ex.Message}");
            }
        }
    }
}