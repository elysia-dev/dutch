import React, { FunctionComponent, useState } from 'react';
import { View, Text, Modal } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import ClockPng from './images/clock.png';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { PText } from '../../shared/components/PText';
import { TitleText } from '../../shared/components/TitleText';
import { Argos } from './Argos';

const ClockImg = styled.Image`
  width: 13px;
  height: 13px;
  resize-mode: center;
`;
const Circle = styled.Text`
  width: 26px;
  height: 26px;
  background-color: #3679b5;
  border-radius: 13px;
  color: #fff;
  line-height: 25px;
  text-align: center;
  overflow: hidden;
`;
const CircleWrapper = styled.View`
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 50px;
  font-size: 13px;
`;
const HrLine = styled.View`
  position: absolute;
  height: 175px;
  border-left-width: 1px;
  border-left-color: #3679b5;
  left: 12px;
  margin-left: 5%;
`;

const StartKYC: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    agree: false,
    modalVisible: false,
  });
  return (
    <WrapperLayout
      backButtonHandler={() => {
        navigation.goBack();
      }}
      title={i18n.t('kyc.start')}
      subTitle={
        <>
          <ClockImg
            source={ClockPng}
            style={{
              marginTop: 2,
              resizeMode: 'center',
              height: 13,
              width: 13,
              marginRight: 3,
            }}
          />
          <PText
            label={i18n.t('kyc.start_text')}
            style={{ color: '#626368' }}
          />
        </>
      }
      isScrolling={true}
      body={
        <>
          <View style={{ marginTop: 20 }}>
            <HrLine />
            <CircleWrapper>
              <Circle>1</Circle>
              <PText
                label={i18n.t('kyc.start_step1')}
                style={{
                  position: 'absolute',
                  fontSize: 14,
                  marginLeft: 36,
                  marginTop: 3,
                  marginBottom: 42,
                }}
              />
            </CircleWrapper>
            <CircleWrapper>
              <Circle>2</Circle>
              <PText
                label={i18n.t('kyc.start_step2')}
                style={{
                  position: 'absolute',
                  fontSize: 14,
                  marginLeft: 36,
                  marginTop: 3,
                  marginBottom: 42,
                }}
              />
            </CircleWrapper>
            <CircleWrapper>
              <Circle>3</Circle>
              <PText
                label={i18n.t('kyc.start_step3')}
                style={{
                  position: 'absolute',
                  fontSize: 14,
                  marginLeft: 36,
                  marginTop: 3,
                  marginBottom: 42,
                }}
              />
            </CircleWrapper>
            <Modal
              transparent={true}
              animationType={'slide'}
              visible={state.modalVisible}>
              <Argos
                updateAgree={() =>
                  setState({ ...state, modalVisible: false, agree: true })
                }
              />
            </Modal>
          </View>
        </>
      }
      button={
        <>
          <SubmitButton
            title={i18n.t('kyc_label.argos_terms')}
            handler={() => setState({ ...state, modalVisible: true })}
            variant={'WhiteTheme'}
            style={{ marginBottom: 10 }}
          />
          <SubmitButton
            title={i18n.t('kyc_label.agree_start')}
            handler={() =>
              state.agree === false
                ? alert(i18n.t('kyc.argos'))
                : navigation.navigate(KycPage.SelectID)
            }
            variant={state.agree === false ? 'GrayTheme' : undefined}
          />
        </>
      }
    />
  );
};
export default StartKYC;
