import { test, expect } from "@base-test";
import DuckDuckGoSteps from "../duckduckgo/steps/DuckDuckGoSteps";

test.describe("DuckDuckGo Search E2E", () => {
  let ddg: DuckDuckGoSteps;

  test.beforeEach(async ({ page }) => {
    ddg = new DuckDuckGoSteps(page);
  });

  test("DuckDuckGo_Search_Selenium_Then_Playwright", async ({ page }) => {
    await test.step("1. Navigate to DuckDuckGo and verify title contains DuckDuckGo", async () => {
      await ddg.navigateToHome();
      await ddg.verifyTitleContainsDuckDuckGo();
      await expect(page).toHaveTitle(/DuckDuckGo/i);
    });

    await test.step(
      "2. Verify search input is present, visible, enabled, and empty by default",
      async () => {
        await ddg.verifySearchInputDefaultState();
      }
    );

    await test.step("3. Enter Selenium and verify entered value matches", async () => {
      await ddg.enterSearchTextAndVerify("Selenium");
    });

    await test.step("4. Submit the search using the ENTER key", async () => {
      await ddg.submitSearchWithEnter();
    });

    await test.step("5. Verify URL contains search query parameter for Selenium", async () => {
      await ddg.verifyUrlContainsQuery("Selenium");
      await expect(page.url()).toContain("q=Selenium");
    });

    await test.step("6. Wait for the search results container to be displayed", async () => {
      await ddg.waitForResultsContainer();
    });

    await test.step("7. Verify at least one search result item is displayed", async () => {
      await ddg.verifyAtLeastOneResultDisplayed();
    });

    await test.step(
      "8. Verify first search result has non-empty text and includes Selenium (case-insensitive)",
      async () => {
        await ddg.verifyFirstResultContainsQueryInTitleOrSnippet("Selenium");
      }
    );

    await test.step("9. Verify search input still contains Selenium after results load", async () => {
      await ddg.verifySearchInputRetainsValue("Selenium");
    });

    await test.step("10. Clear input, search for Playwright, and submit", async () => {
      await ddg.clearAndSearchNewQuery("Playwright");
    });

    await test.step("11. Verify results update and at least one result related to Playwright", async () => {
      await ddg.verifyUrlContainsQuery("Playwright");
      await ddg.verifyResultsContainQuery("Playwright");
    });

    await test.step("12. Verify no unexpected errors and page remains responsive", async () => {
      await ddg.finalResponsivenessCheck();
    });
  });
});
