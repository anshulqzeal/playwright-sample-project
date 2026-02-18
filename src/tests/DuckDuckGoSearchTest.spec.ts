import { expect, test } from "@base-test";
import Allure from "@allure";
import DuckDuckGoSteps from "../duckduckgo/steps/DuckDuckGoSteps";

let ddg: DuckDuckGoSteps;

test.beforeEach(async ({ page }) => {
    ddg = new DuckDuckGoSteps(page);
});

test(`DDG_01 - DuckDuckGo Search (Selenium then Playwright)`, async () => {
    Allure.attachDetails(
        "Search DuckDuckGo for Selenium then Playwright and validate results and page responsiveness.",
        "",
    );

    // 1
    await ddg.launch();

    // 2
    await ddg.assertTitleContainsDuckDuckGo();

    // 3
    await ddg.assertSearchInputReadyAndEmpty();

    // 4
    await ddg.enterSearchTextAndAssertValue("Selenium");

    // 5
    await ddg.submitWithEnter();

    // 6
    await ddg.assertUrlContainsQuery("Selenium");

    // 7
    await ddg.waitForResultsVisible();

    // 8
    await ddg.assertAtLeastOneResult();

    // 9
    await ddg.assertFirstResultContainsKeyword("Selenium");

    // 10
    await ddg.assertSearchBoxValue("Selenium");

    // 11
    await ddg.clearAndSearch("Playwright");
    await ddg.assertUrlContainsQuery("Playwright");
    await ddg.waitForResultsVisible();
    await ddg.assertAtLeastOneResult();

    // Soft check: at least first result text should often include the keyword.
    await expect
        .soft(ddg["assertFirstResultContainsKeyword"]("Playwright"))
        .resolves.toBeUndefined();

    // 12
    await ddg.assertPageResponsive();
});
