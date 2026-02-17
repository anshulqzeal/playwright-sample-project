import type { Locator, Page } from "@playwright/test";

export default class DuckDuckGoHomePage {
    readonly page: Page;

    // Core search/result locators
    static readonly SEARCH_INPUT = "input[name='q']";
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links .result";
    static readonly FIRST_RESULT_TITLE = "#links .result:first-child a[data-testid='result-title-a']";
    static readonly FIRST_RESULT_SNIPPET = "#links .result:first-child [data-result='snippet']";

    // Provided locator mapping (CTA/Extension/SAD sections)
    static readonly CTA_SECTION = ".homepage-cta-section_ctaSection__V5TiC";
    static readonly CTA_TITLE = ".homepage-cta-section_title__yh7tH";
    static readonly EXTENSION_BROWSER_LIST = "id=desktopssg:extensionbrowser";
    static readonly EXTENSION_BROWSER_CARD_1 = ".cta-cards_card__v9a4R";
    static readonly EXTENSION_BROWSER_CARD_2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly DOWNLOAD_BUTTON = "id=desktopssg:download";
    static readonly SAD_BROWSER_LIST = "id=desktopssg:sadbrowser";
    static readonly SET_AS_DEFAULT_BUTTON = "linkText=Set As Default Search";
    static readonly SAD_EXTENSION_LIST = "id=desktopssg:sadextension";
    static readonly SAD_EXTENSION_CARD_1 = ".cta-cards_card__v9a4R";
    static readonly SAD_EXTENSION_CARD_2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly SAD_LIST = "id=desktopssg:sad";

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string = "https://duckduckgo.com/"): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState("domcontentloaded");
    }

    getSearchInput(): Locator {
        return this.page.locator(DuckDuckGoHomePage.SEARCH_INPUT);
    }

    async fillSearch(text: string): Promise<void> {
        await this.getSearchInput().fill(text);
    }

    async clearSearch(): Promise<void> {
        await this.getSearchInput().fill("");
    }

    async pressEnterOnSearch(): Promise<void> {
        await this.getSearchInput().press("Enter");
    }

    async waitForResults(): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
        await this.getResultsContainer().waitFor({ state: "visible" });
    }

    getResultsContainer(): Locator {
        return this.page.locator(DuckDuckGoHomePage.RESULTS_CONTAINER);
    }

    getResultItems(): Locator {
        return this.page.locator(DuckDuckGoHomePage.RESULT_ITEMS);
    }

    async getResultsCount(): Promise<number> {
        return await this.getResultItems().count();
    }

    getFirstResultTitle(): Locator {
        return this.page.locator(DuckDuckGoHomePage.FIRST_RESULT_TITLE);
    }

    getFirstResultSnippet(): Locator {
        return this.page.locator(DuckDuckGoHomePage.FIRST_RESULT_SNIPPET);
    }

    async getFirstResultText(): Promise<string> {
        const title = (await this.getFirstResultTitle().innerText().catch(() => "")).trim();
        const snippet = (await this.getFirstResultSnippet().innerText().catch(() => "")).trim();
        return `${title}\n${snippet}`.trim();
    }

    // --- Provided locator mapping methods (exactly one method per provided locator) ---

    getCtaSection(): Locator {
        return this.page.locator(DuckDuckGoHomePage.CTA_SECTION);
    }

    getCtaTitle(): Locator {
        return this.page.locator(DuckDuckGoHomePage.CTA_TITLE);
    }

    getExtensionBrowserList(): Locator {
        return this.page.locator(DuckDuckGoHomePage.EXTENSION_BROWSER_LIST);
    }

    getExtensionBrowserCard1(): Locator {
        return this.page.locator(DuckDuckGoHomePage.EXTENSION_BROWSER_CARD_1);
    }

    getExtensionBrowserCard2(): Locator {
        return this.page.locator(DuckDuckGoHomePage.EXTENSION_BROWSER_CARD_2);
    }

    clickDownloadButton(): Promise<void> {
        return this.page.locator(DuckDuckGoHomePage.DOWNLOAD_BUTTON).click();
    }

    getSadBrowserList(): Locator {
        return this.page.locator(DuckDuckGoHomePage.SAD_BROWSER_LIST);
    }

    clickSetAsDefaultButton(): Promise<void> {
        return this.page.locator(DuckDuckGoHomePage.SET_AS_DEFAULT_BUTTON).click();
    }

    getSadExtensionList(): Locator {
        return this.page.locator(DuckDuckGoHomePage.SAD_EXTENSION_LIST);
    }

    getSadExtensionCard1(): Locator {
        return this.page.locator(DuckDuckGoHomePage.SAD_EXTENSION_CARD_1);
    }

    getSadExtensionCard2(): Locator {
        return this.page.locator(DuckDuckGoHomePage.SAD_EXTENSION_CARD_2);
    }

    getSadList(): Locator {
        return this.page.locator(DuckDuckGoHomePage.SAD_LIST);
    }
}
