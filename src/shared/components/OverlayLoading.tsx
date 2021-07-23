import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import AppColors from '../../enums/AppColors';

const OverlayLoading: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={'none'}
      style={{ zIndex: 1100 }}
      onRequestClose={() => {}}>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          height: '100%',
          zIndex: 999,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={AppColors.WHITE} />
        </View>
      </View>
    </Modal>
  );
};

export default OverlayLoading;
