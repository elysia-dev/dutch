import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  z-index: 3;
  margin-bottom: 15px;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: left;
  font-weight: 300;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 12px;
  font-weight: 300;
`;

const DesView = styled.View`
  margin-top: 18px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

interface Props {
  product: Product;
}

const OwnershipWrappedInfo: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    financial: false,
    highlight: false,
    abstract: false,
  });

  const { locale } = useContext(RootContext);
  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription =
    product.data.descriptions[
      product.data.languages.includes(locale) ? locale : LocaleType.EN
    ];

  return (
    <View style={{ width: '100%', paddingBottom: 0 }}>
      <View
        style={{
          padding: 20,
        }}>
        <TouchableOpacity
          onPress={() => setState({ ...state, financial: !state.financial })}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <H1Text>{i18n.t('product_label.financials')}</H1Text>
            <Image
              source={require('../images/downbutton.png')}
              style={[
                {
                  width: 20,
                  height: 17,
                  resizeMode: 'center',
                },
                {
                  transform: [{ rotate: state.financial ? '180deg' : '0deg' }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {state.financial && (
          <View style={{ paddingBottom: 20 }}>
            <DesView>
              <GText>
                {i18n.t('product_financial.expected_annual_return')}
              </GText>
              <PText>{`${props.product.data.expectedAnnualReturn}%`}</PText>
            </DesView>
            <DesView>
              <GText>{i18n.t('product_financial.return_rent')}</GText>
              <PText>{`${props.product.data.returnOnRent}%`}</PText>
            </DesView>
            <DesView>
              <GText>{i18n.t('product_financial.return_sale')}</GText>
              <PText>{`${props.product.data.returnOnSale}%`}</PText>
            </DesView>
            <DesView>
              <GText>{i18n.t('product_financial.rent_distribution')}</GText>
              <PText>
                {productDescription.monthlyRentIncomeDistributionCycle}
              </PText>
            </DesView>
            <DesView>
              <GText>{i18n.t('product_financial.lockup_period')}</GText>
              <PText>{productDescription.lockupPeriod}</PText>
            </DesView>
            <DesView>
              <GText>{i18n.t('product_financial.expected_sale_date')}</GText>
              <PText>{productDescription.expectedSaleDate}</PText>
            </DesView>
            <DesView>
              <GText>{i18n.t('product_financial.price')}</GText>
              <PText>{`${product.data.propertyPrice}$`}</PText>
            </DesView>

            <DesView>
              <GText>{i18n.t('product_financial.net_deposit')}</GText>
              <PText>{`${product.data.netDeposit}$`}</PText>
            </DesView>

            <DesView>
              <GText>{i18n.t('product_financial.net_rent_year')}</GText>
              <PText>{`${product.data.netRentPerYear}$`}</PText>
            </DesView>

            <DesView>
              <GText>{i18n.t('product_financial.bankloan')}</GText>
              <PText>{`${product.data.bankLoan}`}</PText>
            </DesView>
          </View>
        )}
      </View>
      <View
        style={{
          padding: 20,
        }}>
        <TouchableOpacity
          onPress={() => setState({ ...state, abstract: !state.abstract })}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <H1Text>{i18n.t('dashboard_label.property_abstract')}</H1Text>
            <Image
              source={require('../images/downbutton.png')}
              style={[
                {
                  width: 20,
                  height: 17,
                  resizeMode: 'center',
                },
                {
                  transform: [{ rotate: state.abstract ? '180deg' : '0deg' }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {state.abstract && (
          <View>
            <PText>{productDescription.summary}</PText>
          </View>
        )}
      </View>
    </View>
  );
};

export default OwnershipWrappedInfo;
