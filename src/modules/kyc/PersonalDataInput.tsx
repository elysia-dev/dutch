import React, { FunctionComponent, useContext, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { Modal } from '../../shared/components/Modal';
import KycSubmitPng from './images/kycsubmit.png';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { NationInput } from './components/NationInput';
import { DateInput } from './components/DateInput';
import { ShortOptionButton } from './components/ShortOptionButton';
import RootContext from '../../contexts/RootContext';
import { P3Text, H1Text, SubTitleText } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';

// const H1Text = styled.Text`
//   color: #1c1c1c;
//   font-size: 20px;
//   font-weight: bold;
//   text-align: left;
//   margin-top: 40px;
//   margin-bottom: 6px;
// `;
// const PText = styled.Text`
//   font-size: 12px;
//   color: #626368;
//   text-align: left;
// `;
const IdImg = styled.Image`
  height: 45%;
`;
const ConfirmImg = styled.Image`
  width: 150px;
  height: 150px;
`;

type ParamList = {
  PersonalDataInput: {
    selfie_hash: string;
    photoId_hash: string;
    id_type: string;
    idPhoto: any;
  };
};


const PersonalDataInput: FunctionComponent<{}> = props => {
  const [state, setState] = useState({
    gender: '',
    firstName: '',
    lastName: '',
    nationality: '',
    birthday: '',
    modalVisible: false,
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PersonalDataInput'>>();
  const { Server } = useContext(RootContext);

  const setModalVisible = (visible: boolean) => {
    setState({ ...state, modalVisible: visible });
  };

  const setNationality = (input: string) => {
    setState({ ...state, nationality: input });
  };

  const setBirthday = (input: string) => {
    setState({ ...state, birthday: input });
  };

  const callKycApi = () => {
    if (state.gender === '') {
      alert(i18n.t('kyc.alert_data'));
    } else if (state.firstName === '' || state.lastName === '') {
      alert(i18n.t('kyc.alert_data'));
    } else if (state.birthday === '' || state.nationality === '') {
      alert(i18n.t('kyc.alert_data'));
    } else {
      Server.submission(
        state.firstName,
        state.lastName,
        state.nationality,
        state.birthday,
        state.gender,
        route.params.id_type === 'passport' ? 'passport' : 'government_id',
        route.params.photoId_hash,
        route.params.selfie_hash,
      )
        .then(res => {
          setModalVisible(true);
        })
        .catch(e => {
          if (e.response.status === 404) {
            alert(i18n.t('kyc.submit_error'));
            navigation.navigate('Main', { screen: 'MoreMain' });
          } else if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    }
  };
  return (
    <WrapperLayout
      isScrolling={true}
      backButtonHandler={() => navigation.goBack()}
      title={i18n.t('kyc.step3')}
      subTitle={<SubTitleText label={i18n.t('kyc.step3_text')} />}
      body={
        <View
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            height: '70%',
            flexDirection: 'column',
            flexGrow: 1,
          }}>
          <View style={{ flex: 1 }}>
            <IdImg source={{ uri: route.params.idPhoto.uri }} />
            <H1Text
              label={i18n.t('kyc_label.personal_data')}
              style={{ marginTop: 40, marginBottom: 6, fontSize: 20 }}
            />
            <TextField
              label={i18n.t('kyc_label.last_name')}
              eventHandler={(input: string) => {
                setState({ ...state, lastName: input });
              }}
              style={{
                marginTop: 20,
              }}
            />
            <TextField
              label={i18n.t('kyc_label.first_name')}
              eventHandler={(input: string) => {
                setState({ ...state, firstName: input });
              }}
              style={{
                marginTop: 20,
              }}
            />
            <NationInput
              type={i18n.t('kyc_label.nationality')}
              eventHandler={setNationality}
              nationality={state.nationality}
              style={{
                marginTop: 20,
              }}
            />
            <DateInput
              type={i18n.t('kyc_label.birthday')}
              eventHandler={setBirthday}
              birthday={state.birthday}
              style={{
                marginTop: 20,
              }}
            />
            <P3Text
              style={{ marginTop: 20 }}
              label={i18n.t('kyc_label.gender')}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
                marginTop: 10,
              }}>
              <ShortOptionButton
                check={state.gender === 'male' ? 'checked' : ''}
                title={i18n.t('kyc_label.male')}
                handler={() =>
                  setState({
                    ...state,
                    gender: state.gender === 'male' ? '' : 'male',
                  })
                }
              />
              <ShortOptionButton
                check={state.gender === 'female' ? 'checked' : ''}
                title={i18n.t('kyc_label.female')}
                handler={() =>
                  setState({
                    ...state,
                    gender: state.gender === 'female' ? '' : 'female',
                  })
                }
              />
            </View>
          </View>
          <View style={{ padding: 130 }} />
        </View>
      }
      button={
        <SubmitButton
          title={i18n.t('kyc_label.complete_input')}
          handler={() => setModalVisible(true)}
        />
      }
    />
    // <PersonalDataInputWrapper>
    //   <ScrollViewWrapper>

    //     {state.modalVisible === true && (
    //       <Modal
    //         child={
    //           <View>
    //             <ConfirmImg source={KycSubmitPng} />
    //             <H1Text label={i18n.t('kyc.submit')} />
    //             <P1Text label={i18n.t('kyc.submit_text')} />
    //           </View>
    //         }
    //         visible={state.modalVisible}
    //         modalHandler={() => {
    //           setModalVisible(false);
    //           navigation.navigate('Main', { screen: 'MoreMain' });
    //         }}></Modal>
    //     )}
    //   </ScrollViewWrapper>
    // </PersonalDataInputWrapper>
  );
};
export default PersonalDataInput;
