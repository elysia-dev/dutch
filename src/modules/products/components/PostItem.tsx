import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { H1Text, P1Text } from '../../../shared/components/Texts';
import Product from '../../../types/product';

interface Props {
  product?: Product;
  active?: boolean;
  activateCard?: (pageX: number, pageY: number) => void;
}

export const PostItem: FunctionComponent<Props> = (props: Props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Product', {
          screen: 'ProductBuying',
          params: { productId: props.product?.id },
        });
      }}
    >
      <View style={{
        height: 200,
        marginTop: 20,
      }}>
        <ImageBackground source={{ uri: (props.product?.data.images[0]) }} style={{ flex: 1, justifyContent: "center" }} imageStyle={{ borderRadius: 10 }}>
          <View style={{ backgroundColor: "#1c1c1ccc", flex: 1, borderRadius: 10 }}>
            <View style={{ margin: 20 }}>
              <P1Text style={{ color: "#FFF" }} label={props.product?.title || 'Asset'} />
              <H1Text style={{
                marginTop: 45,
                textAlign: 'center',
                color: "#Fff",
              }}
                label={'CLOSED'}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};
