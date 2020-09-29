import React, { createRef, FunctionComponent, useState } from 'react';
import {
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

import { H1Text } from '../../../shared/components/H1Text';
import { PText } from '../../../shared/components/PText';
import { Story } from '../../../types/product';

interface Props {
  story: Story;
  active: boolean;
  activateCard: (pageX: number, pageY: number) => void;
}

export const Item: FunctionComponent<Props> = (props: Props) => {
  const ref = createRef<Image>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (ref.current) {
          ref.current.measure((_x, _y, _width, _height, pageX, pageY) => {
            props.activateCard(pageX, pageY);
          });
        }
      }}
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
          opacity: props.active ? 0 : 1,
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
