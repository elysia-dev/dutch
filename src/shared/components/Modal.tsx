import React, { FunctionComponent } from 'react';
import { Modal as RNModal, TouchableOpacity, View, Image } from 'react-native';
import QuitButtonImg from '../assets/images/quitbutton.png';
import AppColors from '../../enums/AppColors';

interface Props {
  visible: boolean;
  child: React.ReactNode;
  modalHandler: () => void;
}

export const Modal: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RNModal animationType="slide" transparent={true} visible={props.visible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: AppColors.WHITE,
              borderRadius: 20,
              alignItems: 'center',
              elevation: 10,
              width: '90%',
            }}
          >
            <TouchableOpacity
              onPress={props.modalHandler}
              style={{
                borderRadius: 20,
                alignSelf: 'flex-end',
                paddingTop: 20,
                paddingRight: 20,
                paddingBottom: 0,
                paddingLeft: 0,
              }}
            >
              <Image
                source={QuitButtonImg}
                style={{
                  width: 13,
                  height: 13,
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                paddingTop: 10,
                paddingBottom: 20,
                paddingHorizontal: 20,
              }}
            >
              {props.child}
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
};
