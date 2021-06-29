import { useRef, useCallback, useEffect } from 'react';

const useMountedState = () => {
  const mountedRef = useRef(false);
  const isMounted = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    }
  }, []);

  return isMounted;
};

const useSafeAsync = () => {
  const isMounted = useMountedState();
  const safeAsync = useCallback((promise) => {
    return new Promise((resolve) => {
      promise.then((value: unknown) => {
        if (isMounted()) {
          resolve(value);
        }
      });
    });
  }, []);

  return safeAsync;
};

export default useSafeAsync;