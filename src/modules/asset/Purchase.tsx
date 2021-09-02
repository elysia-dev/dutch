import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../enums/CryptoType';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import UserContext from '../../contexts/UserContext';
import PaymentSelection from '../../shared/components/PaymentSelection';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import {
  getAssetTokenFromCryptoType,
  getElysiaContract,
} from '../../utiles/getContract';
import PurposeType from '../../enums/PurposeType';
import AssetContext from '../../contexts/AssetContext';
import createTransferTx from '../../utiles/createTransferTx';
import TransferType from '../../enums/TransferType';
import useErcContract from '../../hooks/useErcContract';

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
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.CheckAllowance,
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
    isApproved: !![CryptoType.ETH, CryptoType.BNB].includes(assetInCrypto.type),
  });
  const [current, setCurrent] = useState<'token' | 'fiat'>('token');
  const navigation = useNavigation();
  const { isWalletUser, Server, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(
    state.txHash,
    assetInCrypto.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );

  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const contract = getAssetTokenFromCryptoType(
    assetInCrypto.type,
    contractAddress,
  );
  const { getBalance, assets } = useContext(AssetContext);
  const { transferValue } = createTransferTx(
    assetInCrypto.type,
    TransferType.Purchase,
    contract,
  );
  const remainingSupplyInCrypto =
    ((remainingSupplyInToken || 0) * 5) / getCryptoPrice(assetInCrypto.type);
  const cryptoPrice = getCryptoPrice(assetInCrypto.type);
  const tokenPrice = getCryptoPrice(CryptoType.ELA);
  const balanceInCrypto = getBalance(assetInCrypto.type);
  const balanceInToken = (balanceInCrypto * cryptoPrice) / tokenPrice;
  const { elContract } = useErcContract();
  const [isLoading, setIsLoading] = useState(false);
  const [approveGasPrice, setApproveGasPrice] = useState('');
  const [estimateGasCount, setEstimateGasCount] = useState(0);
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];

  const getApproveGasPrice = async () => {
    try {
      const estimateGas = await elContract.estimateGas.approve(
        contractAddress,
        '1' + '0'.repeat(30),
      );
      setApproveGasPrice(utils.formatEther(estimateGas.mul(gasPrice)));
    } catch (error) {
      console.log(error);
    }
  };

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;
    try {
      switch (assetInCrypto.type) {
        case CryptoType.ETH:
        case CryptoType.BNB:
          estimateGas = await contract?.estimateGas.purchase({
            from: address,
            value: utils.parseEther('0.1'),
          });
          break;
        default:
          estimateGas = await contract?.estimateGas.purchase(
            utils.parseEther('100'),
            {
              from: address,
            },
          );
      }
      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(
            estimateGas.mul(
              assetInCrypto.type === CryptoType.ETH ? gasPrice : bscGasPrice,
            ),
          ),
        });
        setIsLoading(false);
      }
    } catch (e) {
      throw Error;
    }
  };

  useEffect(() => {
    if (address) {
      estimateGas(address);
    }
  }, []);

  const createTx = async () => {
    try {
      setIsLoading(true);
      await transferValue(values.inFiat, values.inToken);
    } catch (error) {
      afterTxFailed('Transaction failed');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const approve = async () => {
    try {
      setIsLoading(true);
      await elContract.approve(contractAddress, '1' + '0'.repeat(30));
      await estimateGas(address || '');
      setState({
        ...state,
        isApproved: true,
        step: TxStep.None,
      });
    } catch (error) {
      setEstimateGasCount((prev) => prev + 1);
      setState({
        ...state,
        isApproved: false,
        step: TxStep.None,
      });
    }
  };

  useEffect(() => {
    if (estimateGasCount === 0 || estimateGasCount >= 4) return;
    setTimeout(async () => {
      try {
        await estimateGas(address || '');
        setState({
          ...state,
          isApproved: true,
        });
        setIsLoading(false);
      } catch (error) {
        setEstimateGasCount((prev) => prev + 1);
      } finally {
        if (estimateGasCount >= 3) {
          setState({
            ...state,
            isApproved: true,
          });
          setIsLoading(false);
        }
      }
    }, 2000);
  }, [estimateGasCount]);

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        if ([CryptoType.ETH, CryptoType.BNB].includes(assetInCrypto.type)) {
          setState({ ...state, step: TxStep.None });
          return;
        } else if (!isWalletUser) {
          setState({ ...state, step: TxStep.None });
          return;
        }

        if (isWalletUser) {
          elContract
            .allowance(wallet?.getFirstNode()?.address || '', contractAddress)
            .then((res: BigNumber) => {
              setState({
                ...state,
                isApproved: Number(utils.formatEther(res)) > balanceInCrypto,
                step: TxStep.None,
              });
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
    if (state.isApproved) return;
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
        cryptoPrice={cryptoPrice}
        tokenPrice={tokenPrice}
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        disabled={parseInt(values.inToken || '0', 10) < 1}
        estimatedGas={state.estimateGas}
        isApproved={state.isApproved}
        approve={approve}
        isLoading={isLoading}
        approveGasPrice={approveGasPrice}
        createTx={() => {
          if (isWalletUser) {
            if (state.isApproved) {
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
      value={parseFloat(values.inToken)}
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
