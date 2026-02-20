import { expect, test } from "@base-test";
import { Page } from "@playwright/test";
import StringUtil from "@utils/StringUtil";
import UIActions from "@uiActions/UIActions";
import DuckDuckGoPage from "../pages/DuckDuckGoPage";

export default class DuckDuckGoSteps {
  private ui: UIActions;

  constructor(private page: Page) {
    this.ui = new UIActions(page);
  }

  public async navigateToDuckDuckGo(url = "https://duckduckgo.com") {
    await this.ui.goto(url, "DuckDuckGo");
  }

  public async verifyHomePageTitle() {
    await test.step("Verify page title contains DuckDuckGo", async () => {
      await expect(this.page).toHaveTitle(/DuckDuckGo/i);
    });
  }

  public async verifySearchInputDefaultState() {
    await test.step(
      "Verify search input is present, visible, enabled and empty by default",
      async () => {
        const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
        await expect(searchInput, "Search input should be present").toHaveCount(1);
        await expect(searchInput, "Search input should be visible").toBeVisible();
        await expect(searchInput, "Search input should be enabled").toBeEnabled();
        await expect(searchInput, "Search input should be empty").toHaveValue("");
      },
    );
  }

  public async enterSearchTextAndVerify(searchText: string) {
    await this.ui.editBox(DuckDuckGoPage.SEARCH_INPUT, "Search input").fill(searchText);

    await test.step(`Verify search input value is '${searchText}'`, async () => {
      await expect(this.page.locator(DuckDuckGoPage.SEARCH_INPUT)).toHaveValue(searchText);
    });
  }

  public async submitSearchWithEnter() {
    await this.ui.keyPress("Enter", "ENTER");
  }

  public async verifyUrlContainsQuery(query: string) {
    await test.step(`Verify URL contains query '${query}'`, async () => {
      // DuckDuckGo uses either ?q=<query> or /?q=<query> in most flows.
      const q = encodeURIComponent(query);
      await expect(this.page).toHaveURL(new RegExp(`[?&]q=${q}(?:&|$)`, "i"));
    });
  }

  public async waitForResultsContainer() {
    await test.step("Wait for results container to be visible", async () => {
      await expect(this.page.locator(DuckDuckGoPage.RESULTS_CONTAINER)).toBeVisible({
        timeout: 15000,
      });
    });
  }

  public async verifyAtLeastOneResultDisplayed() {
    await test.step("Verify at least one result item is displayed", async () => {
      const results = this.page.locator(DuckDuckGoPage.RESULT_ITEMS);
      await expect(results.first(), "At least one result should be visible").toBeVisible({
        timeout: 15000,
      });
      await expect(results, "At least one result should be present").toHaveCountGreaterThan(0);
    });
  }

  public async verifyFirstResultContainsTerm(expectedTerm: string) {
    await test.step(
      `Verify first result contains non-empty text and includes '${expectedTerm}' (case-insensitive) in title or snippet`,
      async () => {
        const title = this.page.locator(DuckDuckGoPage.FIRST_RESULT_TITLE);
        const snippet = this.page.locator(DuckDuckGoPage.FIRST_RESULT_SNIPPET);

        await expect(title, "First result title should be visible").toBeVisible({
          timeout: 15000,
        });

        const titleText = ((await title.first().innerText()) ?? "").trim();
        const snippetText = (await snippet.first().count())
          ? ((await snippet.first().innerText()) ?? "").trim()
          : "";

        expect(titleText.length, "First result title should not be empty").toBeGreaterThan(0);

        const normalizedExpected = expectedTerm.trim().toLowerCase();
        const haystack = `${titleText} ${snippetText}`.toLowerCase();

        // If StringUtil is extended in future for normalization, use it without impacting flow.
        // Currently used as dependency import per plan.
        const expected = StringUtil.replaceAll(normalizedExpected, "\\s+", " ");
        expect(
          haystack.includes(expected),
          `Expected term '${expectedTerm}' should appear in title or snippet. Actual title: '${titleText}', snippet: '${snippetText}'`,
        ).toBeTruthy();
      },
    );
  }

  public async verifySearchInputValue(expectedValue: string) {
    await test.step(`Verify search input retains value '${expectedValue}'`, async () => {
      await expect(this.page.locator(DuckDuckGoPage.SEARCH_INPUT)).toHaveValue(expectedValue);
    });
  }

  public async clearSearchAndSearchAgain(newQuery: string) {
    await test.step(`Clear search input and search again for '${newQuery}'`, async () => {
      const searchInput = this.page.locator(DuckDuckGoPage.SEARCH_INPUT);
      await expect(searchInput).toBeVisible();

      const clearBtn = this.page.locator(DuckDuckGoPage.CLEAR_SEARCH_BUTTON);
      if (await clearBtn.isVisible().catch(() => false)) {
        await this.ui.element(DuckDuckGoPage.CLEAR_SEARCH_BUTTON, "Clear search").click();
      } else {
        // Fallback clear if clear button isn't present.
        await searchInput.fill("");
      }

      await expect(searchInput, "Search input should be empty after clearing").toHaveValue("");
    });

    await this.enterSearchTextAndVerify(newQuery);
    await this.submitSearchWithEnter();
  }

  public async verifyPageResponsive() {
    await test.step("Final responsiveness check: page open and key element visible", async () => {
      expect(this.page.isClosed(), "Page should not be closed").toBeFalsy();
      await expect(this.page.locator(DuckDuckGoPage.SEARCH_INPUT)).toBeVisible();
      await expect(this.page.locator(DuckDuckGoPage.SEARCH_INPUT)).toBeEnabled();
    });
  }
}
