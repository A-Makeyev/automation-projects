using System;
using System.Diagnostics;
using System.Threading;
using FlaUI.Core;
using FlaUI.Core.AutomationElements;
using FlaUI.Core.Conditions;
using FlaUI.UIA3;

class Program
{
    static void Main()
    {
        // Launch Windows Calculator via shell (safe for UWP apps)
        var startInfo = new ProcessStartInfo(
            "explorer.exe", 
            "shell:AppsFolder\\Microsoft.WindowsCalculator_8wekyb3d8bbwe!App")
        {
            UseShellExecute = true
        };
        Process.Start(startInfo);

        // Wait for the calculator to load
        Thread.Sleep(1500);

        using var automation = new UIA3Automation();
        var calcWindow = RetryFindWindow(automation);

        if (calcWindow == null)
        {
            Console.WriteLine("❌ Calculator window not found.");
            return;
        }

        // Create a condition factory to search UI elements
        var cf = new ConditionFactory(new UIA3PropertyLibrary());

        // Find the "Nine" button and click it
        var nine = calcWindow.FindFirstDescendant(cf.ByName("Nine"))?.AsButton();
        if (nine == null)
        {
            Console.WriteLine("❌ 'Nine' button not found.");
            return;
        }

        nine.Invoke();
        Console.ReadLine(); // Pause
    }

    static Window? RetryFindWindow(UIA3Automation automation)
    {
        for (int i = 0; i < 10; i++)
        {
            foreach (var window in automation.GetDesktop().FindAllChildren())
            {
                if (window.Name?.Contains("Calculator") == true)
                    return window.AsWindow();
            }
            Thread.Sleep(500);
        }
        return null;
    }
}
