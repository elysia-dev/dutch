import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import * as Linking from 'expo-linking';
import { DAPP_URL, EXTERNAL_WALLET_TX_URL } from 'react-native-dotenv';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { SubmitButton } from './SubmitButton';
import useAppState from '../../hooks/useAppState';
import WalletType from '../../enums/WalletType';
import storeDeeplink from '../../utiles/storeDeeplink';
import ProviderType from '../../enums/ProviderType';
import { TextField } from './TextField';
import UserContext from '../../contexts/UserContext';
import SheetHeader from './SheetHeader';
import AppColors from '../../enums/AppColors';
import WalletSelectionButton from './WalletSelectionButton';
import CryptoType from '../../enums/CryptoType';
import TransactionContext from '../../contexts/TransactionContext';
import ExternalWalletTxData from '../../api/ExternalWalletTxData';

type AssetTxData = {
  productId: number;
  type: 'buying' | 'refund' | 'interest';
};

type StakingTxData = {
  type: 'stake' | 'unstake' | 'unstakeAndMigrate' | 'reward';
  unit: CryptoType;
  round?: number; // 원래 1~6이지만 지금 테스트 중인 라운드가 7을 넘어서서... // stake는안필요함
  rewardValue?: number;
  migrationValue?: number;
};

const PaymentSelection: React.FC<{
  value: number | string;
  page: 'asset' | 'staking'; // 좋은 이름인지는 모르겠다,,,
  contractAddress: string;
  assetTxData?: AssetTxData;
  stakingTxData?: StakingTxData;
  espressoTxId?: string;
}> = ({
  value,
  page,
  contractAddress,
  assetTxData,
  stakingTxData,
  espressoTxId,
}) => {
  useEffect(() => {}, []);
  const navigation = useNavigation();
  const [state, setState] = useState({
    wallet: '',
    emailRestriction: false,
    email: '',
  });
  const { wallet, emailRestriction, email } = state;
  const { user, Server, refreshUser } = useContext(UserContext);
  const { uuid, setUuid } = useContext(TransactionContext);
  const { t } = useTranslation();

  const appState = useAppState();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (appState === 'active' && espressoTxId) {
      Server.getTransactionRequest(espressoTxId).catch(async () => {
        await refreshUser();
        navigation.goBack();
      });
    }
  }, [appState]);

  const linkURL = useCallback(
    (wallet: string) => {
      if (page === 'asset') {
        if (wallet === WalletType.IMTOKEN_MOBILE) {
          return `imtokenv2://navigate?screen=DappView&url=https://${DAPP_URL}/requests/${assetTxData?.productId}/${value}/${assetTxData?.type}/${contractAddress}/${user.ethAddresses}/${user.language}/${uuid}`;
        }
        return `https://metamask.app.link/dapp/${DAPP_URL}/requests?productId=${assetTxData?.productId}&value=${value}&type=${assetTxData?.type}&contractAddress=${contractAddress}&address=${user.ethAddresses}&language=${user.language}&uuid=${uuid}`;
      } else {
        if (wallet === WalletType.IMTOKEN_MOBILE) {
          return `imtokenv2://navigate?screen=DappView&url=https://${DAPP_URL}/staking-requests/${value}/${stakingTxData?.type}/${stakingTxData?.unit}/${stakingTxData?.round}/${contractAddress}/${user.ethAddresses}/${user.language}/${stakingTxData?.rewardValue}/${stakingTxData?.migrationValue}/${uuid}`;
        }
        return `https://metamask.app.link/dapp/${DAPP_URL}/staking-requests?value=${value}&type=${stakingTxData?.type}&unit=${stakingTxData?.unit}&round=${stakingTxData?.round}&contractAddress=${contractAddress}&userAddress=${user.ethAddresses}&language=${user.language}&rewardValue=${stakingTxData?.rewardValue}&migrationValue=${stakingTxData?.migrationValue}&uuid=${uuid}`;
      }
    },
    [uuid, assetTxData, value, contractAddress, stakingTxData, page, user],
  );

  useEffect(() => {
    ExternalWalletTxData.getUuid().then((res) => {
      setUuid(res.data.uuid);
    });
  }, []);

  const linkDapp = () => {
    switch (wallet) {
      case WalletType.IMTOKEN_MOBILE:
        Linking.openURL(linkURL(wallet)).catch((_e) => {
          storeDeeplink('imtoken-btc-eth-wallet/id1384798940', 'im.token.app');
        });
        navigation.goBack();
        break;
      case WalletType.METAMASK_MOBILE:
        Linking.openURL(linkURL(wallet)).catch((_e) => {
          storeDeeplink('metamask/id1438144202', 'io.metamask');
        });
        navigation.goBack();
        break;
      case WalletType.METAMASK_PC:
        if (emailRestriction) {
          return alert(t('product.email_restriction'));
        }
        if (user.provider === ProviderType.ETH) {
          if (!email) {
            return alert(t('account.check_email'));
          } else {
            Server.sendEmailForTransaction(espressoTxId!, email)
              .then((_res) => {
                setState({ ...state, emailRestriction: true });
                alert(t('product.send_purchase_link'));
                setTimeout(() => {
                  setState({
                    ...state,
                    emailRestriction: false,
                  });
                  navigation.goBack();
                }, 30000);
              })
              .catch((e) => {
                if (e.response.status === 500) {
                  alert(t('account_errors.server'));
                }
              });
          }
        } else {
          Server.sendEmailForTransaction(espressoTxId!)
            .then((_res) => {
              setState({ ...state, emailRestriction: true });
              alert(t('product.send_purchase_link'));
              setTimeout(() => {
                setState({
                  ...state,
                  emailRestriction: false,
                });

                navigation.goBack();
              }, 30000);
            })
            .catch((e) => {
              if (e.response.status === 500) {
                alert(t('account_errors.server'));
              }
            });
        }
        break;
      default:
        alert(t('product.select_metamask'));
    }
  };

  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
      }}>
      <SheetHeader title={t('product.select_payment')} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: AppColors.WHITE,
        }}>
        <View style={{ marginTop: 40 }}>
          <WalletSelectionButton
            title={t('product.metamask_mobile')}
            type={WalletType.METAMASK_MOBILE}
            selected={wallet === WalletType.METAMASK_MOBILE}
            modeHandler={() =>
              setState({ ...state, wallet: WalletType.METAMASK_MOBILE })
            }
          />
          {page === 'asset' && (
            <WalletSelectionButton
              title={t('product.metamask_pc')}
              type={WalletType.METAMASK_PC}
              selected={wallet === WalletType.METAMASK_PC}
              modeHandler={() =>
                setState({ ...state, wallet: WalletType.METAMASK_PC })
              }
            />
          )}
          {wallet === WalletType.METAMASK_PC && (
            <>
              {user.provider === ProviderType.ETH && (
                <TextField
                  eventHandler={(input: string) =>
                    setState({ ...state, email: input })
                  }
                  value={email}
                  label={t('account.insert_account_email')}
                  placeHolder={'* ' + t('product.link_will_be_sent')}
                />
              )}
            </>
          )}
          <WalletSelectionButton
            title={t('product.imtoken_mobile')}
            type={WalletType.IMTOKEN_MOBILE}
            selected={wallet === WalletType.IMTOKEN_MOBILE}
            modeHandler={() =>
              setState({ ...state, wallet: WalletType.IMTOKEN_MOBILE })
            }
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%',
        }}>
        <SubmitButton
          title={t('account_label.continue')}
          // eslint-disable-next-line no-nested-ternary
          style={{
            alignSelf: 'center',
            width: '100%',
            backgroundColor:
              // eslint-disable-next-line no-nested-ternary
              wallet === WalletType.METAMASK_MOBILE
                ? AppColors.MAIN
                : emailRestriction
                ? AppColors.BLUE_2
                : AppColors.MAIN,
          }}
          handler={linkDapp}></SubmitButton>
      </View>
    </View>
  );
};

export default PaymentSelection;
