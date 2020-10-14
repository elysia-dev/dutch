export type SummaryReportResponse = {
  id: 0;
  type: string;
  summary: {
    totalBalance: string;
    totalRealEstateValue: string;
    totalInterest: string;
    withdrawnInterest: string;
    withdrawableInterest: string;
    averageAnnualReturn: string;
  };
  content: {
    day0: {
      dailyProfits: string;
      dailyValue: string;
    };
    day1: {
      dailyProfits: string;
      dailyValue: string;
    };
    day2: {
      dailyProfits: string;
      dailyValue: string;
    };
    day3: {
      dailyProfits: string;
      dailyValue: string;
    };
    day4: {
      dailyProfits: string;
      dailyValue: string;
    };
    day5: {
      dailyProfits: string;
      dailyValue: string;
    };
    day6: {
      dailyProfits: string;
      dailyValue: string;
    };
    ownerships: [];
  };
};

export const defaultSummaryReportResponse = {
  id: 0,
  type: '',
  summary: {
    totalBalance: '0',
    totalRealEstateValue: '0',
    totalInterest: '0',
    withdrawnInterest: '0',
    withdrawableInterest: '0',
    averageAnnualReturn: '0',
  },
  content: {
    day0: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    day1: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    day2: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    day3: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    day4: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    day5: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    day6: {
      dailyProfits: '0',
      dailyValue: '0',
    },
    ownerships: [],
  },
};
