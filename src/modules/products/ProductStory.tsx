import React, { FunctionComponent, useState, useContext } from 'react';
import { View, ScrollView, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import HTMLView from 'react-native-htmlview';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../../i18n/i18n';
import { Story } from '../../types/product';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';
import Api from '../../api/product';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
  z-index: 3;
`;

const GText = styled.Text`
  color: #4e4e4e;
  font-size: 13px;
  text-align: left;
  margin-bottom: 10px;
`;

const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
  height: 100%;
  width: 100%;
`;

type ParamList = {
  Story: {
    product: Story;
  };
};

const ProductStory: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'Story'>>();
  const { product } = route.params;
  const [state, setState] = useState({
    scrollY: new Animated.Value(0),
  });
  const callApi = () => {
    Api.productInfo(product.productId)
      .then(res => {
        navigation.navigate('BuyModalStack', {
          screen: ProductPage.ProductBuying,
          params: { product: res.data },
        });
        console.log(res.data);
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        }
      });
  };

  return (
    <ProductInfoWrapper>
      <Animated.ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: state.scrollY } },
            },
          ],
          { useNativeDriver: true },
        )}
        style={{ height: '100%', backgroundColor: '#fff' }}>
        <View
          style={{
            top: 0,
            width: '100%',
            height: 382,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Image
            source={{ uri: product.image }}
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 382,
              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              justifyContent: 'space-between',

              paddingLeft: 30,
              paddingRight: 15,
              width: '100%',
            }}>
            <View style={{ flexDirection: 'column', paddingTop: 30 }}>
              <GText>{product.subTitle}</GText>
              <H1Text>{product.title}</H1Text>
            </View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    resizeMode: 'center',
                    opacity: 0.8,
                  }}
                  source={require('./images/quitbutton.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            paddingTop: 30,
            paddingBottom: 60,
          }}>
          <HTMLView value={product.body} stylesheet={styles} />
          <HTMLView value={product.body} stylesheet={styles} />
          <HTMLView value={product.body} stylesheet={styles} />
          <HTMLView value={product.body} stylesheet={styles} />
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={{
          height: 0,
          backgroundColor: 'transparent',
          transform: [
            {
              translateY: state.scrollY.interpolate({
                inputRange: [-1000, 0, 20, 60, 1000],
                outputRange: [60, 60, 20, 0, 0],
              }),
            },
          ],
        }}>
        <SubmitButton
          style={{
            position: 'relative',
            top: -55,
            marginBottom: 15,
          }}
          title={i18n.t('product_label.purchase')}
          handler={() => callApi()}
        />
      </Animated.View>
    </ProductInfoWrapper>
  );
};

const styles = StyleSheet.create({
  h2: {
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 40,
  },
  p: {
    fontSize: 15,
    lineHeight: 40,
    color: '#626368',
    textAlign: 'left',
  },
});

export default ProductStory;
