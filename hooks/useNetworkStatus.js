// hooks/useNetworkStatus.js
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchInitialState = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    fetchInitialState(); // Set the initial value
    return () => unsubscribe();
  }, []);

  return isConnected;
};

export default useNetworkStatus;