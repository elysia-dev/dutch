import { Transaction } from "../../types/Transaction";

export interface State {
  page: number;
  start: string;
  end: string;
  period: string;
  type: string;
  modal: boolean;
  productId: number;
  transactions: Transaction[];
}

export function reducer(state: State, action: any) {
  switch (action.type) {
    case 'ADD_TRANSACTIONS':
      return {
        ...state,
        transactions: state.transactions.concat(action.transactions),
      };
    case 'UPDATE_TRANSACTIONS':
      return {
        ...state,
        transactions: action.transactions,
      };
    case 'UPDATE_PAGE':
      return {
        ...state,
        page: action.page,
      };
    case 'UPDATE_PERIOD':
      return {
        ...state,
        period: action.period,
      };
    case 'MODAL_CONTROL':
      return {
        ...state,
        modal: action.modal,
      };
    case 'UPDATE_TYPE':
      return {
        ...state,
        type: action.transactionType,
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        productId: action.productId,
      };
    case 'UPDATE_STARTDATE':
      return { ...state, start: action.start };
    case 'UPDATE_ENDDATE':
      return { ...state, end: action.end };
    default:
      return state;
  }
}
