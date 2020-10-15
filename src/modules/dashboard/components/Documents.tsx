import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import i18n from '../../../i18n/i18n';
import { DocsResponse } from '../../../types/Docs';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
`;

interface Props {
  docs: DocsResponse;
}

const documentButton = (title: string, handler: () => void) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#3679B538',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 7,
        width: 100,
        height: 95,
        padding: 10,
        paddingTop: 15,
      }}>
      <GText>{title}</GText>
      <View
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          width: 15,
          height: 5,
          borderRadius: 1,
          backgroundColor: '#3679B5',
        }}></View>
    </TouchableOpacity>
  );
};

const Documents: FunctionComponent<Props> = (props: Props) => {
  const shareholderCertificate = [
    {
      url: props.docs.shareholderCertificate,
      width: 300,
      height: 300,
      props: {
        source: { uri: props.docs.shareholderCertificate },
      },
    },
  ];
  const leaseContract = [
    {
      url: props.docs.leaseContract,
      props: {
        source: { uri: props.docs.leaseContract },
      },
    },
  ];
  const stakeCertificate = [
    {
      url: props.docs.stakeCertificate,
      props: {
        source: { uri: props.docs.stakeCertificate },
      },
    },
  ];
  const [state, setState] = useState({
    showShareholderCertificate: false,
    showLeaseContract: false,
    showStakeCertificate: false,
  });
  return (
    <View
      style={{
        marginTop: 20,
        width: '100%',
        height: 190,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#3679B538',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 7,
        padding: 15,
        paddingTop: 20,
      }}>
      <H1Text>{i18n.t('dashboard_label.document')}</H1Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {props.docs.shareholderCertificate !== '' && (
          <View>
            {documentButton(
              i18n.t('dashboard_label.shareholder_document'),
              () => setState({ ...state, showShareholderCertificate: true }),
            )}
            <Modal
              visible={state.showShareholderCertificate}
              transparent={true}>
              <ImageViewer
                imageUrls={shareholderCertificate}
                renderArrowRight={() => (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 60,
                      opacity: 0.7,
                      position: 'relative',
                      top: -(Dimensions.get('window').height * 0.4),
                      marginLeft: 'auto',
                    }}
                    onPress={() =>
                      setState({ ...state, showShareholderCertificate: false })
                    }>
                    <Image
                      source={require('../images/quitbutton.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'center',
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </Modal>
          </View>
        )}
        {props.docs.leaseContract !== '' && (
          <View>
            {documentButton(i18n.t('dashboard_label.lease_document'), () =>
              setState({ ...state, showLeaseContract: true }),
            )}
            <Modal visible={state.showLeaseContract} transparent={true}>
              <ImageViewer
                imageUrls={leaseContract}
                renderArrowRight={() => (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 60,
                      opacity: 0.7,
                      position: 'relative',
                      top: -(Dimensions.get('window').height * 0.4),
                      marginLeft: 'auto',
                    }}
                    onPress={() =>
                      setState({ ...state, showLeaseContract: false })
                    }>
                    <Image
                      source={require('../images/quitbutton.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'center',
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </Modal>
          </View>
        )}
        {props.docs.stakeCertificate !== '' && (
          <View>
            {documentButton(i18n.t('dashboard_label.stake_document'), () =>
              setState({ ...state, showStakeCertificate: true }),
            )}
            <Modal visible={state.showStakeCertificate} transparent={true}>
              <ImageViewer
                imageUrls={stakeCertificate}
                renderArrowRight={() => (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 60,
                      opacity: 0.7,
                      position: 'relative',
                      top: -(Dimensions.get('window').height * 0.4),
                      marginLeft: 'auto',
                    }}
                    onPress={() =>
                      setState({ ...state, showStakeCertificate: false })
                    }>
                    <Image
                      source={require('../images/quitbutton.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'center',
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </Modal>
          </View>
        )}
      </View>
    </View>
  );
};

export default Documents;