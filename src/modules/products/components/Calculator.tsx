import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';
import { P1Text, H3Text, H2Text } from '../../../shared/components/Texts';

interface Props {
  sliderHandler: (value: number) => void;
  buttonHandler: (value: number) => void;
  tokenName: string;
  tokenCount: number;
  return?: string;
  type?: string;
  max: number;
}

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
      style={{ width: '100%', height: '40%' }}>
      <P1Text
        label={props.type === 'refund'
        ? i18n.t('product_label.refund_token_count')
        : i18n.t('product_label.token_count')}
        style={{ marginBottom: 10 }} />
      <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <H2Text label={Math.round(props.tokenCount).toString()} style={{ color: "#3679b5" }} />
        <H3Text label={`${props.tokenName} Token`} style={{ zIndex: 3, marginTop: 5, marginLeft: 5 }} />
      </View>

      <View style={{ marginTop: 10, width: '100%' }}>
        <Slider
          style={{
            elevation: 6,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            borderWidth: 1,
            borderColor: "#000",
          }}
          minimumValue={0}
          maximumValue={props.max}
          minimumTrackTintColor={'#3679B5'}
          maximumTrackTintColor={'#E9EBEF'}
          thumbTintColor={'#3679B5'}
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
            allowFontScaling={false}
            style={{
              color: '#3679B5',
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Roboto_400Regular',
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
              allowFontScaling={false}
              style={{
                color: '#3679B5',
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'Roboto_400Regular',
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
              allowFontScaling={false}
              style={{
                color: '#3679B5',
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'Roboto_400Regular',
              }}>
              {'+ 100 T'}
            </Text>
          </CountButton>
        }
      </View>
    </View>
  );
};
