import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScrollView, View } from 'react-native';
import RootContext from '../../contexts/RootContext';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text } from '../../shared/components/Texts';
import { defaultDocsResponse } from '../../types/Docs';
import Product from '../../types/product';
import { Map } from '../products/components/Map';
import Documents from './components/Documents';
import OwnershipWrappedInfo from './components/OwnershipWrappedInfo';

type ParamList = {
  OwnershipProduct: {
    product: Product;
  };
};

const ProductData: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'OwnershipProduct'>>();
  const { product } = route.params;
  const [docs, setDocs] = useState(defaultDocsResponse);
  const { Server } = useContext(RootContext);
  const isDocumentempty =
    docs.leaseContract === '' &&
    docs.shareholderCertificate === '' &&
    docs.stakeCertificate === '';

  const callDocsApi = () => {
    Server.productDocs(product.id)
      .then((res) => {
        setDocs(res.data);
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    callDocsApi();
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: '#FAFCFF',
        width: '100%',
        height: '100%',
      }}>
      <View style={{ padding: 15 }}>
        <BackButton
          handler={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
        <H1Text label={i18n.t('dashboard_label.documents')} />
        <View
          style={{
            marginTop: 40,
            padding: 15,
            paddingTop: 20,
            width: '100%',
            height: 310,
            borderRadius: 10,
            backgroundColor: '#fff',
            shadowColor: '#3679B538',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.6,
            shadowRadius: 7,
            elevation: 5,
          }}>
          <Map product={product} />
        </View>
        {!isDocumentempty && <Documents docs={docs} />}
      </View>
      <View style={{ backgroundColor: '#fff', height: '100%' }}>
        <OwnershipWrappedInfo product={product} />
      </View>
    </ScrollView>
  );
};

export default ProductData;
