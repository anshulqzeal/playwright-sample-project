import DuckDuckGoSteps from "@duckduckgo/steps/DuckDuckGoSteps";
import Allure from "@allure";
import { test } from "@base-test";

let ddg: DuckDuckGoSteps;

test.beforeEach(async ({ page }) => {
    ddg = new DuckDuckGoSteps(page);
});

test(`DDG_01 - DuckDuckGo Search - Selenium then Playwright`, async () => {
    Allure.attachDetails(
        "DuckDuckGo search flow: validate search input default state, search for Selenium then Playwright and verify results update.",
        ""
    );

    await ddg.launchDuckDuckGo();
    await ddg.verifyHomePageLoaded();

    await ddg.verifySearchInputDefaultState();

    await ddg.enterSearchTextAndVerifyValue("Selenium");
    await ddg.submitSearchWithEnter();
    await ddg.verifyUrlContainsQuery("Selenium");

    await ddg.waitForResultsDisplayed();
    await ddg.verifyAtLeastOneResult();
    await ddg.verifyFirstResultMentions("Selenium");
    await ddg.verifySearchBoxRetainsValue("Selenium");

    await ddg.searchFor("Playwright");
    await ddg.verifyResultsRelatedTo("Playwright");

    await ddg.verifyPageResponsive();
});
