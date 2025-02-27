import {
  isAllowed,
  setAllowed,
  getAddress,
  signMessage,
  isConnected as isConnectedFreighter,
} from "@stellar/freighter-api";
import useAppStore from "@/lib/store/app";
import { errorToast } from "@/lib/utils/toast";
import useApi from "@/lib/hooks/useApi";

const useWallet = () => {
  const {
    isConnected,
    walletAddress,
    setIsConnected,
    setWalletAddress,
    setAccessToken,
    setRefreshToken,
    setLoading,
  } = useAppStore();
  const { authenticationApiService } = useApi();

  const connect = async () => {
    try {
      setLoading(true);

      const installed = await isConnectedFreighter();
      if (!installed) {
        throw new Error("Freighter is not installed");
      }

      const allowed = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }
      const info = await getAddress();
      if (info.error) {
        throw new Error("Please unlock your wallet");
      }

      const { nonce } = await authenticationApiService.getNonce({
        address: info.address,
      });

      const data = await signMessage(btoa(JSON.stringify({ nonce })), {
        address: info.address,
      });
      if (!data.signedMessage) {
        throw new Error("Failed to sign message");
      }

      const signature = Buffer.from(data.signedMessage).toString("base64");

      const { accessToken, refreshToken } =
        await authenticationApiService.connect({
          signature,
          address: info.address,
        });

      setWalletAddress(info.address);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setIsConnected(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      errorToast(error);
    }
  };

  const disconnect = async () => {
    setIsConnected(false);
    setWalletAddress("");
    setAccessToken("null");
  };

  return {
    connect,
    disconnect,
    walletAddress,
    isConnected,
  };
};

export default useWallet;
