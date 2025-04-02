import { test } from '@playwright/test';
import { LoginPage } from '../../pages/Login';

test.describe('Login', () => {
  test('Standard user login behaviour', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Open login page', async () => {
      await loginPage.open();
      await loginPage.assertPageOpen();
    });

    await test.step('Enter valid credentials', async () => {
      await loginPage.enterUsername('standard_user');
      await loginPage.enterPassword('secret_sauce');
    });

    await test.step('Submit login and verify success', async () => {
      await loginPage.pressLoginButton();
      await loginPage.assertLoginSuccess();
    });
  });

  test('Locked out user login behaviour', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Open login page', async () => {
      await loginPage.open();
      await loginPage.assertPageOpen();
    });

    await test.step('Enter locked out user credentials', async () => {
      await loginPage.enterUsername('locked_out_user');
      await loginPage.enterPassword('secret_sauce');
    });

    await test.step('Submit login and verify error', async () => {
      await loginPage.pressLoginButton();
      await loginPage.assertLoginErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    });
  });

  test('Invalid user login behaviour', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Open login page', async () => {
      await loginPage.open();
      await loginPage.assertPageOpen();
    });

    await test.step('Enter invalid credentials', async () => {
      await loginPage.enterUsername('invalid_user');
      await loginPage.enterPassword('invalid_password');
    });

    await test.step('Submit login and verify error', async () => {
      await loginPage.pressLoginButton();
      await loginPage.assertLoginErrorMessage('Epic sadface: Username and password do not match any user in this service');
    });
  });
});