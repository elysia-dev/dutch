import { Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import EspressoV2 from '../api/EspressoV2';
import getEnvironment from '../utiles/getEnvironment';

type TxHandlers = {
  afterTxCreated: (address: string, contractAddress: string, txHash: string) => void;
  afterTxFailed: () => void;
};

function useTxHandler(): TxHandlers {
  const afterTxCreated = (address: string, contractAddress: string, txHash: string) => {
    EspressoV2.createPendingTxNotification(address, contractAddress, txHash).then((res) => alert(
      JSON.stringify(res)
    ))
    showMessage({
      message: `트랜잭션 생성 요청을 완료했습니다.`,
      description: txHash,
      type: 'info',
      onPress: () => {
        Linking.openURL(
          getEnvironment().ethNetwork === 'main'
            ? `https://etherscan.io/tx/${txHash}`
            : `https://kovan.etherscan.io/tx/${txHash}`,
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
