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

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 40px;
  margin-bottom: 6px;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
`;
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
`;
const IdImg = styled.Image`
  height: 30%;
  justify-content: center;
  align-content: center;
  position: relative;
  elevation: 5;
`;
const ConfirmImg = styled.Image`
  width: 150px;
  height: 150px;
`;
const PersonalDataInputWrapper = styled.SafeAreaView`
  padding-top: 25px;
  background-color: #ffffff;
`;
const ScrollViewWrapper = styled.ScrollView.attrs(() => ({
  backgroundColor: '#fff',
  contentContainerStyle: {
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
  },
}))`
  flex-direction: column;
  background-color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 30px;
`;

type ParamList = {
  PersonalDataInput: {
    selfie_hash: string;
    photoId_hash: string;
    id_type: string;
    photoId: any;
  };
};

export const PersonalDataInput: FunctionComponent<{}> = props => {
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
    <PersonalDataInputWrapper>
      <ScrollViewWrapper>
        <BackButton
          handler={() => navigation.goBack()}
          style={{ marginTop: 30 }}
        />
        <H1Text>{i18n.t('kyc.step3')}</H1Text>
        <PText>{i18n.t('kyc.step3_text')}</PText>
        <IdImg source={{ uri: route.params.photoId.uri }} />
        <H1Text>{i18n.t('kyc_label.personal_data')}</H1Text>
        <TextField
          label={i18n.t('kyc_label.last_name')}
          value=""
          edit={true}
          eventHandler={(input: string) => {
            setState({ ...state, lastName: input });
          }}
          secure={false}
          style={{
            marginTop: 20,
          }}
        />
        <TextField
          label={i18n.t('kyc_label.first_name')}
          value=""
          edit={true}
          eventHandler={(input: string) => {
            setState({ ...state, firstName: input });
          }}
          secure={false}
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
        <InputHeaderText style={{ marginTop: 20 }}>
          {i18n.t('kyc_label.gender')}
        </InputHeaderText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 80,
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
        <SubmitButton
          title={i18n.t('kyc_label.complete_input')}
          handler={() => setModalVisible(true)}
          style={{ marginBottom: 20 }}
        />
        {state.modalVisible === true && (
          <Modal
            child={
              <View>
                <ConfirmImg source={KycSubmitPng} />
                <H1Text>{i18n.t('kyc.submit')}</H1Text>
                <PText>{i18n.t('kyc.submit_text')}</PText>
              </View>
            }
            visible={state.modalVisible}
            modalHandler={() => {
              setModalVisible(false);
              navigation.navigate('Main', { screen: 'MoreMain' });
            }}></Modal>
        )}
      </ScrollViewWrapper>
    </PersonalDataInputWrapper>
  );
};
