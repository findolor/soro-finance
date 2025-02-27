import { useMemo } from "react";
import AuthenticationApiService from "@/lib/api/auth";

const useApiService = () => {
  // const { accessToken } = useAppStore()

  const authenticationApiService = useMemo(() => {
    return new AuthenticationApiService();
  }, []);

  return {
    authenticationApiService,
  };
};

export default useApiService;
