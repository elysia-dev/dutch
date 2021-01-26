type NotificationData = {
  reportId: number;
  ownershipId: number;
  productId: number;
  month: number;
  week: number;
  message: string;
  tokenName: string;
  tokenAmount: string;
  txHash: string;
  paymentMethod: string;
};

export default NotificationData;
