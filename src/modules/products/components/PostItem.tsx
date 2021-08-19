import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import AppColors from '../../../enums/AppColors';
import CachedImage from '../../../shared/components/CachedImage';
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
      }}>
      <View
        style={{
          height: 200,
          marginTop: 20,
        }}>
        {props.product && (
          <>
            <CachedImage
              cacheKey={props.product?.data.images[0].replace(/\//g, '_')}
              source={{ uri: props.product?.data.images[0] }}
              style={{ flex: 1, justifyContent: 'center', borderRadius: 10 }}
            />

            <View
              style={{
                backgroundColor: '#1c1c1ccc',
                flex: 1,
                width: '100%',
                height: '100%',
                borderRadius: 10,
                position: 'absolute',
              }}>
              <View style={{ width: '100%', height: '100%' }}>
                <P1Text
                  style={{
                    color: AppColors.WHITE,
                    marginLeft: 20,
                    marginTop: 20,
                  }}
                  label={props.product?.title || 'Asset'}
                />
                <H1Text
                  style={{
                    marginTop: 45,
                    textAlign: 'center',
                    color: AppColors.WHITE,
                  }}
                  label={'CLOSED'}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};
