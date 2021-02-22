import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Animated,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import QuitIcon from './images/quitbuttonblack.png';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { P1Text, H2Text } from '../../shared/components/Texts';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';

type ParamList = {
  ProductStory: {
    givenId: number;
  };
};

const htmlStyles = StyleSheet.create({
  h2: {
    textAlign: 'left',
    lineHeight: 25,
    marginLeft: '5%',
    marginRight: '5%',
    fontFamily: 'Roboto_400Regular',
  },
  p: {
    fontSize: 15,
    lineHeight: 25,
    color: '#626368',
    textAlign: 'left',
    marginLeft: '5%',
    marginRight: '5%',
    fontFamily: 'Roboto_400Regular',
  },
});
const defaultTextProps = {
  style: {
    fontSize: 14,
  },
  allowFontScaling: false,
};

const defaultStory = {
  productId: 0,
  title: '',
  subTitle: '',
  body: '',
  image: '',
};

const ProductStory: FunctionComponent<{}> = () => {
  const { user } = useContext(UserContext);
  const { Server } = useContext(FunctionContext);

  const [state, setState] = useState({
    scrollY: 0,
    story: defaultStory,
  });
  const { story } = state;
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductStory'>>();
  const { givenId } = route.params;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Server.storyList()
      .then((res) => {
        const story = res.data.find((st) => st.productId === givenId);
        if (story) {
          setState({ ...state, story });
        }
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }, [user.language]);

  return story.productId === 0 ? (
    <View
      style={{
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <ActivityIndicator size="large" color="#3679B5" />
    </View>
  ) : (
    <View
      style={{
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
      }}>
      <ScrollView
        style={{ width: '100%' }}
        ref={scrollRef}
        bouncesZoom={false}
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          setState({
            ...state,
            scrollY: event.nativeEvent.contentOffset.y,
          });
        }}>
        <Image
          source={{ uri: story.image }}
          style={{
            height: 500,
            resizeMode: 'cover',
          }}
        />
        <View
          style={{
            width: '100%',
            position: 'absolute',
            flexDirection: 'column',
            top: 40,
            left: 20,
          }}>
          <P1Text label={story.subTitle} />
          <H2Text label={story.title} style={{ marginTop: 10 }} />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            paddingTop: 30,
            paddingBottom: 60,
          }}>
          <HTMLView
            value={story.body}
            stylesheet={htmlStyles}
            textComponentProps={defaultTextProps}
            nodeComponentProps={defaultTextProps}
          />
          <View style={{ marginTop: 35 }} />
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          top: 30,
          right: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(28,28,28,0.3)',
            }}
          />
          <Image
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              top: 8,
              left: 8,
              opacity: 0.8,
            }}
            source={QuitIcon}
          />
        </TouchableOpacity>
      </View>
      {state.scrollY > 50 && (
        <SubmitButton
          style={{ position: 'absolute', bottom: 0, marginBottom: 15 }}
          title={i18n.t('product_label.more_info')}
          handler={() => {
            StatusBar.setHidden(false);
            navigation.navigate('Product', {
              screen: 'ProductBuying',
              params: { productId: story.productId },
            });
          }}
        />
      )}
    </View>
  );
};

export default ProductStory;
