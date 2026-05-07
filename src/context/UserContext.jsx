import React, { createContext, useContext, useState } from "react";
import { getLocalToken, setLocalToken } from "../data/localStorage";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(getLocalToken);

  const login = (payload) => {
    setLocalToken(payload);
    setAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <UserContext.Provider value={{ user: auth?.user ?? null, token: auth?.token ?? null, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export { UserContext };
