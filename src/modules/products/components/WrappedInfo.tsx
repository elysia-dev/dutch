import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Product from '../../../types/product';
import { H3Text, P1Text, P3Text } from '../../../shared/components/Texts';
import commaFormatter from '../../../utiles/commaFormatter';
import PreferenceContext from '../../../contexts/PreferenceContext';
import LocaleType from '../../../enums/LocaleType';
import DesView from './DesView';
import AppColors from '../../../enums/AppColors';

interface Props {
  product: Product;
}

const WrappedInfo: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { language, currencyFormatter } = useContext(PreferenceContext);
  const [state, setState] = useState({
    financial: false,
    highlight: false,
    abstract: false,
  });

  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription =
    product.data.descriptions[language || LocaleType.EN];
  // TODO : Add null guard languages & descrptions
  const isLoan = product.financeType === 'loan';

  return (
    <View style={{ width: '100%', paddingBottom: 60 }}>
      <View
        style={{
          padding: 20,
          marginBottom: 20,
        }}>
        <H3Text
          label={t('product_label.property_info')}
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
                label={t('product_label.financials')}
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
                  label={t('product_financial.expected_annual_return')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={`${props.product.expectedAnnualReturn}%`}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t(
                    isLoan
                      ? 'product_financial.apr'
                      : 'product_financial.return_rent',
                  )}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={`${props.product.data.returnOnRent}%`}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_financial.return_sale')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={`${props.product.data.returnOnSale}%`}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t(
                    isLoan
                      ? 'product_financial.distribution_date'
                      : 'product_financial.rent_distribution',
                  )}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.monthlyRentIncomeDistributionCycle}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_financial.lockup_period')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.lockupPeriod}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t(
                    isLoan
                      ? 'product_financial.expiry'
                      : 'product_financial.expected_sale_date',
                  )}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.expectedSaleDate}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_financial.price')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={
                    isLoan
                      ? `₩ ${commaFormatter(
                          parseFloat(product.data.propertyPrice),
                        )}`
                      : currencyFormatter(
                          parseFloat(product.data.propertyPrice),
                          0,
                        )
                  }
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              {!isLoan && (
                <DesView>
                  <P3Text
                    label={t('product_financial.net_deposit')}
                    style={{ color: AppColors.BLACK2 }}
                  />
                  <P3Text
                    label={currencyFormatter(
                      parseFloat(product.data.netDeposit),
                      0,
                    )}
                    style={{ color: AppColors.BLACK }}
                  />
                </DesView>
              )}
              <DesView>
                <P3Text
                  label={t(
                    isLoan
                      ? 'product_financial.annual_return'
                      : 'product_financial.net_rent_year',
                  )}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={currencyFormatter(
                    parseFloat(product.data.netRentPerYear),
                    0,
                  )}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>

              <DesView>
                <P3Text
                  label={t('product_financial.bankloan')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={
                    isLoan
                      ? `₩ ${commaFormatter(parseFloat(product.data.bankLoan))}`
                      : currencyFormatter(parseFloat(product.data.bankLoan), 0)
                  }
                  style={{ color: AppColors.BLACK }}
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
                label={t('product_label.property_highlightes')}
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
                  label={t('product_highlight.type')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.propertyType}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.ground')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.ground}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.underground')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.underground}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              {productDescription.unit && (
                <DesView>
                  <P3Text
                    label={t('product_highlight.unit')}
                    style={{ color: AppColors.BLACK2 }}
                  />
                  <P3Text
                    label={productDescription.unit}
                    style={{ color: AppColors.BLACK }}
                  />
                </DesView>
              )}
              <DesView>
                <P3Text
                  label={t('product_highlight.bedroom')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.bedroom}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.completion_date')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={moment(product.data.buildingCompletionDate).format(
                    'YYYY-MM-DD',
                  )}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.total_parking_available')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.totalParkingAvailable}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.air_conditioning')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.airConditioning}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.heating')}
                  style={{ color: AppColors.BLACK2 }}
                />
                <P3Text
                  label={productDescription.heating}
                  style={{ color: AppColors.BLACK }}
                />
              </DesView>
              <DesView>
                <P3Text
                  label={t('product_highlight.security_facilities')}
                  style={{ color: AppColors.BLACK2, flex: 1 }}
                />
                <P3Text
                  label={productDescription.securityFacilities}
                  style={{
                    color: AppColors.BLACK,
                    flex: 4,
                    textAlign: 'right',
                  }}
                />
              </DesView>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default WrappedInfo;
