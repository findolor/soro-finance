import BaseApiService from "./base";

const BASE_PATH = "auth";
const SIGN_UP = `${BASE_PATH}/signup`;

interface ISignUpRequest {
  address: string;
}

class AuthenticationApiService extends BaseApiService {
  constructor() {
    super(undefined);
  }

  public async signUp({ address }: ISignUpRequest) {
    return this.post(SIGN_UP, { address });
  }
}

export default AuthenticationApiService;
