import React, { Component, FunctionComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';

const GText = styled.Text`
  color: #838383;
  font-size: 12px;
  text-align: left;
`;
const Item = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

interface Props {
  name: string;
  rate: string;
  expectedSale: string;
}

export const OwnershipItem: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{
        marginTop: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingBottom: 15,
        // marginBottom: 15,
      }}>
      <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, height: 50 }}>
        <Image
          source={require('../images/building.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'center',
          }}></Image>
      </View>
      <View
        style={{
          flex: 4,
          flexDirection: 'column',
        }}>
        <Item>
          <GText>{i18n.t('more_label.product_name')}</GText>
          <Text>{props.name}</Text>
        </Item>
        <Item>
          <GText>{i18n.t('more_label.entire_profit')}</GText>
          <Text>{`${props.rate}%`}</Text>
        </Item>
        <Item>
          <GText>{i18n.t('more_label.expectd_sale_profit')}</GText>
          <Text>{`${props.expectedSale}%`}</Text>
        </Item>
      </View>
    </View>
  );
};
