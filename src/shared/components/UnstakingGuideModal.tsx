import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../../enums/AppColors';
import AppFonts from '../../enums/AppFonts';

interface Props {
  isGuideModal: boolean;
  setIsGuideModal: Dispatch<React.SetStateAction<boolean>>;
}

const UnstakingGuideModal: React.FC<Props> = ({
  isGuideModal,
  setIsGuideModal,
}) => {
  const { t } = useTranslation();
  return (
    <Modal transparent={true} visible={isGuideModal}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AppColors.MODAL_BACKGROUND,
          opacity: 1,
        }}>
        <View
          style={{
            width: 343,
            backgroundColor: AppColors.WHITE,
            borderRadius: 10,
            paddingTop: 10,
            paddingBottom: 20,
          }}>
          <View
            style={{
              paddingTop: 37,
              paddingLeft: 24,
              paddingRight: 30,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Text style={{ fontSize: 17, fontFamily: AppFonts.Bold }}>
                {t('staking.unstaking_help')}
              </Text>
              <Text style={{ fontSize: 17, fontFamily: AppFonts.Regular }}>
                {/* 이란? */}
              </Text>
            </View>
            <View
              style={{
                width: 289,
                height: 75,
                marginBottom: 49,
              }}>
              <Text
                style={{
                  color: AppColors.BLACK2,
                  fontSize: 12,
                  lineHeight: 18,
                  fontFamily: AppFonts.Regular,
                }}>
                {t('staking.unstaking_help_description')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Text style={{ fontSize: 17, fontFamily: AppFonts.Bold }}>
                {t('staking.migration_help')}
              </Text>
              <Text style={{ fontSize: 17, fontFamily: AppFonts.Regular }}>
                {/* 이란? */}
              </Text>
            </View>
            <View
              style={{
                width: 289,
                marginBottom: 49,
              }}>
              <Text
                style={{
                  color: AppColors.BLACK2,
                  fontSize: 12,
                  lineHeight: 18,
                  fontFamily: AppFonts.Regular,
                }}>
                {t('staking.migration_help_description')}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  height: 50,
                  justifyContent: 'center',
                  alignContent: 'center',
                  backgroundColor: AppColors.MAIN,
                  borderRadius: 5,
                }}
                onPress={() => setIsGuideModal(false)}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    fontFamily: AppFonts.Bold,
                    color: '#F5F5F5',
                  }}>
                  {t('more_label.close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UnstakingGuideModal;
