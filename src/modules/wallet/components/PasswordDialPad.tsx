import React, { FunctionComponent, useEffect, useState } from 'react';
import { View } from 'react-native';
import { H2Text } from '../../../shared/components/Texts';
import DialButton from './DialButton';

interface IPasswordDialPad {
  nextHandler: (password: string) => void
}

const PasswordDialPad: FunctionComponent<IPasswordDialPad> = (props) => {
  const [password, setPassword] = useState<string>('');
  const [numbers] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (password.length >= 4) {
      props.nextHandler(password)
    }
  }, [password])

  return (
    <View>
      <View style={{ height: 50, alignItems: 'center' }}>
        <H2Text label={'*'.repeat(password.length)} style={{ textAlign: 'center' }} />
      </View>
      {
        [0, 1, 2].map((index) => {
          return (
            <View key={`DialLine${index}`} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 100 }}>
              {
                [0, 1, 2].map((index2) => {
                  const value = index * 3 + index2;
                  return <DialButton key={value} value={numbers[value].toString()} pressHandler={() => password.length < 4 && setPassword(password + numbers[value])} />
                })
              }
            </View>
          )
        })
      }
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', height: 100, alignItems: 'center' }}>
        <DialButton key={'dialNone'} value={''} pressHandler={() => { }} />
        <DialButton key={'dialLast'} value={numbers[9].toString()} pressHandler={() => setPassword(password + numbers[9])} />
        <DialButton key={'dialRemove'} value={'←'} pressHandler={() => setPassword(password.slice(0, -1))} />
      </View>
    </View>
  );
};

export default PasswordDialPad;