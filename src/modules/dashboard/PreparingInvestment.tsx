import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { SubTitleText, P1Text, TitleText } from '../../shared/components/Texts';
import { KycStatus } from '../../enums/KycStatus';
import { KycPage, MorePage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import RootContext from '../../contexts/RootContext';

type ButtonProps = {
  title: string;
  color: boolean;
  onPress: () => void;
};

const StatusButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.color}
      style={{
        width: '100%',
        height: 50,
        padding: 15,
        marginBottom: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: props.color ? '#3679B5' : '#D0D8DF',
      }}>
      <Text
        allowFontScaling={false}
        style={{
          color: props.color ? '#1C1C1C' : '#A7A7A7',
          fontSize: 15,
          fontFamily: props.color ? 'Roboto_700Bold' : 'Roboto_400Regular',
          alignItems: 'center',
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const PreparingInvestment: FunctionComponent = () => {
  const navigation = useNavigation();
  const { kycStatus, ethAddresses } = useContext(RootContext).user;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        padding: 20,
      }}>
      <BackButton
        style={{ marginTop: 10 }}
        handler={() => navigation.goBack()}
      />
      {kycStatus === KycStatus.SUCCESS && ethAddresses !== null && (
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: -10 }}
          fallSpeed={3000}
          fadeOut={true}
        />
      )}
      <TitleText label={i18n.t('dashboard.prepare_investment')} />
      <SubTitleText
        label={i18n.t('dashboard.need_kyc_wallet')}
        style={{ marginTop: 10 }}
      />
      <View style={{ marginTop: 30, width: '100%' }}>
        <StatusButton
          title={`${i18n.t(`more_label.${kycStatus}_kyc`)}`}
          color={
            kycStatus === KycStatus.PENDING || kycStatus === KycStatus.SUCCESS
          }
          onPress={() => {
            if ([KycStatus.REJECTED, KycStatus.NONE].includes(kycStatus)) {
              navigation.navigate('Kyc', { screen: KycPage.StartKYC });
            }
          }}
        />
        <StatusButton
          title={
            ethAddresses?.length > 0
              ? i18n.t('dashboard.wallet_connected')
              : i18n.t('dashboard.no_wallet')
          }
          color={ethAddresses?.length > 0}
          onPress={() => {
            if (!(ethAddresses?.length > 0)) {
              navigation.navigate('More', {
                screen: MorePage.RegisterEthAddress,
              });
            }
          }}
        />
      </View>

      <SubmitButton
        disabled={!(kycStatus === KycStatus.SUCCESS && ethAddresses !== null)}
        title={
          kycStatus === KycStatus.SUCCESS && ethAddresses !== null
            ? i18n.t('dashboard.event_guide_EL')
            : i18n.t('dashboard.complete_prepare')
        }
        handler={() => {}}
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 20,
          backgroundColor:
            kycStatus === KycStatus.SUCCESS && ethAddresses !== null
              ? '#3679B5'
              : '#D0D8DF',
        }}
      />
    </View>
  );
};

export default PreparingInvestment;
