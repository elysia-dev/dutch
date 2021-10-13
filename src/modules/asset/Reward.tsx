import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../enums/CryptoType';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import useTxHandler from '../../hooks/useTxHandler';
import CryptoInput from './components/CryptoInput';
import NextButton from '../../shared/components/NextButton';
import OverlayLoading from '../../shared/components/OverlayLoading';
import PaymentSelection from '../../shared/components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import PreferenceContext from '../../contexts/PreferenceContext';
import SheetHeader from '../../shared/components/SheetHeader';
import PriceContext from '../../contexts/PriceContext';
import NetworkType from '../../enums/NetworkType';
import AssetContext from '../../contexts/AssetContext';
import TxStatus from '../../enums/TxStatus';
import { useWatingTx } from '../../hooks/useWatingTx';
import GasPrice from '../../shared/components/GasPrice';
import AppColors from '../../enums/AppColors';
import TransferType from '../../enums/TransferType';
import useProductByType from '../../hooks/useProductByType';
import TransactionContext from '../../contexts/TransactionContext';
import ToastStatus from '../../enums/ToastStatus';

type ParamList = {
  Reward: {
    toCrypto: CryptoType;
    toTitle: string;
    productId: number;
    contractAddress: string;
  };
};

const Reward: FunctionComponent = () => {
  const [interest, setInterest] = useState(0);
  const route = useRoute<RouteProp<ParamList, 'Reward'>>();
  const { toCrypto, toTitle, contractAddress, productId } = route.params;
  const navigation = useNavigation();
  const { wallet } = useContext(WalletContext);
  const { addPendingTx, setToastList } = useContext(TransactionContext);
  const { currencyFormatter } = useContext(PreferenceContext);
  const { isWalletUser, user, Server } = useContext(UserContext);
  const { getBalance } = useContext(AssetContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const [state, setState] = useState({
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
    txHash: '',
    step: TxStep.None,
  });
  const { t } = useTranslation();
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const gasCrypto =
    toCrypto === CryptoType.BNB ? CryptoType.BNB : CryptoType.ETH;
  const insufficientGas = getBalance(gasCrypto) < parseFloat(state.estimateGas);
  const { contract, createTransaction } = useProductByType(
    toCrypto,
    contractAddress,
    TransferType.ProductReward,
  );
  const txResult = useWatingTx(
    state.txHash,
    toCrypto === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );
  const insets = useSafeAreaInsets();

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await contract?.estimateGas.claimReward({
        from: address,
      });
      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(
            estimateGas.mul(
              toCrypto === CryptoType.ETH ? gasPrice : bscGasPrice,
            ),
          ),
        });
      }
    } catch {
      setState({
        ...state,
        estimateGas: '',
      });
    }
  };

  useEffect(() => {
    const address = isWalletUser
      ? wallet?.getFirstAddress()
      : user.ethAddresses[0];

    if (address) {
      estimateGas(address);
    }
  }, []);

  useEffect(() => {
    const address = isWalletUser
      ? wallet?.getFirstNode()?.address
      : user.ethAddresses[0];

    contract?.getReward(address).then((res: BigNumber) => {
      setInterest(parseFloat(utils.formatEther(res)));
    });
  }, []);

  const createTx = async () => {
    createTransaction('', (interest / getCryptoPrice(toCrypto)).toFixed(4))
      .then((res) => {
        addPendingTx(
          TransferType.ProductReward,
          (interest / getCryptoPrice(toCrypto)).toFixed(4),
          res,
          toCrypto,
          toCrypto,
        );
      })
      .catch((error) => {
        setToastList(TransferType.ProductReward, ToastStatus.Fail);
      })
      .finally(() => {
        navigation.goBack();
      });
  };

  useEffect(() => {
    switch (state.step) {
      case TxStep.Creating:
        createTx();
        break;
      case TxStep.Created:
        afterTxCreated(
          state.txHash,
          toCrypto === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
        );
        navigation.goBack();
        break;
      default:
    }
  }, [state.step]);

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
        });
        break;
      default:
    }
  }, [txResult.status]);

  if (state.stage === 0) {
    return (
      <View style={{ height: '100%' }}>
        <SheetHeader title={t('assets.yield_reward')} />
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: AppColors.WHITE,
            height: '100%',
          }}>
          <CryptoInput
            title={t('assets.yield')}
            cryptoTitle={toTitle}
            cryptoType={toCrypto}
            style={{ marginTop: 20 }}
            value={(interest / getCryptoPrice(toCrypto)).toFixed(4)}
            subValue={currencyFormatter(interest, 4)}
            active={true}
            onPress={() => {}}
          />
          <View style={{ height: 10 }} />
          <GasPrice
            estimatedGas={state.estimateGas}
            gasCrypto={gasCrypto}
            insufficientGas={insufficientGas}
          />
          <OverlayLoading visible={state.step === TxStep.Creating} />
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: insets.bottom || 10,
            paddingLeft: '5%',
            paddingRight: '5%',
          }}>
          <NextButton
            disabled={!(interest > 0) || insufficientGas}
            title={t('assets.yield_reward')}
            handler={() => {
              if (isWalletUser) {
                setState({
                  ...state,
                  step: TxStep.Creating,
                });
              } else {
                Server.requestTransaction(productId, 1, 'interest')
                  .then((res) => {
                    setState({
                      ...state,
                      stage: 1,
                      espressoTxId: res.data.id,
                    });
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
      </View>
    );
  }

  return (
    <PaymentSelection
      value={parseFloat((interest / getCryptoPrice(toCrypto)).toFixed(4))}
      page="asset"
      assetTxData={{
        productId,
        type: 'interest',
      }}
      contractAddress={contractAddress}
      espressoTxId={state.espressoTxId}
    />
  );
};

export default Reward;
