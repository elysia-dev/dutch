import React, { FunctionComponent, useState, useContext } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  GestureResponderEvent,
  View,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BackButton } from './BackButton';
import LocaleType from '../../enums/LocaleType';
import UserContext from '../../contexts/UserContext';
import AppFonts from '../../enums/AppFonts';
import FullScreenWrapper from './FullScreenWrapper';

interface Props {
  title: string;
  subTitle?: React.ReactNode;
  body: React.ReactNode;
  backButtonHandler?: (event: GestureResponderEvent) => void;
  isScrolling: boolean;
  button?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

type Scrolling = {
  Scrolling: boolean;
  scrollY: Animated.Value;
};

const ConditionalKeyboardAvoidingView: FunctionComponent = (props) =>
  Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      // behavior={'padding'}
      style={{ flex: 1, flexDirection: 'column' }}>
      {props.children}
    </KeyboardAvoidingView>
  ) : (
    <View style={{ flex: 1 }}>{props.children}</View>
  );

const ScrollingView: FunctionComponent<Scrolling> = (props) => {
  return props.Scrolling === true ? (
    <Animated.ScrollView
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: props.scrollY },
            },
          },
        ],
        { useNativeDriver: true },
      )}
      style={{ flex: 1 }}>
      {props.children}
    </Animated.ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{props.children}</View>
  );
};

const WrapperLayout: FunctionComponent<Props> = (props) => {
  const [scrollY] = useState(new Animated.Value(0));
  const { user } = useContext(UserContext);
  const languageType = user.language;

  return (
    <FullScreenWrapper style={props.style}>
      <Animated.View
        style={{
          marginLeft: '5%',
          marginRight: '5%',
          marginTop: props.backButtonHandler !== undefined ? 0 : 68,
        }}>
        {props.backButtonHandler !== undefined && (
          <BackButton handler={props.backButtonHandler} style={{ width: 30 }} />
        )}
        {languageType === LocaleType.EN ? (
          <Animated.View
            style={[
              props.backButtonHandler !== undefined
                ? {
                    transform: [
                      {
                        translateX: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, 10, 10],
                        }),
                      },
                      {
                        translateY: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, -57, -57],
                        }),
                      },
                    ],
                  }
                : {
                    transform: [
                      {
                        translateX: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, -34, -34],
                        }),
                      },
                      {
                        translateY: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, -57, -57],
                        }),
                      },
                    ],
                  },
            ]}>
            <Animated.Text
              allowFontScaling={false}
              numberOfLines={1}
              style={{
                position: 'absolute',
                fontSize: 22,
                fontFamily: AppFonts.Bold,
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-1000, 0, 50, 1000],
                      outputRange: [1, 1, 0.8, 0.8],
                    }),
                  },
                ],
              }}>
              {props.title}
            </Animated.Text>
            <Animated.Text
              allowFontScaling={false}
              style={{
                position: 'absolute',
                top: 40,
                fontFamily: AppFonts.Regular,
                transform: [
                  {
                    translateX: scrollY.interpolate({
                      inputRange: [-1000, 0, 50, 1000],
                      outputRange: [0, 0, -10, -10],
                    }),
                  },
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-1000, 0, 50, 1000],
                      outputRange: [0, 0, 0, 0],
                    }),
                  },
                ],
              }}>
              {props.subTitle}
            </Animated.Text>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              props.backButtonHandler !== undefined
                ? {
                    transform: [
                      {
                        translateX: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, 30, 30],
                        }),
                      },
                      {
                        translateY: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, -57, -57],
                        }),
                      },
                    ],
                  }
                : {
                    transform: [
                      {
                        translateX: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, -17, -17],
                        }),
                      },
                      {
                        translateY: scrollY.interpolate({
                          inputRange: [-1000, 0, 50, 1000],
                          outputRange: [0, 0, -57, -57],
                        }),
                      },
                    ],
                  },
            ]}>
            <Animated.Text
              allowFontScaling={false}
              style={{
                position: 'absolute',
                fontSize: 25,
                fontFamily: AppFonts.Bold,
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-1000, 0, 50, 1000],
                      outputRange: [1, 1, 0.8, 0.8],
                    }),
                  },
                ],
              }}>
              {props.title}
            </Animated.Text>
            <Animated.Text
              allowFontScaling={false}
              style={{
                position: 'absolute',
                top: 40,
                fontFamily: AppFonts.Regular,
                transform: [
                  {
                    translateX: scrollY.interpolate({
                      inputRange: [-1000, 0, 50, 1000],
                      outputRange: [0, 0, -30, -30],
                    }),
                  },
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-1000, 0, 50, 1000],
                      outputRange: [0, 0, 0, 0],
                    }),
                  },
                ],
              }}>
              {props.subTitle}
            </Animated.Text>
          </Animated.View>
        )}
      </Animated.View>
      {props.subTitle !== undefined && <View style={{ marginBottom: 30 }} />}
      <ScrollingView Scrolling={props.isScrolling} scrollY={scrollY}>
        <ConditionalKeyboardAvoidingView>
          <View style={{ marginTop: 60 }}>{props.body}</View>
          {props.button !== undefined && (
            <View style={{ marginTop: 'auto', marginBottom: 20 }}>
              {props.button}
            </View>
          )}
        </ConditionalKeyboardAvoidingView>
      </ScrollingView>
    </FullScreenWrapper>
  );
};

export default WrapperLayout;
