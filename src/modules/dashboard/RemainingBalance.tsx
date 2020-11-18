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
  const navigation = useNavigation();
  const [state, setState] = useState({
    user: defaultUser,
    errorReturn: 0,
    elPrice: 0.003,
    modalVisible: false,
    switchingHandler: false,
    status: LegacyRefundStatus,
  });
  const {
    user,
    Server,
    setRefundStatus,
  } = useContext(RootContext);

  function TotalValueUpdate(legacyEl: number, elPrice: number, legacyUsd: number) {
    return parseFloat(((legacyEl * elPrice) + legacyUsd).toFixed(2));
  }
  const legacyTotal =
    useMemo(() => TotalValueUpdate(user.legacyEl, state.elPrice, user.legacyUsd), [state]);

  const legacyTotalValue = async () => {
    try {
      const userInfo = await Server.me();
      const getElPrice = await Server.getELPrice();
      setState({
        ...state,
        user: userInfo.data.user,
        elPrice: getElPrice.data.elysia.usd,
      });
    } catch (e) {
      if (e.response.status === 400) {
        alert('출금할 금액이 없거나, 이미 출금하셨습니다.');
        setState({ ...state, errorReturn: 1 });
      } else if (e.response.status === 500) {
        alert(i18n.t('account_errors.server'));
        setState({ ...state, errorReturn: 1 });
      }
      setState({ ...state, errorReturn: 1 });
    }
  };

  useEffect(() => {
    legacyTotalValue();
  }, []);

  return (
    <>
      <WrapperLayout
        style={{ backgroundColor: "#FAFCFF" }}
        isScrolling={false}
        backButtonHandler={() => navigation.goBack()}
        title={'잔여 EL / USD'}
        body={
          <>
            <View style={{ marginLeft: '5%', marginRight: '5%' }}>
              <RemainingBalanceCard
                totalBalance={legacyTotal} usd={user.legacyUsd} el={user.legacyEl} />
              <View style={{ flexDirection: 'row', marginBottom: 10, marginRight: '5%' }}>
                <InformationCircle />
                <P1Text
                  label={'위 금액은 엘리시아 웹사이트(elysia.land) 내부지갑에 있는 잔고입니다. 출금요청시 USD/EL이 각각 동시에 출금됩니다.'}
                  style={{ fontSize: 14, lineHeight: 22 }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: '5%' }}>
                <InformationCircle />
                <P1Text
                  label={'보유하신 상품별 적립금은, 상품별로 별도 인출 가능합니다.'}
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
                    label={'출금신청이 완료되었습니다'}
                  />
                  <P1Text
                    style={{
                      marginBottom: 40,
                      textAlign: 'center',
                      color: "#626368",
                    }}
                    label={'진행 사항은 알림으로 안내드리겠습니다.'}
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
                ? '출금하기'
                : (user.legacyWalletRefundStatus === LegacyRefundStatus.PENDING)
                ? '출금 요청이 진행중입니다'
                : '출금 대상이 아닙니다'
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
