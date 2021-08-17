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
  const [isDisabled, setIsDisabled] = useState(false);
  const elContract = getElysiaContract();
  const { t } = useTranslation();

  const getEstimateGas = async (inputGasPrice: string) => {
    let estimateGas: BigNumber | undefined;
    const isCryptoBnb =
      paymentMethod === CryptoType.None
        ? transaction.cryptoType === CryptoType.BNB
        : paymentMethod === CryptoType.BNB;
    if (inputGasPrice.includes('-') || inputGasPrice[0] === '.') return;
    if (changedGasPrice.includes('.')) {
      if (inputGasPrice.match(/[.]/g)?.length === 2) return;
    }
    if (
      Number(inputGasPrice) <
      Number(utils.formatUnits(isCryptoBnb ? bscGasPrice : gasPrice, 9))
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    setChangedGasPrice(inputGasPrice);
    try {
      if (
        transaction.cryptoType === CryptoType.EL ||
        paymentMethod === CryptoType.EL
      ) {
        if (paymentMethod === CryptoType.None) {
          estimateGas = await elContract?.estimateGas.transfer(
            transaction.toAddress,
            utils.parseEther(transaction.value || '0.1'),
            {
              from: wallet?.getFirstAddress(),
            },
          );
        } else {
          estimateGas = await contract?.estimateGas.purchase(
            utils.parseEther('100'),
            {
              from: wallet?.getFirstAddress() || '',
            },
          );
        }
      } else {
        if (paymentMethod === CryptoType.None) {
          estimateGas = await wallet
            ?.getFirstSigner(transaction.cryptoType)
            ?.estimateGas({
              to: transaction.toAddress,
              value: utils.parseEther(transaction.value || '0').toHexString(),
            });
        } else {
          estimateGas = await contract?.estimateGas.purchase({
            from: wallet?.getFirstAddress() || '',
            value: utils.parseEther('0.1'),
          });
        }
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

  useEffect(() => {
    if (!isModalVisible) return;
    setChangedGasPrice(
      parseInt(
        utils.formatUnits(
          paymentMethod === CryptoType.BNB ? bscGasPrice : gasPrice,
          9,
        ),
      ).toFixed(0),
    );
    getEstimateGas(
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
          color="#1c1c1c"
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
          getEstimateGas={getEstimateGas}
          changedGasPrice={changedGasPrice}
          paymentMethod={paymentMethod}
          valueInCryto={valueInCryto}
          gasFee={gasFee}
          crytoValue={crytoValue?.value}
          contract={contract}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
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
