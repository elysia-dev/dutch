import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';

interface Props {
  sliderHandler: (value: number) => void;
  buttonHandler: (value: number) => void;
  tokenName: string;
  tokenCount: number;
  return?: string;
  type?: string;
  max: number;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
  font-weight: bold;
  margin-top: 5px;
  margin-left: 5px;
`;
const CountText = styled.Text`
  color: #3679b5;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
  margin-left: -4px;
`;
const CountButton = styled.TouchableOpacity`
  width: 54px;
  height: 26px;
  border-radius: 5px;
  border-width: 1px;
  justify-content: center;
  align-content: center;
`;

export const Calculator: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{ width: '100%', height: '40%', position: 'relative', top: 0 }}>
      <Text
        style={{
          color: '#1C1C1C',
          textAlign: 'left',
          fontSize: 15,
          marginBottom: 10,
        }}>
        {props.type === 'refund'
          ? i18n.t('product_label.refund_token_count')
          : i18n.t('product_label.token_count')}
      </Text>
      <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <CountText> {Math.round(props.tokenCount)}</CountText>
        <H1Text>{`${props.tokenName} Token`}</H1Text>
      </View>

      <View style={{ marginTop: 10, width: '100%' }}>
        <Slider
          minimumValue={0}
          maximumValue={props.max}
          minimumTrackTintColor={'#3679B5'}
          maximumTrackTintColor={'#E9EBEF'}
          thumbTintColor={'#fff'}
          value={props.tokenCount}
          step={1}
          onValueChange={props.sliderHandler}></Slider>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <CountButton
          onPress={() => props.buttonHandler(1)}
          style={{
            borderColor: '#3679B5',
          }}>
          <Text
            style={{
              color: '#3679B5',
              fontSize: 15,
              textAlign: 'center',
            }}>
            {'+ 01 T'}
          </Text>
        </CountButton>
        {
          props.max >= 10 && <CountButton
            onPress={() => props.buttonHandler(10)}
            style={{
              borderColor: '#3679B5',
              marginLeft: 10,
            }}>
            <Text
              style={{
                color: '#3679B5',
                fontSize: 15,
                textAlign: 'center',
              }}>
              {'+ 10 T'}
            </Text>
          </CountButton>
        }
        {
          props.max >= 100 && <CountButton
            onPress={() => props.buttonHandler(100)}
            style={{
              borderColor: '#3679B5',
              marginLeft: 10,
            }}>
            <Text
              style={{
                color: '#3679B5',
                fontSize: 15,
                textAlign: 'center',
              }}>
              {'+ 100 T'}
            </Text>
          </CountButton>
        }
      </View>
    </View>
  );
};
