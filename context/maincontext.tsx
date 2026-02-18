"use client";

import { MessageInstance } from "antd/es/message/interface";
import useMessage from "antd/es/message/useMessage";
import {
  createContext,
  Dispatch,
  JSX,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface UserTypes {
  username: string | null;
  _id: string | null;
  accessToken: string | null;
  email: string | null;
}
interface GlobalContextTypes {
  msg: MessageInstance;
  userData: UserTypes;
  setUserData: Dispatch<SetStateAction<UserTypes>>;
}
interface Props {
  children: ReactNode;
}

const GlobalContext = createContext<GlobalContextTypes | null>(null);

const GlobalContextWraper = ({ children }: Props): JSX.Element => {
  const [msg, msgArea] = useMessage();
  const [userData, setUserData] = useState<UserTypes>({
    username: "",
    _id: "",
    accessToken: "",
    email: "",
  });

  return (
    <GlobalContext.Provider
      value={{
        msg,
        userData,
        setUserData,
      }}
    >
      {msgArea}
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextWraper;
// 3. Add a safety check to the hook

export const useGlobalContext = (): GlobalContextTypes => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextWrapper",
    );
  }
  return context;
};
