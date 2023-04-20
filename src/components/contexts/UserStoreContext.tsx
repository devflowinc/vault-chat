import {
  Accessor,
  createContext,
  createSignal,
  createEffect,
  JSX,
} from "solid-js";

export interface GlobalStoreProviderType {
  isLogin: Accessor<boolean> | null;
  setIsLogin: (isLogin: boolean) => void;
}

export const GlobalStoreContext = createContext<GlobalStoreProviderType>({
  isLogin: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setIsLogin: (isLogin: boolean) => {},
});

export interface GlobalStoreProviderProps {
  children: JSX.Element;
}

const UserStoreContext = (props: GlobalStoreProviderProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  const [isLogin, setIsLogin] = createSignal<boolean>(false);

  createEffect(() => {
    console.log(`getting ${api_host}/auth`);
    void fetch(`${api_host}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok && !window.location.pathname.includes("/auth/")) {
        window.location.href = "/auth/login";
        return;
      }
      void response.json().then((data) => {
        console.log("user response", data);
      });
      setIsLogin(response.ok);
    });
  });

  const GlobalStoreProvider = {
    isLogin,
    setIsLogin,
  };

  return (
    <GlobalStoreContext.Provider value={GlobalStoreProvider}>
      {props.children}
    </GlobalStoreContext.Provider>
  );
};

export default UserStoreContext;
