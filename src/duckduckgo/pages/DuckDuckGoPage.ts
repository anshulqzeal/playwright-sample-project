export default class DuckDuckGoPage {
    // Core DuckDuckGo search locators
    static readonly SEARCH_INPUT = "input[name='q']";
    static readonly SEARCH_FORM = "form#search_form_homepage";
    static readonly SEARCH_BUTTON = "button[type='submit']";

    // Results page locators
    static readonly RESULTS_CONTAINER = "#links";
    static readonly RESULT_ITEMS = "#links .results > .result, #links .results .result";
    static readonly RESULT_TITLE_OR_SNIPPET = "h2 a, [data-result='snippet'], .result__snippet, .result__a";

    // Provided locators (for future expansion / coverage)
    static readonly CTASECTION = ".homepage-cta-section_ctaSection__V5TiC";
    static readonly CTATITLE = ".homepage-cta-section_title__yh7tH";
    static readonly EXTENSIONBROWSERLIST = "#desktopssg\\:extensionbrowser";
    static readonly EXTENSIONBROWSERCARD1 = ".cta-cards_card__v9a4R";
    static readonly EXTENSIONBROWSERCARD2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly DOWNLOADBUTTON = "#desktopssg\\:download";
    static readonly SADBROWSERLIST = "#desktopssg\\:sadbrowser";
    static readonly SETASDEFAULTBUTTON = "text=Set As Default Search";
    static readonly SADEXTENSIONLIST = "#desktopssg\\:sadextension";
    static readonly SADEXTENSIONCARD1 = ".cta-cards_card__v9a4R";
    static readonly SADEXTENSIONCARD2 = ".cta-cards_card__v9a4R.cta-cards_green__sJHCl";
    static readonly SADLIST = "#desktopssg\\:sad";
}
