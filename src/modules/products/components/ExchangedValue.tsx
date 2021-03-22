import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next'
import { H3Text, P1Text } from '../../../shared/components/Texts';
import PreferenceContext from '../../../contexts/PreferenceContext';
import usePrices from '../../../hooks/usePrice';

const DesView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 2px;
`;

interface Props {
  return?: string;
  tokenCount: number;
  type: string;
  hasEth?: boolean;
}

const ExchangedValue: FunctionComponent<Props> = (props: Props) => {
  const { elPrice, ethPrice } = usePrices();
  const { currencyFormatter } = useContext(PreferenceContext)
  const { t } = useTranslation();

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
              label={t('product_label.recovery')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={currencyFormatter(
                5.0 * props.tokenCount,
                2,
              )}
              style={{ fontWeight: 'bold' }}
            />
          </DesView>
          <DesView>
            <P1Text
              label={
                props.hasEth
                  ? t('product_label.expected_eth_price')
                  : t('product_label.expected_el_price')
              }
              style={{ flex: 1, color: '#626368' }}
            />
            <H3Text
              label={`${props.hasEth ? 'ETH' : 'EL'} ${parseFloat(
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
              label={t('product_label.investment')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={currencyFormatter(
                5.0 * props.tokenCount,
                2,
              )}
              style={{ fontWeight: 'bold' }}
            />
          </DesView>
          <DesView>
            <P1Text
              label={t('product_label.expected_el_price')}
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
              label={
                props.hasEth
                  ? t('product_label.expected_eth_price')
                  : t('product_label.eth_price')
              }
              style={{ color: '#626368' }}
            />
            <P1Text
              label={`ETH ${parseFloat(
                `${(5 * props.tokenCount) / ethPrice}`,
              ).toFixed(6)}`}
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
                marginVertical: 5,
              }}></View>
          </View>
          <DesView>
            <P1Text
              style={{ color: '#1C1C1C' }}
              label={
                props.type === 'buy'
                  ? t('product_label.expected_return')
                  : t('product_label.expected_refund')
              }
            />
            <H3Text
              label={currencyFormatter(
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
