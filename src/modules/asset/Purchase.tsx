import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken, useAssetTokenEth, useElysiaToken } from '../../hooks/useContract';
import { BigNumber } from '@ethersproject/bignumber';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import { utils } from 'ethers';
import TxInput from './components/TxInput';
import usePrices from '../../hooks/usePrice';
import useTxHandler from '../../hooks/useTxHandler';

type ParamList = {
  Purchase: {
    fromCrypto: CryptoType,
    fromTitle: string,
    toTitle: string,
    toCrypto: CryptoType,
  };
};

// EL - EA
//const testContractAddress = '0xb09479b0ad2C939d59cB1Ea1C27C1b25F9B8A46E';
// EL - ETH
const testContractAddress = '0xFFBFF24cA3A03F1039f9AFc222A6F76105564b12'
// TODO
// 1. Check Maximu value gasFee & Price...
// 2. toPrice는 5달러 고정이 아닐 수 도 있다.
// 4. Tx 생성 에러 더 상세하게 적기
const Purchase: FunctionComponent = () => {
  const [values, setValues] = useState({
    from: '',
    to: ''
  })
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.None,
  });
  const [current, setCurrent] = useState<'from' | 'to'>('from');
  const { fromCrypto, fromTitle, toTitle, toCrypto } = useRoute<RouteProp<ParamList, 'Purchase'>>()?.params;
  const navigation = useNavigation();
  const assetTokenContract = useAssetToken(testContractAddress);
  const assetTokenEthContract = useAssetTokenEth(testContractAddress);
  const elContract = useElysiaToken();
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(state.txHash);
  const { elPrice, ethPrice } = usePrices()
  const { afterTxFailed, afterTxCreated } = useTxHandler();

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        elContract?.allowance(
          wallet?.getFirstNode()?.address, testContractAddress
        ).then((res: BigNumber) => {
          if (res.isZero()) {
            setState({ ...state, step: TxStep.Approving })
          } else {
            setState({ ...state, step: TxStep.Creating })
          }
        }).catch(() => {
          afterTxFailed();
          navigation.goBack();
        })
        break;

      case TxStep.Approving:
        elContract?.populateTransaction
          .approve(testContractAddress, '1' + '0'.repeat(25))
          .then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
            }).then((tx: any) => {
              setState({ txHash: tx, step: TxStep.Creating })
            }).catch(() => {
              afterTxFailed();
              navigation.goBack();
            })
          })
        break;

      case TxStep.Creating:
        if (fromCrypto === CryptoType.ETH) {
          assetTokenEthContract?.populateTransaction.purchase(
          ).then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
              value: utils.parseEther(values.from).toHexString(),
            }).then((tx) => {
              afterTxCreated(tx.hash)
              navigation.goBack();
            }).catch(() => {
              afterTxFailed();
              navigation.goBack();
            })
          })
        } else {
          assetTokenContract?.populateTransaction.purchase(
            utils.parseEther(values.from)
          ).then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
            }).then((tx) => {
              afterTxCreated(tx.hash)
              navigation.goBack();
            }).catch(() => {
              afterTxFailed();
            })
          })
        }
        break;
      default:
    }
  }, [state.step])

  useEffect(() => {
    if (![TxStatus.Success, TxStatus.Fail].includes(txResult.status)) return;

    switch (state.step) {
      case TxStep.Approving:
        setState({
          ...state,
          step:
            txResult.status === TxStatus.Success
              ? TxStep.Creating
              : TxStep.Failed,
        });
        break;
    }
  }, [txResult.status]);

  return (
    <TxInput
      title={'구매하기'}
      fromInputTitle={'투자 금액'}
      toInputTitle={'받는 지분'}
      fromCrypto={fromCrypto}
      fromTitle={fromTitle}
      toCrypto={toCrypto}
      toTitle={toTitle}
      values={values}
      fromPrice={fromCrypto === CryptoType.ETH ? ethPrice : elPrice}
      toPrice={5} // 5 USD
      current={current}
      step={state.step}
      setCurrent={setCurrent}
      setValues={setValues}
      createTx={() => {
        setState({ ...state, step: TxStep.CheckAllowance })
      }}
    />
  );
};

export default Purchase;
