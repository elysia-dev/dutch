import { useEffect, useState } from 'react'
import TxStatus from '../enums/TxStatus';
import { provider } from '../utiles/getContract';

type TxResult = {
  status: TxStatus,
  error: string,
}

export function useWatingTx(txHash: string): TxResult {
  const [state, setState] = useState<{ status: TxStatus, error: string, counter: number }>(
    { status: TxStatus.None, error: "", counter: 0 }
  );

  useEffect(() => {
    if (txHash) {
      setState({
        status: TxStatus.Pending,
        error: "",
        counter: state.counter + 1,
      })
    }
  }, [txHash])

  useEffect(() => {
    if (state.status !== TxStatus.Pending) {
      return;
    }

    let timer = setTimeout(() => {
      provider.getTransactionReceipt(txHash).then((res: any) => {
        if (res && res.status === 1) {
          setState({
            ...state,
            status: TxStatus.Success,
          });
        } else if (res && res.status !== 1) {
          setState({
            ...state,
            status: TxStatus.Fail,
            error: 'Transaction is failed',
          });
        } else {
          setState({
            ...state,
            counter: state.counter + 1
          })
        }
      }).catch((e: any) =>
        setState({
          ...state,
          status: TxStatus.Fail,
          error: e.toString(),
        })
      )
    }, 2000)

    return () => {
      clearTimeout(timer);
    }
  }, [state.counter])

  return {
    status: state.status,
    error: state.error,
  };
}