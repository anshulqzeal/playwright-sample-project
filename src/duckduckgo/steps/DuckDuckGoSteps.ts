import { test, Page } from "@playwright/test";
import UIActions from "../../framework/playwright/actions/UIActions";
import Assert from "../../framework/playwright/asserts/Assert";
import DuckDuckGoPage from "../pages/DuckDuckGoPage";
import DuckDuckGoConstants from "../constants/DuckDuckGoConstants";

export default class DuckDuckGoSteps {
  private uiActions: UIActions;

  constructor(private page: Page) {
    this.uiActions = new UIActions(page);
  }

  public async launchDuckDuckGo() {
    await test.step("Launch DuckDuckGo", async () => {
      await this.uiActions.goto("https://duckduckgo.com", DuckDuckGoConstants.HOME_PAGE);
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  public async verifyHomePageTitle() {
    await test.step("Verify DuckDuckGo page title", async () => {
      const title = await this.page.title();
      await Assert.assertContains(
        title,
        DuckDuckGoConstants.EXPECTED_TITLE_SUBSTRING,
        "Page title",
      );
    });
  }

  public async verifySearchInputDefaultState() {
    await test.step("Verify search input default state", async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await searchInput.waitFor({ state: "visible" });

      const isVisible = await searchInput.isVisible();
      const isEnabled = await searchInput.isEnabled();
      const currentValue = await searchInput.inputValue();

      await Assert.assertTrue(isVisible, `${DuckDuckGoConstants.SEARCH_INPUT} is visible`);
      await Assert.assertTrue(isEnabled, `${DuckDuckGoConstants.SEARCH_INPUT} is enabled`);
      await Assert.assertEquals(currentValue, "", `${DuckDuckGoConstants.SEARCH_INPUT} is empty`);
    });
  }

  public async enterSearchTermAndVerify(term: string) {
    await test.step(`Enter search term '${term}' and verify`, async () => {
      await this.uiActions.editBox(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT).fill(term);
      const value = await this.uiActions
        .element(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT)
        .getInputValue();
      await Assert.assertEquals(value, term, `${DuckDuckGoConstants.SEARCH_INPUT} value`);
    });
  }

  public async submitSearchWithEnter() {
    await test.step("Submit search using ENTER", async () => {
      await this.page.waitForLoadState("domcontentloaded");
      await this.uiActions.keyPress(DuckDuckGoConstants.ENTER_KEY, "ENTER key");
    });
  }

  public async verifyUrlContainsSearchQuery(term: string) {
    await test.step(`Verify URL contains search query for '${term}'`, async () => {
      await this.page.waitForURL(
        (url) =>
          url.toString().includes(DuckDuckGoConstants.QUERY_PARAM_EXPECTATION) &&
          url.searchParams.get(DuckDuckGoConstants.QUERY_PARAM_KEY)?.toLowerCase() === term.toLowerCase(),
        { timeout: 15000 },
      );

      const currentUrl = this.page.url();
      await Assert.assertContains(currentUrl, DuckDuckGoConstants.QUERY_PARAM_EXPECTATION, "Current URL");
      await Assert.assertContainsIgnoreCase(currentUrl, term, "Current URL includes search term");
    });
  }

  public async waitForResultsToLoad() {
    await test.step("Wait for results to load", async () => {
      await this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER).waitFor({
        state: "visible",
        timeout: 15000,
      });
    });
  }

  public async verifyAtLeastOneResultDisplayed() {
    await test.step("Verify at least one search result is displayed", async () => {
      const results = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
      await results.first().waitFor({ state: "visible", timeout: 15000 });
      const count = await results.count();
      await Assert.assertTrue(count > 0, `${DuckDuckGoConstants.RESULT_ITEMS} count > 0`);
    });
  }

  public async verifyFirstResultContainsTerm(term: string) {
    await test.step(`Verify first result contains '${term}'`, async () => {
      const titleText = await this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE).innerText();
      const snippetLocator = this.page.locator(DuckDuckGoPage.FIRST_RESULT_SNIPPET);
      const snippetText = (await snippetLocator.count()) > 0 ? await snippetLocator.first().innerText() : "";

      const combined = `${titleText} ${snippetText}`.trim();
      await Assert.assertTrue(combined.length > 0, `${DuckDuckGoConstants.FIRST_RESULT} has non-empty text`);
      await Assert.assertContainsIgnoreCase(combined, term, `${DuckDuckGoConstants.FIRST_RESULT} relevance`);
    });
  }

  public async verifySearchInputRetainsValue(expected: string) {
    await test.step(`Verify search input retains value '${expected}'`, async () => {
      const value = await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).inputValue();
      await Assert.assertEquals(value, expected, `${DuckDuckGoConstants.SEARCH_INPUT} retains value`);
    });
  }

  public async clearAndSearchNewTerm(term: string) {
    await test.step(`Clear search input and search for '${term}'`, async () => {
      await this.uiActions.editBox(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT).fill("");
      const emptyValue = await this.page.locator(DuckDuckGoPage.SEARCH_INPUT).inputValue();
      await Assert.assertEquals(emptyValue, "", `${DuckDuckGoConstants.SEARCH_INPUT} cleared`);

      await this.enterSearchTermAndVerify(term);
      await this.submitSearchWithEnter();
      await this.verifyUrlContainsSearchQuery(term);
      await this.waitForResultsToLoad();
    });
  }

  public async verifyResultsContainTerm(term: string) {
    await test.step(`Verify results contain '${term}'`, async () => {
      await this.verifyAtLeastOneResultDisplayed();
      await this.verifyFirstResultContainsTerm(term);
      await this.verifySearchInputRetainsValue(term);
    });
  }

  public async verifyPageResponsive() {
    await test.step("Verify page remains responsive", async () => {
      await Assert.assertTrue(!this.page.isClosed(), "Page is not closed");
      const input = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await input.waitFor({ state: "visible" });
      await Assert.assertTrue(await input.isEnabled(), "Search input is enabled");
    });
  }
}
