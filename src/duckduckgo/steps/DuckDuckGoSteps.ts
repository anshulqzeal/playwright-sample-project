import { expect, Page } from "@playwright/test";
import DuckDuckGoPage from "../pages/DuckDuckGoPage";
import UIActions from "../../framework/playwright/actions/UIActions";
import Assert from "../../framework/playwright/asserts/Assert";
import StringUtil from "../../framework/utils/StringUtil";

export default class DuckDuckGoSteps {
  private actions: UIActions;

  constructor(private page: Page) {
    this.actions = new UIActions(page);
  }

  public async launch(): Promise<void> {
    await this.actions.goto("https://duckduckgo.com", "DuckDuckGo Home Page");
    await this.actions.waitForDomContentLoaded();
  }

  public async assertTitleContainsDuckDuckGo(): Promise<void> {
    const title = await this.page.title();
    await Assert.assertContains(title, "DuckDuckGo", "Page title");
  }

  public async assertSearchInputReadyAndEmpty(): Promise<void> {
    const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);

    await expect(searchInput, "Search input should be visible").toBeVisible();
    await expect(searchInput, "Search input should be enabled").toBeEnabled();

    const value = await searchInput.inputValue();
    await Assert.assertEquals(value, "", "Search input default value");
  }

  public async enterSearchTextAndAssertValue(text: string): Promise<void> {
    const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
    await expect(searchInput).toBeVisible();

    await searchInput.fill(text);
    await this.assertSearchBoxValue(text);
  }

  public async submitWithEnter(): Promise<void> {
    await this.actions.keyPress("Enter", "ENTER key");
    await this.actions.waitForDomContentLoaded();
  }

  public async assertUrlContainsQuery(text: string): Promise<void> {
    const url = this.page.url();
    const encoded = encodeURIComponent(text);

    // DuckDuckGo typically uses `?q=<query>`; allow either encoded or plus-space forms.
    const plusEncoded = StringUtil.replaceAll(encoded, "%20", "+");

    const hasQuery =
      url.includes(`q=${encoded}`) ||
      url.includes(`q=${plusEncoded}`) ||
      url.toLowerCase().includes(`q=${text.toLowerCase()}`);

    await Assert.assertTrue(hasQuery, `URL contains query parameter for '${text}'`);
  }

  public async waitForResultsVisible(): Promise<void> {
    const results = this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER);
    await expect(results, "Results container should be visible").toBeVisible();
  }

  public async assertAtLeastOneResult(): Promise<void> {
    const items = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
    await expect(items.first(), "At least one result item should be visible").toBeVisible();

    const count = await items.count();
    await Assert.assertTrue(count > 0, "At least one result item is displayed");
  }

  public async assertFirstResultContainsKeyword(keyword: string): Promise<void> {
    const firstResult = this.page.locator(DuckDuckGoPage.RESULT_ITEMS).first();
    await expect(firstResult, "First result should be visible").toBeVisible();

    const combinedText = (await firstResult.innerText()).trim();
    await Assert.assertTrue(combinedText.length > 0, "First result has non-empty text");

    const matches = combinedText.toLowerCase().includes(keyword.toLowerCase());
    await Assert.assertTrue(
      matches,
      `First result contains keyword '${keyword}' (case-insensitive) in title/snippet`,
    );
  }

  public async assertSearchBoxValue(text: string): Promise<void> {
    const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
    await expect(searchInput).toBeVisible();
    const value = await searchInput.inputValue();
    await Assert.assertEquals(value, text, "Search input value");
  }

  public async clearAndSearch(text: string): Promise<void> {
    const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
    await expect(searchInput).toBeVisible();

    await searchInput.fill("");
    await this.enterSearchTextAndAssertValue(text);
    await this.submitWithEnter();
  }

  public async assertPageResponsive(): Promise<void> {
    await Assert.assertTrue(!this.page.isClosed(), "Page is not closed");

    const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
    await expect(searchInput, "Search input should remain visible").toBeVisible();
    await expect(searchInput, "Search input should remain enabled").toBeEnabled();
  }
}
