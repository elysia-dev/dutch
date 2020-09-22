import React, { FunctionComponent, useState, useContext } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import HTMLView from 'react-native-htmlview';
import i18n from '../../i18n/i18n';
import { Story } from '../../types/product';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Api from '../../api/product';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
  z-index: 3;
`;
const WText = styled.Text`
  margin-top: 30px;
  color: #fff;
  font-size: 14px;
  line-height: 30px;
`;
const GText = styled.Text`
  color: #4e4e4e;
  font-size: 13px;
  text-align: left;
  margin-bottom: 10px;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 12px;
  font-weight: 300;
`;
const DesView = styled.View`
  margin-top: 18px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Method = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 14px;
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
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
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
            source={{ uri: product.images }}
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
        </View>
      </ScrollView>
      <SubmitButton
        style={{ position: 'absolute', bottom: 0, marginBottom: 15 }}
        title={i18n.t('product_label.buy')}
        handler={() => callApi()}
      />
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
