import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';
import { STAKING_POOL_ROUNDS_MOMENT } from '../../../constants/staking';

interface Props {
  isFinishRound: boolean;
  setIsFinishRound: Dispatch<SetStateAction<boolean>>;
  handler: () => void;
  currentRound: number;
}

const FinishedRoundModal: React.FC<Props> = ({
  isFinishRound,
  setIsFinishRound,
  handler,
  currentRound,
}) => {
  const { t } = useTranslation();
  return (
    <Modal transparent={true} visible={isFinishRound}>
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
            width: '90%',
            height: 283,
            backgroundColor: AppColors.WHITE,
            borderRadius: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 20.84,
              marginTop: 35.81,
            }}>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: AppColors.BLACK,
                  fontSize: 13,
                }}>
                {t('staking.ended_round_migration_notice', {
                  round: currentRound,
                })}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 25.65,
            }}>
            <View
              style={{
                width: 301,
                height: 67,
                borderWidth: 1,
                borderColor: AppColors.SUB_GREY,
                padding: 16,
                borderRadius: 5,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 5,
                    color: AppColors.SUB_BLACK,
                  }}>
                  {currentRound}차기간
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: AppColors.BLACK,
                  }}>
                  {`${STAKING_POOL_ROUNDS_MOMENT[
                    currentRound - 1
                  ].startedAt.format(
                    t('staking.datetime_format'),
                  )} ~ ${STAKING_POOL_ROUNDS_MOMENT[
                    currentRound - 1
                  ].endedAt.format(t('staking.datetime_format'))}`}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsFinishRound(false);
              }}
              style={{
                borderWidth: 1,
                borderColor: AppColors.MAIN,
                backgroundColor: AppColors.WHITE,
                borderRadius: 5,
                justifyContent: 'center',
                alignContent: 'center',
                height: 50,
                width: 142,
                marginRight: 10.5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: AppFonts.Bold,
                  color: AppColors.MAIN,
                }}>
                {t('assets.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handler();
                setIsFinishRound(false);
              }}
              style={{
                backgroundColor: AppColors.MAIN,
                borderRadius: 5,
                justifyContent: 'center',
                alignContent: 'center',
                height: 50,
                width: 142,
                marginLeft: 10.5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: AppFonts.Bold,
                  color: AppColors.WHITE,
                }}>
                {t('assets.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FinishedRoundModal;
