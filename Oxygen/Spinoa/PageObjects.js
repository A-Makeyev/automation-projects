module.exports = {
	INIT: function() {
		web.init()
		web.open(this.URL)
		web.setTimeout(10000)
	},

    URL: 'https://spinoa.ro/',

    NAV: {
        SHOP: '//ul[@id="menu-main-menu"]//a[text()="SHOP"]',
        INSPIR: '//ul[@id="menu-main-menu"]//a[text()="InSpir"]',
        DESPRE: '//ul[@id="menu-main-menu"]//a[text()="DESPRE"]',
        BLOG: '//ul[@id="menu-main-menu"]//a[text()="BLOG"]',
        CONTACT: '//ul[@id="menu-main-menu"]//a[text()="CONTACT"]',
        ENGLISH: '//ul[@id="menu-main-menu"]//a[@title="English"]',
        CART: '//div[@class="shopping-cart-header add-header-height"]/a'
    },
    
    SHOP: {
        ENGLISH_TEXT: '//h1[contains(text(), "New product range")]',
        FRANCE: '//div[contains(@class, "shop-product")]//a[contains(@href, "france")]',
        BURKINA: '//div[contains(@class, "shop-product")]//a[contains(@href, "burkina")]',
        DISCOVERY: '//div[contains(@class, "shop-product")]//a[contains(@href, "discovery")]',
        ADVENTURER: '//div[contains(@class, "shop-product")]//a[contains(@href, "adventurer")]',
        ITEM: {
            CANTITATE: '//select[@id="cantitate"]',
            ADD: '//button[contains(@class, "single_add_to_cart_button")]',
            PLUS: '//input[@value="+"]',
            MINUS: '//input[@value="-"]'
        }
    }
}