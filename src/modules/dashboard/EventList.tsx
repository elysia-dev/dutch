import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { P1Text, H2Text } from '../../shared/components/Texts';
import i18n from '../../i18n/i18n';

import { DashboardPage, ProductPage } from '../../enums/pageEnum';
import getEnvironment from '../../utiles/getEnvironment';

export const EventList: FunctionComponent<{}> = () => {
  const navigation = useNavigation();

  return (
    <>
      <WrapperLayout
        style={{ backgroundColor: '#FAFCFF' }}
        isScrolling={false}
        backButtonHandler={() => navigation.goBack()}
        title={i18n.t('dashboard_label.event')}
        body={
          <>
            <View style={{ marginLeft: '5%', marginRight: '5%' }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(DashboardPage.PreparingInvestment)
                }
                style={{
                  marginBottom: 25,
                  width: '100%',
                  height: 122,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  shadowColor: '#3679B540',
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                  elevation: 8,
                }}>
                <Image
                  style={{
                    width: 90,
                    height: 100,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                  }}
                  source={require('./images/promotion.png')}
                />
                <P1Text
                  style={{ position: 'absolute', top: 35, left: 20 }}
                  label={i18n.t('dashboard.connect_wallet')}
                />
                <H2Text
                  style={{ position: 'absolute', top: 55, left: 20 }}
                  label={i18n.t('dashboard.get_EL')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Product', {
                    screen: ProductPage.ProductStory,
                    params: {
                      givenId:
                        getEnvironment().envName === 'PRODUCTION' ? 8 : 35,
                    },
                  })
                }
                style={{
                  marginBottom: 25,
                  width: '100%',
                  height: 122,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  shadowColor: '#3679B540',
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                  elevation: 8,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    borderRadius: 10,
                  }}
                  source={require('./images/eventcard_building.png')}
                />
                <P1Text
                  style={{ position: 'absolute', top: 35, left: 20 }}
                  label={i18n.t('dashboard.first_product_subs')}
                />
                <H2Text
                  style={{ position: 'absolute', top: 55, left: 20 }}
                  label={i18n.t('dashboard.give_EL')}
                />
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </>
  );
};
