export default class DuckDuckGoConstants {
    // Human-readable names for reporting (UIActions / Assert step messages)
    static readonly HOME_PAGE = "DuckDuckGo Home Page";
    static readonly SEARCH_INPUT = "Search input";
    static readonly RESULTS_CONTAINER = "Results container";
    static readonly RESULT_ITEMS = "Result items";
    static readonly FIRST_RESULT = "First result";

    // Common expectations
    static readonly EXPECTED_TITLE_SUBSTRING = "DuckDuckGo";

    // Keyboard / input
    static readonly ENTER_KEY = "Enter";

    // URL / query params
    static readonly QUERY_PARAM_KEY = "q";
    static readonly QUERY_PARAM_EXPECTATION = "q=";
}
