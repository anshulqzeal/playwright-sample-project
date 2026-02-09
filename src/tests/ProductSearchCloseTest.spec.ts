import { test, expect } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import HomeSteps from "@advantage/steps/HomeSteps";
import HomePage from "@pages/HomePage";

const SHEET = "ProductSearchCloseTest";
let home: HomeSteps;

test.beforeEach(async ({ page }) => {
    home = new HomeSteps(page);
});

const data1 = ExcelUtil.getTestData(SHEET, "TC01_SearchOpenTypeAndClose");

test(`${data1.TestID} - ${data1.Description}`, async ({ page }) => {
    Allure.attachDetails(data1.Description, data1.Issue);

    await test.step("Launch application", async () => {
        await home.launchApplication();
    });

    const homePage = new HomePage(page);

    await test.step("Open search box from search icon", async () => {
        await homePage.clickSearchIcon();
        await expect(page.locator(HomePage.SEARCH_TEXTBOX)).toBeVisible();
    });

    await test.step(`Type search query: ${data1.Query}`, async () => {
        await homePage.typeSearchQuery(data1.Query);
        await expect(page.locator(HomePage.SEARCH_TEXTBOX)).toHaveValue(data1.Query);
    });

    await test.step("Close search box", async () => {
        await homePage.closeSearchBox();
        await expect(page.locator(HomePage.SEARCH_TEXTBOX)).toBeHidden();
    });
});
