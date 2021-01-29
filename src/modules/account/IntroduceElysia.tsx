import React, { FunctionComponent, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { H1Text, H2Text, P1Text } from '../../shared/components/Texts';
import i18n from '../../i18n/i18n';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { AccountPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import LocaleType from '../../enums/LocaleType';

const Circle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #a8a8a8;
  border-radius: 10px;
  overflow: hidden;
  margin: 6px;
`;

const IntroduceElysia: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const [state, setState] = useState(0);
  const [scrollX, setScrollX] = useState(new Animated.Value(0));
  const { user } = useContext(RootContext);

  const viewPager = React.createRef<ViewPager>();
  const ReturnImageOrText = (imgNumber: number) => {
    switch (imgNumber) {
      case 0:
        return i18n.t('account.introduction_title');
      case 1:
        return require('./images/intro_image_1.png');
      case 2:
        return require('./images/intro_image_2.png');
      case 3:
        return require('./images/intro_image_3.png');
      case 4:
        return require('./images/intro_image_4.png');
      default:
        break;
    }
  };
  const ItemListing = Array(5)
    .fill(0)
    .map((_x, index) => {
      return (
        <View style={{ width: '100%' }} key={index}>
          {index ? (
            <Image
              source={ReturnImageOrText(index)}
              style={{
                // backgroundColor: '#1c1c1c',
                width: '90%',
                marginHorizontal: '5%',
                position: 'absolute',
                resizeMode: 'contain',
                bottom: Dimensions.get('window').height * 0.5,
              }}
            />
          ) : (
            <H1Text
              style={{
                fontSize: 42,
                width: '90%',
                marginHorizontal: '5%',
                position: 'absolute',
                bottom: Dimensions.get('window').height * 0.5,
              }}
              label={ReturnImageOrText(index)}
            />
          )}
          {index > 0 && (
            <View style={{ top: '65%' }}>
              <H2Text
                label={i18n.t('account.introduction_header.' + (index - 1))}
                style={{ fontSize: 25, textAlign: 'center' }}
              />
              <P1Text
                label={i18n.t('account.introduction_text.' + (index - 1))}
                style={{ marginTop: 20, textAlign: 'center' }}
              />
            </View>
          )}
        </View>
      );
    });

  const ButtonListing = Array(5)
    .fill(0)
    .map((_x, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            viewPager.current?.setPage(index);
          }}
          key={index}>
          <Circle
            style={[
              state === index ? styles.enableCircle : styles.disableCircle,
            ]}
          />
        </TouchableOpacity>
      );
    });
  return (
    <SafeAreaView
      forceInset={{ top: 'always', bottom: 'always' }}
      style={{
        flex: 1,
        backgroundColor: '#FAFCFF',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            zIndex: 5,
            backgroundColor: '#3679B5',
            bottom: scrollX.interpolate({
              inputRange: [-1, 0, 1, 2, 2.3, 2.5, 2.7, 3, 3.3, 3.4, 3.6, 4, 5],
              outputRange: [
                Dimensions.get('window').height * 0.5 + 10,
                Dimensions.get('window').height * 0.5 + 10,
                Dimensions.get('window').height * 0.5 + 60,
                Dimensions.get('window').height * 0.5 + 70,
                Dimensions.get('window').height * 0.5 + 180,
                Dimensions.get('window').height * 0.5 + 160,
                Dimensions.get('window').height * 0.5 + 180,
                Dimensions.get('window').height * 0.5 + 120,
                Dimensions.get('window').height * 0.5 + 100,
                Dimensions.get('window').height * 0.5 + 90,
                Dimensions.get('window').height * 0.5 + 90,
                Dimensions.get('window').height * 0.5 + 70,
                Dimensions.get('window').height * 0.5 + 70,
              ],
            }),
            left: scrollX.interpolate({
              inputRange: [-1, 0, 1, 2, 2.3, 2.5, 2.7, 3, 3.3, 3.4, 3.6, 4, 5],
              outputRange: [
                550,
                Dimensions.get('window').width * 0.46 +
                  // eslint-disable-next-line no-nested-ternary
                  (i18n.currentLocale() === LocaleType.KO
                    ? 0
                    : i18n.currentLocale() === LocaleType.CH
                    ? -60
                    : 20),
                Platform.OS === 'ios'
                  ? Dimensions.get('window').width * 0.55
                  : Dimensions.get('window').width * 0.433,
                Dimensions.get('window').width * 0.25,
                Dimensions.get('window').width * 0.92,
                Dimensions.get('window').width * +20,
                Dimensions.get('window').width,
                Dimensions.get('window').width * 0.5,
                -30,
                -30,
                Dimensions.get('window').width * 0.2,
                Dimensions.get('window').width * 0.68,
                -100,
              ],
            }),
            width: scrollX.interpolate({
              inputRange: [
                -1,
                0,
                1,
                2,
                2.3,
                2.301,
                2.499,
                2.5,
                3,
                3.3,
                3.301,
                3.599,
                3.6,
                4,
                5,
              ],
              outputRange: [8, 8, 50, 30, 8, 0, 0, 8, 30, 8, 0, 0, 8, 30, 30],
            }),
            height: scrollX.interpolate({
              inputRange: [
                -1,
                0,
                1,
                2,
                2.3,
                2.301,
                2.499,
                2.5,
                3,
                3.3,
                3.301,
                3.599,
                3.6,
                4,
                5,
              ],
              outputRange: [8, 8, 50, 30, 8, 0, 0, 8, 30, 8, 0, 0, 8, 30, 30],
            }),
            opacity: scrollX.interpolate({
              inputRange: [-1, 0, 1, 2, 2.7, 3, 4, 5],
              outputRange: [1, 1, 0.8, 0.8, 1, 0.8, 0.8, 0.8],
            }),
          }}></Animated.View>
        <ViewPager
          style={{ width: '100%', height: '100%' }}
          initialPage={0}
          ref={viewPager}
          onPageScroll={(e) => {
            setScrollX(
              new Animated.Value(e.nativeEvent.position + e.nativeEvent.offset),
            );
          }}
          onPageSelected={(e) => {
            setState(e.nativeEvent.position);
          }}>
          {ItemListing}
        </ViewPager>
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            position: 'absolute',
            bottom: Dimensions.get('window').height * 0.4,
          }}>
          {ButtonListing}
        </View>
        <SubmitButton
          title={
            i18n.t('account_label.login') + '/' + i18n.t('account_label.signup')
          }
          style={{
            width: '90%',
            marginHorizontal: '5%',
            position: 'absolute',
            bottom: 20,
          }}
          handler={() => navigation.navigate(AccountPage.InitializeEmail)}
        />
        {/* <FlatButton
        style={{ position: 'absolute', bottom: 65, alignSelf: 'center' }}
        title={i18n.t('account.forget_password_link')}
        handler={() => navigation.navigate(AccountPage.InitializeEmail)}
      /> */}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  enableCircle: {
    backgroundColor: '#4E5968',
  },
  disableCircle: {
    backgroundColor: '#A8A8A8',
  },
});

export default IntroduceElysia;