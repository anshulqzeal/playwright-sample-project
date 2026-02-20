import { test, expect } from "@base-test";
import DuckDuckGoSteps from "../duckduckgo/steps/DuckDuckGoSteps";

let duckDuckGo: DuckDuckGoSteps;

test.beforeEach(async ({ page }) => {
  duckDuckGo = new DuckDuckGoSteps(page);
});

test(`DuckDuckGo - search Selenium then Playwright`, async ({ page }) => {
  await duckDuckGo.launchApplication("https://duckduckgo.com");
  await duckDuckGo.verifyHomeLoadedByTitle();

  await duckDuckGo.verifySearchInputDefaultState();

  await duckDuckGo.enterQueryAndVerifyValue("Selenium");
  await duckDuckGo.submitSearchWithEnter();

  await test.step("Verify URL contains query parameter for Selenium", async () => {
    await expect(page).toHaveURL(/\?.*q=Selenium/i);
  });

  await duckDuckGo.waitForResults();
  await duckDuckGo.verifyAtLeastOneResult();
  await duckDuckGo.verifyFirstResultContainsKeyword("Selenium");
  await duckDuckGo.verifySearchInputValue("Selenium");

  await duckDuckGo.clearAndSearch("Playwright");

  await test.step("Verify URL contains query parameter for Playwright", async () => {
    await expect(page).toHaveURL(/\?.*q=Playwright/i);
  });

  await duckDuckGo.verifyResultsContainKeyword("Playwright");
  await duckDuckGo.verifyPageResponsive();
});
