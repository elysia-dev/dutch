import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Keyboard,
  TextInput,
  Image,
} from 'react-native';
import AppFonts from '../../enums/AppFonts';
import WarningImg from '../assets/images/warning.png';
import { P3Text } from './Texts';
import AppColors from '../../enums/AppColors';

interface Props {
  label: string;
  value?: string;
  editable?: boolean;
  onFocused?: boolean;
  autocapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  eventHandler: (text: string) => void;
  secure?: boolean;
  autoFocus?: boolean;
  placeHolder?: string;
  style?: StyleProp<ViewStyle>;
  helperText?: string;
  helperIcon?: string;
  focusHandler?: (value: boolean) => void;
}

export const TextField: FunctionComponent<Props> = ({
  onFocused = false,
  autocapitalize = 'none',
  focusHandler = () => {},
  ...props
}) => {
  const [focusing, setFocus] = useState(onFocused);

  useEffect(() => {
    // Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // cleanup function
    return () => {
      // Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  const keyboardDidHide = () => {
    setFocus(false);
    focusHandler(false);
  };

  return (
    <View style={props.style}>
      <P3Text
        label={props.label}
        style={{
          color:
            // eslint-disable-next-line no-nested-ternary
            props.helperText !== undefined
              ? '#C91725'
              : focusing === true
              ? AppColors.MAIN
              : '#A7A7A7',
          fontFamily: AppFonts.Regular,
        }}
      />
      <TextInput
        style={{
          borderBottomColor:
            // eslint-disable-next-line no-nested-ternary
            props.helperText !== undefined
              ? '#C91725'
              : focusing === true
              ? AppColors.MAIN
              : AppColors.BLUE_2,
          marginBottom: props.helperText !== undefined ? 0 : 20,
          color: props.editable === false ? '#A7A7A7' : AppColors.BLACK,
          fontFamily: AppFonts.Regular,
          width: '100%',
          height: 30,
          borderBottomWidth: 1,
        }}
        allowFontScaling={false}
        defaultValue={props.value}
        editable={props.editable}
        onChangeText={props.eventHandler}
        enablesReturnKeyAutomatically={false}
        secureTextEntry={props.secure}
        maxLength={50}
        autoCapitalize={autocapitalize}
        onBlur={() => {
          setFocus(false);
          focusHandler(false);
        }}
        onKeyPress={() => {
          setFocus(true);
          focusHandler(true);
        }}
        placeholder={props.placeHolder}
        onFocus={() => {
          setFocus(true);
          focusHandler(true);
        }}
      />
      {props.helperText !== undefined && (
        <View
          style={{
            flexDirection: 'row-reverse',
            paddingTop: 5,
            height: 30,
          }}>
          <P3Text
            label={props.helperText}
            style={{
              fontSize: 12,
              color: AppColors.BLACK,
              lineHeight: 15,
            }}
          />
          {(() => {
            switch (props.helperIcon) {
              case 'Error':
                return (
                  <Image
                    source={WarningImg}
                    style={{
                      marginTop: 1,
                      width: 12,
                      height: 12,
                      marginRight: 2,
                    }}
                  />
                );
              case 'Info':
              default:
                break;
            }
          })()}
        </View>
      )}
    </View>
  );
};
