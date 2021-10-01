import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import StakingType from '../enums/StakingType';
import TransferType from '../enums/TransferType';

const getTransferType = (
  transferType: TransferType | StakingType,
  t: TFunction,
) => {
  let type;
  switch (transferType) {
    case TransferType.Purchase:
      type = t('assets.purchase_product_token');
      break;
    case TransferType.Refend:
      type = t('assets.refund_product_token');
      break;
    case TransferType.ProductReward:
      type = t('assets.yield_withdrawal');
      break;
    case TransferType.Send:
      type = t('assets.crypto_withdrawl');
      break;
    case TransferType.Staking:
      type = t('staking.staking');
      break;
    case TransferType.Unstaking:
      type = t('staking.unstake');
      break;
    case TransferType.Migration:
      type = t('staking.migration');
      break;
    case TransferType.StakingReward:
      type = t('staking.claim_rewards');
      break;
    default:
      type = '';
      break;
  }
  return type;
};

export default getTransferType;
