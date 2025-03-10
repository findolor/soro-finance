import {
  isAllowed,
  setAllowed,
  getAddress,
  isConnected as isConnectedFreighter,
  requestAccess,
} from "@stellar/freighter-api";
import useAppStore from "@/lib/store/app";
import useApi from "@/lib/hooks/useApi";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const useWallet = () => {
  const {
    isConnected,
    walletAddress,
    setIsConnected,
    setWalletAddress,
    setLoading,
  } = useAppStore();
  const { authenticationApiService } = useApi();

  const connect = async () => {
    try {
      const supabase = createClient();

      setLoading(true);
      let address = "";

      const installed = await isConnectedFreighter();
      if (!installed) {
        throw new Error("Freighter is not installed");
      }

      const allowed = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }

      const access = await requestAccess();
      if (access.error) {
        throw new Error("Please grant access to your wallet");
      } else {
        address = access.address;
      }

      const info = await getAddress();
      if (info.error) {
        throw new Error("Please grant access to your wallet");
      } else {
        address = info.address;
      }

      await authenticationApiService.signUp({ address });

      const { error } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}-${
          process.env.NEXT_PUBLIC_ANONYMOUS_SUFFIX
        }`,
        password: process.env.NEXT_PUBLIC_ANONYMOUS_PASSWORD as string,
      });
      if (error) {
        throw new Error("Wallet connection failed");
      }

      setWalletAddress(info.address);
      setIsConnected(true);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  };

  const disconnect = async () => {
    setIsConnected(false);
    setWalletAddress("");
  };

  return {
    connect,
    disconnect,
    walletAddress,
    isConnected,
  };
};

export default useWallet;
