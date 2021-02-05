import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { TextArea } from './components/TextArea';
import { SubTitleText, P1Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import RootContext from '../../contexts/RootContext';
import { TextField } from '../../shared/components/TextField';
import ProviderType from '../../enums/ProviderType';

const Contact: FunctionComponent = () => {
  const navigation = useNavigation();
  const { Server, user } = useContext(RootContext);

  const [state, setState] = useState({
    email: '',
    contents: '',
    contactRestriction: false,
  });

  const callApi = () => {
    if (state.contactRestriction) {
      return alert(i18n.t('more.contact_restriction'));
    } else if (
      user.provider === ProviderType.GUEST ||
      user.provider === ProviderType.ETH
    ) {
      Server.sendQuestionWithEmail(state.email, state.contents)
        .then((_res) => {
          alert(i18n.t('more.question_submitted'));
          setState({
            ...state,
            email: '',
            contactRestriction: true,
            contents: '',
          });
          setTimeout(() => {
            setState({
              ...state,
              contactRestriction: false,
            });
          }, 60000);
        })
        .catch((e) => {
          if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    } else {
      Server.sendQuestion(state.contents)
        .then((res) => {
          alert(i18n.t('more.question_submitted'));
          setState({ ...state, contactRestriction: true, contents: '' });
          setTimeout(() => {
            setState({
              ...state,
              contactRestriction: false,
            });
          }, 60000);
        })
        .catch((e) => {
          if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    }
  };

  return (
    <SafeAreaView
      style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
      forceInset={{ bottom: 'always' }}>
      <TouchableWithoutFeedback
        style={{
          width: '100%',
          height: '100%',
        }}
        onPress={() => Keyboard.dismiss()}>
        <WrapperLayout
          isScrolling={false}
          backButtonHandler={() => {
            navigation.goBack();
          }}
          subTitle={
            <SubTitleText
              label={i18n.t('more.contact_text')}
              style={{ marginBottom: 10, color: '#5c5b5b' }}
            />
          }
          title={i18n.t('more_label.contact')}
          body={
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
              {(user.provider === ProviderType.GUEST ||
                user.provider === ProviderType.ETH) && (
                <TextField
                  label={i18n.t('more_label.reply_email')}
                  eventHandler={(input: string) =>
                    setState({ ...state, email: input })
                  }
                />
              )}
              <TextArea
                contents={state.contents}
                eventHandler={(input: string) =>
                  setState({ ...state, contents: input })
                }
              />
              <P1Text
                style={{
                  color: '#A7A7A7',
                  fontSize: 12,
                  textAlign: 'right',
                  marginTop: 2,
                }}
                label={`${state.contents.length}/1000`}
              />
            </View>
          }
        />
      </TouchableWithoutFeedback>
      <SubmitButton
        disabled={!state.contents || state.contactRestriction}
        style={{
          position: 'relative',
          bottom: 70,
          zIndex: 999,
          backgroundColor:
            !state.contents || state.contactRestriction ? '#D0D8DF' : '#3679B5',
        }}
        title={i18n.t('kyc_label.submit')}
        handler={() => callApi()}
      />
    </SafeAreaView>
  );
};

export default Contact;
