import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { TextArea } from './components/TextArea';
import { SubTitleText, P1Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayoutAvoidingKeyboard';
import { TextField } from '../../shared/components/TextField';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import PreferenceContext from '../../contexts/PreferenceContext';
import LocaleType from '../../enums/LocaleType';
import AppColors from '../../enums/AppColors';

const Contact: FunctionComponent = () => {
  const navigation = useNavigation();
  const { user, Server } = useContext(UserContext);
  const { t } = useTranslation();
  const { language } = useContext(PreferenceContext);

  const [state, setState] = useState({
    email: '',
    contents: '',
    contactRestriction: false,
  });

  const callApi = () => {
    if (state.contactRestriction) {
      return alert(t('more.contact_restriction'));
    } else if (
      user.provider === ProviderType.GUEST ||
      user.provider === ProviderType.ETH
    ) {
      Server.sendQuestionWithEmail(
        state.email,
        state.contents,
        language || LocaleType.EN,
      )
        .then((_res) => {
          alert(t('more.question_submitted'));
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
          if (e.response.status === 400) {
            alert(t('accout.invalid_email'));
          } else if (e.response.status === 500) {
            alert(t('account_errors.server'));
          }
        });
    } else {
      Server.sendQuestion(state.contents)
        .then((res) => {
          alert(t('more.question_submitted'));
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
            alert(t('account_errors.server'));
          }
        });
    }
  };

  return (
    <WrapperLayout
      isScrolling={false}
      backButtonHandler={() => {
        navigation.goBack();
      }}
      subTitle={
        <SubTitleText
          label={t('more.contact_text')}
          style={{ marginBottom: 10, color: '#5c5b5b' }}
        />
      }
      title={t('more_label.contact')}
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
            backgroundColor: AppColors.WHITE,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: AppColors.SHADOW_BLACK,
            shadowOpacity: 0.8,
            shadowRadius: 6,
            marginBottom: 30,
            elevation: 6,
            zIndex: 1,
          }}>
          {(user.provider === ProviderType.GUEST ||
            user.provider === ProviderType.ETH) && (
            <TextField
              value={state.email}
              label={t('more_label.reply_email')}
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
              color: AppColors.TEXT_GREY,
              fontSize: 12,
              textAlign: 'right',
              marginTop: 2,
            }}
            label={`${state.contents.length}/1000`}
          />
        </View>
      }
      button={
        <SubmitButton
          disabled={!state.contents || state.contactRestriction}
          style={{
            backgroundColor:
              !state.contents || state.contactRestriction
                ? AppColors.BLUE_2
                : AppColors.MAIN,
          }}
          title={t('more_label.contact')}
          handler={() => callApi()}
        />
      }
    />
  );
};

export default Contact;
