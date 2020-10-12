import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { PostResponse } from '../../types/PostResponse';

type ParamList = {
  ProductNotice: {
    posts: PostResponse[];
  };
};

const GText = styled.Text`
  margin-top: 10px;
  margin-bottom: 10px;
  color: #626368;
  font-size: 15px;
  text-align: left;
`;
const PText = styled.Text`
  margin-top: 10px;
  margin-bottom: 10px;
  color: #1c1c1c;
  font-size: 15px;
`;

export interface Props {
  post: PostResponse;
}

export const Notice: FunctionComponent<Props> = props => {
  const [state, setState] = useState({
    content: false,
  });
  return (
    <TouchableOpacity
      onPress={() => setState({ ...state, content: !state.content })}>
      <View
        style={{
          paddingVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <GText>
          {i18n.strftime(new Date(props.post.createdAt), '%Y-%m-%d')}
        </GText>
        <PText>{props.post.title}</PText>
      </View>
      {state.content && (
        <View>
          <Text
            style={{
              color: '#A7A7A7',
              marginTop: 0,
              marginBottom: 10,
              fontSize: 15,
            }}>
            {props.post.body}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const ProductNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductNotice'>>();
  const { posts } = route.params;
  const [state, setState] = useState({
    full: false,
  });

  const fullPostsList = posts.map((post, index) => (
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
          {'Notice'}
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
                  resizeMode: 'center',
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

export default ProductNotice;
