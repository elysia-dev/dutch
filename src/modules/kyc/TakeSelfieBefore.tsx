/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { SubmitButton } from '../../shared/components/SubmitButton';
import SelfieBeforePng from './images/selfiebefore.png';
import { KycPage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import { Modal } from '../../shared/components/Modal';
import { H1Text, P1Text, P3Text, SubTitleText } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';

const Container = styled.View`
  background-color: #fff;
  width: 90%;
  height: 206px;
  left: 5%;
  border-radius: 13px;
  border: solid 2px #d0d8df;
  margin-bottom: 23px;
`;
const Selfie = styled.Image`
  margin: 9px auto 0px auto;
  resize-mode: stretch;
  flex: 1;
  top: 1px;
`;
const InformationCircle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #3679b5;
  border-radius: 10px;
  margin-right: 10px;
  top: 2px;
`;

type ParamList = {
  TakeSelfieBefore: {
    id_type: string;
    idPhoto: any;
  };
};

const TakeSelfieBefore: FunctionComponent<{}> = () => {
  const [state, setState] = useState({
    modalVisible: false,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'TakeSelfieBefore'>>();

  return (
    <>
      <WrapperLayout
        backButtonHandler={() => navigation.navigate(KycPage.ConfirmID)}
        isScrolling={false}
        title={i18n.t('kyc.step2')
        }
        subTitle={<SubTitleText
          label={i18n.t('kyc.step2_text')}
          style={{ color: '#626368', marginBottom: 15 }}
        />}
        body={
          <>
            <Container>
              <Selfie source={SelfieBeforePng} />
            </Container>
            <View style={{ marginLeft: '5%', marginRight: '5%' }}>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <InformationCircle />
                <P1Text
                  label={i18n.t('kyc.step2_desc1')}
                  style={{ fontSize: 13, lineHeight: 15 }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <InformationCircle />
                <P1Text
                  label={i18n.t('kyc.step2_desc2')}
                  style={{ fontSize: 13, lineHeight: 15 }}
                />
              </View>
            </View>
          </>
        }
        button={
          <SubmitButton
            title={i18n.t('kyc_label.shoot')}
            handler={() => setState({ modalVisible: true })}
          />
        }
      />
      {state.modalVisible === true && (
        <>
          <View
            style={{
              top: 25,
              position: 'absolute',
              height: '100%',
              width: '100%',
              zIndex: 999,
              backgroundColor: '#000000',
              opacity: 0.6,
            }}
          />
          <Modal
            child={
              <View>
                <H1Text
                  style={{ textAlign: 'center', marginBottom: 10 }}
                  label={i18n.t('kyc.take_selfie_before_title')}
                />
                <P3Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: '#626368',
                  }}
                  label={i18n.t('kyc.decline_warning')}
                />
                <View
                  style={{
                    backgroundColor: '#F1F1F1',
                    borderRadius: 10,
                    width: '100%',
                    padding: 18,
                    marginBottom: 32,
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <InformationCircle />
                    <P1Text
                      style={{ marginBottom: 18, fontSize: 14, lineHeight: 15 }}
                      label={i18n.t('kyc.decline_case1')}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <InformationCircle />
                    <P1Text
                      style={{ marginBottom: 18, fontSize: 14, lineHeight: 15 }}
                      label={i18n.t('kyc.decline_case2')}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <InformationCircle />
                    <P1Text
                      style={{ marginBottom: 18, fontSize: 14, lineHeight: 15 }}
                      label={i18n.t('kyc.decline_case3')}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <InformationCircle />
                    <P1Text
                      style={{ marginBottom: 18, fontSize: 14, lineHeight: 15 }}
                      label={i18n.t('kyc.decline_case4')}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <InformationCircle />
                    <P1Text
                      style={{ fontSize: 14, lineHeight: 15 }}
                      label={i18n.t('kyc.decline_case5')}
                    />
                  </View>
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
                  style={{ width: '100%', right: '5%' }}
                />
              </View>
            }
            modalHandler={() => {
              setState({ modalVisible: false });
            }}
            visible={state.modalVisible}></Modal>
        </>
      )}
    </>
  );
};
export default TakeSelfieBefore;
