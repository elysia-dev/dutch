import React from 'react';
import { Platform, View, Animated } from 'react-native';
import AppFonts from '../../enums/AppFonts';
import AppColors from '../../enums/AppColors';

const AnimatedMainHeader: React.FC<{ title: string; scrollY: Animated.Value }> = ({
  title,
  scrollY,
}) => {
  return (
    <Animated.View
      style={{
        overflow: 'hidden',
        backgroundColor: 'transparent',
        paddingBottom: 1,
      }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          backgroundColor: AppColors.WHITE,
          elevation: scrollY.interpolate({
            inputRange: [-1000, 0, 15, 1000],
            outputRange: [0, 0, 5, 5],
          }),
          shadowOffset: { width: 1, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: scrollY.interpolate({
            inputRange: [-1000, 0, 15, 1000],
            outputRange: [0, 0, 0.5, 0.5],
          }),
          paddingTop: Platform.OS === 'android' ? 65 : 45,
          paddingBottom: 10,
          paddingLeft: '5%',
          paddingRight: '5%',
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [-1000, 0, 15, 1000],
                outputRange: [0, 0, -5, -5],
              }),
            },
          ],
        }}>
        <View>
          <Animated.Text
            allowFontScaling={false}
            style={{
              color: AppColors.BLACK,
              fontSize: 28,
              left: 0,
              paddingLeft: 0,
              transform: [
                {
                  translateX: scrollY.interpolate({
                    inputRange: [-1000, 0, 15, 1000],
                    outputRange: [0, 0, -5, -5],
                  }),
                },
                {
                  translateY: 0,
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-1000, 0, 15, 1000],
                    outputRange: [1, 1, 0.9, 0.9],
                  }),
                },
              ],
              textAlign: 'left',
              fontFamily: AppFonts.Bold,
            }}>
            {title}
          </Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedMainHeader;
