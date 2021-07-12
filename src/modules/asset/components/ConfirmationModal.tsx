import React, { Dispatch, SetStateAction } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';
import { H3Text, H4Text } from '../../../shared/components/Texts';
import commaFormatter from '../../../utiles/commaFormatter';

interface Props {
  modalVisible: boolean
  setModalVisible: Dispatch<SetStateAction<boolean>>
  title: string
  purposeType: string
  assetTitle: string
  assetUnit: string
  values: { from: string, to: string }
  priceInCryptocurrency: number
  cryptocurrencyType: string
  estimateGas: string
  gasCrypto: string
  isApproved: boolean
  createTx: () => void
  disabled: boolean
}

const ConfirmationModal: React.FC<Props> = ({
  modalVisible,
  setModalVisible,
  title,
  purposeType,
  assetTitle,
  assetUnit,
  values,
  priceInCryptocurrency,
  cryptocurrencyType,
  estimateGas,
  gasCrypto,
  isApproved,
  createTx,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType={'slide'}
    >
      <View
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.44)',
          }}
        />
        <View
          style={{
            width: '100%',
            height: 572,
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.44)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: AppColors.BACKGROUND_GREY,
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <H4Text label={t('assets.cancel')} style={{ color: AppColors.MAIN }} />
            </TouchableOpacity>
            <H3Text label={title} style={{}} />
            <View style={{ width: 20 }} />
          </View>
          <View
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: 18,
              flex: 1,
              backgroundColor: 'white',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: 'rgba(28, 28, 28, 1)',
                  textAlign: 'center',
                  lineHeight: 32,
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(241, 241, 241, 1)',
                  alignItems: 'center',
                  marginTop: 20,
                  height: 50,
                  fontFamily: AppFonts.Bold,
                }}
              >
                {t(`assets.${purposeType}_confirm`)}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(241, 241, 241, 1)',
                  alignItems: 'center',
                  height: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(102, 102, 102, 1)',
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}
                >
                  {t(`assets.${purposeType}_confirm_product`)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#1C1C1C',
                    marginRight: 5,
                    fontFamily: AppFonts.Bold,
                  }}
                >
                  {`${assetTitle} (${assetUnit})`}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(241, 241, 241, 1)',
                  alignItems: 'center',
                  height: 64,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(102, 102, 102, 1)',
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}
                >
                  {t(`assets.${purposeType}_confirm_value`)}
                </Text>
                <View style={{ marginRight: 5 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#1C1C1C',
                      textAlign: 'right',
                      fontFamily: AppFonts.Bold,
                    }}
                  >
                    {`$ ${commaFormatter(values.from)}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#848484',
                      textAlign: 'right',
                      fontFamily: AppFonts.Regular,
                    }}
                  >
                    {`${commaFormatter((Number(values.from) / priceInCryptocurrency).toFixed(2))} ${cryptocurrencyType}`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(241, 241, 241, 1)',
                  alignItems: 'center',
                  height: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(102, 102, 102, 1)',
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}
                >
                  {t(`assets.${purposeType}_confirm_stake`)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#1C1C1C',
                    marginRight: 5,
                    fontFamily: AppFonts.Bold,
                  }}
                >
                  {`${commaFormatter(values.to)} ${assetUnit}`}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(241, 241, 241, 1)',
                  alignItems: 'center',
                  height: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(102, 102, 102, 1)',
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}
                >
                  {t('assets.gas_price')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#1C1C1C',
                    marginRight: 5,
                    fontFamily: AppFonts.Bold,
                  }}
                >
                  {`${commaFormatter(estimateGas)} ${gasCrypto}`}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#1C1C1C',
                  marginHorizontal: 5,
                  marginTop: 12,
                  lineHeight: 20,
                  fontFamily: AppFonts.Regular,
                }}
              >
                {`* ${t('assets.confirm_gas')}`}
              </Text>
            </View>
            <View>
              {!isApproved && <Text
                style={{
                  fontSize: 12,
                  color: '#1C1C1C',
                  marginHorizontal: 5,
                  marginBottom: 12,
                  lineHeight: 20,
                  fontFamily: AppFonts.Bold,
                }}
              >
                {`* ${t('assets.check_allowance_guide')}`}
              </Text>}
              <TouchableOpacity
                onPress={createTx}
                style={{
                  backgroundColor: disabled ? AppColors.GREY : AppColors.MAIN,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignContent: 'center',
                  height: 50,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    fontFamily: AppFonts.Bold,
                    color: 'white',
                  }}
                  allowFontScaling={false}
                >
                  {isApproved ? t(`assets.${purposeType}`) : t('assets.check_allowance')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmationModal;