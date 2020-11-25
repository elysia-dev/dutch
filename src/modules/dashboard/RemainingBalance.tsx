import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useState, useContext, useEffect, useMemo } from 'react';
import { View, Modal } from 'react-native';
import styled from 'styled-components/native';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { P1Text, H2Text } from '../../shared/components/Texts';
import { Modal as Modals } from '../../shared/components/Modal';
import i18n from '../../i18n/i18n';
import { RemainingBalanceCard } from './components/RemainingBalanceCard';
import SliderWithdrawal from './SliderWithdrawal';
import RootContext from '../../contexts/RootContext';

import LegacyRefundStatus from '../../enums/LegacyRefundStatus';
import { SubmitButton } from '../../shared/components/SubmitButton';
import AcceptedImg from '../account/images/accepted.png';

const Accepted = styled.Image`
  width: 140px;
  height: 140px;
  margin: 10px auto;
`;
const InformationCircle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #3679b5;
  border-radius: 10px;
  margin-right: 10px;
  top: 6px;
`;

export const RemainingBalance: FunctionComponent<{}> = () => {
  const defaultUser = {
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
  };
  const { user, getElPrice, elPrice } = useContext(RootContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    user: defaultUser,
    errorReturn: 0,
    modalVisible: false,
    switchingHandler: false,
    status: LegacyRefundStatus,
  });

  const legacyTotal = parseFloat(((user.legacyEl * elPrice) + user.legacyUsd).toFixed(2));

  useEffect(() => {
    getElPrice();
  }, []);

  return (
    <>
      <WrapperLayout
        style={{ backgroundColor: "#FAFCFF" }}
        isScrolling={false}
        backButtonHandler={() => navigation.goBack()}
        title={i18n.t("dashboard_label.remaining_balance")}
        body={
          <>
            <View style={{ marginLeft: '5%', marginRight: '5%' }}>
              <RemainingBalanceCard
                totalBalance={legacyTotal} usd={user.legacyUsd} el={user.legacyEl} />
              <View style={{ flexDirection: 'row', marginBottom: 10, marginRight: '5%' }}>
                <InformationCircle />
                <P1Text
                  label={i18n.t("dashboard.remaining_text.0")}
                  style={{ fontSize: 14, lineHeight: 22 }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: '5%' }}>
                <InformationCircle />
                <P1Text
                  label={i18n.t("dashboard.remaining_text.1")}
                  style={{ fontSize: 14, lineHeight: 22 }}
                />
              </View>
            </View>
            <Modal
              transparent={true}
              animationType={'slide'}
              visible={state.modalVisible}
              onRequestClose={() => setState({ ...state, modalVisible: false })}>
              <SliderWithdrawal
                modalHandler={() => setState({ ...state, modalVisible: false })}
                switchingHandler={() => setState({
                  ...state, modalVisible: false, switchingHandler: true,
                  })}
                el={user.legacyEl}
                usd={user.legacyUsd}
              />
            </Modal>
            <Modals
              child={
                <View>
                  <Accepted source={AcceptedImg} />
                  <H2Text
                    style={{
                      textAlign: 'center',
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                    label={i18n.t("dashboard.remaining_withdraw_popup.0")}
                  />
                  <P1Text
                    style={{
                      marginBottom: 40,
                      textAlign: 'center',
                      color: "#626368",
                    }}
                    label={i18n.t("dashboard.remaining_withdraw_popup.1")}
                  />
                </View>
              }
              modalHandler={() => {
                setState({ ...state, switchingHandler: false });
                navigation.goBack();
              }}
              visible={state.switchingHandler} />
          </>
        }
        button={
          <SubmitButton
            title={
              // eslint-disable-next-line no-nested-ternary
              (user.legacyWalletRefundStatus === LegacyRefundStatus.NONE)
                ? i18n.t("dashboard_label.remaining_withdraw")
                : (user.legacyWalletRefundStatus === LegacyRefundStatus.PENDING)
                ? i18n.t("dashboard_label.remaining_withdraw_pending")
                : i18n.t("dashboard_label.remaining_withdraw_other")
              }
            handler={(user.legacyWalletRefundStatus === LegacyRefundStatus.NONE)
              ? () => setState({ ...state, modalVisible: true })
              : () => {}
            }
            variant={
              (user.legacyWalletRefundStatus === LegacyRefundStatus.NONE)
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
