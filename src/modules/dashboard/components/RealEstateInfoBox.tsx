import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BigNumber, utils } from 'ethers';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';
import PriceContext from '../../../contexts/PriceContext';
import commaFormatter from '../../../utiles/commaFormatter';
import decimalFormatter from '../../../utiles/decimalFormatter';
import Asset from '../../../types/Asset';
import { getAssetTokenFromCryptoType } from '../../../utiles/getContract';
import getPaymentCrypto from '../../../utiles/getPaymentCrypto';
import PreferenceContext from '../../../contexts/PreferenceContext';
import useUserAddress from '../../../hooks/useUserAddress';
import LoadDetail from '../../../utiles/LoadLagacyDetail';
import UserContext from '../../../contexts/UserContext';
import AssetDetail from '../../../types/AssetDetail';

const StakingInfoBox: React.FC<{
  asset: Asset;
  onPress: (asset: Asset) => void;
}> = ({ asset, onPress }) => {
  const { getCryptoPrice } = useContext(PriceContext);
  const { currencyFormatter } = useContext(PreferenceContext);
  const { t } = useTranslation();
  const userAddress = useUserAddress();
  const [reward, setReward] = useState(0);
  const paymentMethod = getPaymentCrypto(asset.paymentMethod!);
  const loadDetail = new LoadDetail();
  const { Server } = useContext(UserContext);

  useEffect(() => {
    if (asset.address) {
      const assetContract = getAssetTokenFromCryptoType(
        paymentMethod,
        asset.address,
      );
      assetContract?.getReward(userAddress).then((res: BigNumber) => {
        // 아 getReward가 토큰이 아니라 달러 기준으로 값을 주는구나
        setReward(Number(utils.formatEther(res)));
      });
    } else {
      // legacy
      loadDetail
        .ownershipDetail(Server, asset.ownershipId, 1, () => {})
        .then((res: AssetDetail) => setReward(res.reward));
    }
  }, []);

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: AppColors.GREY,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 10,
      }}
      onPress={() => onPress(asset)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontSize: 12,
            color: AppColors.SUB_BLACK,
            fontFamily: AppFonts.Regular,
          }}>
          {t('main.assets_value')}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              color: AppColors.BLACK,
              fontFamily: AppFonts.Medium,
            }}>
            {`${commaFormatter(decimalFormatter(asset.value, 2))} ${
              asset.unit
            } `}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: AppColors.SUB_BLACK,
              fontFamily: AppFonts.Regular,
            }}>
            {`(= ${currencyFormatter(
              asset.value * getCryptoPrice(asset.type),
            )})`}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: AppColors.SUB_BLACK,
            fontFamily: AppFonts.Regular,
          }}>
          {t('main.return')}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {asset.address && (
            <Text
              style={{
                fontSize: 12,
                color: AppColors.BLACK,
                fontFamily: AppFonts.Medium,
              }}>
              {`${commaFormatter(
                decimalFormatter(reward / getCryptoPrice(paymentMethod), 2),
              )} ${paymentMethod} `}
            </Text>
          )}
          <Text
            style={{
              fontSize: asset.address ? 10 : 12,
              color: asset.address ? AppColors.SUB_BLACK : AppColors.BLACK,
              fontFamily: asset.address ? AppFonts.Regular : AppFonts.Medium,
            }}>
            {asset.address
              ? `(= ${currencyFormatter(reward)})`
              : currencyFormatter(reward)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StakingInfoBox;
