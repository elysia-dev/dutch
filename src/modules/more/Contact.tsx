import React, { FunctionComponent, useContext, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { TextArea } from './components/TextArea';
import RootContext from '../../contexts/RootContext';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-weight: bold;
  font-size: 28px;
  text-align: left;
  margin-bottom: 10px;
`;
const PText = styled.Text`
  color: #5c5b5b;
  font-size: 12px;
  text-align: left;
  margin-bottom: 30px;
`;
const LabelText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: left;
  margin-bottom: 25px;
`;

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
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
      }}>
      <ScrollView>
        <View style={{ padding: 20, paddingTop: 0 }}>
          <BackButton
            handler={() => {
              navigation.goBack();
            }}
            style={{ marginTop: 10, marginBottom: 10 }}
          />
          <H1Text>{i18n.t('more_label.contact')}</H1Text>
          <PText>{i18n.t('more.contact_text')}</PText>
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 30,
              paddingBottom: 30,
              borderRadius: 10,
              backgroundColor: '#fff',
              shadowOffset: { width: 0, height: 2 },
              shadowColor: '#00000029',
              shadowOpacity: 0.8,
              shadowRadius: 6,
              marginBottom: 30,
            }}>
            {/* <LabelText>{i18n.t("more.elysia_contact")}</LabelText> */}
            <LabelText>{'Contact'}</LabelText>

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
        </View>
      </ScrollView>
      <SubmitButton
        style={{ marginBottom: 15, position: 'absolute', bottom: 0 }}
        title={i18n.t('kyc_label.submit')}
        handler={() => callApi()}
      />
    </SafeAreaView>
  );
};

export default Contact;
