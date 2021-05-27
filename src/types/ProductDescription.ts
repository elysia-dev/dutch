type ProductDescription = {
  title: string;
  currencyUnit: string;
  monthlyRentIncomeDistributionCycle: string;
  address: string;
  lockupPeriod: string;
  expectedSaleDate: string;
  propertyType: string;
  ground: string;
  underground: string;
  unit: string;
  bedroom: string;
  bathroom: string;
  airConditioning: string;
  heating: string;
  securityFacilities: string;
  totalParkingAvailable: string;
  summary: string;
};

export const defaultProductDescription = {
  title: '',
  currencyUnit: '',
  monthlyRentIncomeDistributionCycle: '',
  address: '',
  lockupPeriod: '',
  expectedSaleDate: '',
  propertyType: '',
  ground: '',
  underground: '',
  unit: '',
  bedroom: '',
  bathroom: '',
  airConditioning: '',
  heating: '',
  securityFacilities: '',
  totalParkingAvailable: '',
  summary: '',
};

export default ProductDescription;
