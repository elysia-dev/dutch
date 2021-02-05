enum NotificationType {
  CLOSE_OWNERSHIP = 'closeOwnership',
  WEEKLY_REPORT = 'weeklyReport',
  MONTHLY_REPORT = 'monthlyReport',
  SUCCESS_KYC = 'successKyc',
  FAIL_KYC = 'failKyc',
  NEW_DEVICE = 'newDevice',
  PROFIT = 'profit',
  PRODUCT_NOTICE = 'productNotice',
  ELYSIA_NOTICE = 'elysiaNotice',
  PENDING_TRANSACTION = 'pendingTransaction',
  INCREASE_OWNERSHIP = 'increaseOwnership',
  DECREASE_OWNERSHIP = 'decreaseOwnership',
  WITHDRAW_INTEREST = 'withdrawInterest',
  FAIL_TRANSACTION = 'failTransaction',
  ONBOARDING_NEW_USER = 'onboardingNewUser',
  ONBOARDING_CONNECT_WALLET = 'onboardingConnectWallet',
}

export default NotificationType;
