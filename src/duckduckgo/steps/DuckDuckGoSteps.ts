import { expect, test } from "@base-test";
import { Page } from "@playwright/test";
import DuckDuckGoPage from "../pages/DuckDuckGoPage";

export default class DuckDuckGoSteps {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async launchDuckDuckGo(): Promise<void> {
    await test.step("Launch DuckDuckGo", async () => {
      await this.page.goto("https://duckduckgo.com/");
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  async verifyTitleContainsDuckDuckGo(): Promise<void> {
    await test.step("Verify title contains DuckDuckGo", async () => {
      await expect(this.page).toHaveTitle(/DuckDuckGo/i);
    });
  }

  async verifySearchInputReadyAndEmpty(): Promise<void> {
    await test.step("Verify search input is visible, enabled, and empty", async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEnabled();
      await expect(searchInput).toHaveValue("");
    });
  }

  async enterSearchTextAndVerifyValue(text: string): Promise<void> {
    await test.step(`Enter search text: ${text}`, async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await searchInput.fill(text);
      await expect(searchInput).toHaveValue(text);
    });
  }

  async submitSearchWithEnter(): Promise<void> {
    await test.step("Submit search with Enter", async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await searchInput.press("Enter");
    });
  }

  async verifyUrlContainsQuery(text: string): Promise<void> {
    await test.step(`Verify URL contains query for: ${text}`, async () => {
      const encoded = encodeURIComponent(text);
      await expect(this.page).toHaveURL(new RegExp(`[?&]q=${encoded}(?:&|$)`, "i"));
    });
  }

  async waitForResultsVisible(): Promise<void> {
    await test.step("Wait for search results container to be visible", async () => {
      const container = this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER);
      await container.waitFor({ state: "visible" });
    });
  }

  async verifyAtLeastOneResult(): Promise<void> {
    await test.step("Verify at least one search result is displayed", async () => {
      const items = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
      await expect(items.first()).toBeVisible();
      await expect(items).toHaveCountGreaterThan(0);
    });
  }

  async verifyFirstResultContainsKeyword(text: string): Promise<void> {
    await test.step(`Verify first result contains keyword: ${text}`, async () => {
      const title = this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE);
      const snippet = this.page.locator(DuckDuckGoPage.FIRST_RESULT_SNIPPET);

      const titleText = (await title.first().textContent())?.trim() ?? "";
      const snippetText = (await snippet.first().textContent())?.trim() ?? "";

      expect(titleText.length + snippetText.length).toBeGreaterThan(0);

      const combined = `${titleText} ${snippetText}`.toLowerCase();
      expect(combined).toContain(text.toLowerCase());
    });
  }

  async verifySearchInputValue(text: string): Promise<void> {
    await test.step(`Verify search input value is: ${text}`, async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await expect(searchInput).toHaveValue(text);
    });
  }

  async clearAndSearch(text: string): Promise<void> {
    await test.step(`Clear search input and search for: ${text}`, async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await searchInput.fill("");
      await expect(searchInput).toHaveValue("");
      await searchInput.fill(text);
      await expect(searchInput).toHaveValue(text);
      await searchInput.press("Enter");
    });
  }

  async verifyPageResponsive(): Promise<void> {
    await test.step("Verify page remains responsive", async () => {
      await this.page.waitForLoadState("domcontentloaded");
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await expect(searchInput).toBeVisible();
    });
  }
}
