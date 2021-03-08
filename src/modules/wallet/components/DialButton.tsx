import React, { FunctionComponent } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { H1Text } from '../../../shared/components/Texts';

interface IProps {
  value: string,
  pressHandler: () => void
}

const DialButton: FunctionComponent<IProps> = (props) => {
  return (
    <TouchableOpacity
      style={{ width: 40, height: 40 }}
      onPress={() => props.pressHandler()}
    >
      <H1Text label={props.value} style={{ textAlign: 'center' }} />
    </TouchableOpacity>
  );
};

export default DialButton;