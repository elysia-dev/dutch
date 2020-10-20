import React, { FunctionComponent, useState } from 'react';
import { SafeAreaView, View, Text, TextInput } from 'react-native';
import styled from 'styled-components/native';

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
      <Text
        style={{
          color: state.focus ? '#3679B5' : '#A7A7A7',
          fontSize: 15,
          textAlign: 'left',
          marginBottom: 10,
        }}>
        {i18n.t('more_label.contact_contents')}
      </Text>
      <TextInput
        value={props.contents}
        onChangeText={props.eventHandler}
        maxLength={1000}
        style={{
          backgroundColor: '#F6F6F8',
          borderColor: state.focus ? '#3679B5' : '#00000040',
          borderRadius: 10,
          borderWidth: 1,
          width: '100%',
          height: 150,
          fontSize: 14,
          padding: 10,
        }}
        scrollEnabled={true}
        textAlignVertical={'top'}
        multiline={true}
        onFocus={() => setState({ focus: true })}
        onBlur={() => setState({ focus: false })}></TextInput>
    </View>
  );
};
