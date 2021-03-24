import { useNavigation } from '@react-navigation/native';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import FunctionContext from '../../contexts/FunctionContext';
import { useTranslation } from 'react-i18next'
import { BackButton } from '../../shared/components/BackButton';
import { PostResponse } from '../../types/PostResponse';
import { P1Text, P3Text } from '../../shared/components/Texts';
import moment from 'moment';

const PText = styled.Text`
  margin-top: 10px;
  margin-bottom: 10px;
  color: #1c1c1c;
  font-size: 15px;
`;
interface State {
  full: boolean;
  postList: PostResponse[];
}

const Notice: FunctionComponent<{ post: PostResponse }> = (props) => {
  const [state, setState] = useState({
    content: false,
  });
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => setState({ ...state, content: !state.content })}>
      <View
        style={{
          paddingVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <P1Text
          label={moment(props.post.createdAt).format('YYYY-MM-DD')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            color: '#626368',
          }}
        />
        <P1Text
          label={props.post.title}
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        />
      </View>
      {state.content && (
        <View>
          <P3Text
            style={{
              color: '#A7A7A7',
              marginTop: 0,
              marginBottom: 10,
              fontSize: 15,
            }}
            label={props.post.body}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const ElysiaNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, setState] = useState<State>({
    full: false,
    postList: [],
  });
  const { Server } = useContext(FunctionContext);
  const { t } = useTranslation();

  const loadElysiaNotice = () => {
    Server.elysiaPost()
      .then((res) => setState({ ...state, postList: res.data }))
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    loadElysiaNotice();
  }, []);

  const fullPostsList = state.postList.map((post, index) => (
    <Notice post={post} key={index} />
  ));

  const previewPostsList = fullPostsList.slice(0, 5);

  return (
    <ScrollView
      style={{
        backgroundColor: '#FAFCFF',
        width: '100%',
        height: '100%',
      }}>
      <View style={{ padding: 15 }}>
        <BackButton
          handler={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
        <Text
          style={{
            color: '#1C1C1C',
            textAlign: 'left',
            fontSize: 28,
            fontWeight: 'bold',
          }}>
          {'Elysia Notice'}
        </Text>
        <View
          style={{
            marginTop: 40,
            backgroundColor: '#fff',
            padding: 15,
            width: '100%',
            borderRadius: 10,
            shadowRadius: 7,
            shadowColor: '#3679B540',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.6,
          }}>
          <PText>{'Notice'}</PText>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: '100%',
              height: 1,
              backgroundColor: '#CCCCCC',
            }}></View>
          <View>{state.full ? fullPostsList : previewPostsList}</View>
          <TouchableOpacity
            onPress={() => setState({ ...state, full: !state.full })}>
            <Image
              style={[
                {
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: 30,
                  height: 15,
                },
                {
                  transform: [{ rotate: state.full ? '180deg' : '0deg' }],
                },
              ]}
              source={require('./images/bluedownarrow.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ElysiaNotice;
