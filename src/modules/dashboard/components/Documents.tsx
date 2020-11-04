import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import i18n from '../../../i18n/i18n';
import { DocsResponse } from '../../../types/Docs';
import { H3Text, P1Text } from '../../../shared/components/Texts';

interface Props {
  docs: DocsResponse;
}

const documentButton = (title: string, handler: () => void) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        elevation: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#3679B538',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 7,
        elevation: 4,
        width: 100,
        height: 95,
        padding: 10,
        paddingTop: 15,
      }}>
      <P1Text label={title} style={{ color: '#626368' }} />
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
        elevation: 5,
        padding: 15,
        paddingTop: 20,
        elevation: 2,
      }}>
      <H3Text label={i18n.t('dashboard_label.document')} />
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
              transparent={false}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                }}>
                {Platform.OS === 'android' && (
                  <View
                    style={{
                      width: '100%',
                      height: 50,
                      position: 'absolute',
                      top: 0,
                    }}>
                    <TouchableOpacity
                      style={{
                        zIndex: 15,
                        width: 30,
                        height: 30,
                        opacity: 0.7,
                        position: 'relative',
                        top: 30,
                        marginLeft: 'auto',
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setState({
                          ...state,
                          showShareholderCertificate: false,
                        });
                      }}>
                      <Image
                        source={require('../images/quitbutton.png')}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <ImageViewer
                  imageUrls={shareholderCertificate}
                  renderArrowRight={() =>
                    Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        style={{
                          zIndex: 10,
                          width: 30,
                          height: 30,
                          opacity: 0.7,
                          position: 'relative',
                          top: -(Dimensions.get('window').height * 0.4),
                          marginLeft: 'auto',
                          marginRight: 10,
                        }}
                        onPress={() => {
                          setState({
                            ...state,
                            showShareholderCertificate: false,
                          });
                        }}>
                        <Image
                          source={require('../images/quitbutton.png')}
                          style={{
                            width: 30,
                            height: 30,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View />
                    )
                  }
                />
              </View>
            </Modal>
          </View>
        )}
        {props.docs.leaseContract !== '' && (
          <View>
            {documentButton(i18n.t('dashboard_label.lease_document'), () =>
              setState({ ...state, showLeaseContract: true }),
            )}
            <Modal visible={state.showLeaseContract} transparent={false}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                }}>
                {Platform.OS === 'android' && (
                  <View
                    style={{
                      width: '100%',
                      height: 50,
                      position: 'absolute',
                      top: 0,
                    }}>
                    <TouchableOpacity
                      style={{
                        zIndex: 15,
                        width: 30,
                        height: 30,
                        opacity: 0.7,
                        position: 'relative',
                        top: 30,
                        marginLeft: 'auto',
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setState({
                          ...state,
                          showLeaseContract: false,
                        });
                      }}>
                      <Image
                        source={require('../images/quitbutton.png')}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <ImageViewer
                  imageUrls={leaseContract}
                  renderArrowRight={() =>
                    Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        style={{
                          width: 30,
                          height: 30,
                          opacity: 0.7,
                          position: 'relative',
                          top: -(Dimensions.get('window').height * 0.4),
                          marginLeft: 'auto',
                          marginRight: 10,
                        }}
                        onPress={() =>
                          setState({ ...state, showLeaseContract: false })
                        }>
                        <Image
                          source={require('../images/quitbutton.png')}
                          style={{
                            width: 30,
                            height: 30,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View />
                    )
                  }
                />
              </View>
            </Modal>
          </View>
        )}
        {props.docs.stakeCertificate !== '' && (
          <View>
            {documentButton(i18n.t('dashboard_label.stake_document'), () =>
              setState({ ...state, showStakeCertificate: true }),
            )}
            <Modal visible={state.showStakeCertificate} transparent={false}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                }}>
                {Platform.OS === 'android' && (
                  <View
                    style={{
                      width: '100%',
                      height: 50,
                      position: 'absolute',
                      top: 0,
                    }}>
                    <TouchableOpacity
                      style={{
                        zIndex: 15,
                        width: 30,
                        height: 30,
                        opacity: 0.7,
                        position: 'relative',
                        top: 30,
                        marginLeft: 'auto',
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setState({
                          ...state,
                          showStakeCertificate: false,
                        });
                      }}>
                      <Image
                        source={require('../images/quitbutton.png')}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <ImageViewer
                  imageUrls={stakeCertificate}
                  renderArrowRight={() =>
                    Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        style={{
                          width: 30,
                          height: 30,
                          opacity: 0.7,
                          position: 'relative',
                          top: -(Dimensions.get('window').height * 0.4),
                          marginLeft: 'auto',
                          marginRight: 10,
                        }}
                        onPress={() =>
                          setState({ ...state, showStakeCertificate: false })
                        }>
                        <Image
                          source={require('../images/quitbutton.png')}
                          style={{
                            width: 30,
                            height: 30,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View />
                    )
                  }
                />
              </View>
            </Modal>
          </View>
        )}
      </View>
    </View>
  );
};

export default Documents;
