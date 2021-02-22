import React, { FunctionComponent, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import WrapperLayoutAvoidingKeyboard from '../../shared/components/WrapperLayoutAvoidingKeyboard';
import { FaqItem } from './components/FaqItem';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';

const Faq: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    selectNumber: 0,
  });

  const { user } = useContext(UserContext);

  const setQuestionNumber = (arrayNum: number) => {
    // eslint-disable-next-line no-unused-expressions
    state.selectNumber !== arrayNum
      ? setState({ selectNumber: arrayNum })
      : setState({ selectNumber: 0 });
  };

  const ItemListing = Array(7)
    .fill(0)
    .map((_x, index) => {
      return (
        <FaqItem
          key={`FAQ_${index}`}
          faqId={index + 1}
          handler={() => setQuestionNumber(index)}
          question={i18n.t('FAQ.question.' + index)}
          answer={i18n.t('FAQ.answer.' + index)}
          isSelected={state.selectNumber === index}
        />
      );
    });

  const ItemListingWithoutKyc = Array(7)
    .fill(0)
    .map((_x, index) => {
      const isAfterKyc = index === 5 || index === 6;
      const editedIndex = isAfterKyc ? index - 2 : index;
      return (
        <FaqItem
          key={`FAQ_${editedIndex}`}
          faqId={isAfterKyc ? index - 1 : index + 1}
          handler={() => setQuestionNumber(index)}
          question={i18n.t('FAQ.question.' + index)}
          answer={i18n.t('FAQ.answer.' + index)}
          isSelected={state.selectNumber === index}
        />
      );
    });

  return (
    <WrapperLayoutAvoidingKeyboard
      isScrolling={true}
      backButtonHandler={() => {
        navigation.goBack();
      }}
      title={i18n.t('more_label.faq')}
      body={
        user.provider === ProviderType.GUEST ||
        user.provider === ProviderType.ETH
          ? ItemListingWithoutKyc.slice(0, 3).concat(
              ItemListingWithoutKyc.slice(5),
            )
          : ItemListing
      }
    />
  );
};

export default Faq;
