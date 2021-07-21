import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next'
import { P1Text } from './Texts';
import AppColors from '../../enums/AppColors';

type Props = React.PropsWithChildren<{
  modalVisible: boolean;
  doneHandler: () => void;
  cancelHandler?: () => void;
  buttonNumber: number;
}>;

const IosPickerModal: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={props.modalVisible}
      animationType={'slide'}
      transparent={true}>
      <View
        style={{
          backgroundColor: 'rgba(250,250,250,0.9)',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 245,
        }}>
        <View
          style={{
            zIndex: 3,
            backgroundColor: AppColors.WHITE,
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 45,
            flexDirection: 'row',
            justifyContent:
              props.buttonNumber === 2 ? 'space-between' : 'flex-end',
            alignItems: 'center',
            paddingHorizontal: '5%',
          }}>
          {props.buttonNumber === 2 && (
            <TouchableOpacity onPress={props.cancelHandler}>
              <P1Text
                label={t('more_label.close')}
                style={{ color: '#626368' }}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={props.doneHandler}>
            <P1Text
              label={t('more_label.done')}
              style={{ color: AppColors.MAIN }}
            />
          </TouchableOpacity>
        </View>
        {props.children}
      </View>
    </Modal>
  );
};

export default IosPickerModal;
