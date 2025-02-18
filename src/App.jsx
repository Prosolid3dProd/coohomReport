import React, { useState, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import {
  Config,
  Report,
  Dashboard,
  Encimeras,
  RedirectLogin,
  History,
  Admin,
} from "./components/index";

const Login = lazy(() => import("./components/pages/log/login"));
const Error = lazy(() => import("./components/pages/error/errorPage"));

import { getLocalToken } from "./data/localStorage";
import "./index.css";

export const userContext = React.createContext();

// const ReDirect = () => {
//   const location = useLocation();
//   if (location && location.pathname === "/")
//     return <Navigate to={`Dashboard/Presupuestos`} replace />;

//   return;
// };

const App = () => {
  //IMPORTANTE! --> User debe de tomar información de BD
  const [users, setUsers] = useState(getLocalToken());

  return (
    <>
      <userContext.Provider value={users}>
        <Suspense >
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route element={<RedirectLogin />}>
              <Route path="/" element={<Login />} />
              <Route path="/Dashboard" element={<Dashboard />}>
                <Route path="Tiendas" element={<Admin />} />
                <Route path="Config" element={<Config />} />
                <Route path="Biblioteca" element={<Encimeras />} />
                <Route path="Presupuestos" element={<History />} />
                <Route path="Report" element={<Report />} />
              </Route>
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </userContext.Provider>
    </>
  );
};

export default App;
