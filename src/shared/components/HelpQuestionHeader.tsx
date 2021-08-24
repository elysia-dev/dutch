import { useNavigation } from '@react-navigation/native';
import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { H3Text, H4Text } from './Texts';
import BackButtonImg from '../assets/images/backbutton.png';
import HelpQuestionImg from '../assets/images/HelpQuestion.png';

interface Iprops {
  title: string;
  setIsGuideModal: Dispatch<React.SetStateAction<boolean>>;
}

const HelpQuestionHeader: React.FC<Iprops> = ({ title, setIsGuideModal }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 70 : 20,
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={BackButtonImg}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>
      <H3Text label={title} />
      <TouchableOpacity onPress={() => setIsGuideModal(true)}>
        <Image style={{ width: 18, height: 18 }} source={HelpQuestionImg} />
      </TouchableOpacity>
    </View>
  );
};

export default HelpQuestionHeader;
