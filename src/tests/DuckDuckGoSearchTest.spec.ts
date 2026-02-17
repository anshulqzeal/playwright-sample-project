import { test } from "@base-test";
import DuckDuckGoSteps from "../duckduckgo/steps/DuckDuckGoSteps";

let duck: DuckDuckGoSteps;

test.beforeEach(async ({ page }) => {
  duck = new DuckDuckGoSteps(page);
  await duck.launchDuckDuckGo();
});

test("DuckDuckGo UI Search - Selenium then Playwright", async ({ page }) => {
  await duck.verifyHomePageTitle();
  await duck.verifySearchInputDefaultState();

  await duck.enterSearchTermAndVerify("Selenium");
  await duck.submitSearchWithEnter();
  await duck.verifyUrlContainsSearchQuery("Selenium");

  await duck.waitForResultsToLoad();
  await duck.verifyAtLeastOneResultDisplayed();
  await duck.verifyFirstResultContainsTerm("Selenium");
  await duck.verifySearchInputRetainsValue("Selenium");

  await duck.clearAndSearchNewTerm("Playwright");
  await duck.verifyResultsContainTerm("Playwright");

  await duck.verifyPageResponsive();
  await test.step("Lightweight responsiveness check", async () => {
    await test.expect(page.isClosed()).toBeFalsy();
  });
});
