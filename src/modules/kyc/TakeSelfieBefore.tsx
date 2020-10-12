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
import { TitleText } from '../../shared/components/TitleText';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
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
    <WrapperLayout
      isBackbutton={true}
      isScrolling={false}
      title={
        <>
          <BackButton handler={() => navigation.navigate(KycPage.ConfirmID)} />
          <H1Text
            label={i18n.t('kyc.step2')}
            style={{ marginTop: 40, marginBottom: 6 }}
          />
          <PText
            label={i18n.t('kyc.step2_text')}
            style={{ marginBottom: 23, color: '#626368' }}
          />
        </>
      }
      body={
        <>
          <Container>
            <Selfie source={SelfieBeforePng} />
          </Container>
          <View style={{ marginLeft: '5%' }}>
            <View style={{ flexDirection: 'row', marginBottom: 26 }}>
              <InformationCircle />
              <PText
                label={i18n.t('kyc.step2_desc1')}
                style={{ fontSize: 15, lineHeight: 15 }}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <InformationCircle />
              <PText
                label={i18n.t('kyc.step2_desc2')}
                style={{ fontSize: 15, lineHeight: 15 }}
              />
            </View>
          </View>
        </>
      }
      button={
        <SubmitButton
          title={i18n.t('kyc_label.shoot')}
          handler={() => setState({ modalVisible: true })}
          style={{ marginBottom: 10 }}
        />
      }
    />
    // <TakeSelfieBeforeWrapper>
    //   {state.modalVisible === true && (
    //     <Modal
    //       child={
    //         <View>
    //           <H1Text style={{ textAlign: 'center' }}>
    //             {i18n.t('kyc.take_selfie_before_title')}
    //           </H1Text>
    //           <PText style={{ textAlign: 'center', marginBottom: 10 }}>
    //             {i18n.t('kyc.decline_warning')}
    //           </PText>
    //           <View
    //             style={{
    //               backgroundColor: '#F1F1F1',
    //               borderRadius: 10,
    //               width: '100%',
    //               padding: 15,
    //               marginBottom: 10,
    //             }}>
    //             <PText style={{ marginBottom: 5 }}>
    //               {i18n.t('kyc.decline_case1')}
    //             </PText>
    //             <PText style={{ marginBottom: 5 }}>
    //               {i18n.t('kyc.decline_case2')}
    //             </PText>
    //             <PText style={{ marginBottom: 5 }}>
    //               {i18n.t('kyc.decline_case3')}
    //             </PText>
    //             <PText style={{ marginBottom: 5 }}>
    //               {i18n.t('kyc.decline_case4')}
    //             </PText>
    //             <PText style={{ marginBottom: 5 }}>
    //               {i18n.t('kyc.decline_case5')}
    //             </PText>
    //           </View>
    //           <SubmitButton
    //             title={i18n.t('kyc.accepted_shoot')}
    //             handler={() => {
    //               setState({ modalVisible: false });
    //               navigation.navigate(KycPage.TakeSelfie, {
    //                 id_type: route.params.id_type,
    //                 // photoId_hash: photoId_hash,
    //                 idPhoto: route.params.idPhoto,
    //               });
    //             }}
    //           />
    //         </View>
    //       }
    //       modalHandler={() => {
    //         setState({ modalVisible: false });
    //       }}
    //       visible={state.modalVisible}></Modal>
    //   )}
    // </TakeSelfieBeforeWrapper>
  );
};
export default TakeSelfieBefore;
