export default class DuckDuckGoPage {
    // Core search flow locators (resilient selectors)
    static readonly SEARCH_INPUT = "input[name='q']";
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links article";
    static readonly FIRST_RESULT = "#links article:first-of-type";
    static readonly FIRST_RESULT_TITLE = "#links article:first-of-type h2";
    static readonly FIRST_RESULT_SNIPPET =
        "#links article:first-of-type [data-result='snippet'], #links article:first-of-type .result__snippet";

    // Additional locators (kept for coverage/future reuse)
    static readonly CTA_SECTION =
        "section[data-testid='cta-section'], section:has(h2:has-text('DuckDuckGo Browser'))";
    static readonly CTA_TITLE =
        "section[data-testid='cta-section'] h2, section:has(h2:has-text('DuckDuckGo Browser')) h2";

    static readonly EXTENSION_BROWSER_LIST =
        "[data-testid='extension-browser-list'], [data-testid='extension-browsers']";
    static readonly EXTENSION_BROWSER_CARD_1 =
        "[data-testid='extension-browser-card']:nth-of-type(1), [data-testid='extension-browser-list'] > *:nth-child(1)";
    static readonly EXTENSION_BROWSER_CARD_2 =
        "[data-testid='extension-browser-card']:nth-of-type(2), [data-testid='extension-browser-list'] > *:nth-child(2)";

    static readonly DOWNLOAD_BUTTON = "a[data-testid='download-button'], a:has-text('Download')";

    static readonly SAD_BROWSER_LIST = "[data-testid='sad-browser-list'], [data-testid='sad-browsers']";
    static readonly SET_AS_DEFAULT_BUTTON =
        "button[data-testid='set-as-default-button'], button:has-text('Set as default')";

    static readonly SAD_EXTENSION_LIST = "[data-testid='sad-extension-list'], [data-testid='sad-extensions']";
    static readonly SAD_EXTENSION_CARD_1 =
        "[data-testid='sad-extension-card']:nth-of-type(1), [data-testid='sad-extension-list'] > *:nth-child(1)";
    static readonly SAD_EXTENSION_CARD_2 =
        "[data-testid='sad-extension-card']:nth-of-type(2), [data-testid='sad-extension-list'] > *:nth-child(2)";

    static readonly SAD_LIST = "[data-testid='sad-list']";
}
