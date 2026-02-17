import { test } from "@base-test";
import Assert from "@framework/playwright/asserts/Assert";
import DuckDuckGoPage from "@duckduckgo/pages/DuckDuckGoPage";

test("DuckDuckGo Search - Search Selenium then Playwright", async ({ page }) => {
    const ddg = new DuckDuckGoPage(page);

    await test.step("(1) Navigate to DuckDuckGo and verify title", async () => {
        await ddg.gotoHome();
        await ddg.assertTitleContains("DuckDuckGo");
    });

    await test.step("(2) Verify search input is visible/enabled/empty", async () => {
        await ddg.assertSearchInputDefaultState();
    });

    await test.step("(3) Enter 'Selenium' and verify input value", async () => {
        await ddg.enterSearchText("Selenium");
        await Assert.assertEquals(await ddg.getSearchValue(), "Selenium", "Search input value after fill");
    });

    await test.step("(4) Submit search with ENTER", async () => {
        await ddg.submitSearchWithEnter();
    });

    await test.step("(5) Verify URL contains query parameter for Selenium", async () => {
        await page.waitForURL((url) => url.toString().toLowerCase().includes("q=selenium"), { timeout: 15000 });
        const currentUrl = page.url();
        await Assert.assertTrue(
            currentUrl.toLowerCase().includes("q=selenium"),
            "URL contains query parameter q=Selenium",
        );
    });

    await test.step("(6) Wait for results container visible", async () => {
        await ddg.waitForResults();
        await Assert.assertTrue(
            await page.locator(DuckDuckGoPage.RESULTS_CONTAINER).isVisible(),
            "Results container is visible",
        );
    });

    await test.step("(7) Assert at least one result item visible", async () => {
        const results = ddg.getResultItems();
        await results.first().waitFor({ state: "visible" });
        const count = await results.count();
        await Assert.assertTrue(count > 0, "At least one search result item is displayed");
    });

    await test.step(
        "(8) Assert first result title/snippet contains 'selenium' (case-insensitive) and is non-empty",
        async () => {
            const titleText = await ddg.getFirstResultTitleText();
            const snippetText = await ddg.getFirstResultSnippetText();
            const combined = `${titleText}\n${snippetText}`.trim();

            await Assert.assertTrue(combined.length > 0, "First result has non-empty title or snippet text");
            await Assert.assertContainsIgnoreCase(combined, "selenium", "First result contains Selenium in title/snippet");
        },
    );

    await test.step("(9) Assert search input still contains 'Selenium'", async () => {
        await Assert.assertEquals(await ddg.getSearchValue(), "Selenium", "Search input retains Selenium");
    });

    await test.step("(10) Clear, enter 'Playwright', and submit", async () => {
        await ddg.replaceSearchText("Playwright");
        await ddg.submitSearchWithEnter();
    });

    await test.step(
        "(11) Wait for results refreshed and validate first result contains 'playwright'",
        async () => {
            await page.waitForURL((url) => url.toString().toLowerCase().includes("q=playwright"), { timeout: 15000 });
            await ddg.waitForResults();

            const results = ddg.getResultItems();
            await results.first().waitFor({ state: "visible" });
            const count = await results.count();
            await Assert.assertTrue(count > 0, "At least one Playwright search result item is displayed");

            const titleText = await ddg.getFirstResultTitleText();
            const snippetText = await ddg.getFirstResultSnippetText();
            const combined = `${titleText}\n${snippetText}`.trim();

            await Assert.assertTrue(combined.length > 0, "First Playwright result has non-empty title or snippet");
            await Assert.assertContainsIgnoreCase(combined, "playwright", "First result contains Playwright in title/snippet");
        },
    );

    await test.step("(12) Final responsiveness check", async () => {
        const input = ddg.getSearchInput();
        await input.waitFor({ state: "visible" });
        await Assert.assertTrue(await input.isVisible(), "Search input remains visible");
        await Assert.assertTrue(await input.isEnabled(), "Search input remains enabled");
        await Assert.assertEquals(await ddg.getSearchValue(), "Playwright", "Search input retains Playwright");
    });
});
