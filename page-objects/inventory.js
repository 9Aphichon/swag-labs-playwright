class InventoryPage {
    constructor(page){
        this.page = page;
        this.menu_button = page.getByRole('button', { name: 'Open Menu' });
        this.logout_button = page.getByRole('link', { name: 'Logout' });
        this.add_to_card_sauce_labs_backpack_button = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.add_to_cart_sauce_labs_bike_light_button = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.add_to_cart_sauce_labs_fleece_jacket = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
        this.shopping_cart_button = page.locator('#shopping_cart_container a');
        this.check_out_button = page.locator('[data-test="checkout"]');
        this.first_name_text_field = page.locator('[data-test="firstName"]');
        this.last_name_text_field = page.locator('[data-test="lastName"]');
        this.postal_code_text_field = page.locator('[data-test="postalCode"]');
        this.continue_button = page.locator('[data-test="continue"]');
        this.finish_button = page.locator('[data-test="finish"]');
    }

    async logout(){
        this.menu_button.click();
        this.logout_button.click();
    }

    async getAllProductListInPage(){
        const productListInPage = await this.page.$$eval('.inventory_item', (items) => {
            return items.map((item) => {
                const name = item.querySelector('.inventory_item_name').textContent;
                const price = item.querySelector('.inventory_item_price').textContent;
                const desc = item.querySelector('.inventory_item_desc').textContent;
                const imgSrc = item.querySelector('.inventory_item_img > a > img').getAttribute('src');
                return { name, price, desc, imgSrc };
            });
        });
        return productListInPage
    }

    async addProductsToCart(){
        await this.add_to_card_sauce_labs_backpack_button.click();
        await this.add_to_cart_sauce_labs_bike_light_button.click();
        await this.add_to_cart_sauce_labs_fleece_jacket.click();
    }

    async goToCartPage(){
        await this.shopping_cart_button.click();
    }
    
    async waitProductList(){
        await this.page.waitForSelector('.inventory_item');
    }

    async getAllProductNameInCart(){
        const productNamesInCart = await this.page.$$eval('.cart_contents_container .cart_item .inventory_item_name', (elements) =>
            elements.map((element) => element.innerText)
        );
        return productNamesInCart;
    }

    async clickCheckOutButton(){
        await this.check_out_button.click();
    }

    async getHeaderTextCheckoutInfo(){
        const headerTextCheckoutInfo = await this.page.textContent('.title');
        return headerTextCheckoutInfo;
    }

    async enterFirstName(firstName){
        await this.first_name_text_field.click();
        await this.first_name_text_field.fill(firstName);
    }

    async enterLastName(lastName){
        await this.last_name_text_field.click();
        await this.last_name_text_field.fill(lastName);
    }

    async enterPostalCode(postalCode){
        await this.postal_code_text_field.click();
        await this.postal_code_text_field.fill(postalCode);
    }

    async clickContinueButton(){
        await this.continue_button.click();
    }

    async getHeaderTextCheckoutOverview(){
        const headerTextCheckoutOverview = await this.page.textContent('.title');
        return headerTextCheckoutOverview;
    }

    async getAllProductNamesInCheckoutOverview(){
        const selectedProductNamesInCheckoutOverview = await this.page.$$eval('.checkout_summary_container .cart_item .inventory_item_name', (elements) =>
            elements.map((element) => element.innerText)
        );
        return selectedProductNamesInCheckoutOverview;
    }

    async clickFinishButton(){
        await this.finish_button.click();
    }

    async getCompleteMessage(){
        const completeMessage = await this.page.textContent('.complete-header');
        return completeMessage;
    }

}

module.exports = { InventoryPage };