import { TLoginUser } from "./auth.interface"

const loginUserInDB = async (payload: TLoginUser) => {
    console.log(payload);
    return{}
}

export const AuthService = {
    loginUserInDB
}
