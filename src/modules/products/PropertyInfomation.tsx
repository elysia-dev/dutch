import React, { FunctionComponent } from 'react';
import { View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { P2Text, H2Text, P1Text, H3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import AppColors from '../../enums/AppColors';

const PropertyInfomation: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <WrapperLayout
      isScrolling={true}
      title={t('product_label.property_infomation_title')}
      backButtonHandler={() => navigation.goBack()}
      body={
        <SafeAreaView>
          <View style={{ height: '100%', width: '100%' }}>
            <View
              style={{
                marginLeft: '5%',
                marginRight: '5%',
                borderBottomColor: AppColors.SUB_GREY,
                borderBottomWidth: 1,
                paddingBottom: 40,
              }}>
              <H2Text
                label={t('product_label.unit.0')}
                style={{ fontSize: 20, marginBottom: '5%' }}
              />
              <View style={{ marginLeft: '5%', marginRight: '5%' }}>
                <H3Text
                  label={t('product_label.unit.1')}
                  style={{ marginBottom: 6 }}
                />
                <View style={{ marginBottom: 35 }}>
                  <P1Text
                    label={':'}
                    style={{ position: 'absolute', marginLeft: '2.5%' }}
                  />
                  <P1Text
                    label={t('product_label.unit.2')}
                    style={{ marginLeft: '5%', marginRight: '5%' }}
                  />
                </View>
                <H3Text
                  label={t('product_label.unit.3')}
                  style={{ marginBottom: 6 }}
                />
                <View style={{ marginBottom: 35 }}>
                  <P1Text
                    label={':'}
                    style={{ position: 'absolute', marginLeft: '2.5%' }}
                  />
                  <P1Text
                    label={t('product_label.unit.4')}
                    style={{ marginLeft: '5%', marginRight: '5%' }}
                  />
                </View>

                <H3Text
                  label={t('product_label.unit.5')}
                  style={{ marginBottom: 6 }}
                />
                <View
                  style={{
                    borderColor: AppColors.SUB_GREY,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    paddingBottom: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('./images/el-main.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 80,
                        height: 80,
                        marginVertical: 10,
                      }}
                    />
                    <H3Text
                      label={'+'}
                      style={{ position: 'absolute', left: '34%' }}
                    />
                    <Image
                      source={require('./images/el-bonus.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 60,
                        height: 60,
                      }}
                    />
                    <H3Text
                      label={'='}
                      style={{ position: 'absolute', right: '34%' }}
                    />
                    <Image
                      source={require('./images/el-total.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 70,
                        height: 70,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.unit.6')}
                        style={{ fontSize: 11 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.unit.7')}
                        style={{ fontSize: 11 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.unit.8')}
                        style={{ fontSize: 11 }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginLeft: '5%',
                marginRight: '5%',
                borderBottomColor: AppColors.SUB_GREY,
                borderBottomWidth: 1,
                paddingVertical: 40,
              }}>
              <H2Text
                label={t('product_label.usd.0')}
                style={{ fontSize: 20, marginBottom: '5%' }}
              />
              <View style={{ marginLeft: '5%', marginRight: '5%' }}>
                <H3Text
                  label={t('product_label.usd.1')}
                  style={{ marginBottom: 6 }}
                />
                <View style={{ marginBottom: 35 }}>
                  <P1Text
                    label={':'}
                    style={{ position: 'absolute', marginLeft: '2.5%' }}
                  />
                  <P1Text
                    label={t('product_label.usd.2')}
                    style={{ marginLeft: '5%', marginRight: '5%' }}
                  />
                </View>
                <H3Text
                  label={t('product_label.usd.3')}
                  style={{ marginBottom: 6 }}
                />
                <View style={{ marginBottom: 35 }}>
                  <P1Text
                    label={':'}
                    style={{ position: 'absolute', marginLeft: '2.5%' }}
                  />
                  <P1Text
                    label={t('product_label.usd.4')}
                    style={{ marginLeft: '5%', marginRight: '5%' }}
                  />
                </View>

                <H3Text label={'3-1)'} style={{ marginBottom: 2 }} />
                <H3Text
                  label={t('product_label.usd.5')}
                  style={{ marginBottom: 6 }}
                />
                <View
                  style={{
                    borderColor: AppColors.SUB_GREY,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    paddingBottom: 20,
                    marginBottom: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('./images/usd-main.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 80,
                        height: 80,
                        marginVertical: 10,
                      }}
                    />
                    <H3Text
                      label={'+'}
                      style={{ position: 'absolute', left: '34%' }}
                    />
                    <Image
                      source={require('./images/usd-bonus.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 60,
                        height: 60,
                      }}
                    />
                    <H3Text
                      label={'='}
                      style={{ position: 'absolute', right: '34%' }}
                    />
                    <Image
                      source={require('./images/usd-total.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 70,
                        height: 70,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.usd.7')}
                        style={{ fontSize: 11 }}
                      />
                      <P1Text label={'(500EL)'} style={{ fontSize: 10 }} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.usd.8')}
                        style={{ fontSize: 11 }}
                      />
                      <P1Text label={'(50EL)'} style={{ fontSize: 10 }} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.usd.9')}
                        style={{ fontSize: 11 }}
                      />
                      <P1Text label={'(550EL)'} style={{ fontSize: 10 }} />
                    </View>
                  </View>
                </View>
                <H3Text label={'3-2)'} style={{ marginBottom: 2 }} />
                <H3Text
                  label={t('product_label.usd.6')}
                  style={{ marginBottom: 6 }}
                />
                <View
                  style={{
                    borderColor: AppColors.SUB_GREY,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    paddingBottom: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('./images/usd-main.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 80,
                        height: 80,
                        marginVertical: 10,
                      }}
                    />
                    <H3Text
                      label={'+'}
                      style={{ position: 'absolute', left: '34%' }}
                    />
                    <Image
                      source={require('./images/usd-bonus.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 60,
                        height: 60,
                      }}
                    />
                    <H3Text
                      label={'='}
                      style={{ position: 'absolute', right: '34%' }}
                    />
                    <Image
                      source={require('./images/usd-total.png')}
                      style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 70,
                        height: 70,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.usd.7')}
                        style={{ fontSize: 11 }}
                      />
                      <P1Text label={'(2000EL)'} style={{ fontSize: 10 }} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.usd.8')}
                        style={{ fontSize: 11 }}
                      />
                      <P1Text label={'(200EL)'} style={{ fontSize: 10 }} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <P1Text
                        label={t('product_label.usd.9')}
                        style={{ fontSize: 11 }}
                      />
                      <P1Text label={'(2200EL)'} style={{ fontSize: 10 }} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      }
    />
  );
};

export default PropertyInfomation;
