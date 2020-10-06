import { State } from '../modules/more/Transactions';

export function reducer(state: State, action: any) {
  switch (action.type) {
    case 'UPDATE_LIST':
      return {
        ...state,
        transactions: state.transactions.concat(action.value),
      };
    case 'FILTER_LIST':
      return {
        ...state,
        transactions: action.value,
      };
    case 'UPDATE_PAGE':
      return {
        ...state,
        page: action.value,
      };
    case 'CHANGE_PERIOD':
      return {
        ...state,
        period: action.value,
      };
    case 'MODAL_CONTROL':
      return {
        ...state,
        modal: action.value,
      };
    case 'CHANGE_TYPE':
      return {
        ...state,
        type: action.value,
      };
    case 'CHANGE_PRODUCT':
      return {
        ...state,
        productId: action.value,
      };
    case 'CHANGE_STARTDATE':
      return { ...state, start: action.value };
    case 'CHANGE_ENDDATE':
      return { ...state, end: action.value };
    default:
      return state;
  }
}
