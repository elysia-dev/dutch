import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { H2Text, P1Text } from '../../shared/components/Texts';
import WaitingTxListItem from './components/WaitingTxListItem';
import BasicLayout from '../../shared/components/BasicLayout';
import { WaitingTransaction } from '../../types/WaitingTransaction';
import TransactionContext from '../../contexts/TransactionContext';

const WaitingTxList: FunctionComponent<{}> = () => {
  const { t } = useTranslation();
  const { waitingTxs } = useContext(TransactionContext);
  const [state, setState] = useState<WaitingTransaction[]>([]);
  const [page, setPage] = useState(1);

  const onPress = () => {
    if (waitingTxs.length / (10 * page) >= 1) {
      setPage((prev) => prev + 1);
      setState(waitingTxs.slice(0, 10 * (page + 1)));
    }
  };

  useEffect(() => {
    setState(waitingTxs.slice(0, 10 * (page + 1)));
  }, [waitingTxs]);
  return (
    <>
      <ScrollView
        style={{
          backgroundColor: AppColors.WHITE,
          height: '100%',
          width: '100%',
        }}>
        <SheetHeader title={''} />
        <BasicLayout>
          <View
            style={{
              width: '100%',
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: AppColors.GREY,
              marginBottom: 25.5,
            }}>
            <H2Text
              label={t('main.pending_transaction')}
              style={{ fontSize: 22 }}
            />
          </View>
          {waitingTxs?.length !== 0 &&
            state &&
            state.map((i, idx) => (
              <WaitingTxListItem key={idx} waitingTransaction={i} />
            ))}
          {waitingTxs.length !== 0 && waitingTxs.length / (10 * page + 1) >= 1 && (
            <TouchableOpacity
              style={{
                width: '100%',
                height: 50,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: AppColors.MAIN,
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: 15,
                marginBottom: 70,
              }}
              onPress={() => {
                onPress();
              }}>
              <P1Text
                style={{
                  color: AppColors.MAIN,
                  fontSize: 17,
                  textAlign: 'center',
                }}
                label={t('dashboard_label.more_transactions')}
              />
            </TouchableOpacity>
          )}
        </BasicLayout>
      </ScrollView>
    </>
  );
};
export default WaitingTxList;
