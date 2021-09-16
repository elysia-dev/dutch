import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import EspressoV2 from '../api/EspressoV2';
import NetworkType from '../enums/NetworkType';
import { MainPage } from '../enums/pageEnum';
import getTxScanLink from '../utiles/getTxScanLink';

type TxHandlers = {
  afterTxCreated: (txHash: string, networkType?: NetworkType) => void;
  afterTxHashCreated: (
    address: string,
    contractAddress: string,
    txHash: string,
    networkType?: NetworkType,
  ) => void;
  afterTxFailed: (description?: string) => void;
};

const useTxHandler = (): TxHandlers => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const afterTxCreated = (txHash: string) => {
    showMessage({
      style: {
        paddingTop: Platform.OS === 'android' ? 20 : 0,
      },
      message: t('transaction.created'),
      description: txHash,
      type: 'info',
      onPress: () => {
        navigation.navigate(MainPage.DashboardMain, {
          refresh: true,
        });
      },
      duration: 3000,
    });
  };

  const afterTxHashCreated = (
    address: string,
    contractAddress: string,
    txHash: string,
    networkType?: NetworkType,
  ) => {
    EspressoV2.createPendingTxNotification(
      address,
      contractAddress,
      txHash,
    ).then((res) => alert(JSON.stringify(res)));

    showMessage({
      style: {
        paddingTop: Platform.OS === 'android' ? 20 : 0,
      },
      message: t('transaction.pending'),
      description: txHash,
      type: 'info',
      onPress: () => {
        Linking.openURL(getTxScanLink(txHash, networkType));
      },
      duration: 3000,
    });
  };

  const afterTxFailed = (description?: string) => {
    showMessage({
      style: {
        paddingTop: Platform.OS === 'android' ? 20 : 0,
      },
      message: t('transaction.fail'),
      description,
      type: 'danger',
      duration: 3000,
    });
  };

  return {
    afterTxCreated,
    afterTxHashCreated,
    afterTxFailed,
  };
};

export default useTxHandler;
