import { test } from '@playwright/test';
import { LoginPage } from '../../pages/Login';
import { ProductsPage } from '../../pages/Products';

test.describe('Products', () => {
  test('Add and remove products from cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await test.step('Login as standard user', async () => {
      await loginPage.open();
      await loginPage.assertPageOpen();
      await loginPage.enterUsername('standard_user');
      await loginPage.enterPassword('secret_sauce');
      await loginPage.pressLoginButton();
      await loginPage.assertLoginSuccess();
    });

    await test.step('Verify product listing', async () => {
      await productsPage.assertProductsCount(6);
    });

    await test.step('Add product to cart', async () => {
      await productsPage.clickAddToCartButton(0);
      await productsPage.assertPriceBarButtonText(0, 'Remove');
    });

    await test.step('Remove product from cart', async () => {
      await productsPage.clickRemoveButton(0);
      await productsPage.assertPriceBarButtonText(0, 'Add to cart');
    });
  });
});