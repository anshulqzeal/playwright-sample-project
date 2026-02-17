import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import DuckDuckGoPage from "../pages/DuckDuckGoPage";
import DuckDuckGoConstants from "../constants/DuckDuckGoConstants";

export default class DuckDuckGoSteps {
  private ui: UIActions;

  constructor(private page: Page) {
    this.ui = new UIActions(page);
  }

  public async navigateToHome() {
    await test.step("Navigate to DuckDuckGo", async () => {
      await this.ui.goto("https://duckduckgo.com", DuckDuckGoConstants.DUCKDUCKGO_HOME_PAGE);
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  public async verifyTitleContainsDuckDuckGo() {
    await test.step("Verify title contains DuckDuckGo", async () => {
      const title = await this.ui.getPageTitle();
      await Assert.assertContains(title, "DuckDuckGo", "Page Title");
    });
  }

  public async verifySearchInputDefaultState() {
    await test.step("Verify search input is present, visible, enabled, and empty", async () => {
      const input = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await expect(input, `${DuckDuckGoConstants.SEARCH_INPUT} should be present`).toHaveCount(1);
      await expect(input, `${DuckDuckGoConstants.SEARCH_INPUT} should be visible`).toBeVisible();
      await expect(input, `${DuckDuckGoConstants.SEARCH_INPUT} should be enabled`).toBeEnabled();
      await expect(input, `${DuckDuckGoConstants.SEARCH_INPUT} should be empty`).toHaveValue("");
    });
  }

  public async enterSearchTextAndVerify(query: string) {
    await test.step(`Enter search text '${query}' and verify value`, async () => {
      await this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT).fill(query);
      await expect(this.page.locator(DuckDuckGoPage.SEARCH_INPUT)).toHaveValue(query);
    });
  }

  public async submitSearchWithEnter() {
    await test.step("Submit search with Enter", async () => {
      await this.ui.keyPress(DuckDuckGoConstants.ENTER_KEY, "Enter Key");
    });
  }

  public async verifyUrlContainsQuery(query: string) {
    await test.step(`Verify URL contains query parameter for '${query}'`, async () => {
      await this.page.waitForURL(/\?.*\bq=/, { timeout: 15000 });
      const url = this.page.url();
      const expected = `q=${encodeURIComponent(query)}`;
      await Assert.assertContains(url, expected, "Results Page URL");
    });
  }

  public async waitForResultsContainer() {
    await test.step("Wait for results container", async () => {
      await this.page
        .locator(DuckDuckGoPage.RESULTS_CONTAINER)
        .waitFor({ state: "visible", timeout: 15000 });
    });
  }

  public async verifyAtLeastOneResultDisplayed() {
    await test.step("Verify at least one result item is displayed", async () => {
      const results = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
      await results.first().waitFor({ state: "visible", timeout: 15000 });
      const count = await results.count();
      await Assert.assertTrue(count > 0, "Search results count > 0");
    });
  }

  public async verifyFirstResultContainsQueryInTitleOrSnippet(query: string) {
    await test.step(`Verify first result includes '${query}' in title or snippet (case-insensitive)`, async () => {
      const first = this.page.locator(DuckDuckGoPage.RESULT_ITEMS).first();
      await first.waitFor({ state: "visible", timeout: 15000 });

      const titleText = (
        await first.locator(DuckDuckGoPage.RESULT_TITLE).first().innerText().catch(() => "")
      ).trim();
      const snippetText = (
        await first.locator(DuckDuckGoPage.RESULT_SNIPPET).first().innerText().catch(() => "")
      ).trim();

      const combined = `${titleText} ${snippetText}`.trim();
      await Assert.assertTrue(combined.length > 0, "First result has non-empty text");

      const q = query.toLowerCase();
      const contains = titleText.toLowerCase().includes(q) || snippetText.toLowerCase().includes(q);
      await Assert.assertTrue(contains, "First result title or snippet contains query");
    });
  }

  public async verifySearchInputRetainsValue(expectedValue: string) {
    await test.step(`Verify search input retains value '${expectedValue}'`, async () => {
      await expect(this.page.locator(DuckDuckGoPage.SEARCH_INPUT)).toHaveValue(expectedValue);
    });
  }

  public async clearAndSearchNewQuery(newQuery: string) {
    await test.step(`Clear search input and search for '${newQuery}'`, async () => {
      const input = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await input.fill("");
      await expect(input).toHaveValue("");

      await this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, DuckDuckGoConstants.SEARCH_INPUT).fill(newQuery);
      await expect(input).toHaveValue(newQuery);

      await this.ui.keyPress(DuckDuckGoConstants.ENTER_KEY, "Enter Key");
    });
  }

  public async verifyResultsContainQuery(query: string) {
    await test.step(`Verify results update and contain '${query}'`, async () => {
      await this.waitForResultsContainer();

      const results = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
      await results.first().waitFor({ state: "visible", timeout: 15000 });
      const count = await results.count();
      await Assert.assertTrue(count > 0, "Search results count > 0");

      await this.verifyFirstResultContainsQueryInTitleOrSnippet(query);
      await this.verifySearchInputRetainsValue(query);
    });
  }

  public async finalResponsivenessCheck() {
    await test.step("Final responsiveness check", async () => {
      await this.page.waitForLoadState("networkidle").catch(() => null);
      await expect(this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER)).toBeVisible();
    });
  }
}
