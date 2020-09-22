import React, { FunctionComponent, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { Calculator } from './components/Calculator';
import WrappedInfo from './components/WrappedInfo';
import Product from '../../types/product';
import UserContext from '../../contexts/UserContext';
import LocaleType from '../../enums/LocaleType';
import { Map } from './components/Map';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';

const PaymentSelection: FunctionComponent = () => {
  return (
    // <View
    //   style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: '50%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <Text>Testing a modal with transparent background</Text>
    </View>
    // </View>
  );
};

export default PaymentSelection;
