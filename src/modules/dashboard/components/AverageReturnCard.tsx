import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next'
import { P1Text, H2Text } from '../../../shared/components/Texts';

interface Props {
  return: string;
}

export const AverageReturnCard: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '99%',
        height: 98,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
        elevation: 1,
        marginLeft: 3,
        marginRight: 3,
      }}>
      <P1Text
        style={{ marginBottom: 10 }}
        label={t('dashboard_label.average_return')}
      />
      <H2Text
        style={{ marginBottom: 18 }}
        label={`${parseFloat(props.return).toFixed(4)} %`}
      />
    </View>
  );
};
