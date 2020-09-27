import React, { FunctionComponent } from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';

import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';
import { Story } from '../../../types/product';

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 13px;
  color: #4e4e4e;
  text-align: left;
  margin-bottom: 8px;
`;

interface Props {
  story: Story;
  activeCard: () => void;
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

  return (
    <TouchableWithoutFeedback
      onPressIn={() => { SCALE.pressInAnimation(scaleInAnimated); }}
      onPressOut={() => { SCALE.pressOutAnimation(scaleInAnimated); }}
    >
      <Animated.View
        style={{
          width: '100%',
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
          source={{ uri: props.story.image }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: 10,
          }}
        />
        <View
          style={{ position: 'absolute', flexDirection: 'column', padding: 20 }}>
          <PText>{props.story.subTitle}</PText>
          <H1Text>{props.story.title}</H1Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
