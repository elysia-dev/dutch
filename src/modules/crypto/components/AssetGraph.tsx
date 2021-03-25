import React from 'react';
import { View } from 'react-native';
import { P2Text } from '../../../shared/components/Texts';
import { Chart, Line, HorizontalAxis, ChartDataPoint, } from 'react-native-responsive-linechart'
import AppColors from '../../../enums/AppColors';
import CustomChartTooltip from './CustomChartTooltip';
import { useTranslation } from 'react-i18next';

interface IAssetGraph {
  data: ChartDataPoint[],
  lineColor: AppColors,
}

const AssetGraph: React.FC<IAssetGraph> = ({
  data,
  lineColor,
}) => {
  const maxY = data.reduce((res, cur) => cur.y >= res ? cur.y : res, 0);
  const { t } = useTranslation();

  return (
    <View
      style={{
        position: 'relative',
        minHeight: 200,
        paddingBottom: 20,
      }}
    >
      {
        data.length === 0 && <View
          style={{
            flexDirection: 'row',
            height: 200,
            alignItems: 'center'
          }}
        >
          <P2Text label={t('assets.null_transaction')} style={{ textAlign: 'center', width: '100%' }} />
        </View>
      }
      {
        data.length === 1 && <View
          style={{
            flexDirection: 'row',
            height: 200,
            alignItems: 'center'
          }}
        >
          <P2Text label={t('assets.null_data')} style={{ textAlign: 'center', width: '100%' }} />
        </View>
      }
      {
        data.length >= 2 && <Chart
          style={{ height: 250, width: '100%' }}
          data={data}
          padding={{ bottom: 2, top: 70 }}
          xDomain={{ min: data[0].x, max: data[data.length - 1].x }}
          yDomain={{ min: -1, max: maxY + 1 }}
        >
          <HorizontalAxis
            tickCount={5}
            theme={{
              axis: {
                stroke: {
                  color: AppColors.SUB_BLACK,
                  dashArray: [5],
                  width: 1,
                }
              },
              grid: {
                visible: false,
              },
              labels: {
                visible: false,
              },
              ticks: {
                visible: false,
              }
            }}
          />
          <Line
            tooltipComponent={<CustomChartTooltip />}
            theme={{
              stroke: { color: lineColor, width: 4 },
              scatter: {
                selected: {
                  width: 1,
                  height: 230,
                  dy: -100,
                  color: AppColors.SUB_BLACK
                },
              }
            }}
          />
        </Chart>
      }
    </View >
  );
};

export default AssetGraph
