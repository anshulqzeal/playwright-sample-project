import { test, expect } from "@base-test";
import { Locator, Page } from "@playwright/test";

export default class DuckDuckGoPage {
  static readonly SEARCH_INPUT = "input#searchbox_input";
  static readonly SEARCH_RESULTS_CONTAINER = "section[data-testid='mainline']";
  static readonly SEARCH_RESULTS = "div[data-testid='result']";
  static readonly FIRST_RESULT_TITLE = "div[data-testid='result'] h2";

  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public get searchInput(): Locator {
    return this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
  }

  public get searchResultsContainer(): Locator {
    return this.page.locator(DuckDuckGoPage.SEARCH_RESULTS_CONTAINER);
  }

  public get searchResults(): Locator {
    return this.page.locator(DuckDuckGoPage.SEARCH_RESULTS);
  }

  public get firstResultTitle(): Locator {
    return this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE).first();
  }

  public async navigateToHome(url: string): Promise<void> {
    await test.step(`Navigate to ${url}`, async () => {
      await this.page.goto(url);
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  public async waitForPageReady(): Promise<void> {
    await test.step("Wait for DuckDuckGo page to be ready", async () => {
      await this.page.waitForLoadState("domcontentloaded");
      await this.searchInput.waitFor({ state: "visible" });
    });
  }

  public async getTitle(): Promise<string> {
    return await test.step("Get page title", async () => {
      await this.page.waitForLoadState("domcontentloaded");
      return this.page.title();
    });
  }

  public async getSearchValue(): Promise<string> {
    return await test.step("Get search input value", async () => {
      await this.searchInput.waitFor({ state: "visible" });
      return await this.searchInput.inputValue();
    });
  }

  public async verifySearchInputStateVisibleEnabledEmpty(): Promise<void> {
    await test.step("Verify search input is visible, enabled, and empty", async () => {
      await this.searchInput.waitFor({ state: "visible" });
      await expect(this.searchInput).toBeVisible();
      await expect(this.searchInput).toBeEnabled();
      await expect(this.searchInput).toHaveValue("");
    });
  }

  public async enterSearch(text: string): Promise<void> {
    await test.step(`Enter search text: ${text}`, async () => {
      await this.searchInput.waitFor({ state: "visible" });
      await this.searchInput.fill(text);
      await expect(this.searchInput).toHaveValue(text);
    });
  }

  public async clearSearch(): Promise<void> {
    await test.step("Clear search input", async () => {
      await this.searchInput.waitFor({ state: "visible" });
      await this.searchInput.fill("");
      await expect(this.searchInput).toHaveValue("");
    });
  }

  public async submitSearchWithEnter(): Promise<void> {
    await test.step("Submit search with Enter", async () => {
      await this.searchInput.waitFor({ state: "visible" });
      await this.searchInput.press("Enter");
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  public async waitForResultsContainerVisible(): Promise<void> {
    await test.step("Wait for results container to be visible", async () => {
      await this.searchResultsContainer.waitFor({ state: "visible" });
    });
  }

  public async getResultsCount(): Promise<number> {
    return await test.step("Get results count", async () => {
      await this.searchResultsContainer.waitFor({ state: "visible" });
      return await this.searchResults.count();
    });
  }

  public async getFirstResultTitleText(): Promise<string> {
    return await test.step("Get first result title text", async () => {
      await this.searchResultsContainer.waitFor({ state: "visible" });
      await this.firstResultTitle.waitFor({ state: "visible" });
      return (await this.firstResultTitle.textContent())?.trim() ?? "";
    });
  }

  public async verifyFirstResultContainsKeyword(keyword: string): Promise<void> {
    await test.step(`Verify first result contains keyword: ${keyword}`, async () => {
      const titleText = await this.getFirstResultTitleText();
      await expect(titleText, "First result title should be non-empty").not.toEqual("");
      await expect(titleText.toLowerCase()).toContain(keyword.toLowerCase());
    });
  }
}
