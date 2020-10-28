import React, { FunctionComponent, useState, useContext } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  GestureResponderEvent,
  View,
  Animated,
} from 'react-native';
import styled from 'styled-components/native';
import { BackButton } from './BackButton';
import RootContext from '../../contexts/RootContext';
import LocaleType from '../../enums/LocaleType';

const Wrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === 'android' ? '25px' : '0px'};
  height: 100%;
  background-color: #fff;
  overflow: hidden;
`;

interface Props {
  title: string;
  subTitle?: React.ReactNode;
  body: React.ReactNode;
  backButtonHandler?: (event: GestureResponderEvent) => void;
  isScrolling: boolean;
  button?: React.ReactNode;
}

type Scrolling = {
  Scrolling: boolean;
  scrollY: Animated.value;
};

const ConditionalKeyboardAvoidingView: FunctionComponent = props =>
  Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{ flex: 1, flexDirection: 'column' }}>
      {props.children}
    </KeyboardAvoidingView>
  ) : (
      <View style={{ flex: 1 }}>{props.children}</View>
    );

const ScrollingView: FunctionComponent<Scrolling> = props => {
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

const WrapperLayout: FunctionComponent<Props> = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const { user } = useContext(RootContext);
  const languageType = user.language;

  return (
    <Wrapper>
      <Animated.View
        style={{
          marginLeft: '5%',
          marginRight: '5%',
          marginTop: props.backButtonHandler !== undefined ? 0 : 68,
        }}>
        {props.backButtonHandler !== undefined && (
          <BackButton handler={props.backButtonHandler} style={{ width: 30 }} />
        )}
        <Animated.View
          style={[
            props.backButtonHandler !== undefined ? {
              transform: [
                {
                  translateX: scrollY.interpolate({
                    inputRange: [-1000, 0, 50, 1000],
                    outputRange: [0, 0, 0, 0],
                  }),
                },
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-1000, 0, 50, 1000],
                    outputRange: [0, 0, -57, -57],
                  }),
                },
              ],
            } : {
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
              }]}>
          <Animated.Text
            allowFontScaling={false}
            style={{
              position: 'absolute',
              fontSize: languageType === LocaleType.EN ? 22 : 25,
              fontFamily: 'Roboto_700Bold',
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
              fontFamily: 'Roboto_400Regular',
              transform: [
                {
                  translateX: scrollY.interpolate({
                    inputRange: [-1000, 0, 50, 1000],
                    outputRange: [0, 0, 0, 0],
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
      </Animated.View>
      {props.subTitle !== undefined && (<View style={{ marginBottom: 30 }} />)}
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
    </Wrapper>
  );
};

export default WrapperLayout;
