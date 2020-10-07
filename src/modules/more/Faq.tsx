import React, { FunctionComponent, useContext, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { PText } from '../../shared/components/PText';
import { TitleText } from '../../shared/components/TitleText';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { FaqItem } from './components/FaqItem';
import { H1Text } from '../../shared/components/H1Text';
import Answer06Png from './images/answer06Img.png';

const Answer06Img = styled.Image``;

const Faq: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    selectNumber: '',
  });
  const setQuestionNumber = (text: string) => {
    // eslint-disable-next-line no-unused-expressions
    state.selectNumber !== text
      ? setState({ selectNumber: text })
      : setState({ selectNumber: '' });
  };
  return (
    <WrapperLayout
      isScrolling={true}
      isBackbutton={true}
      title={
        <>
          <BackButton
            handler={() => {
              navigation.goBack();
            }}
          />
          <TitleText label={i18n.t('more_label.faq')} />
        </>
      }
      body={
        <>
          <FaqItem
            faqId={'01'}
            handler={() => setQuestionNumber('01')}
            question={i18n.t('FAQ.question.0')}
            answer={<PText label={i18n.t('FAQ.answer.01')} />}
            isSelected={state.selectNumber === '01'}
          />
          <FaqItem
            faqId={'02'}
            handler={() => setQuestionNumber('02')}
            question={i18n.t('FAQ.question.1')}
            answer={<PText label={i18n.t('FAQ.answer.02')} />}
            isSelected={state.selectNumber === '02'}
          />
          <FaqItem
            faqId={'03'}
            handler={() => setQuestionNumber('03')}
            question={i18n.t('FAQ.question.2')}
            answer={<PText label={i18n.t('FAQ.answer.03')} />}
            isSelected={state.selectNumber === '03'}
          />
          <FaqItem
            faqId={'04'}
            handler={() => setQuestionNumber('04')}
            question={i18n.t('FAQ.question.3')}
            answer={<PText label={i18n.t('FAQ.answer.04')} />}
            isSelected={state.selectNumber === '04'}
          />
          <FaqItem
            faqId={'05'}
            handler={() => setQuestionNumber('05')}
            question={i18n.t('FAQ.question.4')}
            answer={<PText label={i18n.t('FAQ.answer.05')} />}
            isSelected={state.selectNumber === '05'}
          />
          <FaqItem
            faqId={'06'}
            handler={() => setQuestionNumber('06')}
            question={i18n.t('FAQ.question.5')}
            answer={
              <>
                <PText label={i18n.t('FAQ.answer.06')} />
                <Answer06Img
                  source={Answer06Png}
                  style={{ resizeMode: 'center', width: '100%' }}
                />
                <PText label={i18n.t('FAQ.answer.06-1')} />
              </>
            }
            isSelected={state.selectNumber === '06'}
          />
          <FaqItem
            faqId={'07'}
            handler={() => setQuestionNumber('07')}
            question={i18n.t('FAQ.question.6')}
            answer={<PText label={i18n.t('FAQ.answer.07')} />}
            isSelected={state.selectNumber === '07'}
          />
        </>
      }
    />
  );
};

export default Faq;
