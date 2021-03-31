import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import useTxHandler from '../../hooks/useTxHandler';
import { View, Text } from 'react-native';
import CryptoInput from './components/CryptoInput';
import NextButton from '../../shared/components/NextButton';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils } from 'ethers';
import OverlayLoading from '../../shared/components/OverlayLoading';
import PaymentSelection from './components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import PreferenceContext from '../../contexts/PreferenceContext';
import SheetHeader from '../../shared/components/SheetHeader';
import PriceContext from '../../contexts/PriceContext';
import { P3Text } from '../../shared/components/Texts';
import NetworkType from '../../enums/NetworkType';
import AssetContext from '../../contexts/AssetContext';
import AppColors from '../../enums/AppColors';
import { getAssetTokenFromCryptoType } from '../../utiles/getContract';
import TxStatus from '../../enums/TxStatus';
import { useWatingTx } from '../../hooks/useWatingTx';

type ParamList = {
  Reward: {
    toCrypto: CryptoType,
    toTitle: string,
    productId: number,
    contractAddress: string,
  };
};

const Reward: FunctionComponent = () => {
  const [interest, setInterest] = useState(0);
  const route = useRoute<RouteProp<ParamList, 'Reward'>>()
  const { toCrypto, toTitle, contractAddress } = route.params;
  const navigation = useNavigation();
  const { wallet } = useContext(WalletContext);
  const { currencyFormatter } = useContext(PreferenceContext)
  const { isWalletUser, user, Server } = useContext(UserContext);
  const { getBalance } = useContext(AssetContext);
  const { gasPrice, bscGasPrice, getCryptoPrice, } = useContext(PriceContext);
  const [state, setState] = useState({
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
    txHash: '',
    step: TxStep.None
  });
  const { t } = useTranslation()
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const gasCrypto = toCrypto === CryptoType.BNB ? CryptoType.BNB : CryptoType.ETH;
  const insufficientGas = getBalance(gasCrypto) < parseFloat(state.estimateGas);
  const contract = getAssetTokenFromCryptoType(toCrypto, contractAddress);
  const txResult = useWatingTx(state.txHash, toCrypto === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH);

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await contract?.estimateGas.claimReward({
        from: wallet?.getFirstNode()?.address
      })
    } catch {
    } finally {
      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(estimateGas.mul(toCrypto === CryptoType.ETH ? gasPrice : bscGasPrice)),
        })
      }
    }
  }

  useEffect(() => {
    if (isWalletUser) {
      estimateGas();
    }
  }, [])

  useEffect(() => {
    const address = isWalletUser ? wallet?.getFirstNode()?.address : user.ethAddresses[0]

    contract?.getReward(address).then((res: BigNumber) => {
      setInterest(parseFloat(utils.formatEther(res)));
    });
  }, [])

  const createTx = async () => {
    let txRes: ethers.providers.TransactionResponse | undefined;

    try {
      const populatedTransaction = await contract?.populateTransaction.claimReward()

      if (!populatedTransaction) return;

      txRes = await wallet?.getFirstSigner(toCrypto === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
      })

      if (toCrypto === CryptoType.BNB) {
        setState({
          ...state,
          txHash: txRes?.hash || '',
        })
      }
    } catch (e) {
      afterTxFailed(e.message);
      navigation.goBack();
    } finally {
      if (toCrypto !== CryptoType.BNB && txRes) {
        afterTxHashCreated(
          wallet?.getFirstAddress() || '',
          contractAddress,
          txRes.hash || '',
          NetworkType.ETH,
        )
        navigation.goBack();
      }
    }
  }

  useEffect(() => {
    switch (state.step) {
      case TxStep.Creating:
        createTx()
        break;
      case TxStep.Created:
        afterTxCreated(
          state.txHash,
          toCrypto === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH
        )
        navigation.goBack();
        break;
      default:
    }
  }, [state.step])

  useEffect(() => {
    if (![TxStatus.Success, TxStatus.Fail].includes(txResult.status)) return;

    switch (state.step) {
      case TxStep.Creating:
        setState({
          ...state,
          step:
            txResult.status === TxStatus.Success
              ? TxStep.Created
              : TxStep.Failed,
        })
        break;
      default:
    }
  }, [txResult.status]);


  if (state.stage === 0) {
    return (
      <View style={{}}>
        <SheetHeader title={t('assets.yield_reward')} />
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#fff',
            height: '100%',
          }}>
          <CryptoInput
            title={t('assets.yield')}
            cryptoTitle={toTitle}
            cryptoType={toCrypto}
            style={{ marginTop: 20 }}
            value={(interest / (getCryptoPrice(toCrypto))).toFixed(4)}
            subValue={currencyFormatter(
              interest,
              4
            )}
            active={true}
            onPress={() => { }}
          />
          {!!state.estimateGas && <>
            <P3Text
              label={`Transaction Fee: ${state.estimateGas} ETH (${currencyFormatter(parseFloat(state.estimateGas) * getCryptoPrice(toCrypto))})`}
              style={{ textAlign: 'center', marginTop: 10 }}
            />
            <View>
              {insufficientGas && (
                <Text style={{ fontSize: 10, right: 0, color: AppColors.RED, textAlign: 'center', marginBottom: 5 }}>
                  {t('assets.insufficient_eth', { crypto: gasCrypto })}
                </Text>
              )}
            </View>
          </>
          }
          <View style={{ position: 'absolute', width: '100%', bottom: 150, marginLeft: '6%' }}>
            <NextButton
              disabled={!(interest > 0) || insufficientGas}
              title={t('assets.yield_reward')}
              handler={() => {
                if (isWalletUser) {
                  setState({
                    ...state,
                    step: TxStep.Creating
                  })
                } else {
                  Server.requestTransaction(8, 1, 'interest')
                    .then((res) => {
                      setState({
                        ...state,
                        stage: 1,
                        espressoTxId: res.data.id,
                      })
                    })
                    .catch((e) => {
                      if (e.response.status === 400) {
                        alert(t('product.transaction_error'));
                      } else if (e.response.status === 500) {
                        alert(t('account_errors.server'));
                      }
                    });
                }
              }}
            />
          </View>
          <OverlayLoading visible={state.step === TxStep.Creating} />
        </View>
      </View>
    );
  }

  return (
    <PaymentSelection espressTxId={state.espressoTxId} />
  )
};

export default Reward;
