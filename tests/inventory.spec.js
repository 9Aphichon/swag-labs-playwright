import {test, expect} from '@playwright/test';
import * as userAccounts from '../test-data/user-accounts';
import { LoginPage } from '../page-objects/login';
import { InventoryPage } from '../page-objects/inventory';
import { URL } from '../test-data/constants';
import * as products from '../test-data/products';

for (const userAccount in userAccounts) {
    if((userAccounts[userAccount].username === 'standard_user') || (userAccounts[userAccount].username === 'performance_glitch_user') ){
        test(`products list is displayed correctly  : User ${userAccount}`, async ({ page }) => {
            const Login = new LoginPage(page);
            const Inventory = new InventoryPage(page);
            await Login.goToLoginPage();
            await Login.login( userAccounts[userAccount].username, userAccounts[userAccount].password);
            await expect(page).toHaveURL(URL.inventoryPage);
            await page.waitForSelector('.inventory_item');
            const productListInPage = await Inventory.getAllProductListInPage();
            for(const product in products){
                const productTestData = products[product];
                const sameProduct = productListInPage.find(productInPage => productInPage.name === productTestData.name);
                if(sameProduct){
                    expect(sameProduct.name).toEqual(productTestData.name);
                    expect(sameProduct.price).toEqual(productTestData.price);
                    expect(sameProduct.desc).toEqual(productTestData.desc);
                    expect(sameProduct.imgSrc).toEqual(productTestData.imgSrc);
                }
            }
        }); 
    }
}


test('images are not loading for : User problem_user', async ({ page }) => {
    const Login = new LoginPage(page);
    const Inventory = new InventoryPage(page);
    await Login.goToLoginPage();
    await Login.login( userAccounts.problem_user.username, userAccounts.problem_user.password);
    await expect(page).toHaveURL(URL.inventoryPage);
    await page.waitForSelector('.inventory_item');
    const productListInPage = await Inventory.getAllProductListInPage();
    for(const product in products){
        const productTestData = products[product];
        const sameProduct = productListInPage.find(productInPage => productInPage.name === productTestData.name);
        if(sameProduct){
            expect(sameProduct.name).toEqual(productTestData.name);
            expect(sameProduct.price).toEqual(productTestData.price);
            expect(sameProduct.desc).toEqual(productTestData.desc);
            expect(sameProduct.imgSrc).not.toEqual(productTestData.imgSrc);
        }
    }
});

for (const userAccount in userAccounts) {
    if((userAccounts[userAccount].username === 'standard_user') || (userAccounts[userAccount].username === 'performance_glitch_user') || ((userAccounts[userAccount].username === 'problem_user') ) ){
        test(`add product to cart correctly and can checkout Complete : ${userAccounts[userAccount].username}`, async ({ page }) => {
            const Login = new LoginPage(page);
            const Inventory = new InventoryPage(page);
            await Login.goToLoginPage();
            await Login.login( userAccounts[userAccount].username,  userAccounts[userAccount].password);
            await expect(page).toHaveURL(URL.inventoryPage);
            await Inventory.waitProductList();
            await Inventory.addProductsToCart();
            await Inventory.goToCartPage();
            const expectedProductNames = [
                'Sauce Labs Backpack',
                'Sauce Labs Bike Light',
                'Sauce Labs Fleece Jacket'
            ];
            const selectedProductNamesInCart = await Inventory.getAllProductNameInCart();
            expect.soft(selectedProductNamesInCart).toEqual(expectedProductNames);
            await Inventory.clickCheckOutButton();
            const headerTextCheckoutInfo = await Inventory.getHeaderTextCheckoutInfo();
            expect.soft(headerTextCheckoutInfo).toContain('Checkout: Your Information');
            await Inventory.enterFirstName('Aphichon');
            await Inventory.enterLastName('Phattanavasanphon');
            await Inventory.enterPostalCode('11120');
            await Inventory.clickContinueButton();
            const headerTextCheckoutOverview = await Inventory.getHeaderTextCheckoutOverview();
            expect.soft(headerTextCheckoutOverview).toContain('Checkout: Overview');
            const productNamesInCheckoutOverview = await Inventory.getAllProductNamesInCheckoutOverview();
            expect.soft(productNamesInCheckoutOverview).toEqual(expectedProductNames);
            await Inventory.clickFinishButton();
            const completeMessage = await Inventory.getCompleteMessage();
            expect(completeMessage).toContain('Thank you for your order!');
        });
    }
}



