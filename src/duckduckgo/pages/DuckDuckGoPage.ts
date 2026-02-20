export default class DuckDuckGoPage {
    // Header
    static readonly HEADER_LOGO = "css=a.header_logoHorizontal__KABN4";
    static readonly AI_CHAT_BUTTON = "[data-testid='aichat-button']";
    static readonly MENU_BUTTON = "[data-testid='sidemenu-button']";

    // Search box
    static readonly SEARCH_INPUT = "#searchbox_input";
    static readonly CLEAR_SEARCH_BUTTON = "[data-ssg-id='search-clear-button']";
    static readonly ASK_DUCK_AI_BUTTON = "[data-ssg-id='ask-duck-ai-submit']";
    static readonly SEARCH_BUTTON = "css=button.search-input_searchButton__FTn6i";

    // Results page (SERP)
    static readonly RESULTS_CONTAINER = "#links, [data-testid='mainline']";
    static readonly RESULT_ITEMS = "[data-testid='result'], article[data-testid='result']";

    static readonly FIRST_RESULT =
        "[data-testid='result']:nth-of-type(1), article[data-testid='result']:nth-of-type(1)";
    static readonly FIRST_RESULT_TITLE =
        "[data-testid='result']:nth-of-type(1) h2 a, article[data-testid='result']:nth-of-type(1) h2 a";
    static readonly FIRST_RESULT_SNIPPET =
        "[data-testid='result']:nth-of-type(1) [data-result='snippet'], [data-testid='result']:nth-of-type(1) [data-testid='result-snippet'], article[data-testid='result']:nth-of-type(1) [data-result='snippet'], article[data-testid='result']:nth-of-type(1) [data-testid='result-snippet']";
}
