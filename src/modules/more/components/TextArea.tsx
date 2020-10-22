import React, { FunctionComponent, useState } from 'react';
import { SafeAreaView, View, TextInput } from 'react-native';
import { P1Text } from '../../../shared/components/Texts';

import i18n from '../../../i18n/i18n';

interface Props {
  eventHandler: (input: string) => void;
  contents: string;
}

export const TextArea: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    focus: false,
  });

  return (
    <View>
      <P1Text
        style={{
          color: state.focus ? '#3679B5' : '#A7A7A7',
          fontSize: 15,
          textAlign: 'left',
          marginBottom: 15,
        }}
        label={i18n.t('more_label.contact_contents')}
      />
      <TextInput
        value={props.contents}
        onChangeText={props.eventHandler}
        maxLength={1000}
        allowFontScaling={false}
        style={{
          backgroundColor: '#F6F6F8',
          borderColor: state.focus ? '#3679B5' : '#00000040',
          borderRadius: 10,
          borderWidth: 1,
          width: '100%',
          height: 150,
          fontSize: 14,
          padding: 10,
          fontFamily: 'Roboto_400Regular',
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
