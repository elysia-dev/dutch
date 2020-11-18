/* eslint-disable radix */
import React, {
  useState,
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { SubmitButton } from '../../shared/components/SubmitButton';
import RootContext from '../../contexts/RootContext';
import { P1Text } from '../../shared/components/Texts';
import { TextField } from '../../shared/components/TextField';
import LegacyRefundStatus from '../../enums/LegacyRefundStatus';


interface Props {
  modalHandler: () => void;
  switchingHandler: () => void;
  el: number;
  usd: number;
}

const InformationCircle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #3679b5;
  border-radius: 10px;
  margin-right: 10px;
  top: 6px;
`;

const SliderWithdrawal: FunctionComponent<Props> = (props) => {
  // const navigation = useNavigation();
  const {
    Server,
    setWithdrawAddress,
    setRefundStatus,
   } = useContext(RootContext);
  const [state, setState] = useState({
    inputEmail: '',
    inputWallet: '',
    errorReturn: 0,
  });
  const [focusing, setFocusing] = useState(false);

  const refundLegacyWallet = () => {
    Server.setRefundLegacyWallet(
      state.inputWallet,
      state.inputEmail,
      ).then((_res) => {
        setWithdrawAddress(state.inputWallet, state.inputEmail);
        setRefundStatus(LegacyRefundStatus.PENDING);
      }).catch((e) => {
        if (e.response.status === 400) {
          alert('출금할 금액이 없거나, 이미 출금하셨습니다.');
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        } else {
          alert(i18n.t('account_errors.server'));
        }
      });
  };
  const checkWithdrawInput = () => {
    if (state.inputEmail === '' && state.inputWallet === '') {
      // 아무것도 입력하지 않음
      alert('출금 받으실 주소를 입력해주세요.');
      return false;
    }
    if (props.el === 0 && props.usd === 0) {
      // 서버에서 el usd 값을 받아오지 못 했거나 비정상 접근 오류
      alert(i18n.t('account_errors.server'));
      return false;
    }

    if (state.inputWallet !== '' && state.inputEmail === '' && props.el === 0) {
      // USD만 있는데 페이팔 주소를 안 적고 EL 주소를 적음
      alert('USD 잔액은 페이팔로만 출금할 수 있습니다. 페이팔 계정 주소만 입력해주세요.');
      return false;
    } else if ((props.usd > 0 && props.el > 0) && state.inputWallet !== '' && state.inputEmail === '') {
      // USD, EL이 모두 있는데 페이팔 주소를 안 적고 EL 주소만 적음
      alert('USD 출금을 위해 Paypal 주소를 입력해주세요.');
      return false;
    } else if ((state.inputWallet !== '' && state.inputEmail !== '') && props.usd === 0 && props.el > 0) {
      // EL만 있는데 둘 다 입력함
      alert('USD 잔고가 없습니다. 개인 이더리움 지갑 주소만 입력해주세요.');
      return false;
    }

    if (state.inputEmail !== '' && state.inputWallet === '' && props.usd === 0) {
      // EL이 있는데 지갑 주소를 안 적고 페이팔 주소를 적음
      alert('EL 잔액은 이더리움 지갑주소로만 출금할 수 있습니다. 개인 이더리움 지갑 주소만 입력해주세요.');
      return false;
    } else if ((props.usd > 0 && props.el > 0) && state.inputWallet === '' && state.inputEmail !== '') {
      // USD, EL이 모두 있는데 지갑 주소를 안 적고 페이팔 주소만 적음
      alert('EL 출금을 위해 이더리움 지갑 주소를 입력해주세요.');
      return false;
    } else if ((state.inputWallet !== '' && state.inputEmail !== '') && props.el === 0 && props.usd > 0) {
      // USD만 있는데 둘 다 입력함
      alert('EL 잔고가 없습니다. 페이팔 계정 주소만 입력해주세요.');
      return false;
    }
    return true;
  };

  function ButtonCallback({ callback }) {
    return (
      <SubmitButton
          title={'출금하기'}
          style={{
            position: 'absolute',
            bottom: 0,
            marginBottom: 10,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
            backgroundColor: '#3679B5',
          }}
          handler={callback}
        />
    );
  }
  function WithDrawalButton() {
    const [callbacks, setCallback] = useState(() => { });
    const callback = useCallback(() => {
      if (checkWithdrawInput()) {
        refundLegacyWallet();
        setCallback(props.switchingHandler());
      }
    }, []);
    return <ButtonCallback callback={callback} />;
  }

  return (
  <View
    style={{
      position: 'absolute',
      bottom: 0,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingLeft: 20,
      paddingRight: 20,
      height: '70%',
      width: '100%',
      backgroundColor: '#fff',
      justifyContent: 'center',
    }}>
    <View style={{ width: '100%', height: '100%' }}>
      <TouchableOpacity
        style={{
          top: 10,
          width: 30,
          height: 30,
          alignSelf: 'center',
        }}
        onPress={props.modalHandler}>
        <Image
          source={require('./images/bluedownarrow.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>
      <View style={{ paddingTop: 40 }} />
      <TextField
        label={'Paypal 계정 주소'}
        eventHandler={(input: string) => {
          setState({ ...state, inputEmail: input });
        }}
        focusHandler={value => setFocusing(value)}
      />
      <TextField
        label={'개인 이더리움 지갑 주소'}
        eventHandler={(input: string) => {
          setState({ ...state, inputWallet: input });
        }}
        focusHandler={value => setFocusing(value)}
      />
      <View style={{ backgroundColor: "#F6F6F8", borderRadius: 10, borderWidth: 1, borderColor: "#F1F1F1", padding: 15, marginTop: 15 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10, marginRight: '5%' }}>
          <InformationCircle />
          <P1Text
            label={'위 금액은 엘리시아 웹사이트(elysia.land) 내부지갑에 있는 잔고입니다. 출금요청시 USD/EL이 각각 동시에 출금됩니다.'}
            style={{ fontSize: 13, lineHeight: 17 }}
          />
        </View>
        <View style={{ flexDirection: 'row', marginRight: '5%' }}>
          <InformationCircle />
          <P1Text
            label={'보유하신 상품별 적립금은, 상품별로 별도 인출 가능합니다.'}
            style={{ fontSize: 13, lineHeight: 17 }}
          />
        </View>
      </View>
      {!focusing &&
        <WithDrawalButton />
      }
    </View>
  </View>
  );
};

export default SliderWithdrawal;
