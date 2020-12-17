import React, { FunctionComponent } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import i18n from '../../../i18n/i18n';
import { P1Text, H1Text } from '../../../shared/components/Texts';

interface Props {
  handler: () => void;
}

export const EventCard: FunctionComponent<Props> = (props) => {
  return (
    <TouchableOpacity onPress={props.handler} style={{ elevation: 10 }}>
      <View
        style={{
          width: '100%',
          height: 122,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#1C1C1C4D',
          shadowOpacity: 0.8,
          shadowRadius: 6,
          marginBottom: 25,
        }}>
        <Image
          source={require('../images/event_background.png')}
          style={{
            borderRadius: 10,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />
        <View
          style={{
            position: 'absolute',
            paddingHorizontal: 20,
            paddingTop: 15,
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'column',

              flex: 4,
              marginTop: 3,
            }}>
            <P1Text
              label={i18n.t('dashboard.how_get_EL')}
              style={{
                color: '#FFFFFF',
                fontSize: 15,
              }}
            />
            <H1Text
              label={i18n.t('dashboard.participate_event')}
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
                  width: 60,
                  height: 60,
                }}
                source={require('../images/event_icon.png')}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
