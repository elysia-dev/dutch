import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../enums/AppFonts';
import AppColors from '../../enums/AppColors';
import { H3Text, H4Text, P3Text } from './Texts';
import ApproveDescription from './ApproveDescription';
import ConfirmBox from './ConfirmBox';
import CryptoType from '../../enums/CryptoType';

interface Props {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  subtitle: string;
  list: { label: string; value: string; subvalue?: string }[];
  isApproved: boolean;
  isAllowanced: boolean;
  isLoading?: boolean;
  approvalGasPrice: string;
  assetTypeOrRefund?: CryptoType | string;
  submitButtonText: string;
  handler: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  modalVisible,
  setModalVisible,
  title,
  subtitle,
  list,
  isApproved,
  isAllowanced,
  isLoading,
  approvalGasPrice,
  assetTypeOrRefund,
  submitButtonText,
  handler,
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
            height: 620,
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
              {assetTypeOrRefund === CryptoType.EL && !isAllowanced && (
                <ConfirmBox isApprove={isApproved} />
              )}
              {isApproved ? (
                <>
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
                    {subtitle}
                  </Text>
                  {list.map((item) => {
                    return (
                      <View
                        key={item.label}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          borderBottomWidth: 1,
                          borderBottomColor: AppColors.GREY,
                          alignItems: 'center',
                          height: item.subvalue ? 64 : 50,
                          paddingHorizontal: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: AppColors.BLACK2,
                            fontFamily: AppFonts.Regular,
                          }}>
                          {item.label}
                        </Text>
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              color: AppColors.BLACK,
                              textAlign: 'right',
                              fontFamily: AppFonts.Bold,
                            }}>
                            {item.value}
                          </Text>
                          {item.subvalue && (
                            <Text
                              style={{
                                fontSize: 12,
                                color: AppColors.SUB_BLACK,
                                textAlign: 'right',
                                fontFamily: AppFonts.Regular,
                              }}>
                              {item.subvalue}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
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
                </>
              ) : !isLoading ? (
                <ApproveDescription approveGasPrice={approvalGasPrice} />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 131,
                  }}>
                  <ActivityIndicator size="large" color={AppColors.GREY2} />
                  <H3Text
                    label={t('assets.approve_pending_transaction')}
                    style={{
                      fontSize: 18,
                      marginTop: 19,
                    }}
                  />
                </View>
              )}
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  handler();
                }}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? AppColors.GREY : AppColors.MAIN,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignContent: 'center',
                  height: 50,
                }}>
                {isApproved && isLoading ? (
                  <ActivityIndicator size="small" color={AppColors.GREY2} />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      fontFamily: AppFonts.Bold,
                      color: AppColors.WHITE,
                    }}
                    allowFontScaling={false}>
                    {isApproved
                      ? submitButtonText
                      : t('assets.check_allowance')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
