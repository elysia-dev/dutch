import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useState, useContext } from 'react';
import { View, Modal, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { P1Text, H2Text } from '../../shared/components/Texts';
import { Modal as Modals } from '../../shared/components/Modal';
import { RemainingBalanceCard } from './components/RemainingBalanceCard';
import SliderWithdrawal from './components/SliderWithdrwal';

import LegacyRefundStatus from '../../enums/LegacyRefundStatus';
import { SubmitButton } from '../../shared/components/SubmitButton';
import AcceptedImg from '../account/images/accepted.png';
import UserContext from '../../contexts/UserContext';
import PriceContext from '../../contexts/PriceContext';
import Circle from '../../shared/components/Circle';
import AppColors from '../../enums/AppColors';

const RemainingBalance: FunctionComponent<{}> = () => {
  const defaultUser = {
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
  };
  const { user } = useContext(UserContext);
  const { elPrice } = useContext(PriceContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    user: defaultUser,
    errorReturn: 0,
    modalVisible: false,
    switchingHandler: false,
    status: LegacyRefundStatus,
  });
  const legacyTotal = parseFloat(
    (user.legacyEl * elPrice + user.legacyUsd).toFixed(2),
  );
  const { t } = useTranslation();

  return (
    <>
      <WrapperLayout
        style={{ backgroundColor: '#FAFCFF' }}
        isScrolling={false}
        backButtonHandler={() => navigation.goBack()}
        title={t('dashboard_label.remaining_balance')}
        body={
          <>
            <View style={{ marginLeft: '5%', marginRight: '5%' }}>
              <RemainingBalanceCard
                totalBalance={legacyTotal}
                usd={user.legacyUsd}
                el={user.legacyEl}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  marginRight: '5%',
                }}>
                <Circle
                  style={{
                    backgroundColor: AppColors.MAIN,
                    marginRight: 10,
                    top: 6,
                  }}
                />
                <P1Text
                  label={t('dashboard.remaining_text.0')}
                  style={{ fontSize: 14, lineHeight: 22 }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: '5%' }}>
                <Circle
                  style={{
                    backgroundColor: AppColors.MAIN,
                    marginRight: 10,
                    top: 6,
                  }}
                />
                <P1Text
                  label={t('dashboard.remaining_text.1')}
                  style={{ fontSize: 14, lineHeight: 22 }}
                />
              </View>
            </View>
            <Modal
              transparent={true}
              animationType={'slide'}
              visible={state.modalVisible}
              onRequestClose={() =>
                setState({ ...state, modalVisible: false })
              }>
              <SliderWithdrawal
                modalHandler={() => setState({ ...state, modalVisible: false })}
                switchingHandler={() =>
                  setState({
                    ...state,
                    modalVisible: false,
                    switchingHandler: true,
                  })
                }
                el={user.legacyEl}
                usd={user.legacyUsd}
              />
            </Modal>
            <Modals
              child={
                <View>
                  <Image
                    source={AcceptedImg}
                    style={{
                      width: 140,
                      height: 140,
                      marginVertical: 10,
                      marginHorizontal: 'auto',
                    }}
                  />
                  <H2Text
                    style={{
                      textAlign: 'center',
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                    label={t('dashboard.remaining_withdraw_popup.0')}
                  />
                  <P1Text
                    style={{
                      marginBottom: 40,
                      textAlign: 'center',
                      color: AppColors.BLACK2,
                    }}
                    label={t('dashboard.remaining_withdraw_popup.1')}
                  />
                </View>
              }
              modalHandler={() => {
                setState({ ...state, switchingHandler: false });
                navigation.goBack();
              }}
              visible={state.switchingHandler}
            />
          </>
        }
        button={
          <SubmitButton
            title={
              // eslint-disable-next-line no-nested-ternary
              user.legacyWalletRefundStatus === LegacyRefundStatus.NONE
                ? t('dashboard_label.remaining_withdraw')
                : user.legacyWalletRefundStatus === LegacyRefundStatus.PENDING
                ? t('dashboard_label.remaining_withdraw_pending')
                : t('dashboard_label.remaining_withdraw_other')
            }
            handler={
              user.legacyWalletRefundStatus === LegacyRefundStatus.NONE
                ? () => setState({ ...state, modalVisible: true })
                : () => {}
            }
            variant={
              user.legacyWalletRefundStatus === LegacyRefundStatus.NONE
                ? undefined
                : 'GrayTheme'
            }
          />
        }
      />
      {(state.modalVisible || state.switchingHandler) && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </>
  );
};

export default RemainingBalance;
