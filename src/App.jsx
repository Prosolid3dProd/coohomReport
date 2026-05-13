import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import {
  Config,
  Dashboard,
  Login,
  Encimeras,
  RedirectLogin,
  Error,
  History,
} from "./components/index";

import { AdminGuard } from "./components/pages/auth/guard";
import { UserProvider, OrderProvider } from "./context";
import './index.css'

const Report = lazy(() => import("./features/report").then(m => ({ default: m.ReportPage })));
const Admin = lazy(() => import("./components/pages/admin/admin").then(m => ({ default: m.Admin })));

const Loading = () => <div style={{ padding: 32, textAlign: "center" }}>Cargando...</div>;

const App = () => (
  <UserProvider>
    <OrderProvider>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route element={<RedirectLogin />}>
          <Route path="/" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />}>
            <Route element={<AdminGuard />}>
              <Route path="Tiendas" element={<Suspense fallback={<Loading />}><Admin /></Suspense>} />
            </Route>
            <Route path="Config" element={<Config />} />
            <Route path="Biblioteca" element={<Encimeras />} />
            <Route path="Presupuestos" element={<History />} />
            <Route path="Report" element={<Suspense fallback={<Loading />}><Report /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </OrderProvider>
  </UserProvider>
);

export default App;
