import test, { expect, Page } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import DuckDuckGoPage from "@duckduckgoPages/DuckDuckGoPage";
import DuckDuckGoConstants from "@duckduckgoConstants/DuckDuckGoConstants";
import TestListener from "@logger/TestListener";

export default class DuckDuckGoSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    public async launchDuckDuckGo() {
        await test.step("Navigate to DuckDuckGo", async () => {
            TestListener.log("Navigating to DuckDuckGo");
            await this.ui.goto("https://duckduckgo.com/", DuckDuckGoConstants.DUCKDUCKGO_HOME);
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async verifyHomePageTitle() {
        await test.step("Verify DuckDuckGo page title", async () => {
            const title = await this.page.title();
            await Assert.assertContains(title, "DuckDuckGo", "Page Title");
        });
    }

    public async verifySearchInputDefaultState() {
        await test.step("Verify search input default state", async () => {
            const search = this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first();
            await search.waitFor({ state: "visible" });
            await expect(search, `${DuckDuckGoConstants.SEARCH_INPUT} should be visible`).toBeVisible();
            await expect(search, `${DuckDuckGoConstants.SEARCH_INPUT} should be enabled`).toBeEnabled();

            const value = await search.inputValue();
            await Assert.assertEquals(value, "", `${DuckDuckGoConstants.SEARCH_INPUT} default value`);
        });
    }

    public async enterSearchTermAndVerifyValue(term: string) {
        await test.step(`Enter search term '${term}' and verify value`, async () => {
            const edit = this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT);
            await edit.fill(term);

            const currentValue = await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().inputValue();
            await Assert.assertEquals(currentValue, term, `${DuckDuckGoConstants.SEARCH_INPUT} value`);
        });
    }

    public async submitSearchWithEnter() {
        await test.step("Submit search with Enter key", async () => {
            await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().press(DuckDuckGoConstants.ENTER_KEY);
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async verifyUrlContainsQuery(term: string) {
        await test.step(`Verify URL contains query for '${term}'`, async () => {
            await this.page.waitForURL(/duckduckgo\.com\//i, { timeout: 15000 });
            const url = this.page.url();
            const encodedTerm = encodeURIComponent(term);

            const queryPresent =
                url.toLowerCase().includes(`${DuckDuckGoConstants.QUERY_PARAM_KEY}=${encodedTerm}`.toLowerCase()) ||
                url.toLowerCase().includes(encodedTerm.toLowerCase()) ||
                url.toLowerCase().includes(`${DuckDuckGoConstants.QUERY_PARAM_KEY}=${term}`.toLowerCase());

            await Assert.assertTrue(queryPresent, `URL contains search query for '${term}'`);
        });
    }

    public async waitForResultsContainer() {
        await test.step("Wait for results container", async () => {
            const container = this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER).first();
            await container.waitFor({ state: "visible", timeout: 20000 });
            await expect(container, `${DuckDuckGoConstants.RESULTS_CONTAINER} should be visible`).toBeVisible();
        });
    }

    public async verifyAtLeastOneResultVisible() {
        await test.step("Verify at least one result is visible", async () => {
            const results = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
            await results.first().waitFor({ state: "visible", timeout: 20000 });

            const count = await results.count();
            await Assert.assertTrue(count > 0, "At least one search result is present");
            await expect(results.first(), `${DuckDuckGoConstants.RESULT_ITEM} should be visible`).toBeVisible();
        });
    }

    public async verifyFirstResultContainsTerm(term: string) {
        await test.step(`Verify first result contains '${term}' in title or snippet`, async () => {
            const title = this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE).first();
            const snippet = this.page.locator(DuckDuckGoPage.FIRST_RESULT_SNIPPET).first();
            const titleOrSnippet = this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE_OR_SNIPPET).first();

            await titleOrSnippet.waitFor({ state: "visible", timeout: 20000 });

            const titleText = (await title.textContent())?.trim() ?? "";
            const snippetText = (await snippet.textContent())?.trim() ?? "";
            const combined = `${titleText} ${snippetText}`.trim();

            await Assert.assertTrue(combined.length > 0, `${DuckDuckGoConstants.FIRST_RESULT} has non-empty text`);

            const includesTerm = combined.toLowerCase().includes(term.toLowerCase());
            await Assert.assertTrue(includesTerm, `${DuckDuckGoConstants.FIRST_RESULT} contains term '${term}'`);
        });
    }

    public async verifySearchInputRetainsValue(term: string) {
        await test.step(`Verify search input retains value '${term}'`, async () => {
            const currentValue = await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().inputValue();
            await Assert.assertEquals(currentValue, term, `${DuckDuckGoConstants.SEARCH_INPUT} retains value`);
        });
    }

    public async clearAndSearchNewTerm(term: string) {
        await test.step(`Clear search input and search '${term}'`, async () => {
            const search = this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT);
            await search.fill("");
            await search.fill(term);

            const currentValue = await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().inputValue();
            await Assert.assertEquals(currentValue, term, `${DuckDuckGoConstants.SEARCH_INPUT} updated value`);

            await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().press(DuckDuckGoConstants.ENTER_KEY);
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async verifyResultsUpdatedForTerm(term: string) {
        await test.step(`Verify results updated for '${term}'`, async () => {
            await this.waitForResultsContainer();
            await this.verifyAtLeastOneResultVisible();

            const firstResultText = (
                (await this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE_OR_SNIPPET).first().textContent()) ?? ""
            ).trim();

            await Assert.assertTrue(firstResultText.length > 0, `${DuckDuckGoConstants.FIRST_RESULT} has text`);
            await Assert.assertContainsIgnoreCase(firstResultText, term, `${DuckDuckGoConstants.FIRST_RESULT} relevance`);
        });
    }

    public async verifyPageResponsive() {
        await test.step("Final responsiveness check", async () => {
            await expect(this.page, "Page should not be closed/crashed").not.toBeClosed();

            const search = this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first();
            await expect(search, `${DuckDuckGoConstants.SEARCH_INPUT} should still be visible`).toBeVisible();
            await expect(search, `${DuckDuckGoConstants.SEARCH_INPUT} should still be enabled`).toBeEnabled();

            const results = this.page.locator(DuckDuckGoPage.RESULT_ITEMS).first();
            await expect(results, "First result should still be visible").toBeVisible();
        });
    }
}
