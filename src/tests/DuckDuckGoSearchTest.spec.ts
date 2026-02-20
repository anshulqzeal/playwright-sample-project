import { test } from "@base-test";
import Allure from "@allure";

import DuckDuckGoSteps from "@uiSteps/DuckDuckGoSteps";

test(`DuckDuckGo - Search Selenium then Playwright`, async ({ page }) => {
    Allure.attachDetails(
        "DuckDuckGo search flow: validate search input defaults, search Selenium then Playwright, and verify results update.",
        "N/A"
    );

    const duck = new DuckDuckGoSteps(page);

    await test.step("1. Navigate to DuckDuckGo and verify page title", async () => {
        await duck.launch("https://duckduckgo.com/");
        await duck.verifyTitleContains("DuckDuckGo");
    });

    await test.step(
        "2. Verify search input is present, visible, enabled, and empty by default",
        async () => {
            await duck.verifySearchInputStateEmptyVisibleEnabled();
        }
    );

    await test.step(
        "3. Enter 'Selenium' into search input and verify entered value",
        async () => {
            await duck.enterSearch("Selenium");
            await duck.verifySearchValue("Selenium");
        }
    );

    await test.step("4. Submit search using ENTER", async () => {
        await duck.submitSearchByEnter();
    });

    await test.step(
        "5. Verify page URL updates and contains search query parameter for Selenium",
        async () => {
            await duck.verifyUrlContainsQuery("Selenium");
        }
    );

    await test.step("6. Wait for results container to be displayed", async () => {
        await duck.waitForResults();
    });

    await test.step("7. Verify at least one search result item is displayed", async () => {
        await duck.verifyAtLeastOneResult();
    });

    await test.step(
        "8. Verify first result contains non-empty text and includes 'Selenium' in title/snippet",
        async () => {
            await duck.verifyFirstResultContains("Selenium");
        }
    );

    await test.step(
        "9. Verify search input field still contains 'Selenium' after results load",
        async () => {
            await duck.verifySearchValuePersists("Selenium");
        }
    );

    await test.step(
        "10. Clear search input, search 'Playwright', and submit via ENTER",
        async () => {
            await duck.clearSearch();
            await duck.enterSearch("Playwright");
            await duck.verifySearchValue("Playwright");
            await duck.submitSearchByEnter();
        }
    );

    await test.step(
        "11. Verify results update and first result is related to Playwright",
        async () => {
            await duck.verifyUrlContainsQuery("Playwright");
            await duck.waitForResults();
            await duck.verifyAtLeastOneResult();
            await duck.verifyFirstResultContains("Playwright");
        }
    );

    await test.step(
        "12. Verify no unexpected errors and page remains responsive",
        async () => {
            await page.waitForLoadState("domcontentloaded");

            const searchInput = page.locator("#searchbox_input").first();
            await searchInput.waitFor({ state: "visible" });

            const enabled = await searchInput.isEnabled();
            if (!enabled) {
                throw new Error("Search input became disabled at end of test");
            }

            if (page.isClosed()) {
                throw new Error("Page was unexpectedly closed at end of test");
            }
        }
    );
});
