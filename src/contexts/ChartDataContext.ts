import { createContext } from 'react';

export type ChartType = {
  chartDate: string | undefined;
  chartToken: string | undefined;
  isChartLine: boolean;
  setChartDate: Function;
  setChartToken: Function;
  setIsChartLine: Function;
};

export const initialChartState: ChartType = {
  chartDate: undefined,
  chartToken: undefined,
  isChartLine: false,
  setChartDate: (): void => {},
  setChartToken: (): void => {},
  setIsChartLine: (): void => {},
};

export const initialChartContext = {
  ...initialChartState,
};

const ChartDataContext = createContext<ChartType>(initialChartContext);
export default ChartDataContext;
