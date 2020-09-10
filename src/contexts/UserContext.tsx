import { createContext } from "react";
import { KycStatus } from "../enums/status";

const UserContext = createContext({
  signedIn: false,
  user: {
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    kycStatus: KycStatus.NONE,
  },
  signIn: async () => { },
  signOut: async () => { },
});

export default UserContext;