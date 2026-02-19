export default class DuckDuckGoPage {
    // Home / Results common
    static readonly SEARCH_INPUT = "input[name='q']";

    // Results page
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links .react-results--main article";
    static readonly FIRST_RESULT_ITEM = "#links .react-results--main article:nth-of-type(1)";
    static readonly FIRST_RESULT_TITLE =
        "#links .react-results--main article:nth-of-type(1) [data-result='title'], #links .react-results--main article:nth-of-type(1) h2";
    static readonly FIRST_RESULT_SNIPPET =
        "#links .react-results--main article:nth-of-type(1) [data-result='snippet'], #links .react-results--main article:nth-of-type(1) [data-result='snippet'] span";

    // CTA-related locators (mapped for completeness; may not be used by tests)
    static readonly CTA_SECTION = ".homepage-cta-section_ctaSection__V5TiC";
    static readonly CTA_TITLE = ".homepage-cta-section_title__yh7tH";

    static readonly EXTENSION_BROWSER_LIST = "#desktopssg\\:extensionbrowser";
    static readonly EXTENSION_BROWSER_CARD_1 = ".cta-cards_card__v9a4R";
    static readonly EXTENSION_BROWSER_CARD_2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly DOWNLOAD_BUTTON = "#desktopssg\\:download";

    static readonly SAD_BROWSER_LIST = "#desktopssg\\:sadbrowser";
    static readonly SET_AS_DEFAULT_BUTTON = "a:has-text('Set As Default Search')";

    static readonly SAD_EXTENSION_LIST = "#desktopssg\\:sadextension";
    static readonly SAD_EXTENSION_CARD_1 = ".cta-cards_card__v9a4R";
    static readonly SAD_EXTENSION_CARD_2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";

    static readonly SAD_LIST = "#desktopssg\\:sad";
}
