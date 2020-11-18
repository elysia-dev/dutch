import React, {
  createRef,
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
  Dimensions,
  Easing,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

import { useNavigation } from '@react-navigation/native';
import base64 from 'base-64';
import i18n from '../../../i18n/i18n';
import QuitIcon from '../images/quitbuttonblack.png';
import { SubmitButton } from '../../../shared/components/SubmitButton';
import { Story } from '../../../types/product';
import { P1Text, H1Text } from '../../../shared/components/Texts';

interface Props {
  story: Story;
  deactivateStory: () => void;
  xOffset: number;
  yOffset: number;
  on: boolean;
  image: string;
}

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

const ELEMENT_HEIGHT = 416;

const ExpandedItem: FunctionComponent<Props> = ({
  story,
  deactivateStory,
  xOffset,
  yOffset,
  on,
  image,
}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [state, setState] = useState({
    scrollY: 0,
    closed: false,
    scrollEnabled: true,
  });
  const { height: windowHeight } = Dimensions.get('window');
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (on) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
        easing: Easing.elastic(1),
      }).start();
      setState({
        ...state,
        scrollY: 0,
        closed: false,
        scrollEnabled: true,
      });
    }
  }, [on]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        elevation: 6,
        height: on ? '100%' : 0,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#00000033',
        shadowOpacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 0],
        }),
        shadowRadius: 5,
        top: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [yOffset, 0],
        }),
        left: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [xOffset, 0],
        }),
        right: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [xOffset, 0],
        }),
        bottom: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [windowHeight - yOffset - ELEMENT_HEIGHT, 0],
        }),
      }}>
      <ScrollView
        ref={scrollRef}
        contentInset={{ bottom: -500 }}
        bouncesZoom={false}
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: 0 }}
        scrollEnabled={state.scrollEnabled}
        showsVerticalScrollIndicator={state.scrollEnabled}
        onScroll={(event) => {
          setState({
            ...state,
            scrollY: event.nativeEvent.contentOffset.y,
          });
        }}>
        <Animated.Image
          source={{ uri: base64.decode(image) }}
          style={{
            borderRadius: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
            height: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [416, 500],
            }),
            resizeMode: 'cover',
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            top: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 40],
            }),
            left: 20,
          }}>
          <P1Text label={story.subTitle} />
          <H1Text label={story.title} style={{ marginTop: 10 }} />
        </Animated.View>
        <Animated.View
          style={{
            backgroundColor: '#fff',
            paddingTop: 30,
            paddingBottom: 60,
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}>
          <HTMLView
            value={story.body}
            stylesheet={htmlStyles}
            textComponentProps={defaultTextProps}
            nodeComponentProps={defaultTextProps}
          />
          <View style={{ marginTop: 535 }} />
        </Animated.View>
      </ScrollView>
      <Animated.View
        style={{
          position: 'absolute',
          top: 30,
          right: 20,
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 1, 1],
          }),
        }}>
        <TouchableOpacity
          onPress={() => {
            scrollRef.current?.scrollTo({ y: 0, animated: false });
            setState({
              ...state,
              closed: true,
              scrollEnabled: false,
            });
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
              easing: Easing.elastic(1),
            }).start(() => deactivateStory());
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
      </Animated.View>
      {
        /* closed: 스크롤 중 닫을 시 버튼이 남아있지 않도록 */
        !state.closed && state.scrollY > 50 && (
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
        )
      }
    </Animated.View>
  );
};

export default ExpandedItem;
