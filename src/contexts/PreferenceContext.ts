import { createContext } from 'react';
import CurrencyType from '../enums/CurrencyType';
import LocaleType from '../enums/LocaleType';

export interface IStatePreferenceContext {
  language: LocaleType | null
  currency: CurrencyType | null
  notification: boolean
  krwPrice: number
  cnyPrice: number
}

export interface IPreferenceContext extends IStatePreferenceContext {
  setCurrency: (currency: CurrencyType) => Promise<void>,
  setLanguage: (language: LocaleType) => Promise<void>,
  setNotification: (notification: boolean) => Promise<void>,
  currencyFormatter: (value: number, fix?: number) => string,
};

export const statePreferenceInitialState = {
  language: LocaleType.EN,
  currency: CurrencyType.USD,
  krwPrice: 1080,
  cnyPrice: 6.53324,
  notification: false
}

export const preferenceInitialState = {
  ...statePreferenceInitialState,
  setCurrency: async (_currency: CurrencyType) => { },
  setLanguage: async (_language: LocaleType) => { },
  setNotification: async (_notification: boolean) => { },
  currencyFormatter: (_value: number) => { return '' },
}

const PreferenceContext = createContext<IPreferenceContext>(preferenceInitialState);

export default PreferenceContext;
