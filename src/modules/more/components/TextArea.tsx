import React, { FunctionComponent, useState } from 'react';
import { View, TextInput } from 'react-native';
import { P3Text } from '../../../shared/components/Texts';
import { useTranslation } from 'react-i18next'
import AppFonts from '../../../enums/AppFonts';

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
          color: state.focus ? '#3679B5' : '#A7A7A7',
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
          backgroundColor: '#F6F6F8',
          borderColor: state.focus ? '#3679B5' : '#D0D8DF',
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
