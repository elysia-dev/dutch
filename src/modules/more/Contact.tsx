import React, { FunctionComponent, useContext, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { TextArea } from './components/TextArea';
import { PText } from '../../shared/components/PText';
import { TitleText } from '../../shared/components/TitleText';
import WrapperLayout from '../../shared/components/WrapperLayout';
import RootContext from '../../contexts/RootContext';

const Contact: FunctionComponent = () => {
  const navigation = useNavigation();
  const { Server } = useContext(RootContext);

  const [state, setState] = useState({
    contents: '',
  });

  const callApi = () => {
    Server.sendQuestion(state.contents)
      .then(res => {
        alert(i18n.t('more.question_submitted'));
        setState({ ...state, contents: '' });
        navigation.goBack();
      })
      .catch(e => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <WrapperLayout
      isScrolling={false}
      backButtonHandler={() => {
        navigation.goBack();
      }}
      subTitle={<PText
        label={i18n.t('more.contact_text')}
        style={{ marginBottom: 10, color: '#5c5b5b' }}
      />}
      title={i18n.t('more_label.contact')}
      body={
        <>
          <View
            style={{
              marginLeft: '5%',
              marginRight: '5%',
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 15,
              paddingBottom: 15,
              borderRadius: 10,
              backgroundColor: '#fff',
              shadowOffset: { width: 0, height: 2 },
              shadowColor: '#00000029',
              shadowOpacity: 0.8,
              shadowRadius: 6,
              marginBottom: 30,
              elevation: 6,
              zIndex: 1,
            }}>
            {/* <LabelText>{i18n.t("more.elysia_contact")}</LabelText> */}
            <PText
              label={'Contact'}
              style={{ fontSize: 14, marginBottom: 25 }}
            />
            <TextArea
              eventHandler={(input: string) =>
                setState({ ...state, contents: input })
              }
            />
            <Text
              style={{
                color: '#A7A7A7',
                fontSize: 12,
                textAlign: 'right',
                marginTop: 2,
              }}>{`${state.contents.length}/1000`}</Text>
          </View>
        </>
      }
      button={
        <SubmitButton
          style={{ zIndex: 999 }}
          title={i18n.t('kyc_label.submit')}
          handler={() => callApi()}
        />
      }
    />
  );
};

export default Contact;
