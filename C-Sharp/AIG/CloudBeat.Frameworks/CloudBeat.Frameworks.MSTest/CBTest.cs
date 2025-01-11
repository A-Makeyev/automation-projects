using CloudBeat.Frameworks.MSTest.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.Events;
using OpenQA.Selenium.Support.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CloudBeat.Frameworks.MSTest
{
    [TestClass]
    public abstract class CBTest : IDisposable
    {
        public TestContext TestContext { get; set; }

        private static TestContext _context;

        private static Dictionary<string, List<StepModel>> _testSteps;

        public static EventFiringWebDriver _driver;

        public CBTest()
        {
            _testSteps = new Dictionary<string, List<StepModel>>();
        }

        public static void InitContext(TestContext context)
        {
            _context = context;
        }

        [TestInitialize]
        public void TestInitialize()
        {
            InitContext(TestContext);
            InitWebDriver(new CBWebDriver(TestContext));
        }

        public static void InitWebDriver(IWebDriver driver)
        {
            if (driver == null)
            {
                return;
            }

            _driver = new EventFiringWebDriver(driver);
            SubscribeToEvents();
        }

        private static void SubscribeToEvents()
        {
            _driver.ElementValueChanging += ElementValueChanging;
            _driver.ElementValueChanged += ElementValueChanged;

            _driver.FindingElement += FindingElement;
            _driver.FindElementCompleted += FindElementCompleted;

            _driver.Navigating += Navigating;
            _driver.Navigated += Navigated;

            _driver.NavigatingBack += NavigatingBack;
            _driver.NavigatedBack += NavigatedBack;

            _driver.NavigatingForward += NavigatingForward;
            _driver.NavigatedForward += NavigatedForward;
        }

        private static void NavigatedForward(object sender, WebDriverNavigationEventArgs e)
        {
            EndStep($"Navigate forward to {e.Url}");
        }

        private static void NavigatingForward(object sender, WebDriverNavigationEventArgs e)
        {
            StartStep($"Navigate forward to {e.Url}");
        }

        private static void NavigatedBack(object sender, WebDriverNavigationEventArgs e)
        {
            EndStep($"Navigate back to {e.Url}");
        }

        private static void NavigatingBack(object sender, WebDriverNavigationEventArgs e)
        {
            StartStep($"Navigate back to {e.Url}");
        }

        private static void Navigated(object sender, WebDriverNavigationEventArgs e)
        {
            long? loadEvent = null;
            long? domContentLoadedEvent = null;

            try 
            {
                loadEvent = _driver.ExecuteJavaScript<long>("return (window.performance.timing.loadEventStart - window.performance.timing.navigationStart)");
                domContentLoadedEvent = _driver.ExecuteJavaScript<long>("return (window.performance.timing.domContentLoadedEventStart - window.performance.timing.navigationStart)");
            }
            catch { }
            
            EndStep($"Navigate to {e.Url}", loadEvent: loadEvent, domContentLoadedEvent: domContentLoadedEvent);
        }

        private static void Navigating(object sender, WebDriverNavigationEventArgs e)
        {
            StartStep($"Navigate to {e.Url}");
        }

        private static void FindElementCompleted(object sender, FindElementEventArgs e)
        {
            EndStep($"Finding element {e.FindMethod}");
        }

        private static void FindingElement(object sender, FindElementEventArgs e)
        {
            StartStep($"Finding element {e.FindMethod}");
        }

        private static void ElementValueChanged(object sender, WebElementValueEventArgs e)
        {
            if (e.Element != null && e.Element.Text != null)
            {
                EndStep($"Value of element {e.Element.Text} changed to {e.Value}");
            }
        }

        private static void ElementValueChanging(object sender, WebElementValueEventArgs e)
        {
            if (e.Element != null && e.Element.Text != null)
            {
                StartStep($"Value of element {e.Element.Text} changed to {e.Value}");
            }
        }

        public static void StartStep(string name)
        {
            var newStep = new StepModel
            {
                Name = name,
                IsFinished = false,
                Steps = new List<StepModel>(),
                StartTime = DateTime.Now
            };

            var testName = _context.TestName;
            if (_testSteps.ContainsKey(testName))
            {
                var steps = _testSteps[testName];
                var currentStep = steps.FirstOrDefault(x => !x.IsFinished);

                while (currentStep != null)
                {
                    steps = currentStep.Steps;
                    currentStep = steps.FirstOrDefault(x => !x.IsFinished);
                }

                steps.Add(newStep);
                return;
            }

            _testSteps.Add(testName, new List<StepModel>
            {
                newStep
            });
        }

        public static void EndStep(string name, bool isSuccess = true, long? loadEvent = null, long? domContentLoadedEvent = null)
        {
            var testName = _context.TestName;
            if (!_testSteps.ContainsKey(testName))
            {
                return;
            }

            var steps = _testSteps[testName];
            var currentStep = steps.FirstOrDefault(x => !x.IsFinished);

            if (currentStep == null)
            {
                return;
            }

            while (currentStep.Name != name)
            {
                steps = currentStep.Steps;
                currentStep = steps.FirstOrDefault(x => !x.IsFinished);

                if (currentStep == null)
                {
                    return;
                }
            }

            FinishStep(currentStep, isSuccess, loadEvent, domContentLoadedEvent);


            while (currentStep != null)
            {
                FinishStep(currentStep, isSuccess, loadEvent, domContentLoadedEvent);
                steps = currentStep.Steps;
                currentStep = steps.FirstOrDefault(x => !x.IsFinished);
            }
        }

        private static void FinishStep(StepModel currentStep, bool isSuccess, long? loadEvent = null, long? domContentLoadedEvent = null)
        {
            currentStep.IsSuccess = isSuccess;
            currentStep.IsFinished = true;
            currentStep.LoadEvent = loadEvent;
            currentStep.DomContentLoadedEvent = domContentLoadedEvent;
            currentStep.Duration = (DateTime.Now - currentStep.StartTime).TotalMilliseconds;
        }

        [TestCleanup]
        public virtual void TestCleanup()
        {
            if (_context == null)
            {
                return;
            }

            if (_testSteps.ContainsKey(_context.TestName))
            {
                var steps = _testSteps[_context.TestName];
                foreach (var step in steps.Where(x => !x.IsFinished))
                {
                    EndStep(step.Name, _context.CurrentTestOutcome != UnitTestOutcome.Failed);
                }

                var stepFile = $"{_context.FullyQualifiedTestClassName}_{_context.TestName}_steps.json";
                File.WriteAllText(stepFile, JsonConvert.SerializeObject(steps));
                _context.AddResultFile(stepFile);
                _testSteps.Remove(_context.TestName);
            }

            if (_context.CurrentTestOutcome == UnitTestOutcome.Failed && _driver != null)
            {
                var screenShotPath = $"{_context.FullyQualifiedTestClassName}.{_context.TestName}.png";
                _driver.GetScreenshot().SaveAsFile(screenShotPath);
                _context.AddResultFile(screenShotPath);
            }

            CleanUpDriver();
        }

        public static void CleanUpDriver()
        {
            try
            {
                _driver.Close();
                _driver.Dispose();
            }
            catch
            { }
        }

        public void Dispose()
        {
            CleanUpDriver();
        }
    }
}
