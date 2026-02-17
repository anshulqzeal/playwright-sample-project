export default class DuckDuckGoPage {
    // Home / header search
    static readonly SEARCH_INPUT = "input[name='q']";

    // Results
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links .react-results--main article";
    static readonly RESULT_TITLE = "h2 a";
    static readonly RESULT_SNIPPET = "[data-result='snippet'], .result__snippet, [class*='result__snippet']";

    // --- Locator coverage (CTA/extension/sad browser sections etc.) ---
    // Note: DuckDuckGo homepage layout can vary by geo/experiment. These locators are
    // intentionally broad but stable enough for presence checks when applicable.

    // CTA section (generic)
    static readonly CTA_SECTION = "section:has-text('DuckDuckGo')";
    static readonly CTA_TITLE = "section:has-text('DuckDuckGo') h2";

    // Extension browser list/cards (best-effort)
    static readonly EXTENSION_BROWSER_LIST = "[data-testid='browser-extension'], section:has-text('Add DuckDuckGo')";
    static readonly EXTENSION_BROWSER_CARD_1 =
        "[data-testid='browser-extension'] a, section:has-text('Add DuckDuckGo') a";
    static readonly EXTENSION_BROWSER_CARD_2 =
        "[data-testid='browser-extension'] a:nth-of-type(2), section:has-text('Add DuckDuckGo') a:nth-of-type(2)";

    // Download / set as default buttons (best-effort)
    static readonly DOWNLOAD_BUTTON = "a:has-text('Download'), button:has-text('Download')";
    static readonly SET_AS_DEFAULT_BUTTON = "a:has-text('Set as default'), button:has-text('Set as default')";

    // SAD (Search, Ads, & Data?) / privacy related sections (best-effort)
    static readonly SAD_BROWSER_LIST = "section:has-text('browser') ul";
    static readonly SAD_EXTENSION_LIST = "section:has-text('extension') ul";
    static readonly SAD_EXTENSION_CARD_1 = "section:has-text('extension') a";
    static readonly SAD_EXTENSION_CARD_2 = "section:has-text('extension') a:nth-of-type(2)";
    static readonly SAD_LIST = "section ul";
}
