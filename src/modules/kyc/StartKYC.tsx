import React, { FunctionComponent, useState } from 'react';
import { View, Modal, Text } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import ClockPng from './images/clock.png';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { P1Text, SubTitleText } from '../../shared/components/Texts';
import { Argos } from './Argos';

const ClockImg = styled.Image`
  width: 13px;
  height: 13px;
`;
const Circle = styled.View`
  width: 26px;
  height: 26px;
  background-color: #3679b5;
  border-radius: 13px;
`;
const CircleText = styled.Text`
  width: 26px;
  line-height: 26px;
  text-align: center;
  font-family: 'Roboto_400Regular';
  color: #fff;
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
              marginTop: -1,
              height: 15,
              width: 15,
            }}
          />
          <SubTitleText
            label={' ' + i18n.t('kyc.start_text')}
            style={{ color: '#626368' }}
          />
        </>
      }
      isScrolling={false}
      body={
        <>
          <View style={{ marginTop: 20 }}>
            <HrLine />
            <CircleWrapper>
              <Circle>
                <CircleText allowFontScaling={false}>{1}</CircleText>
              </Circle>
              <P1Text
                label={i18n.t('kyc.start_step1')}
                style={{
                  position: 'absolute',
                  fontSize: 14,
                  marginLeft: 36,
                  marginTop: 3,
                  marginBottom: 42,
                  lineHeight: 20,
                }}
              />
            </CircleWrapper>
            <CircleWrapper>
              <Circle>
                <CircleText allowFontScaling={false}>{2}</CircleText>
              </Circle>
              <P1Text
                label={i18n.t('kyc.start_step2')}
                style={{
                  position: 'absolute',
                  fontSize: 14,
                  marginLeft: 36,
                  marginTop: 3,
                  marginBottom: 42,
                  lineHeight: 20,
                }}
              />
            </CircleWrapper>
            <CircleWrapper>
              <Circle>
                <CircleText allowFontScaling={false}>{3}</CircleText>
              </Circle>
              <P1Text
                label={i18n.t('kyc.start_step3')}
                style={{
                  position: 'absolute',
                  fontSize: 14,
                  marginLeft: 36,
                  marginTop: 3,
                  marginBottom: 42,
                  lineHeight: 20,
                }}
              />
            </CircleWrapper>
            <P1Text
              style={{
                color: '#626368',
                marginHorizontal: '5%',
              }}
              label={'* ' + i18n.t('FAQ.question.4')}
            />
            <P1Text
              style={{
                color: '#626368',
                marginHorizontal: '5%',
              }}
              label={i18n.t('FAQ.answer.4')}
            />
            <P1Text
              style={{
                color: '#626368',
                margin: '5%',
              }}
              label={'* ' + i18n.t('kyc.result')}
            />

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
