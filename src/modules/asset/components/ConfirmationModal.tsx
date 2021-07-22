import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';
import { H3Text, H4Text } from '../../../shared/components/Texts';
import commaFormatter from '../../../utiles/commaFormatter';
import PurposeType from '../../../enums/PurposeType';

interface Props {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  purpose: PurposeType;
  assetTitle: string;
  assetUnit: string;
  values: { inFiat: string; inToken: string };
  priceInCryptocurrency: number;
  cryptocurrencyType: string;
  estimateGas: string;
  gasCrypto: string;
  isApproved: boolean;
  createTx: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  modalVisible,
  setModalVisible,
  title,
  purpose,
  assetTitle,
  assetUnit,
  values,
  priceInCryptocurrency,
  cryptocurrencyType,
  estimateGas,
  gasCrypto,
  isApproved,
  createTx,
}) => {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(false);

  return (
    <Modal transparent={true} visible={modalVisible} animationType={'slide'}>
      <View
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: AppColors.MODAL_BACKGROUND,
          }}
        />
        <View
          style={{
            width: '100%',
            height: 572,
            display: 'flex',
            backgroundColor: AppColors.MODAL_BACKGROUND,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: AppColors.BACKGROUND_GREY,
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <H4Text
                label={t('assets.cancel')}
                style={{ color: AppColors.MAIN }}
              />
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
              backgroundColor: AppColors.WHITE,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: AppColors.BLACK,
                  textAlign: 'center',
                  lineHeight: 32,
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.GREY,
                  alignItems: 'center',
                  marginTop: 20,
                  height: 50,
                  fontFamily: AppFonts.Bold,
                }}>
                {t(`assets.${purpose}_confirm`)}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.GREY,
                  alignItems: 'center',
                  height: 50,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: AppColors.BLACK2,
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}>
                  {t(`assets.${purpose}_confirm_product`)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: AppColors.BLACK,
                    marginRight: 5,
                    fontFamily: AppFonts.Bold,
                  }}>
                  {`${assetTitle} (${assetUnit})`}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.GREY,
                  alignItems: 'center',
                  height: 64,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: AppColors.BLACK2,
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}>
                  {t(`assets.${purpose}_confirm_value`)}
                </Text>
                <View style={{ marginRight: 5 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: AppColors.BLACK,
                      textAlign: 'right',
                      fontFamily: AppFonts.Bold,
                    }}>
                    {`$ ${commaFormatter(values.inFiat)}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: AppColors.SUB_BLACK,
                      textAlign: 'right',
                      fontFamily: AppFonts.Regular,
                    }}>
                    {`${commaFormatter(
                      (Number(values.inFiat) / priceInCryptocurrency).toFixed(
                        2,
                      ),
                    )} ${cryptocurrencyType}`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.GREY,
                  alignItems: 'center',
                  height: 50,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: AppColors.BLACK2,
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}>
                  {t(`assets.${purpose}_confirm_stake`)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: AppColors.BLACK,
                    marginRight: 5,
                    fontFamily: AppFonts.Bold,
                  }}>
                  {`${commaFormatter(values.inToken)} ${assetUnit}`}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.GREY,
                  alignItems: 'center',
                  height: 50,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: AppColors.BLACK2,
                    marginLeft: 5,
                    fontFamily: AppFonts.Regular,
                  }}>
                  {t('assets.gas_price')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: AppColors.BLACK,
                    marginRight: 5,
                    fontFamily: AppFonts.Bold,
                  }}>
                  {`${commaFormatter(estimateGas)} ${gasCrypto}`}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: AppColors.BLACK,
                  marginHorizontal: 5,
                  marginTop: 12,
                  lineHeight: 20,
                  fontFamily: AppFonts.Regular,
                }}>
                {`* ${t('assets.confirm_gas')}`}
              </Text>
            </View>
            <View>
              {!isApproved && (
                <Text
                  style={{
                    fontSize: 12,
                    color: AppColors.BLACK,
                    marginHorizontal: 5,
                    marginBottom: 12,
                    lineHeight: 20,
                    fontFamily: AppFonts.Bold,
                  }}>
                  {`* ${t('assets.check_allowance_guide')}`}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  setDisabled(true);
                  createTx();
                }}
                disabled={disabled}
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
                    color: AppColors.WHITE,
                  }}
                  allowFontScaling={false}>
                  {isApproved
                    ? t(`assets.${purpose}`)
                    : t('assets.check_allowance')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
