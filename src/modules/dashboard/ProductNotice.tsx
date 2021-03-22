import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../shared/components/BackButton';
import { PostResponse } from '../../types/PostResponse';
import { TitleText, P1Text, P3Text } from '../../shared/components/Texts';
import FunctionContext from '../../contexts/FunctionContext';
import moment from 'moment';

type ParamList = {
  ProductNotice: {
    productId: number;
  };
};

export interface Props {
  post: PostResponse;
}

export const Notice: FunctionComponent<Props> = (props) => {
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
          label={moment(props.post.createdAt).format('%Y-%m-%d')}
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

const ProductNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductNotice'>>();
  const { productId } = route.params;
  const { Server } = useContext(FunctionContext);
  const [state, setState] = useState({
    full: false,
    posts: [] as PostResponse[],
  });
  const { t } = useTranslation();

  const fullPostsList = state.posts.map((post, index) => (
    <Notice post={post} key={index} />
  ));

  const previewPostsList = fullPostsList.slice(0, 5);

  const callPostApi = () => {
    Server.productPost(productId)
      .then((res) => {
        setState({ ...state, posts: res.data });
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    callPostApi();
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: '#FAFCFF',
        width: '100%',
        height: '100%',
      }}>
      <View style={{ padding: '5%' }}>
        <BackButton
          handler={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
        <TitleText label={t('dashboard_label.notice')} />
        <View
          style={{
            marginTop: 40,
            backgroundColor: '#fff',
            padding: 15,
            width: '100%',
            borderRadius: 10,
            shadowRadius: 7,
            elevation: 4,
            shadowColor: '#3679B540',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.6,
          }}>
          <P1Text
            label={t('dashboard_label.notice')}
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: '100%',
              height: 1,
              backgroundColor: '#CCCCCC',
            }}></View>
          <View>
            {state.full ? fullPostsList : previewPostsList}
            {fullPostsList.length === 0 && (
              <P1Text
                label={t('dashboard.no_notice')}
                style={{
                  textAlign: 'center',
                  marginVertical: 20,
                  color: '#a7a7a7',
                }}
              />
            )}
          </View>
          {fullPostsList.length > 0 && (
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
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductNotice;
