import React, { Component, FunctionComponent } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import i18n from '../../i18n/i18n';
import { SortingButton } from './components/SortingButton';
import { ProductPage } from '../../enums/pageEnum';
import Api from '../../api/product';
import { Item } from './components/Item';
import Product, { Story } from '../../types/product';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  font-weight: bold;
  text-align: left;
`;

interface Props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface State {
  storyList: Story[];
}

export class MainList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyList: [],
    };
  }

  callApi() {
    const { navigation } = this.props;

    Api.productList()
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
    const listToShow = this.state.storyList.map((product, index) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Product', {
            screen: ProductPage.ProductStory,
            params: {
              product,
            },
          })
        }
        key={`item-${index}`}>
        <Item story={product} />
      </TouchableOpacity>
    ));
    return (
      <ScrollView scrollEnabled={true}>
        <View
          style={{
            width: '100%',
            height: '100%',
            padding: 20,
            backgroundColor: '#FFFFFF',
          }}>
          <View style={{ marginTop: 50, marginBottom: 15 }}>
            <H1Text>{i18n.t('product_label.product')}</H1Text>
          </View>
          <View>{listToShow}</View>
        </View>
      </ScrollView>
    );
  }
}
