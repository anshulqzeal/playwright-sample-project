import { test } from "@base-test";
import { expect } from "@playwright/test";
import DuckDuckGoSearchPage from "@pages/DuckDuckGoSearchPage";

test("DuckDuckGoSearch - validates input, URL, and results for Selenium and Playwright", async ({ page }) => {
    const duck = new DuckDuckGoSearchPage(page);
    const pageErrors: Error[] = [];

    page.on("pageerror", (err) => {
        pageErrors.push(err);
    });

    await test.step("1) Navigate to duckduckgo and assert title contains 'DuckDuckGo'", async () => {
        await duck.navigateTo();
        await expect(page).toHaveTitle(/DuckDuckGo/i);
    });

    await test.step("2) Verify search input state (present/visible/enabled/empty)", async () => {
        await duck.verifySearchInputDefaultState();
    });

    await test.step("3) Fill 'Selenium' and assert input value equals 'Selenium'", async () => {
        await duck.enterSearchText("Selenium");
        await expect(duck.getSearchInput()).toHaveValue("Selenium");
    });

    await test.step("4) Press Enter to submit search", async () => {
        await duck.submitSearchWithEnter();
    });

    await test.step("5) Assert URL contains query parameter for Selenium", async () => {
        await expect(page).toHaveURL(/q=Selenium/i);
        expect(decodeURIComponent(page.url())).toContain("Selenium");
    });

    await test.step("6) Wait for results container", async () => {
        await duck.waitForResults();
    });

    await test.step("7) Assert at least one result is displayed", async () => {
        const results = duck.getResults();
        await expect(results.first()).toBeVisible();
        await expect(results).toHaveCountGreaterThan(0);
    });

    await test.step("8) Assert first result is non-empty and contains 'selenium' (case-insensitive)", async () => {
        const firstResult = duck.getResults().first();
        const firstResultText = (await firstResult.innerText()).trim();
        expect(firstResultText.length).toBeGreaterThan(0);
        expect(firstResultText.toLowerCase()).toContain("selenium");
    });

    await test.step("9) Assert search input still has value 'Selenium'", async () => {
        await expect(duck.getSearchInput()).toHaveValue("Selenium");
    });

    await test.step("10) Clear input, fill 'Playwright', and submit", async () => {
        await duck.clearSearchInput();
        await duck.enterSearchText("Playwright");
        await duck.submitSearchWithEnter();
    });

    await test.step("11) Wait for results update and assert first result contains 'playwright' (case-insensitive)", async () => {
        await duck.waitForResults();
        const results = duck.getResults();
        await expect(results.first()).toBeVisible();
        await expect(results).toHaveCountGreaterThan(0);

        const firstResultText = ((await results.first().innerText()) || "").trim();
        expect(firstResultText.length).toBeGreaterThan(0);
        expect(firstResultText.toLowerCase()).toContain("playwright");
    });

    await test.step("12) Final responsiveness + no uncaught page errors", async () => {
        await expect(duck.getSearchInput()).toBeEnabled();
        await expect(page.locator(DuckDuckGoSearchPage.SEARCH_RESULTS_CONTAINER)).toBeVisible();
        expect(pageErrors).toHaveLength(0);
    });
});
