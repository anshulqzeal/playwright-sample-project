import DuckDuckGoSteps from "@duckduckgoSteps/DuckDuckGoSteps";
import { test } from "@base-test";

// Note: Assertions are implemented inside DuckDuckGoSteps using the framework's Assert + Playwright expect.

test("DuckDuckGo - search Selenium then Playwright", async ({ page }) => {
    const duck = new DuckDuckGoSteps(page);

    await duck.launchDuckDuckGo();
    await duck.verifyHomePageTitle();
    await duck.verifySearchInputDefaultState();

    await duck.enterSearchTermAndVerifyValue("Selenium");
    await duck.submitSearchWithEnter();
    await duck.verifyUrlContainsQuery("Selenium");
    await duck.waitForResultsContainer();
    await duck.verifyAtLeastOneResultVisible();
    await duck.verifyFirstResultContainsTerm("Selenium");
    await duck.verifySearchInputRetainsValue("Selenium");

    await duck.clearAndSearchNewTerm("Playwright");
    await duck.verifyUrlContainsQuery("Playwright");
    await duck.verifyResultsUpdatedForTerm("Playwright");

    await duck.verifyPageResponsive();
});
