import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = (): AppStateStatus => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    AppState.addEventListener('change', () =>
      setAppState(AppState.currentState),
    );
  }, []);

  return appState;
}

export default useAppState