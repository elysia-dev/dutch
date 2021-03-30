import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import EspressoV2 from '../api/EspressoV2';
import NetworkType from '../enums/NetworkType';
import getEnvironment from '../utiles/getEnvironment';

type TxHandlers = {
  afterTxCreated: (address: string, contractAddress: string, txHash: string, networkType?: NetworkType) => void;
  afterTxFailed: (description?: string) => void;
};

const useTxHandler = (): TxHandlers => {
  const { t } = useTranslation();

  const afterTxCreated = (address: string, contractAddress: string, txHash: string, networkType?: NetworkType) => {
    EspressoV2.createPendingTxNotification(address, contractAddress, txHash).then((res) => alert(
      JSON.stringify(res)
    ))

    showMessage({
      message: t('transaction.pending'),
      description: txHash,
      type: 'info',
      onPress: () => {
        Linking.openURL(
          networkType && networkType === NetworkType.BSC ?
            `https://${getEnvironment().ethNetwork === 'main' ? '' : 'testnet.'}bscscan.com/tx/${txHash}`
            : `https://${getEnvironment().ethNetwork === 'main' ? '' : 'kovan.'}etherscan.io/tx/${txHash}`
        )
      },
      duration: 3000
    });
  }

  const afterTxFailed = (description?: string) => {
    showMessage({
      message: t('transaction.fail'),
      description,
      type: 'danger',
      duration: 3000
    });
  }

  return {
    afterTxCreated,
    afterTxFailed,
  };
}

export default useTxHandler;
