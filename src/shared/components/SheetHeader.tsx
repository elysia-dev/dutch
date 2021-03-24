import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../enums/AppColors';
import { H3Text, H4Text } from './Texts';

interface Iprops {
  title: string,
}

const SheetHeader: React.FC<Iprops> = ({
  title
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: AppColors.BACKGROUND_GREY,
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 70 : 20
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <H4Text label={'취소'} style={{ color: AppColors.MAIN }} />
      </TouchableOpacity>
      <H3Text label={title} style={{}} />
      <View style={{ width: 20 }} />
    </View>
  )
}

export default SheetHeader