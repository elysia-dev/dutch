import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useState } from 'react';
import { View, Modal } from 'react-native';
import styled from 'styled-components/native';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { P1Text, H2Text } from '../../shared/components/Texts';
import { Modal as Modals } from '../../shared/components/Modal';
import i18n from '../../i18n/i18n';
import { RemainingBalanceCard } from './components/RemainingBalanceCard';
import SliderWithdrawal from './SliderWithdrawal';

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
  const navigation = useNavigation();
  const [state, setState] = useState({
    modalVisible: false,
    switchingHandler: false,
  });

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
              <RemainingBalanceCard totalBalance={123.12} usd={12.2} el={12331} />
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
            title={'출금하기'}
            handler={() => setState({ ...state, modalVisible: true })}
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
