import React, { useState } from 'react';
import ChartDataContext from '../contexts/ChartDataContext';

const ChartDataProvider: React.FC = (props) => {
  const [chartDate, setChartDate] = useState<string | undefined>();
  const [chartToken, setChartToken] = useState<string | undefined>();
  const [isChartLine, setIsChartLine] = useState<boolean>(false);

  return (
    <ChartDataContext.Provider
      value={{
        isChartLine,
        chartDate,
        chartToken,
        setChartDate,
        setChartToken,
        setIsChartLine,
      }}>
      {props.children}
    </ChartDataContext.Provider>
  );
};

export default ChartDataProvider;
