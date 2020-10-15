type ProductDescription = {
  currencyUnit: string;
  monthlyRentIncomeDistributionCycle: string;
  address: string;
  lockupPeriod: string;
  expectedSaleDate: string;
  propertyType: string;
  ground: string;
  underground: string;
  bedroom: string;
  bathroom: string;
  airConditioning: string;
  heating: string;
  securityFacilities: string;
  totalParkingAvailable: string;
  summary: string;
};

export const defaultProductDescription = {
  currencyUnit: '',
  monthlyRentIncomeDistributionCycle: '',
  address: '',
  lockupPeriod: '',
  expectedSaleDate: '',
  propertyType: '',
  ground: '',
  underground: '',
  bedroom: '',
  bathroom: '',
  airConditioning: '',
  heating: '',
  securityFacilities: '',
  totalParkingAvailable: '',
  summary: '',
};

export default ProductDescription;
