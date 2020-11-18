import React, { FunctionComponent } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import i18n from '../../../i18n/i18n';
import { P1Text, H1Text } from '../../../shared/components/Texts';

interface Props {
  balance: number;
  handler: () => void;
}

export const WithdrawalCard: FunctionComponent<Props> = (props) => {
  return (
    <TouchableOpacity onPress={props.handler} style={{ elevation: 10 }}>
      <View
        style={{
          backgroundColor: '#7A7D8D',
          width: '100%',
          height: 122,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#1C1C1C4D',
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
          marginBottom: 25,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View style={{
            flexDirection: "column",
            flex: 4,
            marginTop: 3,
          }}>
            <P1Text
              label={'잔여 EL/USD 출금'}
              style={{
                color: '#FFFFFF',
                fontSize: 15,
              }}
            />
            <H1Text
              label={`$ ${(props.balance).toFixed(2)}`}
              style={{
                color: '#FFFFFF',
                fontSize: 25,
              }}
            />
          </View>
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
                source={require('../images/Wallet.png')}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#FC5C4F',
                }} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
