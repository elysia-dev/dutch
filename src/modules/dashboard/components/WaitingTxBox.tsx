import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import { DashboardPage, Page } from '../../../enums/pageEnum';
import { H4Text, P3Text } from '../../../shared/components/Texts';
import TransactionContext from '../../../contexts/TransactionContext';

const WaitingTxBox: React.FC<{
  isFocused: boolean;
}> = ({ isFocused }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { waitingTxs } = useContext(TransactionContext);

  return (
    <>
      {waitingTxs.length === 0 ? (
        <View
          style={{
            marginBottom: 40,
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 82,
            backgroundColor: AppColors.GREY4,
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 23,
            paddingBottom: 22,
            borderRadius: 5,
            marginBottom: 40,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(Page.Dashboard, {
                screen: DashboardPage.WaitingTxList,
                params: { waitingTxs },
              });
            }}>
            <P3Text
              label={t('main.pending_transaction')}
              style={{ color: AppColors.SUB_BLACK }}
            />
            {waitingTxs.length >= 2 && i18n.language === 'en' ? (
              <H4Text
                label={t('main.pending_transaction_counts', {
                  count: waitingTxs.length,
                })}
                style={{ fontSize: 15 }}
              />
            ) : (
              <H4Text
                label={t('main.pending_transaction_count', {
                  count: waitingTxs.length,
                })}
                style={{ fontSize: 15 }}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default WaitingTxBox;
