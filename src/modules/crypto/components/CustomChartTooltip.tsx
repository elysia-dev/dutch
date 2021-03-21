import * as React from 'react'
import { Dimensions } from 'react-native';
import moment from 'moment';
import { ChartDataPoint, XYValue } from 'react-native-responsive-linechart';
import { Text } from 'react-native-svg';

type Props = {
  value?: ChartDataPoint
  position?: XYValue
}

const CustomChartTooltip: React.FC<Props> = ({ value, position }) => {
  const valueY = value?.y || 0;
  const yStringLength = valueY.toString().length;
  const minPositionX = 5 * yStringLength - (yStringLength > 10 ? 4 : 0);
  const minDayPositionX = 15;
  const positionY = position?.y || 0;
  const positionX = position?.x || 0;
  const maxPositionX = Dimensions.get('window').width * 0.9 - minPositionX;
  const maxDayPositionX = Dimensions.get('window').width * 0.9 - minDayPositionX;

  //x position is problems...
  //Why?

  return (
    <React.Fragment>
      <Text
        x={
          positionX >= maxDayPositionX ? maxDayPositionX :
            positionX >= minDayPositionX ? positionX : minDayPositionX
        }
        y={positionY - 45}
        fontSize={10}
        textAnchor={'middle'}
        opacity={1}
        fill={'#C3C3C3'}
      >
        {moment(value?.x).format('MM.DD')}
      </Text>
      <Text
        x={
          positionX >= maxPositionX ? maxPositionX :
            positionX >= minPositionX ? positionX : minPositionX
        }
        y={positionY - 30}
        fontSize={14}
        textAnchor={'middle'}
        opacity={1}
        fill={'#848484'}
        fontWeight={700}
      >
        {value?.y.toString() || 0}
      </Text>
    </React.Fragment>
  )
};

export default CustomChartTooltip