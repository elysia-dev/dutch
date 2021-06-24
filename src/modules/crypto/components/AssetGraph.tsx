import React, { useContext, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  Chart,
  Line,
  HorizontalAxis,
  ChartDataPoint,
} from 'react-native-responsive-linechart';

import CustomChartTooltip from './CustomChartTooltip';
import AppColors from '../../../enums/AppColors';
import { P2Text } from '../../../shared/components/Texts';
import ChartDataContext from '../../../contexts/ChartDataContext';
import ClickChartLine from './ClickChartLine';

interface IAssetGraph {
  data: ChartDataPoint[] | undefined;
  lineColor: AppColors;
  chartLoading: boolean;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

const AssetGraph: React.FC<IAssetGraph> = ({
  data = [],
  lineColor,
  chartLoading = true,
}) => {
  const { isChartLine, setChartDate, setChartToken, setIsChartLine } =
    useContext(ChartDataContext);
  const maxY = data.reduce((res, cur) => (cur.y >= res ? cur.y : res), 0);
  const [chartLoc, setChartLoc] = useState<number>(0);
  const { t } = useTranslation();
  const chartWidth = Dimensions.get('window').width * 0.9;
  return (
    <View
      style={{
        position: 'relative',
        minHeight: 250,
        paddingBottom: 20,
      }}>
      {chartLoading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color={lineColor} />
        </View>
      ) : (
        <>
          {data.length === 0 && (
            <View
              style={{
                flexDirection: 'row',
                height: 250,
                alignItems: 'center',
              }}>
              <P2Text
                label={t('assets.null_transaction')}
                style={{ textAlign: 'center', width: '100%' }}
              />
            </View>
          )}
          {data.length === 1 && (
            <View
              style={{
                flexDirection: 'row',
                height: 250,
                alignItems: 'center',
              }}>
              <P2Text
                label={t('assets.null_data')}
                style={{ textAlign: 'center', width: '100%' }}
              />
            </View>
          )}
          {data.length >= 2 && (
            <Chart
              style={{ height: 250, width: '100%' }}
              data={data}
              padding={{ bottom: 0, top: 40 }}
              xDomain={{ min: data[0].x, max: data[data.length - 1].x }}
              yDomain={{ min: -1, max: maxY + 1 }}>
              <HorizontalAxis
                tickCount={5}
                theme={{
                  axis: {
                    stroke: {
                      color: lineColor,
                      dashArray: [5],
                      width: 1,
                    },
                  },
                  grid: {
                    visible: false,
                  },
                  labels: {
                    visible: false,
                  },
                  ticks: {
                    visible: false,
                  },
                }}
              />
              <Line
                theme={{
                  stroke: { color: lineColor, width: 4 },
                }}
                onTooltipSelect={(value) => {
                  setChartLoc(((value.x - 1) * chartWidth) / (data.length - 1));
                  setChartDate(
                    moment.unix(value?.dateTime).format('YYYY.MM.DD'),
                  );
                  setChartToken(value?.y.toString() || 0);
                  setIsChartLine(true);
                }}
              />
              {/* 차트 클릭시 클릭한 부분 토큰과 날짜를 표시해주는 컴포넌트*/}
              {isChartLine && (
                <ClickChartLine chartLoc={chartLoc} chartWidth={chartWidth} />
              )}
            </Chart>
          )}
        </>
      )}
    </View>
  );
};

export default AssetGraph;
