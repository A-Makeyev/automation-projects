using CloudBeat.Frameworks.Common;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.Events;
using OpenQA.Selenium.Support.Extensions;
using System;

namespace CloudBeat.Frameworks.MSTest
{
    public class CBWebDriver : EventFiringWebDriver
    {
        private TestContext _context;

        public CBWebDriver(TestContext testContext, ICapabilities capabilities) : base(new RemoteWebDriver(Helper.GetSeleniumUrl(testContext),
                                                                                                           capabilities))
        {
            Initialize(testContext);
        }

        public CBWebDriver(TestContext testContext) : base(new RemoteWebDriver(Helper.GetSeleniumUrl(testContext),
                                                                               Helper.GetSeleniumCapabilities(testContext)))
        {
            Initialize(testContext);
        }

        private void Initialize(TestContext testContext)
        {
            
            _context = testContext;
            this.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);
            this.ExceptionThrown += CloudBeatWebDriver_ExceptionThrown;
        }

        private void CloudBeatWebDriver_ExceptionThrown(object sender, WebDriverExceptionEventArgs e)
        {
            var screenShotPath = $"{_context.FullyQualifiedTestClassName}_{_context.TestName}.png";
            this.TakeScreenshot().SaveAsFile(screenShotPath);
            _context.AddResultFile(screenShotPath);
        }
    }
}
