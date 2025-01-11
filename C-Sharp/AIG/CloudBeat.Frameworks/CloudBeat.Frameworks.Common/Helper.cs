using CloudBeat.Frameworks.Common.Enums;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using System;

namespace CloudBeat.Frameworks.Common
{
    public static class Helper
    {
        private const string DEFAULT_SELENIUM_URL = "http://localhost:4437/wd/hub";

        public static Uri GetSeleniumUrl(TestContext testContext) => new Uri(testContext.Properties["SeleniumUrl"]?.ToString() ?? DEFAULT_SELENIUM_URL);

        public static ICapabilities GetSeleniumCapabilities(TestContext testContext)
        {
            switch (GetBrowserTypeFromArgs(testContext))
            {
                case BrowserType.Chrome:
                    return new ChromeOptions().ToCapabilities();
                case BrowserType.Firefox:
                    return new FirefoxOptions().ToCapabilities();
                case BrowserType.IE:
                    return new InternetExplorerOptions().ToCapabilities();
                default:
                    return new ChromeOptions().ToCapabilities();
            }
        }

        private static BrowserType GetBrowserTypeFromArgs(TestContext testContext)
        {
            var browserName = testContext.Properties["browserName"]?.ToString();
            foreach (var enumName in Enum.GetNames(typeof(BrowserType)))
            {
                if (browserName != null && browserName.Contains(enumName, StringComparison.InvariantCultureIgnoreCase))
                {
                    return Enum.Parse<BrowserType>(enumName);
                }
            }

            return BrowserType.Chrome;
        }
    }
}
