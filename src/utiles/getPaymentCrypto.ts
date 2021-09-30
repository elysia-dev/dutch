import CryptoType from '../enums/CryptoType';

function getPaymentCrypto(paymentMethod: string) {
  switch (paymentMethod.toLowerCase()) {
    case 'eth':
      return CryptoType.ETH;
    case 'bnb':
      return CryptoType.BNB;
    case 'el':
      return CryptoType.EL;
    default:
      throw Error('Unknown payment method');
  }
}

export default getPaymentCrypto;
