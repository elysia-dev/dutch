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
import { getAssetTokenFromCryptoType } from '../../utiles/getContract';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import PurposeType from '../../enums/PurposeType';

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
  const { isWalletUser, Server, user } = useContext(UserContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const contract = getAssetTokenFromCryptoType(
    assetInCrypto.type,
    contractAddress,
  );
  const txResult = useWatingTx(
    state.txHash,
    assetInCrypto.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );

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
    const address = isWalletUser
      ? wallet?.getFirstAddress()
      : user.ethAddresses[0];

    if (address) {
      estimateGas(address);
    }
  }, []);

  const createTx = async () => {
    let txRes: ethers.providers.TransactionResponse | undefined;

    try {
      const populatedTransaction = await contract?.populateTransaction.refund(
        utils.parseEther(values.inToken),
      );

      if (!populatedTransaction) return;

      txRes = await wallet?.getFirstSigner(assetInCrypto.type).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
      });

      if (assetInCrypto.type === CryptoType.BNB) {
        setState({
          ...state,
          txHash: txRes?.hash || '',
        });
      }
    } catch (e) {
      afterTxFailed(e);
      navigation.goBack();
    } finally {
      if (assetInCrypto.type !== CryptoType.BNB && txRes) {
        afterTxHashCreated(
          wallet?.getFirstAddress() || '',
          contractAddress,
          txRes.hash || '',
          NetworkType.ETH,
        );
        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    switch (state.step) {
      case TxStep.Creating:
        createTx();
        break;
      case TxStep.Created:
        afterTxCreated(
          state.txHash,
          assetInCrypto.type === CryptoType.BNB
            ? NetworkType.BSC
            : NetworkType.ETH,
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
      <TxInput
        purpose={PurposeType.Refund}
        title={t('assets.refund')}
        fiatInputTitle={t('assets.refund_value')}
        tokenInputTitle={t('assets.refund_stake')}
        assetInCrypto={assetInCrypto}
        assetInToken={assetInToken}
        values={values}
        cryptoPrice={cryptoPrice}
        tokenPrice={tokenPrice}
        balanceInCrypto={balanceInCrypto}
        balanceInToken={balanceInToken}
        current={current}
        step={state.step}
        disabled={parseInt(values.inToken || '0', 10) < 0.01}
        setCurrent={setCurrent}
        setValues={setValues}
        estimateGas={state.estimateGas}
        isApproved={true}
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
      valueTo={parseFloat(values.inToken)}
      productId={productId}
      type={'refund'}
      contractAddress={contractAddress}
      espressoTxId={state.espressoTxId}
    />
  );
};

export default Refund;
