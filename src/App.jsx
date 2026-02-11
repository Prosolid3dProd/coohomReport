import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext";

import {
  Config,
  Report,
  Dashboard,
  Login,
  Encimeras,
  RedirectLogin,
  Error,
  History,
  Tiendas,
  Profile,
} from "./components/index";

import { getLocalToken } from "./data/localStorage";
import { UserProvider } from "./context/UserContext";

// export const userContext = React.createContext(); // Obsolete



const App = () => {
  return (
    <UserProvider>
      <OrderProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<RedirectLogin />}>
            <Route path="/" element={<Login />} />
            <Route path="/Dashboard" element={<Dashboard />}>
              <Route path="Tiendas" element={<Tiendas />} />
              <Route path="Config" element={<Config />} />
              <Route path="Biblioteca" element={<Encimeras />} />
              <Route path="Presupuestos" element={<History />} />
              <Route path="Report" element={<Report />} />
              <Route path="Perfil" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </OrderProvider>
    </UserProvider>
  );
};

export default App;
