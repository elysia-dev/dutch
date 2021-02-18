import React, { Component, FunctionComponent, useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import UserContext from '../../../contexts/UserContext';

interface Props {
  product: Product;
}

export const Map: FunctionComponent<Props> = (props: Props) => {
  const markerCord = {
    latitude: parseFloat(props.product.data.latitude),
    longitude: parseFloat(props.product.data.longitude),
  };
  const { user } = useContext(UserContext);
  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription = product.data.descriptions[user.language];
  // TODO : Add null guard languages & descrptions

  return (
    <View>
      <H3Text label={i18n.t('product_label.address')} />
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
            marginBottom: 10,
          }}>
          <P1Text
            label={i18n.t('product_label.location')}
            style={{ flex: 1, color: '#626368' }}
          />
          <P1Text
            label={productDescription.address}
            style={{ flex: 4, textAlign: 'right' }}
          />
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
