import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Animated,
  Image,
  View,
  Dimensions,
  Easing,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

import QuitIcon from '../images/quitbutton.png';
import { Story } from '../../../types/product';
import { PText } from '../../../shared/components/PText';
import { H1Text } from '../../../shared/components/H1Text';

interface Props {
  story: Story;
  deactiveStory: () => void;
  xOffset: number;
  yOffset: number;
}

const htmlStyles = StyleSheet.create({
  h2: {
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  p: {
    fontSize: 15,
    lineHeight: 20,
    color: '#626368',
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
  },
});

const ELEMENT_HEIGHT = 395;

const ExpendedItem: FunctionComponent<Props> = ({
  story,
  deactiveStory,
  xOffset,
  yOffset,
}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  // Device Height
  const { height: windowHeight } = Dimensions.get("window");

  useEffect(() => {
    console.log(yOffset);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
  }, []);

  return (
    <Animated.ScrollView
      scrollEnabled={true}
      scrollToOverflowEnabled={true}
      style={{
        position: 'absolute',
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
      }}
    >
      <Animated.Image
        source={{ uri: story.image }}
        style={{
          borderRadius: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
          height: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [395, 500],
          }),
          resizeMode: 'cover',
        }}
      />
      <Animated.View style={{
        position: 'absolute',
        top: 30,
        right: 20,
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      }}
      >
        <TouchableOpacity onPress={() => {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start(() => deactiveStory());
        }}>
          <Image
            style={{
              width: 26,
              height: 26,
              resizeMode: 'center',
              opacity: 0.8,
            }}
            source={QuitIcon}
          />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          flexDirection: 'column',
          top: 20,
          left: 20,
        }}
      >
        <PText label={story.subTitle} />
        <H1Text label={story.title} style={{ marginTop: 10 }} />
      </View>
      <Animated.View style={{
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 60,
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      }}>
        <HTMLView value={story.body} stylesheet={htmlStyles} />
      </Animated.View>
    </Animated.ScrollView>
  );
};

export default ExpendedItem;
