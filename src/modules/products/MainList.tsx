import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  View,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import Api from '../../api/product';
import { Item } from './components/Item';
import { Story } from '../../types/product';

interface State {
  stories: Story[];
  scrollY: Animated.Value;
}
const MainList: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    stories: [],
    scrollY: new Animated.Value(0),
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
      <Animated.View
        style={{
          backgroundColor: '#fff',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: state.scrollY.interpolate({
            inputRange: [0, 15, 1000],
            outputRange: [0, 0.5, 0.5],
          }),
          paddingTop: 60,
          paddingBottom: 15,
          paddingLeft: 20,
          transform: [
            {
              translateY: state.scrollY.interpolate({
                inputRange: [0, 15, 1000],
                outputRange: [0, -5, -5],
              }),
            },
          ],
        }}>
        <Animated.Text
          style={{
            position: 'relative',
            left: 0,
            width: 50,
            color: '#1c1c1c',
            fontSize: 28,
            transform: [
              {
                scale: state.scrollY.interpolate({
                  inputRange: [-1000, 0, 15, 1000],
                  outputRange: [1, 1, 0.9, 0.9],
                }),
              },
            ],
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {i18n.t('product_label.product')}
        </Animated.Text>
      </Animated.View>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: state.scrollY } },
            },
          ],
          { useNativeDriver: true },
        )}
        style={{ width: '100%', padding: 20, paddingTop: 0 }}>
        {
          state.stories.map((product, index) => (
            <Item story={product} key={`item-${index}`} activeCard={() => { }} />
          ))
        }
      </Animated.ScrollView>
    </View>
  );
};

export default MainList;
