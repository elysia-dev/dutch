/* eslint-disable radix */
import React, {
  useState,
  FunctionComponent,
  useCallback,
} from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { SubmitButton } from '../../shared/components/SubmitButton';
import RootContext from '../../contexts/RootContext';
import { P1Text } from '../../shared/components/Texts';
import { TextField } from '../../shared/components/TextField';


interface Props {
  modalHandler: () => void;
  switchingHandler: () => void;
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
  // const { Server } = useContext(RootContext);
  const [state, setState] = useState({
    focusing: false,
  });

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
    const [state, setState] = useState(() => { });
    const callback = useCallback(() => {
      setState(props.switchingHandler());
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
        eventHandler={() => {}}
        focusHandler={value => setState({ ...state, focusing: value })}
      />
      <TextField
        label={'개인지갑 주소'}
        eventHandler={() => {}}
        focusHandler={value => setState({ ...state, focusing: value })}
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
      {!state.focusing &&
        <WithDrawalButton />
      }
    </View>
  </View>
  );
};

export default SliderWithdrawal;
