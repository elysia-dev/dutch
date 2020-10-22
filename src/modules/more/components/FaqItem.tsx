import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';

import styled from 'styled-components/native';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import UpperArrowPng from '../images/upperArrow.png';
import lowerArrowPng from '../images/lowerArrow.png';

interface Props {
  faqId: number;
  handler: any;
  question: string;
  answer: string;
  isSelected: boolean;
}
const QuestionWrapper = styled.TouchableOpacity`
  flex-direction: row;
  padding: 20px 5%;
  height: 68px;
`;
const AnswerWrapper = styled.View`
  background-color: #f6f6f8;
  padding: 20px 5%;
`;
const ArrowImg = styled.Image`
  width: 10px;
  height: 6px;
`;

export const FaqItem: FunctionComponent<Props> = (props: Props) => {
  const [state, setIdValue] = useState({
    selectID: '',
  });
  const ZeroFill = (num: string) => {
    // eslint-disable-next-line no-unused-expressions
    num.length === 1 ? (state.selectID = '0' + num) : (state.selectID = num);
    return state.selectID;
  };
  return (
    <View>
      <QuestionWrapper onPress={props.handler} style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: "center",
          }}>
        <H3Text
          label={ZeroFill(props.faqId.toString())}
          style={{
            flex: 1,
            fontSize: 15,
            color: props.faqId <= 3 ?
              '#3679B5' : "1c1c1c",
          }}
        />
        <H3Text label={props.question} style={{ flex: 10, fontSize: 15 }} />
        <ArrowImg source={props.isSelected ? UpperArrowPng : lowerArrowPng} />
      </QuestionWrapper>
      {props.isSelected && (
        <AnswerWrapper>
          <P1Text label={props.answer} style={{ fontSize: 13 }} />
        </AnswerWrapper>
      )}
    </View>
  );
};
