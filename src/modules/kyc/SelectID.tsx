import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { OptionButton } from './components/OptionButton';
import CheckedPng from './images/checked.png';
import PassportPng from './images/passport.png';
import DriverPng from './images/driver.png';
import IDCardPng from './images/idcard.png';
import CheckedPassportPng from './images/checkedpassport.png';
import CheckedDriverPng from './images/checkeddriver.png';
import CheckedIDCardPng from './images/checkedidcard.png';
import WrapperLayout from '../../shared/components/WrapperLayout';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import { SubTitleText } from '../../shared/components/Texts';
import KycContext from '../../contexts/KycContext';

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

const SelectID: FunctionComponent<{}> = (props) => {
  const [state, setState] = useState({
    idType: '',
  });
  const navigation = useNavigation();
  const { setIdType } = useContext(KycContext);

  const setID = (text: string) => {
    if (state.idType !== text) {
      setState({ idType: text });
    } else {
      setState({ idType: '' });
    }
  };

  return (
    <WrapperLayout
      backButtonHandler={() => navigation.goBack()}
      title={i18n.t('kyc.step1')}
      subTitle={
        <SubTitleText
          label={i18n.t('kyc.step1_text')}
          style={{ color: '#626368', marginBottom: 42, fontSize: 15 }}
        />
      }
      isScrolling={false}
      body={
        <>
          <View style={{ marginTop: 20 }} />
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
                  state.idType === 'drivers_license'
                    ? CheckedDriverPng
                    : DriverPng
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
                  state.idType === 'government_id'
                    ? CheckedIDCardPng
                    : IDCardPng
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
        </>
      }
      button={
        <SubmitButton
          title={i18n.t('kyc_label.shoot')}
          handler={() => {
            if (state.idType === '') {
              alert(i18n.t('kyc.alert_id'));
            } else {
              setIdType(state.idType);
              navigation.navigate(KycPage.TakeID);
            }
          }}
        />
      }
    />
  );
};
export default SelectID;
