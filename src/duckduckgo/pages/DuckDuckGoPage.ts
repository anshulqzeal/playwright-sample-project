export default class DuckDuckGoPage {
    // Header
    static readonly HEADER_LOGO = "a.header_logoHorizontal__KABN4";
    static readonly AI_CHAT_BUTTON = "[data-testid='aichat-button']";
    static readonly MENU_BUTTON = "[data-testid='sidemenu-button']";

    // Search
    static readonly SEARCH_INPUT = "#searchbox_input";
    static readonly CLEAR_SEARCH_BUTTON = "[data-ssg-id='search-clear-button']";
    static readonly SEARCH_BUTTON = "button.search-input_searchButton__FTn6i";

    // Results
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links .react-results--main > article";
    static readonly FIRST_RESULT_ITEM = "#links .react-results--main > article:first-child";
    static readonly FIRST_RESULT_TITLE = "#links .react-results--main > article:first-child h2";
    static readonly FIRST_RESULT_SNIPPET = "#links .react-results--main > article:first-child [data-result='snippet'], #links .react-results--main > article:first-child .result__snippet";

    // Optional generic error banner (best-effort)
    static readonly ERROR_BANNER = "[role='alert'], .error, .alert.alert-error";
}
