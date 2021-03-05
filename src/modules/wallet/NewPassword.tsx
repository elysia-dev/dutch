import React, { FunctionComponent, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { P1Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';

const NewPassword: FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={true}
      title="New Password"
      backButtonHandler={() => navigation.goBack()}
      body={
        <>
          <View
            style={{
              paddingLeft: '5%',
              // paddingBottom: 20,
              borderBottomWidth: 5,
              borderBottomColor: '#F6F6F8',
            }}>
            <P1Text
              label={'New Password'} style={{ color: '#a7a7a7', marginTop: 20, marginBottom: 5 }}
            />
          </View>
        </>
      }
    />
  );
};

export default NewPassword;