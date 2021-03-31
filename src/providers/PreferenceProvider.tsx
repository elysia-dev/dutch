import AsyncStorage from '@react-native-community/async-storage';
import React, { useCallback, useEffect } from 'react';
import { useState } from "react";
import { CURRENCY, LANGUAGE, NOTIFICATION } from '../constants/storage';
import PreferenceContext, { IStatePreferenceContext, statePreferenceInitialState } from '../contexts/PreferenceContext';
import CurrencyType from '../enums/CurrencyType';
import LocaleType from '../enums/LocaleType';
import { useTranslation } from 'react-i18next'
import currentLocalization from '../utiles/currentLocalization';
import currencyFormatter from '../utiles/currencyFormatter';
import EspressoV1 from '../api/EspressoV1';

const PreferenceProvider: React.FC = (props) => {
  const [state, setState] = useState<IStatePreferenceContext>(statePreferenceInitialState)
  const { i18n } = useTranslation();

  const loadPreferences = async () => {
    const currency: CurrencyType | null = await AsyncStorage.getItem(CURRENCY) as CurrencyType || CurrencyType.USD;
    const notification: boolean = (await AsyncStorage.getItem(NOTIFICATION)) === 'true';
    let language: LocaleType | null = await AsyncStorage.getItem(LANGUAGE) as LocaleType;

    const allCurrency = (await EspressoV1.getAllCurrency()).data;

    if (!language) {
      language = currentLocalization();
    }

    i18n.changeLanguage(language)

    setState({
      ...state,
      krwPrice: allCurrency.find((cr) => cr.code === 'KRW')?.rate || 1080,
      cnyPrice: allCurrency.find((cr) => cr.code === 'CNY')?.rate || 6.53324,
      currency,
      language,
      notification,
      loaded: true,
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

  const setNotification = async (notification: boolean) => {
    await AsyncStorage.setItem(NOTIFICATION, notification.toString());
    setState({
      ...state,
      notification,
    })
  }

  const currencyFormattHandler = useCallback((value: number, fix?: number) => {
    return currencyFormatter(
      state.currency === CurrencyType.KRW ? '₩' : state.currency === CurrencyType.CNY ? '¥' : '$',
      state.currency === CurrencyType.KRW ? state.krwPrice : state.currency === CurrencyType.CNY ? state.cnyPrice : 1,
      value,
      fix || 2,
    );
  }, [state.currency])

  useEffect(() => {
    loadPreferences();
  }, [])

  return (
    <PreferenceContext.Provider
      value={{
        ...state,
        setLanguage,
        setCurrency,
        setNotification,
        currencyFormatter: currencyFormattHandler,
      }}
    >
      {state.loaded && props.children}
    </PreferenceContext.Provider>
  );
}

export default PreferenceProvider;