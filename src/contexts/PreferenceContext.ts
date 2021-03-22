import { createContext } from 'react';
import CurrencyType from '../enums/CurrencyType';
import LocaleType from '../enums/LocaleType';

export interface IStatePreferenceContext {
  language: LocaleType | null
  currency: CurrencyType | null
}

export interface IPreferenceContext extends IStatePreferenceContext {
  setCurrency: (currency: CurrencyType) => Promise<void>,
  setLanguage: (language: LocaleType) => Promise<void>,
};

export const statePreferenceInitialState = {
  language: LocaleType.EN,
  currency: CurrencyType.USD,
  isLocal: false,
}

export const preferenceInitialState = {
  ...statePreferenceInitialState,
  setCurrency: async (_currency: CurrencyType) => { },
  setLanguage: async (_language: LocaleType) => { },
}

const PreferenceContext = createContext<IPreferenceContext>(preferenceInitialState);

export default PreferenceContext;
