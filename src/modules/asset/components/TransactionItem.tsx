import React, { useContext, useState } from 'react';
import {
  View,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { P1Text, P3Text } from '../../../shared/components/Texts';
import CryptoTransaction from '../../../types/CryptoTransaction';
import PreferenceContext from '../../../contexts/PreferenceContext';
import NetworkType from '../../../enums/NetworkType';
import getTxScanLink from '../../../utiles/getTxScanLink';
import TxStatus from '../../../enums/TxStatus';
import AssetContext from '../../../contexts/AssetContext';
import {
  getAssetTokenFromCryptoType,
  getElysiaContract,
} from '../../../utiles/getContract';
import CryptoType from '../../../enums/CryptoType';
import { BigNumber, Contract, ethers, utils } from 'ethers';
import WalletContext from '../../../contexts/WalletContext';
import PriceContext from '../../../contexts/PriceContext';
import useTxHandler from '../../../hooks/useTxHandler';
import TransactionContext from '../../../contexts/TransactionContext';
import { useEffect } from 'react';
import Asset from '../../../types/Asset';
import AccelerateModal from './AccelerateModal';

interface ITransactionItem {
  transaction: CryptoTransaction;
  unit: string;
  networkType: NetworkType;
  contractAddress?: string;
  paymentMethod: CryptoType;
}

const TransactionItem: React.FC<ITransactionItem> = ({
  transaction,
  unit,
  networkType,
  contractAddress,
  paymentMethod,
}) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { assets } = useContext(AssetContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { wallet } = useContext(WalletContext);
  const [crytoValue, setCrytoValue] = useState<Asset>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [changedGasPrice, setChangedGasPrice] = useState('1');
  const [contract, setContract] = useState<Contract | null>();
  const [gasFee, setGasFee] = useState('0');
  const [valueInCryto, setValueInCryto] = useState(0);
  const elContract = getElysiaContract();
  const { t } = useTranslation();

  const estimateElGas = async (): Promise<BigNumber | undefined> => {
    if (paymentMethod === CryptoType.None) {
      return await elContract?.estimateGas.transfer(
        transaction.toAddress,
        utils.parseEther(transaction.value || '0.1'),
        {
          from: wallet?.getFirstAddress(),
        },
      );
    } else {
      return await contract?.estimateGas.purchase(utils.parseEther('100'), {
        from: wallet?.getFirstAddress() || '',
      });
    }
  };

  const estimateEthOrBscGas = async (): Promise<BigNumber | undefined> => {
    if (paymentMethod === CryptoType.None) {
      return await wallet?.getFirstSigner(transaction.cryptoType)?.estimateGas({
        to: transaction.toAddress,
        value: utils.parseEther(transaction.value || '0').toHexString(),
      });
    } else {
      return await contract?.estimateGas.purchase({
        from: wallet?.getFirstAddress() || '',
        value: utils.parseEther('0.1'),
      });
    }
  };

  const setEstimateGas = async (inputGasPrice: string) => {
    let estimateGas: BigNumber | undefined;
    const currentCryptoType =
      (transaction.cryptoType === CryptoType.EL ||
        paymentMethod === CryptoType.EL) &&
      CryptoType.EL;

    try {
      switch (currentCryptoType) {
        case CryptoType.EL:
          estimateGas = await estimateElGas();
          break;
        default:
          estimateGas = await estimateEthOrBscGas();
          break;
      }
      if (estimateGas) {
        setGasFee(
          utils.formatEther(
            estimateGas.mul(utils.parseUnits(inputGasPrice, 'gwei')),
          ),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeGasPrice = (inputGasPrice: string) => {
    setChangedGasPrice(inputGasPrice);
    setEstimateGas(inputGasPrice);
  };

  useEffect(() => {
    if (!isModalVisible) return;
    setChangedGasPrice(
      parseInt(
        utils.formatUnits(
          paymentMethod === CryptoType.BNB
            ? bscGasPrice
            : transaction.cryptoType === CryptoType.BNB
            ? bscGasPrice
            : gasPrice,
          9,
        ),
      ).toFixed(0),
    );
    setEstimateGas(
      parseInt(
        utils.formatUnits(
          paymentMethod === CryptoType.BNB ? bscGasPrice : gasPrice,
          9,
        ),
      ).toFixed(0),
    );
    setValueInCryto(
      parseFloat(transaction.valueFrom || '') / getCryptoPrice(paymentMethod),
    );
    setCrytoValue(
      assets.find((asset) => {
        if (paymentMethod !== CryptoType.BNB) {
          return asset.type === CryptoType.ETH && asset.unit === CryptoType.ETH;
        }
        return asset.type === CryptoType.BNB && asset.unit === CryptoType.BNB;
      }),
    );
    if (paymentMethod === CryptoType.None) return;
    setContract(
      getAssetTokenFromCryptoType(paymentMethod, contractAddress || ''),
    );
  }, [isModalVisible, valueInCryto]);
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: AppColors.GREY,
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
      }}>
      {transaction.status === TxStatus.Pending ? (
        <ActivityIndicator
          size="small"
          color={AppColors.BLACK}
          style={{ marginLeft: 10 }}
        />
      ) : (
        <Image
          style={{
            marginLeft: 10,
            width: 20,
            height: 20,
            transform: transaction.type === 'out' ? [] : [{ rotate: '180deg' }],
          }}
          source={require('../images/blackCircleArrow.png')}
        />
      )}
      <View style={{ marginLeft: 10 }}>
        {transaction.legacyType && (
          <P1Text label={t(`dashboard_label.${transaction.legacyType}`)} />
        )}
        {transaction.txHash && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(getTxScanLink(transaction.txHash, networkType));
            }}>
            <P3Text
              label={`${transaction.txHash.slice(
                0,
                6,
              )}...${transaction.txHash.slice(-6)}`}
              style={{ color: AppColors.BLACK }}
            />
          </TouchableOpacity>
        )}
        <P3Text
          label={
            transaction.status !== TxStatus.Pending ? (
              moment(transaction.createdAt).format('YYYY-MM-DD | HH:mm:ss')
            ) : (
              <TouchableOpacity
                onPress={() => setIsModalVisible((prev) => !prev)}>
                <View
                  style={{
                    width: 50,
                    height: 17,
                    backgroundColor: '#3679B5',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: AppColors.WHITE,
                      fontWeight: '700',
                    }}>
                    가속화
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
        />
      </View>
      <View style={{ marginLeft: 'auto' }}>
        <P1Text
          label={
            ['profit', 'expectedProfit'].includes(
              transaction.legacyType || '',
            ) || transaction.legacyType
              ? currencyFormatter(parseFloat(transaction.value))
              : `${transaction.type === 'out' ? '-' : '+'} ${
                  parseFloat(transaction.value) > 0.01
                    ? (
                        Math.floor(parseFloat(transaction.value) * 100) / 100
                      ).toString()
                    : '0.00...'
                } ${unit}`
          }
        />
      </View>
      <View>
        <AccelerateModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          onChangeGasPrice={onChangeGasPrice}
          changedGasPrice={changedGasPrice}
          paymentMethod={paymentMethod}
          valueInCryto={valueInCryto}
          gasFee={gasFee}
          crytoValue={crytoValue?.value}
          contract={contract}
          txCryptoType={transaction.cryptoType}
          productId={transaction.productId}
          valueFrom={
            paymentMethod === CryptoType.None
              ? transaction.value
              : transaction.valueFrom
          }
          value={transaction.value}
          address={transaction.toAddress}
        />
      </View>
    </View>
  );
};

export default TransactionItem;
