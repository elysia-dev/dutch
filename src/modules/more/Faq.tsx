import React, { FunctionComponent, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'
import WrapperLayoutAvoidingKeyboard from '../../shared/components/WrapperLayoutAvoidingKeyboard';
import { FaqItem } from './components/FaqItem';

const Faq: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    selectNumber: 0,
  });
  const { t } = useTranslation();

  const setQuestionNumber = (arrayNum: number) => {
    // eslint-disable-next-line no-unused-expressions
    state.selectNumber !== arrayNum
      ? setState({ selectNumber: arrayNum })
      : setState({ selectNumber: 0 });
  };

  const ItemListing = Array(5)
    .fill(0)
    .map((_x, index) => {
      return (
        <FaqItem
          key={`FAQ_${index}`}
          faqId={index + 1}
          handler={() => setQuestionNumber(index)}
          question={t('FAQ.question.' + index)}
          answer={t('FAQ.answer.' + index)}
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
      title={t('more_label.faq')}
      body={
        ItemListing
      }
    />
  );
};

export default Faq;
