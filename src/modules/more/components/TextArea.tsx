import React, { FunctionComponent, useState } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { P3Text } from '../../../shared/components/Texts';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';

interface Props {
  eventHandler: (input: string) => void;
  contents: string;
}

export const TextArea: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    focus: false,
  });
  const { t } = useTranslation();

  return (
    <View>
      <P3Text
        style={{
          color: state.focus ? AppColors.MAIN : '#A7A7A7',
          textAlign: 'left',
          marginBottom: 15,
        }}
        label={t('more_label.contact_contents')}
      />
      <TextInput
        value={props.contents}
        onChangeText={props.eventHandler}
        maxLength={1000}
        allowFontScaling={false}
        style={{
          backgroundColor: AppColors.BACKGROUND_GREY,
          borderColor: state.focus ? AppColors.MAIN : AppColors.BLUE_2,
          borderRadius: 10,
          borderWidth: 1,
          width: '100%',
          height: 150,
          fontSize: 14,
          padding: 10,
          fontFamily: AppFonts.Regular,
        }}
        scrollEnabled={true}
        textAlignVertical={'top'}
        multiline={true}
        onFocus={() => setState({ focus: true })}
        onBlur={() => setState({ focus: false })}
      />
    </View>
  );
};
