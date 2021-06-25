import React, { useCallback, useContext, useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import moment from 'moment';
import { ChartDataPoint, XYValue } from 'react-native-responsive-linechart';
import { Text } from 'react-native-svg';
import ChartDataContext from '../../../contexts/ChartDataContext';

type Props = {
  value: ChartDataPoint;
  position?: XYValue;
};

const CustomChartTooltip: React.FC<Props> = ({ value, position }) => {
  const valueY = value?.y || 0;
  const yStringLength = valueY.toString().length;
  const minPositionX = 5 * yStringLength - (yStringLength > 10 ? 4 : 0);
  const minDayPositionX = 15;
  const positionY = position?.y || 0;
  const positionX = position?.x || 0;
  const maxPositionX = Dimensions.get('window').width * 0.9 - minPositionX;
  const maxDayPositionX =
    Dimensions.get('window').width * 0.9 - minDayPositionX;
  //x position is problems...
  //Why?

  function dayPositionX(): number {
    return positionX <= maxDayPositionX * 0.1
      ? value?.y.toString().length >= 7
        ? 40
        : 28
      : positionX >= maxDayPositionX * 0.92
      ? value?.y.toString().length >= 7
        ? maxDayPositionX - 35
        : maxDayPositionX - 18
      : positionX >= maxDayPositionX
      ? maxDayPositionX
      : positionX >= minDayPositionX
      ? positionX
      : minDayPositionX;
  }

  function valuePositionX(): number {
    return positionX <= maxDayPositionX * 0.1
      ? value?.y.toString().length >= 7
        ? 40
        : 28
      : positionX >= maxDayPositionX * 0.92
      ? value?.y.toString().length >= 7
        ? maxDayPositionX - 35
        : maxDayPositionX - 18
      : positionX >= maxPositionX
      ? maxPositionX
      : positionX >= minPositionX
      ? positionX
      : minPositionX;
  }

  return (
    <React.Fragment>
      <Text
        // 시작점과 끝지점의 텍스트가 잘려서 잘리지 않도록 설정한 값
        x={dayPositionX()}
        y={positionY - 100}
        fontSize={10}
        textAnchor={'middle'}
        opacity={1}
        fill={'#C3C3C3'}>
        {moment.unix(value?.dateTime).format('YYYY.MM.DD')}
      </Text>
      <Text
        // 시작점과 끝지점의 텍스트가 잘려서 잘리지 않도록 설정한 값
        x={valuePositionX()}
        y={positionY - 30}
        fontSize={14}
        textAnchor={'middle'}
        opacity={1}
        fill={'#848484'}
        fontWeight={700}>
        {value?.y.toString() || 0}
      </Text>
    </React.Fragment>
  );
};

export default CustomChartTooltip;
