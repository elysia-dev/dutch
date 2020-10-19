import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
import { KycStatus } from '../../enums/KycStatus';
import { KycPage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import RootContext from '../../contexts/RootContext';

type ButtonProps = {
  title: string;
  ableToMove?: boolean;
  color: boolean;
};

const StatusButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={props.ableToMove ? () => { navigation.navigate("Kyc", { screen: KycPage.StartKYC }); } : () => { }} style={{ width: "100%", height: 50, padding: 15, marginBottom: 20, borderRadius: 5, borderWidth: 1, borderColor: props.color ? "#3679B5" : "#D0D8DF" }}>
      <Text style={{ color: props.color ? "#1C1C1C" : "#A7A7A7", fontSize: 15, fontWeight: props.color ? "bold" : "normal", alignItems: 'center' }}>{props.title}</Text>
    </TouchableOpacity >
  );
};

const PreparingInvestment: FunctionComponent = () => {
  const navigation = useNavigation();
  const { kycStatus, ethAddresses } = useContext(RootContext).user;

  return (
    <View style={{ backgroundColor: "#fff", width: '100%', height: "100%", padding: 20 }}>
      <BackButton
        style={{ marginTop: 10 }}
        handler={() => navigation.goBack()}
      />
      { (kycStatus === KycStatus.SUCCESS && ethAddresses !== null)
        &&
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: -10 }}
          fallSpeed={3000}
          fadeOut={true}
        />
      }
      <H1Text label={i18n.t('dashboard.prepare_investment')}></H1Text>
      <PText label={i18n.t('dashboard.need_kyc_wallet')} style={{ marginTop: 10 }}></PText>
      <View style={{ marginTop: 30, width: "100%" }}>
        <StatusButton title={`${i18n.t(`more_label.${kycStatus}_kyc`)}`} ableToMove={kycStatus === KycStatus.REJECTED || kycStatus === KycStatus.NONE} color={(kycStatus === KycStatus.PENDING || kycStatus === KycStatus.SUCCESS)}></StatusButton>
        <StatusButton title={ethAddresses === null ? i18n.t('dashboard.no_wallet') : i18n.t('dashboard.wallet_connected')} color={ethAddresses !== null}></StatusButton>
      </View>

      <SubmitButton title={
        (kycStatus === KycStatus.SUCCESS && ethAddresses !== null) ?
          i18n.t('dashboard.event_guide_EL') : i18n.t('dashboard.complete_prepare')}
        handler={() => { }}
        style={{
          width: '100%',
          position: "absolute",
          bottom: 20,
          backgroundColor: (kycStatus === KycStatus.SUCCESS && ethAddresses !== null) ? "#3679B5" : "#D0D8DF",
        }} />
    </View>);
};

export default PreparingInvestment;
