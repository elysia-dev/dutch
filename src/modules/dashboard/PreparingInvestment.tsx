import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { SubTitleText, P1Text } from '../../shared/components/Texts';
import { KycStatus } from '../../enums/KycStatus';
import { KycPage, MorePage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import WrapperLayout from '../../shared/components/WrapperLayout';
import UserContext from '../../contexts/UserContext';

type ButtonProps = {
  title: string;
  color: boolean;
  onPress: () => void;
};

const StatusButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.color}
      style={{
        width: '90%',
        height: 50,
        padding: 15,
        marginBottom: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: props.color ? '#3679B5' : '#D0D8DF',
        justifyContent: 'center',
        alignContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
      <P1Text
        style={{
          color: props.color ? '#1C1C1C' : '#A7A7A7',
          fontFamily: props.color ? 'Roboto_700Bold' : 'Roboto_400Regular',
          alignItems: 'center',
        }}
        label={props.title}
      />
    </TouchableOpacity>
  );
};

const PreparingInvestment: FunctionComponent = () => {
  const navigation = useNavigation();
  const { kycStatus, ethAddresses } = useContext(UserContext).user;
  const preparingCompletion =
    kycStatus === KycStatus.SUCCESS && ethAddresses?.length > 0;

  return (
    <WrapperLayout
      title={i18n.t('dashboard.prepare_investment')}
      subTitle={<SubTitleText label={i18n.t('dashboard.need_kyc_wallet')} />}
      backButtonHandler={() => navigation.goBack()}
      isScrolling={false}
      body={
        <>
          {preparingCompletion && Platform.OS === 'ios' && (
            <ConfettiCannon
              count={100}
              origin={{ x: -10, y: -100 }}
              fallSpeed={3000}
              fadeOut={true}
            />
          )}
          <View style={{ marginTop: 20, height: '100%' }}>
            <StatusButton
              title={`${i18n.t(`more_label.${kycStatus}_kyc`)}`}
              color={
                kycStatus === KycStatus.PENDING ||
                kycStatus === KycStatus.SUCCESS
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
        </>
      }
      button={
        <SubmitButton
          disabled={!preparingCompletion}
          title={
            preparingCompletion
              ? i18n.t('dashboard.invest_first_asset')
              : i18n.t('dashboard.complete_prepare')
          }
          handler={() => navigation.navigate('ProductsMain', { refresh: true })}
          style={{
            backgroundColor: preparingCompletion ? '#3679B5' : '#D0D8DF',
          }}
        />
      }
    />
  );
};

export default PreparingInvestment;
