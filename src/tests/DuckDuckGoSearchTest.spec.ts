import { test, expect } from "@base-test";
import DuckDuckGoSteps from "../duckduckgo/steps/DuckDuckGoSteps";

describe("DuckDuckGo Search UI Smoke", () => {
  let ddg: DuckDuckGoSteps;

  test.beforeEach(async ({ page }) => {
    ddg = new DuckDuckGoSteps(page);
  });

  test("DuckDuckGo - Search Selenium then Playwright", async () => {
    await ddg.navigateToDuckDuckGo();
    await ddg.verifyHomePageTitle();

    await ddg.verifySearchInputDefaultState();

    await ddg.enterSearchTextAndVerify("Selenium");
    await ddg.submitSearchWithEnter();
    await ddg.verifyUrlContainsQuery("Selenium");

    await ddg.waitForResultsContainer();
    await ddg.verifyAtLeastOneResultDisplayed();
    await ddg.verifyFirstResultContainsTerm("Selenium");
    await ddg.verifySearchInputValue("Selenium");

    await ddg.clearSearchAndSearchAgain("Playwright");
    await ddg.verifyUrlContainsQuery("Playwright");

    await ddg.waitForResultsContainer();
    await ddg.verifyAtLeastOneResultDisplayed();

    await test.step("Verify results updated and contain 'Playwright' in at least one result", async ({ page }) => {
      const resultsText = (await page.locator("[data-testid='result']").allInnerTexts()).join("\n").toLowerCase();
      expect(resultsText, "At least one result should mention Playwright").toContain("playwright");
    });

    await ddg.verifyPageResponsive();
  });
});
