import { expect, type Locator, type Page } from "@playwright/test";

export default class DuckDuckGoSearchPage {
    static readonly SEARCH_INPUT = "css=input#searchbox_input";
    static readonly SEARCH_RESULTS_CONTAINER = "css=section[data-testid='mainline']";
    static readonly SEARCH_RESULTS = "css=div[data-testid='result']";
    static readonly FIRST_RESULT_TITLE = "css=div[data-testid='result'] h2";

    constructor(private readonly page: Page) {}

    async navigateTo(): Promise<void> {
        await this.page.goto("https://duckduckgo.com");
    }

    getSearchInput(): Locator {
        return this.page.locator(DuckDuckGoSearchPage.SEARCH_INPUT);
    }

    async verifySearchInputDefaultState(): Promise<void> {
        const input = this.getSearchInput();
        await expect(input).toBeVisible();
        await expect(input).toBeEnabled();
        await expect(input).toHaveValue("");
    }

    async enterSearchText(text: string): Promise<void> {
        const input = this.getSearchInput();
        await input.fill(text);
        await expect(input).toHaveValue(text);
    }

    async submitSearchWithEnter(): Promise<void> {
        await this.getSearchInput().press("Enter");
    }

    async clearSearchInput(): Promise<void> {
        const input = this.getSearchInput();
        await input.click();

        // Robust clear: select-all then backspace (handles cases where fill("") is prevented)
        const modifier = process.platform === "darwin" ? "Meta" : "Control";
        await input.press(`${modifier}+A`);
        await input.press("Backspace");

        // Ensure empty; fallback to fill if needed.
        if ((await input.inputValue()) !== "") {
            await input.fill("");
        }
        await expect(input).toHaveValue("");
    }

    async waitForResults(): Promise<void> {
        await expect(this.page.locator(DuckDuckGoSearchPage.SEARCH_RESULTS_CONTAINER)).toBeVisible();
    }

    getResults(): Locator {
        return this.page.locator(DuckDuckGoSearchPage.SEARCH_RESULTS);
    }

    getFirstResultTitle(): Locator {
        return this.page.locator(DuckDuckGoSearchPage.FIRST_RESULT_TITLE).first();
    }
}
