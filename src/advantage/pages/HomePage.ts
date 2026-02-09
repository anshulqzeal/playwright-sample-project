import { Page, test } from "@playwright/test";

export default class HomePage {
    static readonly USER_ICON = "#menuUser";
    static readonly USER_NAME_TEXTBOX = "[name='username']";
    static readonly PASSWORD_TEXTBOX = "[name='password']";
    static readonly REMEMBER_ME_CHECKBOX = "[name='remember_me']";
    static readonly SIGN_IN_BUTTON = "#sign_in_btn";
    static readonly LOGGED_IN_USER = "a#menuUserLink>span.hi-user";
    static readonly SIGN_IN_ERROR_MESSAGE = "#signInResultMessage.invalid";
    static readonly SIGN_OUT_LINK = "#loginMiniTitle>[translate='Sign_out']";
    static readonly CREATE_NEW_ACCOUNT_LINK = "[translate='CREATE_NEW_ACCOUNT']";
    static readonly CATEGORY_DROPDOWN = "[name='categoryListboxContactUs']";
    static readonly PRODUCT_DROPDOWN = "[name='productListboxContactUs']";
    static readonly SUBJECT_TEXTAREA = "[name='subjectTextareaContactUs']";
    static readonly EMAIL_TEXTBOX = "[name='emailContactUs']";
    static readonly SEND_BUTTON = "#send_btn";
    static readonly CONTACT_US_MESSAGE = ".roboto-regular.successMessage";
    static readonly SEARCH_ICON = "#searchSection";
    static readonly SEARCH_TEXTBOX = "#autoComplete";
    static readonly SEARCH_CLOSE_IMAGE = "div.autoCompleteCover>div>img";
    static readonly HELP_ICON = "#menuHelp";
    static readonly MANAGEMENT_CONSOLE_LINK = "div#helpMiniTitle [translate='CONFIG_TOOL']";

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickSearchIcon(): Promise<void> {
        await test.step("Click search icon", async () => {
            await this.page.locator(HomePage.SEARCH_ICON).click();
            await this.page.locator(HomePage.SEARCH_TEXTBOX).waitFor({ state: "visible" });
        });
    }

    async typeSearchQuery(query: string): Promise<void> {
        await test.step(`Type search query: ${query}`, async () => {
            const searchBox = this.page.locator(HomePage.SEARCH_TEXTBOX);
            await searchBox.waitFor({ state: "visible" });
            await searchBox.fill(query);
            await this.page.keyboard.press("Enter");
        });
    }

    async closeSearchBox(): Promise<void> {
        await test.step("Close search box", async () => {
            await this.page.locator(HomePage.SEARCH_CLOSE_IMAGE).click();
            await this.page.locator(HomePage.SEARCH_TEXTBOX).waitFor({ state: "hidden" });
        });
    }
}
