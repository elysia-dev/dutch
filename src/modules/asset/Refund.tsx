import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber, ethers, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../enums/CryptoType';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import PaymentSelection from '../../shared/components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import PurposeType from '../../enums/PurposeType';
import TransferType from '../../enums/TransferType';
import useProductByType from '../../hooks/useProductByType';
import TransactionContext from '../../contexts/TransactionContext';
import ToastStatus from '../../enums/ToastStatus';
import useUserAddress from '../../hooks/useUserAddress';

type ParamList = {
  Refund: {
    assetInCrypto: Asset;
    assetInToken: Asset;
    productId: number;
    contractAddress: string;
  };
};

const Refund: FunctionComponent = () => {
  const [values, setValues] = useState({
    inFiat: '',
    inToken: '',
  });
  const [isMax, setIsMax] = useState(false);
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.None,
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
  });
  const [current, setCurrent] = useState<'token' | 'fiat'>('token');
  const route = useRoute<RouteProp<ParamList, 'Refund'>>();
  const { assetInCrypto, assetInToken, contractAddress, productId } =
    route.params;
  const navigation = useNavigation();
  const { wallet } = useContext(WalletContext);
  const { addPendingTx, setToastList } = useContext(TransactionContext);
  const { isWalletUser, Server, user } = useContext(UserContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const txResult = useWatingTx(
    state.txHash,
    assetInCrypto.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );
  const address = useUserAddress();
  const { contract, createTransaction } = useProductByType(
    assetInCrypto.type,
    contractAddress,
    TransferType.Refund,
  );
  const [isLoading, setIsLoading] = useState(false);
  const cryptoPrice = getCryptoPrice(assetInCrypto.type);
  const tokenPrice = getCryptoPrice(CryptoType.ELA);
  const balanceInToken = assetInToken.value;
  const balanceInCrypto = (balanceInToken * tokenPrice) / cryptoPrice;

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await contract?.estimateGas.refund(
        utils.parseEther('0.01'),
        {
          from: address,
        },
      );

      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(
            estimateGas.mul(
              assetInCrypto.type === CryptoType.ETH ? gasPrice : bscGasPrice,
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
    if (address) {
      estimateGas(address);
    }
  }, []);

  const createTx = async () => {
    setIsLoading(true);
    createTransaction(values.inFiat, values.inToken)
      .then((res) => {
        addPendingTx(
          TransferType.Refund,
          values.inToken,
          res,
          assetInCrypto.type,
          assetInToken.unit,
        );
      })
      .catch((error) => {
        setToastList(TransferType.Refund, ToastStatus.Fail);
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
      <TxInput
        purpose={PurposeType.Refund}
        title={t('assets.refund')}
        fiatInputTitle={t('assets.refund_value')}
        tokenInputTitle={t('assets.refund_stake')}
        assetInCrypto={assetInCrypto}
        assetInToken={assetInToken}
        values={values}
        isMax={isMax}
        setIsMax={setIsMax}
        cryptoPrice={cryptoPrice}
        tokenPrice={tokenPrice}
        balanceInCrypto={balanceInCrypto}
        balanceInToken={balanceInToken}
        current={current}
        step={state.step}
        disabled={!isMax && parseInt(values.inToken || '0', 10) < 0.01}
        setCurrent={setCurrent}
        setValues={setValues}
        estimatedGas={state.estimateGas}
        isApproved={true}
        isAllowanced={true}
        isLoading={isLoading}
        isRefund={PurposeType.Refund}
        approve={() => ''}
        createTx={() => {
          if (isWalletUser) {
            setState({ ...state, step: TxStep.Creating });
          } else {
            Server.requestTransaction(
              productId,
              parseInt(values.inToken, 10),
              'refund',
            )
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
    );
  }

  return (
    <PaymentSelection
      value={isMax ? balanceInToken.toFixed(18) : values.inToken}
      page="asset"
      assetTxData={{
        productId,
        type: 'refund',
      }}
      contractAddress={contractAddress}
      espressoTxId={state.espressoTxId}
    />
  );
};

export default Refund;
