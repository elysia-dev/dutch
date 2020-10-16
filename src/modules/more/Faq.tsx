import React, { FunctionComponent, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { FaqItem } from './components/FaqItem';

const Faq: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    selectNumber: 0,
  });
  const setQuestionNumber = (arrayNum: number) => {
    // eslint-disable-next-line no-unused-expressions
    state.selectNumber !== arrayNum
      ? setState({ selectNumber: arrayNum })
      : setState({ selectNumber: 0 });
  };
  const ItemListing = Array(10)
    .fill(0)
    .map((_x, index) => {
      return (
        <FaqItem
          faqId={index + 1}
          handler={() => setQuestionNumber(index)}
          question={i18n.t('FAQ.question.' + index)}
          answer={i18n.t('FAQ.answer.' + index)}
          isSelected={state.selectNumber === index}
        />
      );
    });
  return (
    <WrapperLayout
      isScrolling={true}
      backButtonHandler={() => {
        navigation.goBack();
      }}
      title={i18n.t('more_label.faq')}
      body={ItemListing}
    />
  );
};

export default Faq;
