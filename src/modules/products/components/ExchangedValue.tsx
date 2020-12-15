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
import { H3Text, P1Text } from '../../../shared/components/Texts';
import { CoinPriceResponse } from '../../../types/CoinPrice';

const DesView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  return?: string;
  tokenCount: number;
  type: string;
}

interface State {
  ethPrice: number;
}

const ExchangedValue: FunctionComponent<Props> = (props: Props) => {
  const { Server, currencyExchange, elPrice } = useContext(RootContext);
  const [state, setState] = useState<State>({
    ethPrice: 0,
  });

  const loadCoinExchange = () => {
    Server.coinPrice()
      .then((res) => {
        setState({
          ...state,
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
        top: -10,
        width: '100%',
        height: '29%',
        backgroundColor: '#F6F6F8',
        borderWidth: 2,
        borderColor: '#F1F1F1',
        borderRadius: 10,
        padding: 15,
      }}>
      {props.type === 'refund' ? (
        <>
          <DesView>
            <P1Text
              label={i18n.t('product_label.recovery')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={currencyExchange(5.0 * props.tokenCount, 2)}
              style={{ fontWeight: 'bold' }}
            />
          </DesView>
          <DesView>
            <P1Text
              label={i18n.t('product_label.expected_el_price')}
              style={{ flex: 1, color: '#626368' }}
            />
            <H3Text
              label={`EL ${parseFloat(
                `${(5.0 * props.tokenCount) / elPrice}`,
              ).toFixed(2)}`}
              style={{ flex: 1, color: '#3679b5', textAlign: 'right' }}
            />
          </DesView>
        </>
      ) : (
        <>
          <DesView>
            <P1Text
              label={i18n.t('product_label.investment')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={currencyExchange(5.0 * props.tokenCount, 2)}
              style={{ fontWeight: 'bold' }}
            />
          </DesView>
          <DesView>
            <P1Text
              label={i18n.t('product_label.el_price')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={`EL ${parseFloat(
                `${(5.0 * props.tokenCount) / elPrice}`,
              ).toFixed(2)}`}
              style={{ fontWeight: 'bold' }}
            />
          </DesView>
          <DesView>
            <P1Text
              label={i18n.t('product_label.eth_price')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={`ETH ${parseFloat(
                `${(5 * props.tokenCount) / state.ethPrice}`,
              ).toFixed(2)}`}
              style={{ fontWeight: 'bold' }}
            />
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
            <P1Text
              style={{ color: '#1C1C1C' }}
              label={
                props.type === 'buy'
                  ? i18n.t('product_label.expected_return')
                  : i18n.t('product_label.expected_refund')
              }
            />
            <H3Text
              label={currencyExchange(
                0.01 * parseFloat(props.return!) * 5 * props.tokenCount,
                2,
              )}
              style={{ color: '#3679b5' }}
            />
          </DesView>
        </>
      )}
    </View>
  );
};

export default ExchangedValue;
