export type SummaryReportResponse = {
  id: number;
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
