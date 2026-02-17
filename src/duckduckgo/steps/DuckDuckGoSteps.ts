import type { Page } from "@playwright/test";
import { expect } from "@base-test";
import DuckDuckGoHomePage from "../pages/DuckDuckGoHomePage";

export default class DuckDuckGoSteps {
    readonly page: Page;
    readonly home: DuckDuckGoHomePage;

    constructor(page: Page) {
        this.page = page;
        this.home = new DuckDuckGoHomePage(page);
    }

    async launchDuckDuckGo(): Promise<void> {
        await this.home.navigate("https://duckduckgo.com/");
    }

    async verifyHomePageLoaded(): Promise<void> {
        await expect(this.page).toHaveTitle(/DuckDuckGo/i);
        await expect(this.home.getSearchInput()).toBeVisible();
    }

    async verifySearchInputDefaultState(): Promise<void> {
        const input = this.home.getSearchInput();
        await expect(input).toBeVisible();
        await expect(input).toBeEnabled();
        await expect(input).toHaveValue("");
    }

    async enterSearchTextAndVerifyValue(text: string): Promise<void> {
        await this.home.fillSearch(text);
        await expect(this.home.getSearchInput()).toHaveValue(text);
    }

    async submitSearchWithEnter(): Promise<void> {
        await Promise.all([
            this.page.waitForLoadState("domcontentloaded"),
            this.home.pressEnterOnSearch(),
        ]);
    }

    async verifyUrlContainsQuery(text: string): Promise<void> {
        const encoded = encodeURIComponent(text);
        await expect(this.page).toHaveURL(new RegExp(`[?&]q=${encoded}(&|$)`, "i"));
    }

    async waitForResultsDisplayed(): Promise<void> {
        await this.home.waitForResults();
        await expect(this.home.getResultsContainer()).toBeVisible();
    }

    async verifyAtLeastOneResult(): Promise<void> {
        const count = await this.home.getResultsCount();
        expect(count).toBeGreaterThan(0);
    }

    async verifyFirstResultMentions(text: string): Promise<void> {
        const title = (await this.home.getFirstResultTitle().innerText().catch(() => "")).trim();
        const snippet = (await this.home.getFirstResultSnippet().innerText().catch(() => "")).trim();

        expect(title.length + snippet.length).toBeGreaterThan(0);

        const needle = text.toLowerCase();
        const combined = `${title}\n${snippet}`.toLowerCase();
        expect(combined).toContain(needle);
    }

    async verifySearchBoxRetainsValue(text: string): Promise<void> {
        await expect(this.home.getSearchInput()).toHaveValue(text);
    }

    async searchFor(text: string): Promise<void> {
        await this.home.clearSearch();
        await expect(this.home.getSearchInput()).toHaveValue("");
        await this.enterSearchTextAndVerifyValue(text);
        await this.submitSearchWithEnter();
        await this.verifyUrlContainsQuery(text);
        await this.waitForResultsDisplayed();
    }

    async verifyResultsRelatedTo(text: string): Promise<void> {
        await this.verifyAtLeastOneResult();
        await this.verifyFirstResultMentions(text);
    }

    async verifyPageResponsive(): Promise<void> {
        expect(this.page.isClosed()).toBeFalsy();
        await expect(this.home.getSearchInput()).toBeEnabled();
        await expect(this.home.getResultsContainer()).toBeVisible();
    }
}
