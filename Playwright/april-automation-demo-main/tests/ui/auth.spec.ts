import { LoginService } from "../../services/LoginService";
import { expect, test } from "../fixtures/auth.fixture";

test.describe('Valid Login', () => {
  test('Login with a test user with a wrong OTP via UI', async ({ loginService, loginPage }) => {
    await loginPage.goto()
    await loginPage.enterEmail(process.env.EMAIL!)
    await loginPage.pressContinue()
    await loginPage.enterPassword(process.env.PASS!)
    await loginPage.pressContinue()

    const otp = await loginService.getOTP()
    console.log('OTP:', otp)

    await loginPage.enterOTP(otp !== null ? otp : process.env.OTP!)
    await loginPage.pressContinue()
    
    await expect(loginPage.errorText).toBeVisible()
    await loginPage.takeScreenshot()
  })
})
