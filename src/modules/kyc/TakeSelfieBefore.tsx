/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';

import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import SelfieBeforePng from './images/selfiebefore.png';
import { KycPage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import { Modal } from '../../shared/components/Modal';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 40px;
  margin-left: 5%;
  margin-bottom: 6px;
`;
const PText = styled.Text`
  color: #626368;
  font-size: 13px;
  margin: 0px 5%;
`;
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  width: 90%;
  height: 206px;
  left: 5%;
  border-radius: 13px;
  border: solid 2px #d0d8df;
  margin-bottom: 23px;
`;
const Selfie = styled.Image`
  width: 212px;
  height: 195px;
  margin: 9px auto 0px auto;
`;
const TakeSelfieBeforeWrapper = styled.SafeAreaView`
  padding-top: 25px;
  flex: 1;
  background-color: #ffffff;
`;
const InformationWrapper = styled.View`
  margin-left: 5%;
`;
const InformationText = styled.Text`
  font-size: 14px;
  color: #1c1c1c;
  margin-top: 15px;
`;
const InformationCircle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #3679b5;
  border-radius: 10px;
`;

type ParamList = {
  TakeSelfieBefore: {
    id_type: string;
    idPhoto: any;
  };
};

export const TakeSelfieBefore: FunctionComponent<{}> = () => {
  const [state, setState] = useState({
    modalVisible: false,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'TakeSelfieBefore'>>();

  return (
    <TakeSelfieBeforeWrapper>
      <ScrollView>
        <BackButton
          handler={() => navigation.navigate(KycPage.ConfirmID)}
          style={{ marginTop: 30, marginLeft: 20 }}
        />
        <H1Text>{i18n.t('kyc.step2')}</H1Text>
        <PText style={{ marginBottom: 42 }}>{i18n.t('kyc.step2_text')}</PText>
        <Container>
          <Selfie source={SelfieBeforePng} />
        </Container>
        <InformationWrapper>
          <InformationText>
            <InformationCircle /> {i18n.t('kyc.step2_desc1')}
          </InformationText>
          <InformationText>
            <InformationCircle /> {i18n.t('kyc.step2_desc2')}
          </InformationText>
        </InformationWrapper>
      </ScrollView>
      <SubmitButton
        title={i18n.t('kyc_label.shoot')}
        handler={() => setState({ modalVisible: true })}
        style={{ marginBottom: 10 }}
      />
      {state.modalVisible === true && (
        <Modal
          child={
            <View>
              <H1Text style={{ textAlign: 'center' }}>
                {i18n.t('kyc.take_selfie_before_title')}
              </H1Text>
              <PText style={{ textAlign: 'center', marginBottom: 10 }}>
                {i18n.t('kyc.decline_warning')}
              </PText>
              <View
                style={{
                  backgroundColor: '#F1F1F1',
                  borderRadius: 10,
                  width: '100%',
                  padding: 15,
                  marginBottom: 10,
                }}>
                <PText style={{ marginBottom: 5 }}>
                  {i18n.t('kyc.decline_case1')}
                </PText>
                <PText style={{ marginBottom: 5 }}>
                  {i18n.t('kyc.decline_case2')}
                </PText>
                <PText style={{ marginBottom: 5 }}>
                  {i18n.t('kyc.decline_case3')}
                </PText>
                <PText style={{ marginBottom: 5 }}>
                  {i18n.t('kyc.decline_case4')}
                </PText>
                <PText style={{ marginBottom: 5 }}>
                  {i18n.t('kyc.decline_case5')}
                </PText>
              </View>
              <SubmitButton
                title={i18n.t('kyc.accepted_shoot')}
                handler={() => {
                  setState({ modalVisible: false });
                  navigation.navigate(KycPage.TakeSelfie, {
                    id_type: route.params.id_type,
                    // photoId_hash: photoId_hash,
                    idPhoto: route.params.idPhoto,
                  });
                }}
              />
            </View>
          }
          modalHandler={() => {
            setState({ modalVisible: false });
          }}
          visible={state.modalVisible}></Modal>
      )}
    </TakeSelfieBeforeWrapper>
  );
};
