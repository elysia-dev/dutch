import { AxiosResponse } from "axios";
import { AccountResponse } from "../types/AccountResponse";
import { TransactionRequestResponse } from "../types/TransactionRequest";
import { espressoClient, authenticatedEspressoClient } from '../api/axiosInstances';
import { setToken } from "../asyncStorages/token";

interface ITokenAndRequestId {
  requestId: string,
}

const createGuestAndRegisterAddress = async (language: string): Promise<ITokenAndRequestId> => {
  try {
    const guestRes: AxiosResponse<AccountResponse> = await espressoClient.post('/users/guest', { language });

    const authEspressoClient = authenticatedEspressoClient(
      () => { },
      guestRes.data.token!,
    );

    await setToken(guestRes.data.token!);

    const ethAddressRes: AxiosResponse<TransactionRequestResponse> = await authEspressoClient.post('/ethAddress')

    return {
      requestId: ethAddressRes.data.id
    }
  } catch {
    alert('Error');

    return {
      requestId: ''
    }
  }
};

export default createGuestAndRegisterAddress;