import React, { Component, FunctionComponent, useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import latlon from '../latlon';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import ProductInfo from '../ProductBuying';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
`;

const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-weight: 300;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 300;
`;

interface Props {
  product: Product;
}

export const Map: FunctionComponent<Props> = (props: Props) => {
  const markerCord = {
    latitude: parseFloat(props.product.data.latitude),
    longitude: parseFloat(props.product.data.longitude),
  };
  const { user } = useContext(RootContext);
  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription =
    product.data.descriptions[user.language];
  // TODO : Add null guard languages & descrptions

  return (
    <View>
      <H1Text>{i18n.t('product_label.address')}</H1Text>
      <View
        style={{
          width: '100%',
          height: 180,
          borderRadius: 5,
        }}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: parseFloat(props.product.data.latitude),
            longitude: parseFloat(props.product.data.longitude),
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}>
          <Marker coordinate={markerCord} />
        </MapView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <GText>{i18n.t('product_label.location')}</GText>
          <PText>{productDescription.address}</PText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    marginTop: 20,
    marginBottom: 20,
    height: 180,
    width: '100%',
    borderRadius: 5,
  },
});
