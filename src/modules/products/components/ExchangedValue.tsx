import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, Image, Text } from 'react-native';
import styled from 'styled-components/native';
import RootContext from '../../../contexts/RootContext';
import i18n from '../../../i18n/i18n';
import { CoinPriceResponse } from '../../../types/CoinPrice';

const DesView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
  font-weight: bold;
`;
const BText = styled.Text`
  color: #3679b5;
  font-size: 20px;
  text-align: right;
  font-weight: bold;
`;

interface Props {
  return?: string;
  tokenCount: number;
  type: string;
}

interface State {
  elPrice: number;
  ethPrice: number;
}

const ExchangedValue: FunctionComponent<Props> = (props: Props) => {
  const { Server } = useContext(RootContext);
  const [state, setState] = useState<State>({
    elPrice: 0,
    ethPrice: 0,
  });

  const loadCoinExchange = () => {
    Server.coinPrice()
      .then(res => {
        setState({
          ...state,
          elPrice: res.data.elysia.usd,
          ethPrice: res.data.ethereum.usd,
        });
      })
      .catch((e: { response: { status: number } }) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    loadCoinExchange();
  }, []);
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'space-between',
        position: 'relative',
        top: -20,
        width: '100%',
        height: props.type === "refund" ? "20%" : '35%',
        backgroundColor: '#F6F6F8',
        borderWidth: 2,
        borderColor: '#F1F1F1',
        borderRadius: 10,
        padding: 15,
        marginVertical: props.type === "refund" ? "7.5%" : "0%",
      }}>
      {props.type === "refund" ?
      <>
        <DesView>
          <GText>{i18n.t('product_label.recovery')}</GText>
          <PText>{`$${parseFloat(`${5.0 * props.tokenCount}`).toFixed(
            2,
          )}`}</PText>
        </DesView>
        <DesView>
          <GText>{i18n.t('product_label.expected_el_price')}</GText>
          <BText>{`EL ${parseFloat(
            `${(5.0 * props.tokenCount) / state.elPrice}`,
          ).toFixed(2)}`}</BText>
        </DesView>
      </> :
      <>
        <DesView>
          <GText>{i18n.t('product_label.investment')}</GText>
          <PText>{`$${parseFloat(`${5.0 * props.tokenCount}`).toFixed(
            2,
          )}`}</PText>
        </DesView>
        <DesView>
          <GText>{i18n.t('product_label.el_price')}</GText>
          <PText>{`EL ${parseFloat(
            `${(5.0 * props.tokenCount) / state.elPrice}`,
          ).toFixed(2)}`}</PText>
        </DesView>
        <DesView>
          <GText>{i18n.t('product_label.eth_price')}</GText>
          <PText>{`ETH ${parseFloat(
            `${(5 * props.tokenCount) / state.ethPrice}`,
          ).toFixed(2)}`}</PText>
        </DesView>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: 0,
              borderWidth: 1,
              borderColor: '#F1F1F1',
            }}></View>
        </View>
        <DesView>
          <GText style={{ color: '#1C1C1C' }}>
            {props.type === 'buy'
              ? i18n.t('product_label.expected_return')
              : i18n.t('product_label.expected_refund')}
          </GText>
          <BText>{`$${parseFloat(
            `${0.01 * parseInt(props.return!, 10) * 5 * props.tokenCount}`,
          ).toFixed(2)}`}</BText>
        </DesView>
      </>
      }
    </View>
  );
};

export default ExchangedValue;
