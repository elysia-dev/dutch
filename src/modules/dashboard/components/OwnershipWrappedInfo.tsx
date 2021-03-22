import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import Product from '../../../types/product';
import { P1Text, P3Text } from '../../../shared/components/Texts';
import { useTranslation } from 'react-i18next'
import PreferenceContext from '../../../contexts/PreferenceContext';
import LocaleType from '../../../enums/LocaleType';

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

  const { language, currencyFormatter } = useContext(PreferenceContext);
  const product = props.product;
  const productDescription = product.data.descriptions[language || LocaleType.EN];
  const { t } = useTranslation();

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
            <P1Text label={t('product_label.financials')} />
            <Image
              source={require('../images/downbutton.png')}
              style={[
                {
                  marginTop: 8,
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
              <P3Text
                label={t('product_financial.expected_annual_return')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={`${props.product.expectedAnnualReturn}%`}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>
            <DesView>
              <P3Text
                label={t('product_financial.return_rent')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={`${props.product.data.returnOnRent}%`}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>
            <DesView>
              <P3Text
                label={t('product_financial.return_sale')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={`${props.product.data.returnOnSale}%`}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>
            <DesView>
              <P3Text
                label={t('product_financial.rent_distribution')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={productDescription.monthlyRentIncomeDistributionCycle}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>
            <DesView>
              <P3Text
                label={t('product_financial.lockup_period')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={productDescription.lockupPeriod}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>
            <DesView>
              <P3Text
                label={t('product_financial.expected_sale_date')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={productDescription.expectedSaleDate}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>
            <DesView>
              <P3Text
                label={t('product_financial.price')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={currencyFormatter(
                  parseFloat(product.data.propertyPrice),
                  0,
                )}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>

            <DesView>
              <P3Text
                label={t('product_financial.net_deposit')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={currencyFormatter(
                  parseFloat(product.data.netDeposit),
                  0,
                )}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>

            <DesView>
              <P3Text
                label={t('product_financial.net_rent_year')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={currencyFormatter(
                  parseFloat(product.data.netRentPerYear),
                  0,
                )}
                style={{ color: '#1c1c1c' }}
              />
            </DesView>

            <DesView>
              <P3Text
                label={t('product_financial.bankloan')}
                style={{ color: '#626368' }}
              />
              <P3Text
                label={`${product.data.bankLoan}`}
                style={{ color: '#1c1c1c' }}
              />
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
            <P1Text label={t('dashboard_label.property_abstract')} />
            <Image
              source={require('../images/downbutton.png')}
              style={[
                {
                  marginTop: 8,
                },
                {
                  transform: [{ rotate: state.abstract ? '180deg' : '0deg' }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {state.abstract && (
          <View style={{ paddingTop: 20 }}>
            <P3Text label={productDescription.summary} />
          </View>
        )}
      </View>
    </View>
  );
};

export default OwnershipWrappedInfo;
