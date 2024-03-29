import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
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
  Platform,
  ImageStyle,
} from 'react-native';
import HTMLView, { HTMLViewNode } from 'react-native-htmlview';
import { useNavigation } from '@react-navigation/native';
import base64 from 'base-64';
import { useTranslation } from 'react-i18next';
import QuitIcon from '../images/quitbuttonblack.png';
import { SubmitButton } from '../../../shared/components/SubmitButton';
import { Story } from '../../../types/product';
import { P1Text, H2Text } from '../../../shared/components/Texts';
import { Page, ProductPage } from '../../../enums/pageEnum';
import AppFonts from '../../../enums/AppFonts';
import useSafeAsync from '../../../hooks/useSafeAsync';
import AppColors from '../../../enums/AppColors';

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
    fontFamily: AppFonts.Regular,
  },
  p: {
    fontSize: 15,
    lineHeight: 25,
    color: AppColors.BLACK2,
    textAlign: 'left',
    marginLeft: '5%',
    marginRight: '5%',
    fontFamily: AppFonts.Regular,
  },
});
const defaultTextProps = {
  style: {
    fontSize: 14,
  },
  allowFontScaling: false,
};

const ELEMENT_HEIGHT = 416;
const windowWidth = Dimensions.get('window').width;

const AutoSizedImage: FunctionComponent<{
  style?: ImageStyle;
  source: { uri: string };
}> = (props: { style?: ImageStyle; source: { uri: string } }) => {
  const [state, setState] = useState({ finalSize: { width: 0, height: 0 } });
  const safeAsync = useSafeAsync();

  useEffect(() => {
    const finalSize = {
      width: 0,
      height: 0,
    };

    if (props.style?.width || props.style?.height) {
      return;
    }
    Image.getSize(props.source.uri, (originalWidth, originalHeight) => {
      finalSize.width = originalWidth;
      finalSize.height = originalHeight;
      if (originalWidth > windowWidth) {
        finalSize.width = windowWidth;
        const ratio = finalSize.width / originalWidth;
        finalSize.height = originalHeight * ratio;
      }
      setState({ finalSize });
    });
  }, []);

  return (
    <Image
      {...props}
      resizeMode={'contain'}
      style={[
        props.style,
        state.finalSize.width && state.finalSize.height
          ? state.finalSize
          : null,
      ]}
    />
  );
};

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
    backgroundColor: true,
  });
  const { t } = useTranslation();
  const { height: windowHeight } = Dimensions.get('window');
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const renderNode = (
    node: HTMLViewNode,
    index: number,
    _siblings: HTMLViewNode,
    _parent: HTMLViewNode,
    _defaultRenderer: (
      node: HTMLViewNode,
      parent: HTMLViewNode,
    ) => React.ReactNode,
  ) => {
    if (node.name === 'img') {
      return <AutoSizedImage key={index} source={{ uri: node.attribs.src }} />;
    }
  };

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
        borderRadius: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
        backgroundColor: animatedValue.interpolate({
          inputRange: [0, 0.9, 1],
          outputRange: [
            AppColors.TRANSPARENT,
            AppColors.TRANSPARENT,
            AppColors.WHITE,
          ],
        }),
        elevation: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 6],
        }),
        height: on ? '100%' : 0,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: AppColors.SHADOW_BLACK,
        shadowOpacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 0],
        }),
        shadowRadius: 5,
        transform: [
          {
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [xOffset, 0],
            }),
          },
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [yOffset, 0],
            }),
          },
        ],
      }}>
      <ScrollView
        ref={scrollRef}
        contentInset={{ bottom: Platform.OS === 'ios' ? -500 : 0 }}
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
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [windowWidth - xOffset * 2, windowWidth],
            }),
            resizeMode: 'cover',
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 40],
                }),
              },
            ],
            left: 20,
          }}>
          <P1Text label={story.subTitle} />
          <H2Text label={story.title} style={{ marginTop: 10 }} />
        </Animated.View>
        <Animated.View
          style={{
            backgroundColor: AppColors.WHITE,
            paddingTop: 30,
            paddingBottom: 60,
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}>
          <HTMLView
            renderNode={renderNode}
            value={story.body}
            stylesheet={htmlStyles}
            textComponentProps={defaultTextProps}
            nodeComponentProps={defaultTextProps}
          />
          <View style={{ marginTop: Platform.OS === 'ios' ? 535 : 35 }} />
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
              backgroundColor: false,
            });
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
              easing: Easing.elastic(1),
            }).start(() => {
              deactivateStory();
            });
          }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: AppColors.SHADOW_BLACK2,
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
            style={{ position: 'absolute', bottom: 10 }}
            title={t('product_label.more_info')}
            handler={() => {
              StatusBar.setHidden(false);
              navigation.navigate(Page.Product, {
                screen: ProductPage.ProductBuying,
                params: {
                  productId: story.productId,
                },
              });
            }}
          />
        )
      }
    </Animated.View>
  );
};

export default ExpandedItem;
