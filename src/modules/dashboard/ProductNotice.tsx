import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import RootContext from '../../contexts/RootContext';
import { DashboardPage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { PostResponse } from '../../types/PostResponse';
import { TitleText, P1Text, P3Text } from '../../shared/components/Texts';

type ParamList = {
  ProductNotice: {
    productId: number;
  };
};


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
        <P1Text
          label={i18n.strftime(new Date(props.post.createdAt), '%Y-%m-%d')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            color: "#626368",
          }} />
        <P1Text
          label={props.post.title}
          style={{
              marginTop: 10,
              marginBottom: 10,
            }}/>
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

const ProductNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductNotice'>>();
  const { productId } = route.params;
  const { Server } = useContext(RootContext);
  const [state, setState] = useState({
    full: false,
    posts: [] as PostResponse[],
  });

  const fullPostsList = state.posts.map((post, index) => (
    <Notice post={post} key={index} />
  ));

  const previewPostsList = fullPostsList.slice(0, 5);

  const callPostApi = () => {
    Server.productPost(productId)
      .then(res => {
        setState({ ...state, posts: res.data });
      })
      .catch(e => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => { callPostApi(); }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: '#FAFCFF',
        width: '100%',
        height: '100%',
      }}>
      <View style={{ padding: "5%" }}>
        <BackButton
          handler={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
        <TitleText
          label={'Notice'}
        />
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
          <P1Text
            label={'Notice'}
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}/>
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
