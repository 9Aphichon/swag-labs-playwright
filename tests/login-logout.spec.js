import { test, expect } from '@playwright/test';
import * as userAccounts from '../test-data/user-accounts';
import { LoginPage } from '../page-objects/login';
import { InventoryPage } from '../page-objects/inventory';
import { URL, ERROR_MESSAGES } from '../test-data/constants';

for (const userAccount in userAccounts) {
    if((userAccounts[userAccount].username !== 'invalid_user') && (userAccounts[userAccount].username !== 'locked_out_user') ){
        test(`valid username/password should login and logout success  : User ${userAccount}`, async ({ page }) => {
            const Login = new LoginPage(page);
            const Inentory = new InventoryPage(page);
            await Login.goToLoginPage();
            await Login.login( userAccounts[userAccount].username, userAccounts[userAccount].password);
            await expect(page).toHaveURL(URL.inventoryPage);
            await Inentory.logout();
            await expect(page).toHaveURL(URL.loginPage);
            await expect(Login.login_button).toHaveCount(1);
        }); 
    }
}

test('locked out user should not be able to log in', async ({ page }) => {
    const Login = new LoginPage(page);
    await Login.goToLoginPage();
    await Login.login(userAccounts.locked_out_user.username, userAccounts.locked_out_user.password);
    await expect(Login.error_message_text).toHaveText(ERROR_MESSAGES.userLockedOut);
});

test('invalid password should not be able to log in', async ({ page }) => {
    const Login = new LoginPage(page);
    await Login.goToLoginPage();
    await Login.login(userAccounts.standard_user.username, userAccounts.invalid_user.password);
    await expect(Login.error_message_text).toHaveText(ERROR_MESSAGES.invalidCredentials);
});

test('invalid username should not be able to log in', async ({ page }) => {
    const Login = new LoginPage(page);
    await Login.goToLoginPage();
    await Login.login(userAccounts.invalid_user.username,  userAccounts.standard_user.password);
    await expect(Login.error_message_text).toHaveText(ERROR_MESSAGES.invalidCredentials);
});

test('invalid username/password should not be able to log in', async ({ page }) => {
    const Login = new LoginPage(page);
    await Login.goToLoginPage();
    await Login.login(userAccounts.invalid_user.username, userAccounts.invalid_user.password);
    await expect(Login.error_message_text).toHaveText(ERROR_MESSAGES.invalidCredentials);
});

test('missing username should not be able to log in', async ({ page }) => {
    const Login = new LoginPage(page);
    await Login.goToLoginPage();
    await Login.login('', userAccounts.standard_user.password);
    await expect(Login.error_message_text).toHaveText(ERROR_MESSAGES.usernameIsRequired);
});

test('missing password should not be able to log in', async ({ page }) => {
    const Login = new LoginPage(page);
    await Login.goToLoginPage();
    await Login.login(userAccounts.standard_user.username, '');
    await expect(Login.error_message_text).toHaveText(ERROR_MESSAGES.passwordIsRequired);
});