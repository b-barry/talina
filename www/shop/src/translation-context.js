import React from 'react';

import {addLocaleData, IntlProvider} from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import locale_nl from 'react-intl/locale-data/nl';
import messages_en from '../translations/en.json';
import messages_fr from '../translations/fr.json';
import messages_nl from '../translations/nl.json';
import {nope} from './utils';

export const LANG_KEY = 'talina-lang';

export const getPersistedLangFromLocalStorage = () => {
  return localStorage.getItem(LANG_KEY);
};
export const persistedLangFromLocalStorage = (value = language) => {
  return localStorage.setItem(LANG_KEY, value);
};

addLocaleData([...locale_en, ...locale_fr, ...locale_nl]);
const messages = {
  fr: messages_fr,
  nl: messages_nl,
  en: messages_en,
};

const language = navigator.language.split(/[-_]/)[0]; // language without region code

export const defaultTranslationContext = {
  lang: language,
  updateLang: nope,
};

export const TranslationContext = React.createContext(
  defaultTranslationContext
);

class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultTranslationContext,
      updateLang: this.updateLang,
      lang: this.getLang(),
    };
  }

  getLang = () => {
    let lang = getPersistedLangFromLocalStorage();

    if (!lang) {
      persistedLangFromLocalStorage(language);
      lang = language;
    }

    return lang;
  };

  updateLang = lang => {
    persistedLangFromLocalStorage(lang);
    this.setState({ lang });
  };

  render() {
    const { lang } = this.state;

    return (
      <TranslationContext.Provider value={this.state}>
        {
          <IntlProvider key={lang} locale={lang} messages={messages[lang]}>
            {this.props.children}
          </IntlProvider>
        }
      </TranslationContext.Provider>
    );
  }
}

export const TranslationProvider = Provider;
