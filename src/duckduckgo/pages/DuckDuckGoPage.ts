import { Page } from "@playwright/test";
import Assert from "@framework/playwright/asserts/Assert";

export default class DuckDuckGoPage {
    private readonly page: Page;

    // Core
    static readonly HOME_URL = "https://duckduckgo.com/";

    // Search
    static readonly SEARCH_INPUT = "input[name='q']";

    // Results
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links .result";
    static readonly FIRST_RESULT = "#links .result:nth-child(1)";
    static readonly FIRST_RESULT_TITLE = "#links .result:nth-child(1) [data-testid='result-title-a'], #links .result:nth-child(1) h2 a";
    static readonly FIRST_RESULT_SNIPPET = "#links .result:nth-child(1) [data-testid='result-snippet'], #links .result:nth-child(1) [class*='snippet'], #links .result:nth-child(1) .result__snippet";

    // CTA / Homepage sections (mapped for future coverage)
    static readonly CTA_SECTION = ".homepage-cta-section_ctaSection__V5TiC";
    static readonly CTA_TITLE = ".homepage-cta-section_title__yh7tH";
    static readonly EXTENSION_BROWSER_LIST = "#desktopssg\\:extensionbrowser";
    static readonly EXTENSION_BROWSER_CARD_1 = ".cta-cards_card__v9a4R";
    static readonly EXTENSION_BROWSER_CARD_2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly DOWNLOAD_BUTTON = "#desktopssg\\:download";
    static readonly SAD_BROWSER_LIST = "#desktopssg\\:sadbrowser";
    static readonly SET_AS_DEFAULT_BUTTON = "a:has-text('Set As Default Search')";
    static readonly SAD_EXTENSION_LIST = "#desktopssg\\:sadextension";
    static readonly SAD_EXTENSION_CARD_1 = ".cta-cards_card__v9a4R";
    static readonly SAD_EXTENSION_CARD_2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly SAD_LIST = "#desktopssg\\:sad";

    constructor(page: Page) {
        this.page = page;
    }

    public async gotoHome() {
        await this.page.goto(DuckDuckGoPage.HOME_URL, { waitUntil: "domcontentloaded" });
    }

    public async getTitle(): Promise<string> {
        return this.page.title();
    }

    public async assertTitleContains(expected: string) {
        const title = await this.getTitle();
        await Assert.assertContains(title, expected, "DuckDuckGo page title");
    }

    public getSearchInput() {
        return this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
    }

    public async assertSearchInputDefaultState() {
        const input = this.getSearchInput();
        await input.waitFor({ state: "visible" });
        await Assert.assertTrue(await input.isVisible(), "Search input is visible");
        await Assert.assertTrue(await input.isEnabled(), "Search input is enabled");
        await Assert.assertEquals(await input.inputValue(), "", "Search input is empty by default");
    }

    public async enterSearchText(text: string) {
        const input = this.getSearchInput();
        await input.waitFor({ state: "visible" });
        await input.fill(text);
        await Assert.assertEquals(await input.inputValue(), text, `Search input value is set to '${text}'`);
    }

    public async replaceSearchText(text: string) {
        await this.clearSearch();
        await this.enterSearchText(text);
    }

    public async getSearchValue(): Promise<string> {
        const input = this.getSearchInput();
        await input.waitFor({ state: "attached" });
        return input.inputValue();
    }

    public async submitSearchWithEnter() {
        const input = this.getSearchInput();
        await input.waitFor({ state: "visible" });
        await input.press("Enter");
    }

    public async clearSearch() {
        const input = this.getSearchInput();
        await input.waitFor({ state: "visible" });
        await input.fill("");
        await Assert.assertEquals(await input.inputValue(), "", "Search input cleared");
    }

    public async waitForResults(timeout = 15000) {
        await this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER).waitFor({ state: "visible", timeout });
    }

    public getResultItems() {
        return this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
    }

    public async getResultsCount(): Promise<number> {
        await this.waitForResults();
        return this.getResultItems().count();
    }

    public async getFirstResultTitleText(): Promise<string> {
        await this.waitForResults();
        const title = this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE).first();
        await title.waitFor({ state: "visible" });
        return (await title.innerText()).trim();
    }

    public async getFirstResultSnippetText(): Promise<string> {
        await this.waitForResults();
        const snippet = this.page.locator(DuckDuckGoPage.FIRST_RESULT_SNIPPET).first();
        if (await snippet.count()) {
            await snippet.waitFor({ state: "visible" });
            return (await snippet.innerText()).trim();
        }
        return "";
    }
}
