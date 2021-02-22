import React, { FunctionComponent, useContext } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CurrencyContext from '../../../contexts/CurrencyContext';
import i18n from '../../../i18n/i18n';
import { P1Text, H1Text } from '../../../shared/components/Texts';
import currencyFormatter from '../../../utiles/currencyFormatter';

interface Props {
  balance: string;
  handler: () => void;
}

export const BalanceCard: FunctionComponent<Props> = (props) => {
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);

  const balance = currencyFormatter(
    currencyUnit,
    currencyRatio,
    parseFloat(props.balance),
    2,
  );

  const fontSizeCalcurator = (length: number): number => {
    return 40 - 5 * Math.floor((length - 7) / 3);
  };

  return (
    <TouchableOpacity onPress={props.handler} style={{ elevation: 10 }}>
      <View
        style={{
          backgroundColor: '#3679B5',
          width: '100%',
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#3679B54D',
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
          marginBottom: 25,
        }}>
        <P1Text
          label={i18n.t('dashboard_label.total_balance')}
          style={{
            color: '#F6F6F8',
            marginBottom: 30,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
          }}>
          <H1Text
            label={balance}
            style={{
              flex: 4,
              color: '#FFFFFF',
              fontSize: fontSizeCalcurator(balance.length),
              alignSelf: 'center',
            }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 60,
                height: 60,
                borderRadius: 30,
                shadowOffset: { width: 0, height: 3 },
                shadowColor: '#1C1C1C4D',
                shadowOpacity: 0.8,
                shadowRadius: 6,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Image
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: 25,
                  height: 25,
                }}
                source={require('../images/chart.png')}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
