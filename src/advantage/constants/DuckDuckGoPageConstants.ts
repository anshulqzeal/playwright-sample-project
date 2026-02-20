export default class DuckDuckGoPageConstants {
    // Header / navigation
    static readonly HEADER_LOGO = "css=a.header_logoHorizontal__KABN4";
    static readonly AI_CHAT_BUTTON = "css=[data-testid='aichat-button']";
    static readonly MENU_BUTTON = "css=[data-testid='sidemenu-button']";

    // Search box
    static readonly SEARCH_INPUT = "css=#searchbox_input";
    static readonly CLEAR_SEARCH_BUTTON = "css=[data-ssg-id='search-clear-button']";
    static readonly ASK_DUCK_AI_BUTTON = "css=[data-ssg-id='ask-duck-ai-submit']";
    static readonly SEARCH_BUTTON = "css=button.search-input_searchButton__FTn6i";

    // Results page
    static readonly RESULTS_CONTAINER = "css=[data-testid='mainline']";
    static readonly RESULT_ITEMS = "css=[data-testid='mainline'] article";
    static readonly FIRST_RESULT = "css=[data-testid='mainline'] article:nth-of-type(1)";
    static readonly FIRST_RESULT_TITLE =
        "css=[data-testid='mainline'] article:nth-of-type(1) h2 a";
    static readonly FIRST_RESULT_SNIPPET =
        "css=[data-testid='mainline'] article:nth-of-type(1) [data-result='snippet'], [data-testid='mainline'] article:nth-of-type(1) .result__snippet";
}
