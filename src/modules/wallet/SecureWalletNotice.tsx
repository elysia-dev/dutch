import React, { FunctionComponent, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Layout from './components/Layout';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from './components/NextButton';
import ConfirmBox from './components/ConfirmBox';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { P1Text } from '../../shared/components/Texts';
import CheckIcon from './components/CheckIcon';

const SecureWalletNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const [confirmed, setConfirm] = useState<boolean[]>([false, false]);

  return (
    <Layout>
      <ConfirmBox
        style={{ marginTop: 50 }}
        confirmed={confirmed[0]}
        toggleConfirm={() => { setConfirm([!confirmed[0], confirmed[1]]) }}
        title={'복구키 보관'}
        content={'복구키의 경우, 물리적으로 보관을 하는 것이 안전합니다. 종이에 적어서 안전한 곳에 보관해주시길 바랍니다.'}
      />
      <ConfirmBox
        style={{ marginTop: 20 }}
        confirmed={confirmed[1]}
        toggleConfirm={() => { setConfirm([confirmed[0], !confirmed[1]]) }}
        title={'복구키 분실'}
        content={'복구키의 경우, 물리적으로 보관을 하는 것이 안전합니다. 종이에 적어서 안전한 곳에 보관해주시길 바랍니다.'}
      />
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => {
          const next = confirmed[0] && confirmed[1]
          setConfirm([!next, !next])
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', marginRight: '5%' }}>
          <CheckIcon checked={confirmed[0] && confirmed[1]} />
          <P1Text style={{ marginLeft: 10 }} label={'위 사항을 충분히 이해하며, 지갑 생성에 동의함을 확인합니다.'} />
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={'다음'}
          disabled={!confirmed[0] || !confirmed[1]}
          style={{
            position: 'absolute',
          }}
          handler={() => navigation.navigate(WalletPage.BackupSeedPharase)}
        />
      </View>
    </Layout>
  );
};

export default SecureWalletNotice;