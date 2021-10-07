import React, { useRef, useEffect, useContext } from 'react';
import { Animated, View, Image, TouchableOpacity } from 'react-native';
import toastFailIcon from '../assets/images/toast_message_fail.png';
import toastSuccessIcon from '../assets/images/toast_message_success.png';
import closeIcon from '../assets/images/XCircleCloseDelete.png';
import { P3Text } from './Texts';
import AppColors from '../../enums/AppColors';
import TransactionContext from '../../contexts/TransactionContext';
import { WaitingTransaction } from '../../types/WaitingTransaction';

type Props = {
  waitingTx: WaitingTransaction;
  idx: number;
};

const ToastMessage: React.FC<Props> = ({ waitingTx, idx }) => {
  const txHash = waitingTx?.txHash;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {
    isSuccessTx,
    isWaitingTx,
    isFailedTx,
    removePendingTransaction,
    removeStorageTx,
  } = useContext(TransactionContext);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 2000,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 500,
    }).start(() => {
      removePendingTransaction(txHash!);
    });
  };

  useEffect(() => {
    fadeIn();
    setTimeout(() => {
      fadeOut();
    }, 3000);

    return () => clearTimeout();
  }, []);

  // useEffect(() => {
  //   if (!isSuccessTx) return;
  //   fadeIn();
  //   setTimeout(() => {
  //     fadeOut();
  //   }, 3000);

  //   return () => clearTimeout();
  // }, [isSuccessTx]);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 100,
        width: '100%',
        alignItems: 'center',
        marginBottom: 60 * idx,
      }}>
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
        }}>
        {/* <Image
          source={toastFailIcon}
          style={{
            width: 20,
            height: 20,
          }}
        /> */}
        {isSuccessTx ? (
          <>
            <Image
              source={toastSuccessIcon}
              style={{
                width: 20,
                height: 20,
              }}
            />
            <P3Text
              label={`부동산 토큰 구매가 완료하였습니다.`}
              style={{
                fontSize: 14,
                fontFamily: 'NanumSquareEB',
                color: AppColors.WHITE,
              }}
            />
          </>
        ) : isFailedTx ? (
          <>
            <Image
              source={toastFailIcon}
              style={{
                width: 20,
                height: 20,
              }}
            />
            <P3Text
              label={`트랜잭션을 전송했습니다.`}
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
              label={`트랜잭션을 전송했습니다.`}
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
            removePendingTransaction(txHash!);
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
    </View>
  );
};

export default ToastMessage;
