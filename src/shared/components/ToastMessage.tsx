import React, { useRef, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, View, Image, TouchableOpacity } from 'react-native';
import toastFailIcon from '../assets/images/toast_message_fail.png';
import toastSuccessIcon from '../assets/images/toast_message_success.png';
import closeIcon from '../assets/images/XCircleCloseDelete.png';
import { P3Text } from './Texts';
import AppColors from '../../enums/AppColors';
import { ToastTransaction } from '../../types/WaitingTransaction';
import TransferType from '../../enums/TransferType';

type Props = {
  waitingTx?: ToastTransaction;
  toastHide: (id: number) => void;
};

const ToastMessage: React.FC<Props> = ({ waitingTx, toastHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 1000,
    }).start(() => {
      const fadeOutTime = setTimeout(() => {
        fadeOut();
      }, 2000);
      return () => clearTimeout(fadeOutTime);
    });
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 1000,
    }).start(() => {
      setIsVisible(false);
    });
  };

  useEffect(() => {
    fadeIn();
  }, [waitingTx]);

  return isVisible ? (
    <Animated.View
      style={{
        // Bind opacity to animated value
        width: '80%',
        opacity: fadeAnim,
        backgroundColor: AppColors.BLACK3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 11,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
      }}>
      {waitingTx && waitingTx.isSuccessTx ? (
        <>
          <Image
            source={toastSuccessIcon}
            style={{
              width: 20,
              height: 20,
            }}
          />
          <P3Text
            label={
              waitingTx.transferType === t(TransferType.Purchase)
                ? t('transaction.purchase_transaction', {
                    transferType: `${t(waitingTx.transferType)}`,
                  })
                : t('transaction.success_transaction', {
                    transferType: `${t(waitingTx.transferType)}`,
                  })
            }
            style={{
              fontSize: 14,
              fontFamily: 'NanumSquareEB',
              color: AppColors.WHITE,
            }}
          />
        </>
      ) : waitingTx?.isFailTx ? (
        <>
          <Image
            source={toastFailIcon}
            style={{
              width: 20,
              height: 20,
            }}
          />
          <P3Text
            label={t('transaction.fail_transaction', {
              transferType: `${t(waitingTx.transferType)}`,
            })}
            style={{
              fontSize: 14,
              fontFamily: 'NanumSquareEB',
              color: AppColors.WHITE,
            }}
          />
        </>
      ) : (
        <>
          <View
            style={{
              width: 20,
              height: 20,
            }}
          />
          <P3Text
            label={t('transaction.create_transaction')}
            style={{
              fontSize: 14,
              fontFamily: 'NanumSquareEB',
              color: AppColors.WHITE,
            }}
          />
        </>
      )}
      <TouchableOpacity
        onPress={() => {
          toastHide(waitingTx?.id!);
        }}>
        <Image
          source={closeIcon}
          style={{
            width: 16,
            height: 16,
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  ) : null;
};

export default ToastMessage;
