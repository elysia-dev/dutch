import React, { FunctionComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from 'react-native';
import Dash from 'react-native-dash';
import { H1Text, P1Text } from '../../../shared/components/Texts';

interface Props {
  ownership: {
    id: number;
    title: string;
    productType: string;
    value: number;
    profit: number;
  };

  handler: () => void;
}

export const Asset: FunctionComponent<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={props.handler}
      style={{ width: '47%', elevation: 6 }}>
      <View
        style={{
          backgroundColor:
            props.ownership.productType === 'commercial'
              ? '#33ADCC'
              : '#30C2B8',
          width: '100%',
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#1C1C1C4D',
          shadowOpacity: 0.8,
          shadowRadius: 7,
          padding: 15,
          paddingTop: 23,
          marginBottom: 25,
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Image
            style={{ width: 40, height: 40 }}
            source={
              props.ownership.productType === 'commercial'
                ? require('../images/commercial.png')
                : require('../images/residential.png')
            }
          />
          <P1Text
            label={props.ownership.title}
            style={{ flex: 2, color: '#fff' }}
          />
        </View>
        <H1Text
          style={{
            flex: 2,
            color: '#fff',
            fontSize: PixelRatio.roundToNearestPixel(
              (Dimensions.get('window').width * 0.47) / 7,
            ),
            marginBottom: 10,
            bottom: 0,
          }}
          label={`$ ${parseFloat(`${props.ownership.value}`).toFixed(2)}`}
        />
        <Dash
          dashGap={4}
          dashLength={2}
          dashThickness={2}
          dashColor={'rgba(255, 255, 255, 0.6)'}
          style={{ width: '100%', height: 1 }}
          dashStyle={{
            borderRadius: 100,
            overflow: 'hidden',
          }}></Dash>
        <P1Text
          label={`$ ${parseFloat(`${props.ownership.profit}`).toFixed(2)}`}
          style={{
            flex: 2,
            marginTop: 15,
            color: '#fff',
            fontSize: 18,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};
