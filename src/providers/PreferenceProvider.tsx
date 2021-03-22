import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react';
import { useState } from "react";
import { CURRENCY, LANGUAGE } from '../constants/storage';
import PreferenceContext, { IStatePreferenceContext, statePreferenceInitialState } from '../contexts/PreferenceContext';
import CurrencyType from '../enums/CurrencyType';
import LocaleType from '../enums/LocaleType';
import { useTranslation } from 'react-i18next'
import currentLocalization from '../utiles/currentLocalization';

const PreferenceProvider: React.FC = (props) => {
  const [state, setState] = useState<IStatePreferenceContext>(statePreferenceInitialState)
  const { i18n } = useTranslation();

  const loadPreferences = async () => {
    const currency: CurrencyType | null = await AsyncStorage.getItem(CURRENCY) as CurrencyType;
    let language: LocaleType | null = await AsyncStorage.getItem(LANGUAGE) as LocaleType;

    if (!language) {
      language = currentLocalization();
    }

    i18n.changeLanguage(language)

    setState({
      currency: currency,
      language: language,
    })
  }

  const setLanguage = async (language: LocaleType) => {
    await AsyncStorage.setItem(LANGUAGE, language);
    i18n.changeLanguage(language)
    setState({
      ...state,
      language
    })
  }

  const setCurrency = async (currency: CurrencyType) => {
    await AsyncStorage.setItem(CURRENCY, currency);
    setState({
      ...state,
      currency
    })
  }

  useEffect(() => {
    loadPreferences();
  }, [])

  return (
    <PreferenceContext.Provider
      value={{
        ...state,
        setLanguage,
        setCurrency,
      }}
    >
      {props.children}
    </PreferenceContext.Provider>
  );
}

export default PreferenceProvider;