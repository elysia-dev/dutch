import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import base64 from 'base-64';
import { useTranslation } from 'react-i18next'
import { Item } from './components/Item';
import { PostItem } from './components/PostItem';
import Product, { Story } from '../../types/product';
import ExpandedCard from './components/ExpandedCard';
import VirtualTab from '../../shared/components/VirtualTab';
import { H1Text } from '../../shared/components/Texts';
import PreferenceContext from '../../contexts/PreferenceContext';
import LocaleType from '../../enums/LocaleType';
import UserContext from '../../contexts/UserContext';
import { Page, ProductPage } from '../../enums/pageEnum';
import useSafeAsync from '../../utiles/useSafeAsync';

interface State {
  stories: Story[];
  products: Product[];
  activeStory?: Story;
  xOffset: number;
  yOffset: number;
}

type ParamList = {
  MainList: {
    refresh?: boolean;
  };
};

const MainList: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    stories: [],
    products: [],
    xOffset: 0,
    yOffset: 0,
  });
  const safeAsync = useSafeAsync();

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'MainList'>>();
  const refresh = route.params;
  const { Server } = useContext(UserContext);
  const { t } = useTranslation();
  const { language } = useContext(PreferenceContext);

  const ref = React.useRef<ScrollView>(null);
  useScrollToTop(ref);

  useEffect(() => {
    safeAsync(Server.storyList(language || LocaleType.EN))
      .then((res: any) => {
        setState({ ...state, stories: res.data });

        safeAsync(Server.products()).then((res: any) => {
          setState((state) => {
            return {
              ...state,
              products: res.data.filter(
                (product: { status: string; }) => product.status === 'terminated',
              ),
            };
          });
        });
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  }, [language, safeAsync]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (ref.current !== null) {
  //       ref.current.scrollTo({ y: 0 });
  //     }
  //   }, []),
  // );

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: !state.activeStory,
    })
    StatusBar.setHidden(!!state.activeStory);
  }, [state.activeStory])

  useEffect(() => {
    if (refresh) {
      ref.current?.scrollTo({ y: 0, animated: false });
    }
  }, [refresh]);

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
        <SafeAreaView>
          <View
            // onStartShouldSetResponder={() => true}
            style={{
              borderBottomColor: '#F6F6F8',
              borderBottomWidth: 5,
              paddingLeft: '5%',
              paddingRight: '5%',
              paddingBottom: 35,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                shadowOffset: { width: 1, height: 1 },
                shadowColor: '#00000033',
                paddingTop: Platform.OS === 'android' ? 65 : 45,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between"
              }}>
              <H1Text
                style={{
                  textAlign: 'left',
                  marginBottom: 30,
                }}
                label={t('product_label.product')}
              />
              <TouchableOpacity 
                style={{
                  alignSelf: "center",
                  marginBottom: 30,
                  alignContent: "flex-end"
                }}
                onPress={() => {
                  navigation.navigate(Page.Product, {
                    screen: ProductPage.PropertyInfomation,
                  })
                }}
              >
                <Image 
                  source={require("./images/infomation.png")}
                  style={{
                    width: 20,
                    height: 20
                  }}
                />
              </TouchableOpacity>
            </View>
            {state.stories.map((story, index) => (
              <Item
                story={story}
                key={`item-${index}`}
                activateCard={(xOffset, yOffset) => {
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
                <PostItem
                  key={`terminated-product-${index}`}
                  product={product}
                />
              );
            })}
          </View>
          <VirtualTab />
        </SafeAreaView>
      </ScrollView>
      {state.stories.map((story, index) => (
        <ExpandedCard
          key={`card-${index}`}
          image={base64.encode(story.image)}
          on={
            (state.activeStory &&
              state.activeStory.productId === story.productId) ||
            false
          }
          story={story}
          deactivateStory={() => {
            StatusBar.setHidden(false);
            navigation.setOptions({
              tabBarVisible: true,
            });
            setState({
              ...state,
              activeStory: undefined,
            });
          }}
          xOffset={state.xOffset}
          yOffset={state.yOffset}
        />
      ))}
    </View>
  );
};

export default MainList;
