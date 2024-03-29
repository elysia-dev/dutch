import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber } from '@ethersproject/bignumber';
import { constants, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../enums/CryptoType';
import useProductByType from '../../hooks/useProductByType';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import UserContext from '../../contexts/UserContext';
import PaymentSelection from '../../shared/components/PaymentSelection';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import PurposeType from '../../enums/PurposeType';
import AssetContext from '../../contexts/AssetContext';
import TransferType from '../../enums/TransferType';
import useErcContract from '../../hooks/useErcContract';
import useCountingEstimatedGas from '../../hooks/useCountingEstimatedGas';
import usePurchaseGas from '../../hooks/usePurchaseGas';
import ToastStatus from '../../enums/ToastStatus';
import TransactionContext from '../../contexts/TransactionContext';

type ParamList = {
  Purchase: {
    assetInCrypto: Asset;
    assetInToken: Asset;
    remainingSupplyInToken: number;
    contractAddress: string;
    productId: number; // legacy
  };
};

const Purchase: FunctionComponent = () => {
  const route = useRoute<RouteProp<ParamList, 'Purchase'>>();
  const {
    assetInCrypto,
    assetInToken,
    remainingSupplyInToken,
    contractAddress,
    productId,
  } = route.params;

  const [values, setValues] = useState({
    inFiat: '',
    inToken: '',
  });
  const [isMax, setIsMax] = useState(false);
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.CheckAllowance,
    espressoTxId: '',
    stage: 0,
  });

  const [current, setCurrent] = useState<'token' | 'fiat'>('token');
  const navigation = useNavigation();
  const { addPendingTx, setToastList } = useContext(TransactionContext);
  const { isWalletUser, Server, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(
    state.txHash,
    assetInCrypto.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );

  const { gasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const { contract, createTransaction } = useProductByType(
    assetInCrypto.type,
    contractAddress,
    TransferType.Purchase,
  );
  const { getBalance } = useContext(AssetContext);
  const { estimagedGasPrice, setEstimatedGas } = usePurchaseGas(
    contract,
    assetInCrypto.type,
  );
  const remainingSupplyInCrypto =
    ((remainingSupplyInToken || 0) * 5) / getCryptoPrice(assetInCrypto.type);
  const cryptoPrice = getCryptoPrice(assetInCrypto.type);
  const tokenPrice = getCryptoPrice(CryptoType.ELA);
  const balanceInCrypto = getBalance(assetInCrypto.type);
  const balanceInToken = (balanceInCrypto * cryptoPrice) / tokenPrice;
  const { elContract } = useErcContract();
  const [approvalGasPrice, setApprovalGasPrice] = useState('');
  const [isAllowanced, setIsAllowanced] = useState(false);
  const { addCount, isApproved, setIsApproved, isLoading, setIsLoading } =
    useCountingEstimatedGas(setEstimatedGas);
  const maxValueInToken = remainingSupplyInToken
    ? Math.min(remainingSupplyInToken, balanceInToken)
    : balanceInToken;
  const maxValueInFiat = remainingSupplyInCrypto
    ? Math.min(remainingSupplyInCrypto, balanceInCrypto) *
      getCryptoPrice(assetInCrypto.type)
    : balanceInCrypto * getCryptoPrice(assetInCrypto.type);

  const getApproveGasPrice = async () => {
    try {
      const estimateGas = await elContract.estimateGas.approve(
        contractAddress,
        constants.MaxUint256,
      );
      setApprovalGasPrice(utils.formatEther(estimateGas.mul(gasPrice)));
    } catch (error) {
      console.log(error);
    }
  };

  const createTx = () => {
    setIsLoading(true);
    const inFiat = isMax ? maxValueInFiat.toFixed(18) : values.inFiat;
    const inToken = isMax ? maxValueInToken.toFixed(18) : values.inToken;
    createTransaction(inFiat, inToken)
      .then((res) => {
        addPendingTx(
          TransferType.Purchase,
          inToken,
          res,
          assetInCrypto.type,
          assetInToken.unit,
        );
      })
      .catch((error) => {
        setToastList(TransferType.Purchase, ToastStatus.Fail);
      })
      .finally(() => {
        navigation.goBack();
      });
  };

  const approve = async () => {
    try {
      setIsLoading(true);
      await elContract.approve(contractAddress, constants.MaxUint256);
      await setEstimatedGas();
      setState({
        ...state,
        step: TxStep.None,
      });
      setIsApproved(true);
    } catch (error) {
      addCount();
      setState({
        ...state,
        step: TxStep.None,
      });
      setIsApproved(false);
    }
  };

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        if ([CryptoType.ETH, CryptoType.BNB].includes(assetInCrypto.type)) {
          setState({ ...state, step: TxStep.None });
          setIsApproved(true);
          return;
        } else if (!isWalletUser) {
          setState({ ...state, step: TxStep.None });
          setIsApproved(true);
          return;
        }

        if (isWalletUser) {
          elContract
            .allowance(wallet?.getFirstNode()?.address || '', contractAddress)
            .then((res: BigNumber) => {
              setState({
                ...state,
                step: TxStep.None,
              });
              setIsApproved(Number(utils.formatEther(res)) > balanceInCrypto);
              setIsAllowanced(Number(utils.formatEther(res)) > balanceInCrypto);
            })
            .catch((e: any) => {
              afterTxFailed(e.message);
              navigation.goBack();
            });
        }
        break;
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
        break;
    }
  }, [state.step]);

  useEffect(() => {
    if (isApproved) return;
    getApproveGasPrice();
  }, []);

  if (state.stage === 0) {
    return (
      <TxInput
        purpose={PurposeType.Purchase}
        title={t('assets.purchase')}
        fiatInputTitle={t('assets.purchase_value')}
        tokenInputTitle={t('assets.purchase_stake')}
        assetInCrypto={assetInCrypto}
        assetInToken={assetInToken}
        remainingSupplyInToken={remainingSupplyInToken}
        remainingSupplyInCrypto={remainingSupplyInCrypto}
        balanceInToken={balanceInToken}
        balanceInCrypto={balanceInCrypto}
        values={values}
        isMax={isMax}
        setIsMax={setIsMax}
        cryptoPrice={cryptoPrice}
        tokenPrice={tokenPrice}
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        disabled={parseInt(values.inToken || '0', 10) < 1}
        estimatedGas={estimagedGasPrice}
        isApproved={isApproved}
        approve={approve}
        isAllowanced={isAllowanced}
        isLoading={isLoading}
        approvalGasPrice={approvalGasPrice}
        createTx={() => {
          if (isWalletUser) {
            if (isApproved) {
              createTx();
            } else {
              setState({ ...state, step: TxStep.Approving });
            }
          } else {
            Server.requestTransaction(
              productId,
              parseFloat(values.inToken),
              'buying',
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
      value={isMax ? maxValueInToken.toFixed(18) : values.inToken}
      page="asset"
      assetTxData={{
        productId,
        type: 'buying',
      }}
      contractAddress={contractAddress}
      espressoTxId={state.espressoTxId}
    />
  );
};

export default Purchase;
