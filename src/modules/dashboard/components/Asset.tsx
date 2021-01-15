import React, { FunctionComponent, useContext } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Dash from 'react-native-dash';
import RootContext from '../../../contexts/RootContext';
import { H1Text, H2Text, H3Text, P1Text } from '../../../shared/components/Texts';
import currencyFormatter from '../../../utiles/currencyFormatter';

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
  const { currencyUnit, currencyRatio } = useContext(RootContext);
  const ownershipValue = currencyFormatter(
    currencyUnit,
    currencyRatio,
    props.ownership.value,
    2,
  );

  const fontSizeCalcurator = (length: number): number => {
    return 28 - 3 * Math.floor((length - 1) / 3);
  }

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
            marginBottom: 10,
            bottom: 0,
            fontSize: fontSizeCalcurator(ownershipValue.length),
          }}
          label={ownershipValue}
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
        <View style={{ flexDirection: 'row', flex: 2 }}>
          <P1Text
            label={currencyFormatter(
              currencyUnit,
              currencyRatio,
              props.ownership.profit,
              2,
            )}
            style={{
              marginTop: 15,
              color: '#fff',
              fontSize: 18,
            }}
          />
          <View
            style={{
              alignSelf: 'center',
              marginLeft: 5,
              marginTop: 5,
              width: 0,
              height: 0,
              borderTopWidth: 0,
              borderBottomWidth: 8,
              borderLeftWidth: 5,
              borderRightWidth: 5,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#fff',
              borderLeftColor: 'transparent',
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
