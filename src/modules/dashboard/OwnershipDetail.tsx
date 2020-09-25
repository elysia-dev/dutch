import React, { FunctionComponent } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { BackButton } from '../../shared/components/BackButton';
import { OwnershipResponse } from '../../types/Ownership';
import OwnershipBasicInfo from './components/OwnershipBasicInfo';

const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
`;

type ParamList = {
  OwnershipDetail: {
    ownership: OwnershipResponse;
  };
};

const OwnershipDetail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'OwnershipDetail'>>();
  const { ownership } = route.params;

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
            height: 293,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Image
            source={{ uri: ownership.product.data.images[0] }}
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 293,
              resizeMode: 'cover',
            }}
          />
          <View style={{ position: 'absolute', padding: 20 }}>
            <BackButton handler={() => navigation.goBack()} />
          </View>
        </View>
        <OwnershipBasicInfo ownership={ownership} />
      </ScrollView>
    </ProductInfoWrapper>
  );
};

export default OwnershipDetail;
