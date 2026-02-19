export default class DuckDuckGoPage {
    // Core search locators
    static readonly SEARCH_INPUT = "input[name='q'], #searchbox_input";

    // Results page locators
    static readonly RESULTS_CONTAINER = "#links, [data-testid='mainline'], #react-layout";
    static readonly RESULT_ITEMS = "#links .result, [data-testid='result'], article[data-testid='result']";

    // First result title/snippet (use either title or snippet text)
    static readonly FIRST_RESULT_TITLE =
        "#links .result:first-child h2 a, [data-testid='result']:first-child h2 a, article[data-testid='result']:first-child h2 a";
    static readonly FIRST_RESULT_SNIPPET =
        "#links .result:first-child .result__snippet, [data-testid='result']:first-child [data-testid='result-extras'], article[data-testid='result']:first-child [data-testid='result-extras'], #links .result:first-child [class*='snippet']";
    static readonly FIRST_RESULT_TITLE_OR_SNIPPET =
        "#links .result:first-child h2 a, #links .result:first-child .result__snippet, [data-testid='result']:first-child h2 a, [data-testid='result']:first-child [data-testid='result-extras'], article[data-testid='result']:first-child h2 a, article[data-testid='result']:first-child [data-testid='result-extras']";

    // Additional provided locator mappings (optional/non-blocking checks in steps)
    static readonly CTA_SECTION = "section:has-text('Get our app'), section:has-text('Add DuckDuckGo'), section[data-testid='cta-section']";
    static readonly CTA_TITLE = "section[data-testid='cta-section'] h2, section:has-text('Get our app') h2";

    static readonly EXTENSION_BROWSER_LIST = "[data-testid='extension-browser-list'], ul:has(li:has-text('Chrome')), ul:has(li:has-text('Firefox'))";
    static readonly EXTENSION_BROWSER_CARD_1 =
        "[data-testid='extension-browser-list'] li:nth-child(1), [data-testid='extension-browser-card']:nth-child(1)";
    static readonly EXTENSION_BROWSER_CARD_2 =
        "[data-testid='extension-browser-list'] li:nth-child(2), [data-testid='extension-browser-card']:nth-child(2)";

    static readonly DOWNLOAD_BUTTON = "a:has-text('Download'), button:has-text('Download'), [data-testid='download-button']";

    static readonly SAD_BROWSER_LIST = "[data-testid='sad-browser-list'], ul:has(li:has-text('Chrome'))";
    static readonly SET_AS_DEFAULT_BUTTON =
        "button:has-text('Set as default'), a:has-text('Set as default'), [data-testid='set-as-default-button']";

    static readonly SAD_EXTENSION_LIST = "[data-testid='sad-extension-list'], ul:has(li:has-text('Extension'))";
    static readonly SAD_EXTENSION_CARD_1 =
        "[data-testid='sad-extension-list'] li:nth-child(1), [data-testid='sad-extension-card']:nth-child(1)";
    static readonly SAD_EXTENSION_CARD_2 =
        "[data-testid='sad-extension-list'] li:nth-child(2), [data-testid='sad-extension-card']:nth-child(2)";

    static readonly SAD_LIST = "[data-testid='sad-list'], section:has-text('Set as default') ul";
}
