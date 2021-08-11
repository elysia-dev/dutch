/* eslint-disable radix */
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber, ethers, utils } from 'ethers';
import { isAddress } from '@ethersproject/address';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import SheetHeader from '../../shared/components/SheetHeader';
import { P1Text, P2Text, P3Text, P4Text } from '../../shared/components/Texts';
import Asset from '../../types/Asset';
import AssetContext from '../../contexts/AssetContext';
import commaFormatter from '../../utiles/commaFormatter';
import NumberPad from '../../shared/components/NumberPad';
import CryptoType from '../../enums/CryptoType';
import { getElysiaContract, provider } from '../../utiles/getContract';
import WalletContext from '../../contexts/WalletContext';
import OverlayLoading from '../../shared/components/OverlayLoading';
import PriceContext from '../../contexts/PriceContext';
import GasPrice from '../../shared/components/GasPrice';
import TransactionContext from '../../contexts/TransactionContext';
import createTransferTx from '../../utiles/createTransferTx';
import TransferType from '../../enums/TransferType';

type ParamList = {
  Withdrawal: {
    asset: Asset;
  };
};

// * Info
// Tricky Height Calculations!
// TxInput component 참고
const Withdrawal: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Withdrawal'>>();
  const { asset } = route.params;
  const { addPendingTransaction } = useContext(TransactionContext);
  const { getBalance } = useContext(AssetContext);
  const { wallet } = useContext(WalletContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const [state, setState] = useState({ address: '', scanned: true });
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState('');
  const gasCrypto =
    asset.type === CryptoType.BNB ? CryptoType.BNB : CryptoType.ETH;
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(asset.type)
    ? getBalance(gasCrypto) < parseFloat(estimatedGas) + parseFloat(value)
    : getBalance(gasCrypto) < parseFloat(estimatedGas);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const estimateGas = async () => {
    let estimatedGas: BigNumber | undefined;

    try {
      if (asset.type === CryptoType.EL) {
        const elContract = getElysiaContract();

        estimatedGas = await elContract?.estimateGas.transfer(
          state.address,
          utils.parseEther(value || '0.1'),
          {
            from: wallet?.getFirstAddress(),
          },
        );
      } else {
        estimatedGas = await wallet?.getFirstSigner(asset.type)?.estimateGas({
          to: state.address,
          value: utils.parseEther(value || '0').toHexString(),
        });
      }
    } catch (e) {
    } finally {
      if (estimatedGas) {
        setEstimatedGas(
          utils.formatEther(
            estimatedGas.mul(
              asset.type !== CryptoType.BNB ? gasPrice : bscGasPrice,
            ),
          ),
        );
      }
    }
  };

  const sendTx = async () => {
    navigation.goBack();
    createTransferTx(
      gasPrice,
      bscGasPrice,
      getCryptoPrice,
      wallet,
      addPendingTransaction,
      asset.type,
      TransferType.Send,
      0,
      null,
      '',
      value,
      undefined,
      state.address,
    );
  };

  const openBarcodeScanner = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();

    if (status === 'granted') {
      setState({
        ...state,
        scanned: false,
      });
    } else {
      alert('Permission of camera is not granted');
    }
  };

  const handleBarCodeScanned = (barcodeScannerResult: BarCodeScannerResult) => {
    setState({
      scanned: true,
      address: barcodeScannerResult.data.replace('ethereum:', ''),
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      estimateGas();
    }, 500);

    return () => clearTimeout(handler);
  }, [value, state.address]);

  return (
    <View style={{ height: '100%', backgroundColor: '#fff' }}>
      <SheetHeader title={t('wallet.withdrawal')} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            height: Dimensions.get('window').height - 200,
          }}>
          <P2Text
            label={t('wallet.withdrawal_address')}
            style={{ color: AppColors.BLACK, marginTop: 30 }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={{
                height: 40,
                borderWidth: 1,
                borderRadius: 5,
                borderColor:
                  state.address && !isAddress(state.address)
                    ? AppColors.RED
                    : AppColors.SUB_GREY,
                padding: 10,
                fontSize: 10,
                flex: 1,
              }}
              value={state.address}
              onChangeText={(text) => {
                setState({ ...state, address: text });
              }}
              placeholder={t('wallet.withdrawal_content')}
            />
            <TouchableOpacity
              style={{
                width: 45,
                marginLeft: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                openBarcodeScanner();
              }}>
              <Image
                source={require('./images/qr.png')}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ height: 20 }}>
            {!!state.address && !isAddress(state.address) && (
              <Text
                style={{
                  fontSize: 10,
                  right: 0,
                  color: AppColors.RED,
                  textAlign: 'left',
                  marginBottom: 5,
                }}>
                {t('wallet.invalid_address', { crypto: gasCrypto })}
              </Text>
            )}
          </View>
          <P2Text
            label={t('wallet.send_value')}
            style={{ color: AppColors.BLACK }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: 40,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: AppColors.SUB_GREY,
                padding: 10,
                flex: 1,
              }}>
              <P1Text
                label={`${commaFormatter(value) || '0'} ${asset.unit}`}
                style={{ textAlign: 'right' }}
              />
            </View>
            <TouchableOpacity
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: AppColors.MAIN,
                height: 40,
                width: 45,
                marginLeft: 10,
                paddingTop: 12,
              }}
              onPress={() => {
                if (asset.type === CryptoType.EL) {
                  setValue(getBalance(asset.type).toString());
                } else {
                  setValue(
                    (
                      getBalance(asset.type) -
                      parseFloat(estimatedGas) * 1.01
                    ).toString(),
                  );
                }
              }}>
              <P3Text
                label={t('wallet.full')}
                style={{ color: AppColors.MAIN, textAlign: 'center' }}
              />
            </TouchableOpacity>
          </View>
          <P4Text
            label={`${t('wallet.remaining_value')} : ${commaFormatter(
              getBalance(asset.type),
            )}`}
            style={{ marginTop: 5 }}
          />
          <View style={{ height: 30, marginTop: 10 }}>
            <GasPrice
              estimatedGas={estimatedGas}
              gasCrypto={gasCrypto}
              insufficientGas={insufficientGas}
            />
          </View>
          <NumberPad
            addValue={(text) => {
              if (
                (text === '.' && value.includes('.')) ||
                value.length > 18 ||
                (value
                  .split('')
                  .reduce((res, cur) => res && cur === '0', true) &&
                  text === '0')
              ) {
                return;
              }

              const next =
                text === '.' && !value
                  ? '0.'
                  : text !== '0' && value === '0'
                  ? text
                  : value + text;

              if (parseFloat(next) >= getBalance(asset.type)) {
                // Maximum!
              } else {
                setValue(next);
              }
            }}
            removeValue={() => {
              setValue(value.slice(0, -1));
            }}
            height={Dimensions.get('window').height - 440}
          />
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%',
        }}>
        <NextButton
          disabled={
            !state.address ||
            !value ||
            insufficientGas ||
            !isAddress(state.address) ||
            !estimatedGas
          }
          title={t('wallet.withdrawal')}
          style={{
            width: '100%',
            marginTop: 20,
          }}
          handler={() => {
            sendTx();
          }}
        />
      </View>
      {!state.scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <OverlayLoading visible={loading} />
    </View>
  );
};

export default Withdrawal;
