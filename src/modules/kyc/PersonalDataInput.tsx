import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { Picker } from '@react-native-community/picker';
import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { Modal } from '../../shared/components/Modal';
import KycSubmitPng from './images/kycsubmit.png';
import i18n from '../../i18n/i18n';
import { NationInput } from './components/NationInput';
import { DateInput } from './components/DateInput';
import { ShortOptionButton } from './components/ShortOptionButton';
import RootContext from '../../contexts/RootContext';
import {
  P3Text,
  H1Text,
  SubTitleText,
  P1Text,
} from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import nations from './components/argos.json';
import IosPickerModal from '../../shared/components/IosPickerModal';

const IdImg = styled.Image`
  margin-top: 10px;
  width: 100%;
  height: 200px;
  resize-mode: cover;
`;
const ConfirmImg = styled.Image`
  width: 150px;
  height: 150px;
  align-self: center;
`;

type ParamList = {
  PersonalDataInput: {
    selfie_hash: string;
    photoId_hash: string;
    id_type: string;
    idPhoto: any;
  };
};

const PersonalDataInput: FunctionComponent<{}> = (props) => {
  const [state, setState] = useState({
    gender: '',
    firstName: '',
    lastName: '',
    nationality: '',
    selectedNationality: '',
    birthday: '',
    modalVisible: false,
    submitDisabled: false,
    pickerModalVisible: false,
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PersonalDataInput'>>();
  const { Server, setKycStatus } = useContext(RootContext);
  const nationList = nations.map((nation, Key) => (
    <Picker.Item key={Key} label={nation.Nationality} value={nation.Argos} />
  ));
  const setModalVisible = (visible: boolean) => {
    setState({ ...state, modalVisible: visible, submitDisabled: true });
  };

  const setNationality = (input: string) => {
    setState({ ...state, nationality: input });
  };

  const setBirthday = (input: string) => {
    setState({ ...state, birthday: input });
  };

  const callKycApi = () => {
    if (
      state.gender === '' ||
      state.firstName === '' ||
      state.lastName === '' ||
      state.birthday === '' ||
      state.nationality === ''
    ) {
      alert(i18n.t('kyc.alert_data'));
      setState({ ...state, submitDisabled: false });
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
        .then((res) => {
          setModalVisible(true);
        })
        .catch((e) => {
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
    <>
      <WrapperLayout
        isScrolling={true}
        backButtonHandler={() => navigation.goBack()}
        title={i18n.t('kyc.step3')}
        subTitle={<SubTitleText label={i18n.t('kyc.step3_text')} />}
        body={
          <View
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
              height: '100%',
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
              {Platform.OS === 'android' ? (
                <NationInput
                  type={i18n.t('kyc_label.nationality')}
                  eventHandler={setNationality}
                  nationality={state.nationality}
                  style={{
                    marginTop: 20,
                  }}
                />
              ) : (
                <>
                  <P3Text
                    style={{
                      marginTop: 20,
                      color: '#a7a7a7',
                      fontSize: 12,
                      textAlign: 'left',
                    }}
                    label={i18n.t('kyc_label.nationality')}
                  />
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderBottomColor: '#d0d8df',
                      borderBottomWidth: 1,
                    }}
                    onPress={() => {
                      setState({ ...state, pickerModalVisible: true });
                    }}>
                    <P1Text
                      label={state.nationality.split(',')[0]}
                      style={{
                        textAlign: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </>
              )}
              <DateInput
                type={i18n.t('kyc_label.birthday')}
                eventHandler={setBirthday}
                birthday={state.birthday}
                style={{
                  marginTop: 20,
                  width: '100%',
                  height: 40,
                }}
              />
              <P3Text
                style={{ marginTop: 40 }}
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
            <View style={{ padding: 30 }} />
            {state.modalVisible === true && (
              <Modal
                child={
                  <View>
                    <ConfirmImg source={KycSubmitPng} />
                    <H1Text
                      label={i18n.t('kyc.submit')}
                      style={{ textAlign: 'center', marginTop: 10 }}
                    />
                    <P1Text
                      label={i18n.t('kyc.submit_text')}
                      style={{
                        textAlign: 'center',
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    />
                  </View>
                }
                visible={state.modalVisible}
                modalHandler={() => {
                  setModalVisible(false);
                  setKycStatus();
                  navigation.navigate('Main', { screen: 'MoreMain' });
                }}></Modal>
            )}
          </View>
        }
        button={
          <SubmitButton
            title={i18n.t('kyc_label.complete_input')}
            handler={() => {
              setState({ ...state, submitDisabled: true });
              callKycApi();
            }}
            disabled={state.submitDisabled}
            style={{
              backgroundColor: state.submitDisabled ? '#D0D8DF' : '#3679B5',
            }}
          />
        }
      />
      {(state.modalVisible || state.pickerModalVisible) && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
      )}
      <IosPickerModal
        modalVisible={state.pickerModalVisible}
        doneHandler={() => {
          setState({
            ...state,
            pickerModalVisible: false,
            nationality: state.selectedNationality,
          });
        }}
        cancelHandler={() => {
          setState({ ...state, pickerModalVisible: false });
        }}
        buttonNumber={2}
        children={
          <Picker
            style={{
              top: 35,
            }}
            accessibilityLabel={'nationalinput'}
            selectedValue={state.selectedNationality}
            onValueChange={(itemValue, _itenIndex) => {
              setState({ ...state, selectedNationality: itemValue.toString() });
            }}>
            {nationList}
          </Picker>
        }
      />
    </>
  );
};
export default PersonalDataInput;
