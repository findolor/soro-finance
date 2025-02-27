import BaseApiService from "./base";

const BASE_PATH = "auth";
const GET_NONCE = `${BASE_PATH}/nonce`;
const CONNECT = `${BASE_PATH}/connect`;

interface IGetNonceRequest {
  address: string;
}

interface IConnectRequest {
  signature: string;
  address: string;
}

class AuthenticationApiService extends BaseApiService {
  constructor() {
    super(undefined);
  }

  public async getNonce({ address }: IGetNonceRequest) {
    const res = await this.get<{ nonce: string }>(GET_NONCE, { address });
    return res;
  }

  public async connect({ signature, address }: IConnectRequest) {
    const res = await this.post<{
      accessToken: string;
      refreshToken: string;
    }>(CONNECT, {
      signature,
      address,
    });
    return res;
  }
}

export default AuthenticationApiService;
