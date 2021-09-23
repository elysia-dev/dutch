import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { H3Text, H4Text } from './Texts';
import BackButtonImg from '../assets/images/backbutton.png';

interface Iprops {
  title: string;
}

const SheetHeader: React.FC<Iprops> = ({ title }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 70 : 40,
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={BackButtonImg}
          style={{
            width: 30,
            height: 30,
            left: -6,
            top: -4,
          }}
        />
      </TouchableOpacity>
      <H3Text label={title} style={{ left: -8 }} />
      <View style={{ width: 20 }} />
    </View>
  );
};

export default SheetHeader;
