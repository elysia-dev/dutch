import React, { Component, FunctionComponent } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import i18n from '../../i18n/i18n';
import { ProductPage } from '../../enums/pageEnum';
import Api from '../../api/product';
import { Item } from './components/Item';
import Product, { Story } from '../../types/product';

interface Props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface State {
  storyList: Story[];
  scrollY: Animated.Value;
}

export class MainList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyList: [],
      scrollY: new Animated.Value(0),
    };
  }

  callApi() {
    const { navigation } = this.props;

    Api.storyList()
      .then(res => {
        this.setState({ storyList: res.data });
        console.log(this.state.storyList);
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  }

  componentDidMount() {
    this.callApi();
  }

  render() {
    const { navigation, route } = this.props;
    const { scrollY } = this.state;
    const listToShow = this.state.storyList.map((product, index) => (
      <Item story={product} key={`item-${index}`} pressHandler={() =>
        navigation.navigate('Product', {
          screen: ProductPage.ProductStory,
          params: {
            product,
          },
        })
      } />
    ));
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
            shadowOpacity: scrollY.interpolate({
              inputRange: [0, 15, 1000],
              outputRange: [0, 0.5, 0.5],
            }),
            paddingTop: 60,
            paddingBottom: 15,
            paddingLeft: 20,
            transform: [
              {
                translateY: scrollY.interpolate({
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
                  scale: scrollY.interpolate({
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
                nativeEvent: { contentOffset: { y: this.state.scrollY } },
              },
            ],
            { useNativeDriver: true },
          )}
          style={{ width: '100%', padding: 20, paddingTop: 0 }}>
          {listToShow}
        </Animated.ScrollView>
      </View>
    );
  }
}
