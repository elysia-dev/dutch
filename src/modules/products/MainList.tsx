import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  View,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import i18n from '../../i18n/i18n';
import Api from '../../api/product';
import { Item } from './components/Item';
import { Story } from '../../types/product';
import ExpendedCard from './components/ExpendedCard';

interface State {
  stories: Story[];
  activeStory?: Story;
  xOffset: number;
  yOffset: number;
}
const MainList: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    stories: [],
    xOffset: 0,
    yOffset: 0,
  });

  const navigation = useNavigation();

  useEffect(() => {
    Api.storyList()
      .then(res => {
        setState({ ...state, stories: res.data });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FFF',
      }}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        style={{ width: '100%', padding: 20, paddingTop: 0 }}>
        <Animated.View
          style={{
            backgroundColor: '#fff',
            shadowOffset: { width: 1, height: 1 },
            shadowColor: '#00000033',
            paddingTop: 60,
            paddingBottom: 15,
          }}>
          <Animated.Text
            style={{
              width: 50,
              color: '#1c1c1c',
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {i18n.t('product_label.product')}
          </Animated.Text>
        </Animated.View>
        {
          state.stories.map((story, index) => (
            <Item
              story={story}
              key={`item-${index}`}
              activateCard={(xOffset, yOffset) => {
                StatusBar.setHidden(true);
                navigation.setOptions({
                  tabBarVisible: false,
                });
                setState({
                  ...state,
                  activeStory: story,
                  xOffset,
                  yOffset,
                });
              }}
              active={
                (state.activeStory && state.activeStory.productId === story.productId)
                || false
              }
            />
          ))
        }
      </Animated.ScrollView>
      {state.activeStory &&
        <ExpendedCard
          story={state.activeStory}
          deactivateStory={() => {
            StatusBar.setHidden(false);
            navigation.setOptions({
              tabBarVisible: true,
            });
            setState({ ...state, activeStory: undefined });
          }}
          xOffset={state.xOffset}
          yOffset={state.yOffset}
        />}
    </View>
  );
};

export default MainList;
