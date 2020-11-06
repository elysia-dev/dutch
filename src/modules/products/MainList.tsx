import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  Animated,
  StatusBar,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useScrollToTop,
} from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { Item } from './components/Item';
import { PostItem } from './components/PostItem';
import Product, { Story } from '../../types/product';
import ExpandedCard from './components/ExpandedCard';
import VirtualTab from '../../shared/components/VirtualTab';
import RootContext from '../../contexts/RootContext';

interface State {
  stories: Story[];
  products: Product[];
  activeStory?: Story;
  xOffset: number;
  yOffset: number;
}

const MainList: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    stories: [],
    products: [],
    xOffset: 0,
    yOffset: 0,
  });

  const navigation = useNavigation();
  const { Server, user } = useContext(RootContext);
  const ref = React.useRef<ScrollView>(null);
  useScrollToTop(ref);

  useEffect(() => {
    Server.storyList()
      .then((res) => {
        setState({ ...state, stories: res.data });
        Server.products().then((res) => {
          setState((state) => {
            return {
              ...state,
              products: res.data.filter(
                (product) => product.status === 'terminated',
              ),
            };
          });
        });
      })
      .catch((e) => {
        alert(e);
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }, [user.language]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (ref.current !== null) {
  //       ref.current.scrollTo({ y: 0 });
  //     }
  //   }, []),
  // );

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FFF',
      }}>
      <ScrollView
        scrollEnabled={!state.activeStory}
        ref={ref}
        style={{ width: '100%' }}>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            paddingLeft: '5%',
            paddingRight: '5%',
            paddingBottom: 35,
          }}>
          <Animated.View
            style={{
              backgroundColor: '#fff',
              shadowOffset: { width: 1, height: 1 },
              shadowColor: '#00000033',
              paddingTop: 93,
              paddingBottom: 15,
            }}>
            <Animated.Text
              allowFontScaling={false}
              style={{
                width: '100%',
                color: '#1c1c1c',
                fontSize: 28,
                textAlign: 'left',
                fontFamily: 'Roboto_700Bold',
              }}>
              {i18n.t('product_label.product')}
            </Animated.Text>
          </Animated.View>
          {state.stories.map((story, index) => (
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
                (state.activeStory &&
                  state.activeStory.productId === story.productId) ||
                false
              }
            />
          ))}
        </View>
        <View
          style={{
            width: '90%',
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: 25,
            marginBottom: 50,
          }}>
          {state.products.map((product, index) => {
            return (
              <PostItem key={`terminated-product-${index}`} product={product} />
            );
          })}
        </View>
        <VirtualTab />
      </ScrollView>
      {state.activeStory && (
        <ExpandedCard
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
        />
      )}
    </View>
  );
};

export default MainList;
