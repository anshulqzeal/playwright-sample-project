import { test, expect } from "@base-test";
import DuckDuckGoPage from "@pages/DuckDuckGoPage";

test.describe("DuckDuckGo Search", () => {
  test("DuckDuckGo search - Selenium then Playwright", async ({ page }) => {
    const ddg = new DuckDuckGoPage(page);

    await test.step("Navigate to DuckDuckGo and verify title", async () => {
      await ddg.navigateToHome("https://duckduckgo.com");
      await ddg.waitForPageReady();
      await expect(page).toHaveTitle(/DuckDuckGo/i);
    });

    await test.step("Verify search input present/visible/enabled and empty by default", async () => {
      await ddg.verifySearchInputStateVisibleEnabledEmpty();
    });

    await test.step("Search for Selenium and validate query persistence and results", async () => {
      await ddg.enterSearch("Selenium");

      await ddg.submitSearchWithEnter();

      await test.step("Verify URL contains Selenium query parameter", async () => {
        // DuckDuckGo uses query parameter `q`; URL encoding may vary.
        const url = page.url();
        expect(url).toMatch(/\bq=Selenium\b|\bq=Selenium%/i);
      });

      await ddg.waitForResultsContainerVisible();

      await test.step("Verify at least one result is displayed", async () => {
        await expect(ddg.searchResults.first()).toBeVisible();
        const count = await ddg.getResultsCount();
        expect(count).toBeGreaterThan(0);
      });

      await test.step("Verify first result contains Selenium (case-insensitive)", async () => {
        const titleText = await ddg.getFirstResultTitleText();

        if (titleText) {
          expect(titleText).toMatch(/selenium/i);
        } else {
          const firstResultText = ((await ddg.searchResults.first().textContent()) ?? "").trim();
          expect(firstResultText, "First result container should have non-empty text").not.toEqual("");
          expect(firstResultText).toMatch(/selenium/i);
        }
      });

      await test.step("Verify search input still contains Selenium", async () => {
        await expect(ddg.searchInput).toHaveValue("Selenium");
      });
    });

    await test.step("Search for Playwright and validate updated results", async () => {
      await ddg.clearSearch();
      await ddg.enterSearch("Playwright");

      await ddg.submitSearchWithEnter();

      await test.step("Wait for updated results and verify at least one result", async () => {
        await ddg.waitForResultsContainerVisible();
        await expect(ddg.searchResults.first()).toBeVisible();
        const count = await ddg.getResultsCount();
        expect(count).toBeGreaterThan(0);
      });

      await test.step("Verify first result contains Playwright (case-insensitive)", async () => {
        const titleText = await ddg.getFirstResultTitleText();

        if (titleText) {
          expect(titleText).toMatch(/playwright/i);
        } else {
          const firstResultText = ((await ddg.searchResults.first().textContent()) ?? "").trim();
          expect(firstResultText, "First result container should have non-empty text").not.toEqual("");
          expect(firstResultText).toMatch(/playwright/i);
        }
      });

      await test.step("Verify search input still contains Playwright", async () => {
        await expect(ddg.searchInput).toHaveValue("Playwright");
      });
    });

    await test.step("Final lightweight responsiveness check", async () => {
      expect(page.isClosed()).toBeFalsy();
      await expect(ddg.searchInput).toBeEnabled();
    });
  });
});
