import { Locator, Page } from '@playwright/test';
import { URL } from '../test-data/constants';


export class LoginPage {
    page: Page;
    username_text_field: Locator;
    password_text_field: Locator;
    login_button: Locator;
    error_message_text: Locator;

    constructor(page) {
        this.page = page;
        this.username_text_field = page.locator('[data-test="username"]');
        this.password_text_field = page.locator('[data-test="password"]');
        this.login_button = page.locator('[data-test="login-button"]');
        this.error_message_text = page.locator('[data-test="error"]');
    }

    async goToLoginPage(){
        await this.page.goto(URL.loginPage);
    }

    async login(username, password){
        await this.username_text_field.fill(username);
        await this.password_text_field.fill(password);
        await this.login_button.click();
    }
}


