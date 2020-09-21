import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { OptionButton } from './components/OptionButton';

import CheckedPng from './images/checked.png';
import PassportPng from './images/passport.png';
import DriverPng from './images/driver.png';
import IDCardPng from './images/idcard.png';
import CheckedPassportPng from './images/checkedpassport.png';
import CheckedDriverPng from './images/checkeddriver.png';
import CheckedIDCardPng from './images/checkedidcard.png';

import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin: 40px 5% 6px 5%;
`;
const PText = styled.Text`
  color: #626368;
  font-size: 13px;
  margin: 0px 5%;
  margin-bottom: 42px;
`;
const IDImg = styled.Image`
  width: 28px;
  height: 28px;
  margin: 6px 11px 6px 22px;
`;
const Checked = styled.Image`
  width: 12px;
  height: 12px;
  margin-top: 12px;
  margin-right: 15px;
`;
const SelectIdWrapper = styled.View`
  padding-top: 25px;
  flex: 1;
  background-color: #fff;
`;

export const SelectID: FunctionComponent<{}> = props => {
  const [state, setState] = useState({
    idType: '',
  });
  const navigation = useNavigation();

  const setID = (text: string) => {
    state.idType !== text
      ? setState({ idType: text })
      : setState({ idType: '' });
  };

  return (
    <SelectIdWrapper>
      <BackButton
        handler={() => navigation.goBack()}
        style={{ marginTop: 30, marginLeft: 20 }}
      />
      <H1Text>{i18n.t('kyc.step1')}</H1Text>
      <PText>{i18n.t('kyc.step1_text')}</PText>
      <OptionButton
        title={i18n.t('kyc_label.passport')}
        handler={() => setID('passport')}
        child={
          <IDImg
            source={
              state.idType === 'passport' ? CheckedPassportPng : PassportPng
            }
          />
        }
        checked={
          state.idType === 'passport' ? (
            <Checked source={CheckedPng} />
          ) : (
            <View />
          )
        }
        selected={state.idType === 'passport' ? 'selected' : ''}
      />
      <OptionButton
        title={i18n.t('kyc_label.drivers_license')}
        handler={() => setID('drivers_license')}
        child={
          <IDImg
            source={
              state.idType === 'drivers_license' ? CheckedDriverPng : DriverPng
            }
          />
        }
        checked={
          state.idType === 'drivers_license' ? (
            <Checked source={CheckedPng} />
          ) : (
            <View />
          )
        }
        selected={state.idType === 'drivers_license' ? 'selected' : ''}
      />
      <OptionButton
        title={i18n.t('kyc_label.government_id')}
        handler={() => setID('government_id')}
        child={
          <IDImg
            source={
              state.idType === 'government_id' ? CheckedIDCardPng : IDCardPng
            }
          />
        }
        checked={
          state.idType === 'government_id' ? (
            <Checked source={CheckedPng} />
          ) : (
            <View />
          )
        }
        selected={state.idType === 'government_id' ? 'selected' : ''}
      />
      <SubmitButton
        title={i18n.t('kyc_label.shoot')}
        handler={() => {
          if (state.idType === '') {
            alert(i18n.t('kyc.alert_id'));
          } else {
            navigation.navigate(KycPage.TakeID, {
              // eslint-disable-next-line @typescript-eslint/camelcase
              id_type: state.idType,
            });
          }
        }}
        style={{ marginTop: 'auto', marginBottom: 10 }}
      />
    </SelectIdWrapper>
  );
};
