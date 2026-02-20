import { test, expect, Page } from "@base-test";
import UIActions from "@framework/playwright/actions/UIActions";
import DuckDuckGoPage from "../pages/DuckDuckGoPage";

export default class DuckDuckGoSteps {
  private ui: UIActions;

  constructor(private page: Page) {
    this.ui = new UIActions(page);
  }

  public async launchApplication(url: string) {
    await this.ui.goto(url, "DuckDuckGo home page");
    await this.ui.waitForDomContentLoaded();
  }

  public async verifyHomeLoadedByTitle() {
    await test.step("Verify DuckDuckGo home page title", async () => {
      await expect(this.page).toHaveTitle(/DuckDuckGo/i);
    });
  }

  public async verifySearchInputDefaultState() {
    await test.step("Verify search input default state", async () => {
      const input = this.ui.element(DuckDuckGoPage.SEARCH_INPUT, "Search input").getLocator();
      await expect(input).toBeVisible();
      await expect(input).toBeEnabled();
      await expect(input).toHaveValue("");
    });
  }

  public async enterQueryAndVerifyValue(query: string) {
    await this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, "Search input").fill(query);

    await test.step(`Verify entered query value is '${query}'`, async () => {
      const input = this.ui.element(DuckDuckGoPage.SEARCH_INPUT, "Search input").getLocator();
      await expect(input).toHaveValue(query);
    });
  }

  public async submitSearchWithEnter() {
    await this.ui.keyPress("Enter", "ENTER key");

    await test.step("Verify URL updated with search query param", async () => {
      await expect(this.page).toHaveURL(/\?.*q=/i);
    });
  }

  public async waitForResults() {
    await this.ui.element(DuckDuckGoPage.RESULTS_CONTAINER, "Results container").waitTillVisible(15);
  }

  public async verifyAtLeastOneResult() {
    await test.step("Verify at least one result item is displayed", async () => {
      const items = this.ui.element(DuckDuckGoPage.RESULT_ITEMS, "Result items").getLocators();
      await expect(items.first()).toBeVisible();
      await expect(items).toHaveCountGreaterThan(0);
    });
  }

  public async verifyFirstResultContainsKeyword(keyword: string) {
    await test.step(`Verify first result contains keyword '${keyword}'`, async () => {
      const title = this.ui.element(DuckDuckGoPage.FIRST_RESULT_TITLE, "First result title").getLocator();
      const snippet = this.ui
        .element(DuckDuckGoPage.FIRST_RESULT_SNIPPET, "First result snippet")
        .getLocator();

      const titleText = (await title.innerText().catch(() => ""))?.trim();
      const snippetText = (await snippet.innerText().catch(() => ""))?.trim();

      const combined = `${titleText} ${snippetText}`.trim();
      expect(combined.length).toBeGreaterThan(0);
      expect(combined.toLowerCase()).toContain(keyword.toLowerCase());
    });
  }

  public async verifySearchInputValue(query: string) {
    await test.step(`Verify search input still contains '${query}'`, async () => {
      const input = this.ui.element(DuckDuckGoPage.SEARCH_INPUT, "Search input").getLocator();
      await expect(input).toHaveValue(query);
    });
  }

  public async clearAndSearch(query: string) {
    await test.step(`Clear search input and search '${query}'`, async () => {
      const clearButton = this.ui.element(
        DuckDuckGoPage.CLEAR_SEARCH_BUTTON,
        "Clear search button",
      ).getLocator();

      if (await clearButton.isVisible().catch(() => false)) {
        await clearButton.click();
      } else {
        await this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, "Search input").clear();
      }

      await this.enterQueryAndVerifyValue(query);
      await this.submitSearchWithEnter();
      await this.waitForResults();
    });
  }

  public async verifyResultsContainKeyword(keyword: string) {
    await test.step(`Verify results contain keyword '${keyword}'`, async () => {
      await this.verifyAtLeastOneResult();
      await this.verifyFirstResultContainsKeyword(keyword);

      const expected = `q=${encodeURIComponent(keyword)}`;
      expect(this.page.url()).toContain(expected);
    });
  }

  public async verifyPageResponsive() {
    await test.step("Verify page remains responsive", async () => {
      expect(this.page.isClosed()).toBeFalsy();

      const input = this.ui.element(DuckDuckGoPage.SEARCH_INPUT, "Search input").getLocator();
      await expect(input).toBeVisible();
      await expect(input).toBeEnabled();
    });
  }
}
