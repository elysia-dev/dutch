import React, { createRef, FunctionComponent } from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';

import styled from 'styled-components/native';
import { H1Text } from '../../../shared/components/H1Text';
import { PText } from '../../../shared/components/PText';
import { Story } from '../../../types/product';

interface Props {
  story: Story;
  activeCard: (pageX: number, pageY: number) => void;
}

const SCALE = {
  pressInAnimation(animated: Animated.Value) {
    animated.setValue(0);
    Animated.timing(animated, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  },

  pressOutAnimation(animated: Animated.Value) {
    animated.setValue(1);
    Animated.timing(animated, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  },
};


export const Item: FunctionComponent<Props> = (props: Props) => {
  const scaleInAnimated = new Animated.Value(0);
  const ref = createRef<Image>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log(ref.current);
        if (ref.current) {
          ref.current.measure((_x, _y, _width, _height, pageX, pageY) => {
            props.activeCard(pageX, pageY);
          });
        }
      }}
      onPressIn={() => { SCALE.pressInAnimation(scaleInAnimated); }}
      onPressOut={() => { SCALE.pressOutAnimation(scaleInAnimated); }}
    >
      <Animated.View
        style={{
          height: 416,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#00000033',
          shadowOpacity: 0.8,
          shadowRadius: 5,
          marginTop: 15,
          marginBottom: 15,
          transform: [
            {
              scale: scaleInAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95],
              }),
            },
          ],
        }}>
        <Image
          ref={ref}
          source={{ uri: props.story.image }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: 10,
          }}
        />
        <View
          style={{ position: 'absolute', flexDirection: 'column', marginTop: 20, marginLeft: 20 }}>
          <PText label={props.story.subTitle} />
          <H1Text label={props.story.title} style={{ marginTop: 10 }} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
