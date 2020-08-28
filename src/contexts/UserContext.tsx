import { createContext } from "react";
import { KycStatus } from "../enums/status";

const UserContext = createContext({
  signedIn: false,
  user: {
    email: "",
    firstName: "",
    lastName: "",
    kycStatus: KycStatus.NONE,
  }
});

export default UserContext;