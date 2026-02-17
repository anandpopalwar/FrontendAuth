import { MessageInstance } from "antd/es/message/interface";
import useMessage from "antd/es/message/useMessage";
import { createContext, JSX, ReactNode, useContext } from "react";

interface GlobalContextTypes {
  msg: MessageInstance;
}
interface Props {
  children: ReactNode;
}

const GlobalContext = createContext<GlobalContextTypes | null>(null);

const GlobalContextWraper = ({ children }: Props): JSX.Element => {
  const [msg, msgArea] = useMessage();

  return (
    <GlobalContext.Provider
      value={{
        msg,
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
