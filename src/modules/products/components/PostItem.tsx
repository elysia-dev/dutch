import React, { createRef, FunctionComponent, useState } from 'react';
import {
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import { H1Text, P1Text } from '../../../shared/components/Texts';
import { Story } from '../../../types/product';

interface Props {
  story?: Story;
  active?: boolean;
  activateCard?: (pageX: number, pageY: number) => void;
}

export const PostItem: FunctionComponent<Props> = (props: Props) => {
  // const ref = createRef<Image>();

  return (
    <View style={{
      height: 200,
      marginTop: 20,
    }}>
      <ImageBackground source={{ uri: ('https://elysia-public.s3.ap-northeast-2.amazonaws.com/assets/3/1.jpg') }} style={{ flex: 1, justifyContent: "center" }} imageStyle={{ borderRadius: 10 }}>
        <View style={{ backgroundColor: "#1c1c1ccc", flex: 1, borderRadius: 10 }}>
          <View style={{ margin: 20, flex: 1 }}>
            <P1Text style={{ position: "absolute", color: "#FFF" }} label={'ELYSIA Asset_RED #1'} />
            <H1Text style={{
              flex: 1,
              textAlign: 'center',
              color: "#Fff",
              textAlignVertical: "center",
              }}
              label={'CLOSED'}
              />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
