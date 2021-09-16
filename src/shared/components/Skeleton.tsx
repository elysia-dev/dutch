// reference: https://github.com/chramos/react-native-skeleton-placeholder/blob/master/src/SkeletonPlaceholder.tsx

import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, View, Dimensions } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;

const Skeleton: React.FC<{
  width: number;
  height: number;
  radius?: number;
  speed?: number;
}> = ({ width, height, radius = 0, speed = 1000 }) => {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const translateX = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-windowWidth, windowWidth],
      }),
    [animatedValue],
  );
  const translateStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      transform: [{ translateX }],
    }),
    [translateX],
  );

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: speed,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  });

  return (
    <MaskedView
      style={{ width, height, borderRadius: radius }}
      maskElement={
        <View style={{ backgroundColor: 'transparent' }}>
          <View
            style={{
              width,
              height,
              borderRadius: radius,
              backgroundColor: '#EAECEF',
            }}
          />
        </View>
      }>
      <View
        style={{
          width,
          height,
          borderRadius: radius,
          backgroundColor: '#EAECEF',
        }}>
        <Animated.View style={translateStyle}>
          <MaskedView
            style={{ width, height }}
            maskElement={
              <LinearGradient
                colors={['transparent', 'black', 'transparent']}
                style={{ width, height }}
                end={{ x: 1, y: 0 }}
              />
            }>
            <View
              style={{
                width,
                height,
                backgroundColor: '#F2F3F6',
              }}
            />
          </MaskedView>
        </Animated.View>
      </View>
    </MaskedView>
  );
};

export default Skeleton;
