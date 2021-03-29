import { Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import EspressoV2 from '../api/EspressoV2';
import NetworkType from '../enums/NetworkType';
import getEnvironment from '../utiles/getEnvironment';

type TxHandlers = {
  afterTxCreated: (address: string, contractAddress: string, txHash: string, networkType?: NetworkType) => void;
  afterTxFailed: () => void;
};

function useTxHandler(): TxHandlers {
  const afterTxCreated = (address: string, contractAddress: string, txHash: string, networkType?: NetworkType) => {
    EspressoV2.createPendingTxNotification(address, contractAddress, txHash).then((res) => alert(
      JSON.stringify(res)
    ))

    showMessage({
      message: `트랜잭션 생성 요청을 완료했습니다.`,
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

  const afterTxFailed = () => {
    showMessage({
      message: `트랜잭션 생성에 실패했습니다.`,
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
