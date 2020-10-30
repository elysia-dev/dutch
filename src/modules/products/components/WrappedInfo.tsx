import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';
import { H3Text, P1Text, P3Text } from '../../../shared/components/Texts';

const DesView = styled.View`
  margin-top: 18px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

interface Props {
  product: Product;
}

const WrappedInfo: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    financial: false,
    highlight: false,
    abstract: false,
  });

  const { user } = useContext(RootContext);
  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription = product.data.descriptions[user.language];
  // TODO : Add null guard languages & descrptions

  return (
    <View style={{ width: '100%', paddingBottom: 60 }}>
      <View
        style={{
          padding: 20,
          borderBottomColor: '#F6F6F8',
          borderBottomWidth: 5,
        }}>
        <H3Text
          label={i18n.t('product_label.property_info')}
          style={{ marginBottom: 15 }}
        />
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => setState({ ...state, financial: !state.financial })}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <P1Text
                label={i18n.t('product_label.financials')}
                style={{ marginVertical: 10 }}
              />
              <Image
                source={require('../images/downbutton.png')}
                style={[
                  {
                    marginTop: 14,
                  },
                  {
                    transform: [
                      { rotate: state.financial ? '180deg' : '0deg' },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {state.financial && (
            <View style={{ paddingBottom: 20 }}>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.expected_annual_return')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={`${props.product.expectedAnnualReturn}%`}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.return_rent')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={`${props.product.data.returnOnRent}%`}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.return_sale')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={`${props.product.data.returnOnSale}%`}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.rent_distribution')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.monthlyRentIncomeDistributionCycle}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.lockup_period')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.lockupPeriod}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.expected_sale_date')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.expectedSaleDate}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_financial.price')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={`${product.data.propertyPrice}$`}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>

              <DesView>
                <P3Text
                  label={i18n.t('product_financial.net_deposit')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={`${product.data.netDeposit}$`}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>

              <DesView>
                <P3Text
                  label={i18n.t('product_financial.net_rent_year')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={`${product.data.netRentPerYear}$`}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>

              <DesView>
                <P3Text
                  label={i18n.t('product_financial.bankloan')}
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
        <View>
          <TouchableOpacity
            onPress={() => setState({ ...state, highlight: !state.highlight })}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <P1Text
                label={i18n.t('product_label.property_highlightes')}
                style={{ marginVertical: 10 }}
              />
              <Image
                source={require('../images/downbutton.png')}
                style={[
                  {
                    marginTop: 14,
                  },
                  {
                    transform: [
                      { rotate: state.highlight ? '180deg' : '0deg' },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {state.highlight && (
            <View style={{ paddingBottom: 20 }}>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.type')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.propertyType}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.ground')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.ground}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.underground')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.underground}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.bedroom')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.bedroom}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.completion_date')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={i18n.strftime(
                    new Date(product.data.buildingCompletionDate),
                    '%Y-%m-%d',
                  )}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.total_parking_available')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.totalParkingAvailable}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.air_conditioning')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.airConditioning}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.heating')}
                  style={{ color: '#626368' }}
                />
                <P3Text
                  label={productDescription.heating}
                  style={{ color: '#1c1c1c' }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={i18n.t('product_highlight.security_facilities')}
                  style={{ color: '#626368', flex: 1 }}
                />
                <P3Text
                  label={productDescription.securityFacilities}
                  style={{ color: '#1c1c1c', flex: 4, textAlign: 'right' }}
                />
              </DesView>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          padding: 20,
          borderBottomColor: '#F6F6F8',
          borderBottomWidth: 5,
          marginBottom: 20,
        }}>
        <H3Text
          label={i18n.t('product_label.product_info')}
          style={{ marginBottom: 15 }}
        />
        <View>
          <TouchableOpacity
            onPress={() => setState({ ...state, abstract: !state.abstract })}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <P1Text
                label={i18n.t('product_label.abstract')}
                style={{ marginVertical: 10 }}
              />
              <Image
                source={require('../images/downbutton.png')}
                style={[
                  {
                    marginTop: 14,
                  },
                  {
                    transform: [{ rotate: state.abstract ? '180deg' : '0deg' }],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
        {state.abstract && (
          <View style={{ paddingTop: 10 }}>
            <P3Text
              label={productDescription.summary}
              style={{ color: '#1c1c1c', lineHeight: 25 }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default WrappedInfo;
