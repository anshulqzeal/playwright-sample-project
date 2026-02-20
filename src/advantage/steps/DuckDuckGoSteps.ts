import { Page } from "@playwright/test";

import DuckDuckGoPage from "@advPages/DuckDuckGoPage";
import EditBoxActions from "@playwrightActions/EditBoxActions";
import UIElementActions from "@playwrightActions/UIElementActions";
import Assert from "@playwrightAsserts/Assert";

export default class DuckDuckGoSteps {
    private readonly elementActions: UIElementActions;
    private readonly searchInput: EditBoxActions;

    constructor(private readonly page: Page) {
        this.elementActions = new UIElementActions(this.page);
        this.searchInput = new EditBoxActions(this.page).setEditBox(
            DuckDuckGoPage.SEARCH_INPUT,
            "DuckDuckGo Search Input"
        );
    }

    public async launch(url: string) {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        await this.page.waitForLoadState("networkidle");
    }

    public async verifyTitleContains(text: string) {
        const title = await this.page.title();
        await Assert.assertContains(title, text, "DuckDuckGo page title");
    }

    public async verifySearchInputStateEmptyVisibleEnabled() {
        const locator = this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first();
        await locator.waitFor({ state: "visible" });
        await Assert.assertTrue(await locator.isVisible(), "Search input is visible");
        await Assert.assertTrue(await locator.isEnabled(), "Search input is enabled");
        await this.verifySearchValue("");
    }

    public async enterSearch(text: string) {
        await this.searchInput.fill(text);
    }

    public async verifySearchValue(expected: string) {
        const actual = await this.searchInput.getInputValue();
        await Assert.assertEquals(actual, expected, "Search input value");
    }

    public async submitSearchByEnter() {
        await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().press("Enter");
    }

    public async verifyUrlContainsQuery(term: string) {
        await this.page.waitForURL(
            (url) => url.toString().toLowerCase().includes(term.toLowerCase()),
            { waitUntil: "domcontentloaded" }
        );
        const currentUrl = this.page.url();
        await Assert.assertContainsIgnoreCase(
            currentUrl,
            term,
            "Current URL contains search query"
        );
    }

    public async waitForResults() {
        await this.elementActions
            .setElement(
                DuckDuckGoPage.RESULTS_CONTAINER,
                "DuckDuckGo Results Container"
            )
            .waitTillVisible(30);

        await this.page
            .locator(DuckDuckGoPage.RESULT_ITEMS)
            .first()
            .waitFor({ state: "visible" });
    }

    public async verifyAtLeastOneResult() {
        const count = await this.page.locator(DuckDuckGoPage.RESULT_ITEMS).count();
        await Assert.assertTrue(count > 0, "At least one search result is displayed");
    }

    public async verifyFirstResultContains(term: string) {
        const title = (
            await this.elementActions
                .setElement(DuckDuckGoPage.FIRST_RESULT_TITLE, "First result title")
                .getTextContent()
        ).trim();

        const snippetLocator = this.page
            .locator(DuckDuckGoPage.FIRST_RESULT_SNIPPET)
            .first();
        const hasSnippet = (await snippetLocator.count()) > 0;
        const snippet = hasSnippet
            ? ((await snippetLocator.textContent()) ?? "").trim()
            : "";

        const combined = `${title} ${snippet}`.trim();

        await Assert.assertTrue(
            combined.length > 0,
            "First result has non-empty title or snippet"
        );
        await Assert.assertContainsIgnoreCase(
            combined,
            term,
            "First result contains searched term"
        );
    }

    public async clearSearch() {
        const clearBtn = this.page
            .locator(DuckDuckGoPage.CLEAR_SEARCH_BUTTON)
            .first();
        const canClickClear = await clearBtn.isVisible().catch(() => false);

        if (canClickClear) {
            await clearBtn.click();
        } else {
            await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).first().fill("");
        }

        await this.verifySearchValue("");
    }

    public async verifySearchValuePersists(expected: string) {
        await this.page
            .locator(DuckDuckGoPage.SEARCH_INPUT)
            .first()
            .waitFor({ state: "visible" });
        await this.verifySearchValue(expected);
    }
}
