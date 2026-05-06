# 01 — Seguridad Crítica

Categoría: Secretos y variables de entorno · Protección de rutas por rol

Los problemas de esta categoría deben corregirse **antes** de cualquier despliegue o push a un repositorio público. Incluyen un token de API hardcodeado en código fuente, URLs de backend embebidas en tres archivos distintos y la ausencia de verificación de rol en la ruta `/Dashboard/Tiendas`.

---

## 1. Crear `.env.local` con la URL del backend y el token de API

**Problema:** La URL `https://api.simulhome.com/coohomReport` y el token `Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH` están escritos literalmente en `handlers/order.js`, `handlers/user.js` y `data/constants.js`. Cualquier persona con acceso al repositorio los ve de inmediato.

**Archivo a crear:** `C:\Users\alvar\WebstormProjects\coohomReport\.env.local`

```ini
VITE_API_URL=https://api.simulhome.com/coohomReport
VITE_API_TOKEN=Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH
```

> Vite solo expone al cliente las variables que empiezan con `VITE_`. Las variables sin ese prefijo quedan invisibles en el bundle. `.env.local` nunca se sube a git (ver paso 2).

---

## 2. Añadir `.env.local` al `.gitignore`

**Archivo:** `C:\Users\alvar\WebstormProjects\coohomReport\.gitignore`

El archivo ya existe. Añadir al final:

**ANTES (final del archivo):**
```
*.sw?
```

**DESPUÉS:**
```
*.sw?

# Variables de entorno locales — nunca subir al repositorio
.env.local
.env.*.local
```

---

## 3. Modificar `src/data/constants.js` para usar variables de entorno

**Problema:** La URL del backend está hardcodeada en la línea 9 con tres URLs comentadas encima (desarrollo, staging y producción). Cambiar de entorno requiere modificar el código.

**Archivo:** `src/data/constants.js`

**ANTES (líneas 1-13):**
```javascript
export const CONFIG = {
  ROLE: {
    CLIENT: "346J0NIHU7CRNRVJ0NIHU3T4T4854H9TV4NJ0NIHU5945",
    ADMIN: "E567890KMNGYCTDR6TYUJ067T8NIHUGVTFT67T87Y9HOJG",
  },
  API: {
    // BACKEND_URL: "http://localhost:3007",
    // BACKEND_URL: "https://octopus-app-dgmcr.ondigitalocean.app",
    BACKEND_URL: "https://api.simulhome.com/coohomReport",
    ENDPOINT: "reportCoohom",
    TOKEN: JSON.parse(localStorage.getItem("token"))?.token || null,
  },
```

**DESPUÉS:**
```javascript
export const CONFIG = {
  ROLE: {
    CLIENT: "346J0NIHU7CRNRVJ0NIHU3T4T4854H9TV4NJ0NIHU5945",
    ADMIN: "E567890KMNGYCTDR6TYUJ067T8NIHUGVTFT67T87Y9HOJG",
  },
  API: {
    BACKEND_URL: import.meta.env.VITE_API_URL,
    ENDPOINT: "reportCoohom",
    TOKEN: JSON.parse(localStorage.getItem("token"))?.token || null,
  },
```

---

## 4. Modificar `src/handlers/order.js` — quitar token y URL hardcodeados

**Problema:** El objeto `Settings` en las líneas 6-12 contiene la URL del backend (con tres URLs comentadas) y el token de API literal. Ese token se pasa en el body de **cada llamada** a la API.

**Archivo:** `src/handlers/order.js`

**ANTES (líneas 1-18):**
```javascript
import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";

const Settings = {
  // BACKEND_URL: "http://localhost:3007",
  // BACKEND_URL: "https://octopus-app-dgmcr.ondigitalocean.app",
  BACKEND_URL: "https://api.simulhome.com/coohomReport",
  ENDPOINT: "reportCoohom",
  TOKEN: "Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH",
};

let _AXIOS_ = axios.create({
  headers: {
    Authorization: CONFIG.API.TOKEN,
  },
});
```

**DESPUÉS:**
```javascript
import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";

const Settings = {
  ENDPOINT: "reportCoohom",
  TOKEN: import.meta.env.VITE_API_TOKEN,
};

let _AXIOS_ = axios.create({
  headers: {
    Authorization: CONFIG.API.TOKEN,
  },
});
```

> `CONFIG.API.BACKEND_URL` ya lee de `VITE_API_URL` tras el cambio del paso 3, por lo que todas las funciones que usan `CONFIG.API.BACKEND_URL` quedan automáticamente corregidas (`createOrder`, `updateOrder`, `getOrders`, etc.).

---

## 5. Modificar `src/handlers/user.js` — quitar token y URL hardcodeados

**Problema:** Las líneas 5-10 tienen la misma URL triplicada (comentadas) y el token literal. Además, `axios.defaults.baseURL` se asigna con la URL hardcodeada, lo que afecta a **todas** las instancias de axios en la aplicación.

**Archivo:** `src/handlers/user.js`

**ANTES (líneas 1-21):**
```javascript
import axios from "axios";
import Cookies from "js-cookie";
import { CONFIG } from "../data/constants";

// const backendUrl = "http://localhost:3007";
// const backendUrl = "https://octopus-app-dgmcr.ondigitalocean.app";
const backendUrl = "https://api.simulhome.com/coohomReport"
const token = "Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH";

axios.defaults.baseURL = backendUrl;

axios.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("token") || token;
    config.headers.Authorization = authToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**DESPUÉS:**
```javascript
import axios from "axios";
import Cookies from "js-cookie";
import { CONFIG } from "../data/constants";

const token = import.meta.env.VITE_API_TOKEN;

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("token") || token;
    config.headers.Authorization = authToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

## 6. Añadir guard de rol para `/Dashboard/Tiendas` en `src/App.jsx`

**Problema:** La ruta `/Dashboard/Tiendas` renderiza `<Admin />` sin verificar que el usuario tenga rol `admin`. El guard existente (`guard.jsx`) solo comprueba si hay un token, no el rol.

**Cómo está guardado el rol:** En `handlers/user.js` función `login()` (línea 97), después de un login exitoso se hace:
```javascript
localStorage.setItem(
  "campaign",
  data.user.role === "admin" ? CONFIG.ROLE.ADMIN : CONFIG.ROLE.CLIENT
);
```
`CONFIG.ROLE.ADMIN = "E567890KMNGYCTDR6TYUJ067T8NIHUGVTFT67T87Y9HOJG"`. Por tanto la comprobación de rol debe leer `localStorage.getItem("campaign")` y compararlo con `CONFIG.ROLE.ADMIN`.

También existe `getLocalToken()` en `data/localStorage.js` que devuelve el objeto completo del token, donde `getLocalToken()?.user?.role === "admin"` es igualmente válido.

**Paso 1 — Crear el componente `RoleGuard` en `src/components/pages/log/guard.jsx`**

**ANTES (archivo completo):**
```javascript
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { getLocalToken } from '../../../data/localStorage';

const authLogin = () => {
    const userAuth = getLocalToken()
    if (userAuth && userAuth?.user) return true
    return false
}

const RedirectLogin = () => {
    const user = authLogin()
    return user ? <Outlet /> : <Navigate to={'/Login'} />
}

export {
    authLogin,
    RedirectLogin
}
```

**DESPUÉS:**
```javascript
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { getLocalToken } from '../../../data/localStorage';
import { CONFIG } from '../../../data/constants';

const authLogin = () => {
    const userAuth = getLocalToken()
    if (userAuth && userAuth?.user) return true
    return false
}

const RedirectLogin = () => {
    const user = authLogin()
    return user ? <Outlet /> : <Navigate to={'/Login'} />
}

/**
 * Guard de rol: solo deja pasar si el usuario tiene rol "admin".
 * Redirige a /Dashboard/Presupuestos si el rol no coincide.
 */
const AdminGuard = () => {
    const campaign = localStorage.getItem('campaign')
    const isAdmin = campaign === CONFIG.ROLE.ADMIN
    return isAdmin ? <Outlet /> : <Navigate to={'/Dashboard/Presupuestos'} replace />
}

export {
    authLogin,
    RedirectLogin,
    AdminGuard,
}
```

**Paso 2 — Usar `AdminGuard` en `src/App.jsx`**

**ANTES (líneas 1-55):**
```javascript
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import {
  Config,
  Report,
  Dashboard,
  Login,
  Encimeras,
  RedirectLogin,
  Error,
  History,
  Admin,
} from "./components/index";

import { getLocalToken } from "./data/localStorage";
import './index.css'

export const userContext = React.createContext();

// const ReDirect = () => {
//   const location = useLocation();
//   if (location && location.pathname === "/")
//     return <Navigate to={`Dashboard/Presupuestos`} replace />;

//   return;
// };

const App = () => {
  const [users, setUsers] = useState(getLocalToken());

  return (
    <>
      <userContext.Provider value={users}>
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
      </userContext.Provider>
    </>
  );
};

export default App;
```

**DESPUÉS:**
```javascript
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import {
  Config,
  Report,
  Dashboard,
  Login,
  Encimeras,
  RedirectLogin,
  Error,
  History,
  Admin,
} from "./components/index";

import { AdminGuard } from "./components/pages/log/guard";
import { getLocalToken } from "./data/localStorage";
import './index.css'

export const userContext = React.createContext();

const App = () => {
  const [users, setUsers] = useState(getLocalToken());

  return (
    <>
      <userContext.Provider value={users}>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<RedirectLogin />}>
            <Route path="/" element={<Login />} />
            <Route path="/Dashboard" element={<Dashboard />}>
              {/* Ruta protegida por rol: solo admins */}
              <Route element={<AdminGuard />}>
                <Route path="Tiendas" element={<Admin />} />
              </Route>
              <Route path="Config" element={<Config />} />
              <Route path="Biblioteca" element={<Encimeras />} />
              <Route path="Presupuestos" element={<History />} />
              <Route path="Report" element={<Report />} />
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </userContext.Provider>
    </>
  );
};

export default App;
```

> `AdminGuard` también hay que exportarlo desde `src/components/index.js` si se quiere importar desde el barrel, pero como se importa directamente desde su ruta, no hace falta.

---

## Pasos de ejecución en orden

1. Crear el archivo `.env.local` en la raíz del proyecto con las dos variables `VITE_API_URL` y `VITE_API_TOKEN`.
2. Añadir `.env.local` y `.env.*.local` al `.gitignore`.
3. Aplicar el cambio en `src/data/constants.js` (reemplazar URL literal por `import.meta.env.VITE_API_URL`).
4. Aplicar el cambio en `src/handlers/order.js` (eliminar objeto `Settings` con URL y reemplazar `TOKEN` por `import.meta.env.VITE_API_TOKEN`).
5. Aplicar el cambio en `src/handlers/user.js` (reemplazar `backendUrl` literal y `token` literal por `import.meta.env.*`).
6. Añadir `AdminGuard` al final de `src/components/pages/log/guard.jsx`.
7. Importar y usar `AdminGuard` en `src/App.jsx` envolviendo la ruta `Tiendas`.
8. Ejecutar `npm run dev` y verificar que la app arranca correctamente.
9. Iniciar sesión como usuario `client` e intentar navegar a `/Dashboard/Tiendas` — debe redirigir a `/Dashboard/Presupuestos`.
10. Iniciar sesión como usuario `admin` — debe poder acceder a `/Dashboard/Tiendas` sin problemas.
11. Ejecutar `npm run build` y verificar que `VITE_API_URL` aparece en el bundle (es normal, es frontend) pero el token no aparece en texto claro en `Settings` del código fuente.

> **Nota de seguridad adicional:** En `src/components/pages/admin/admin.jsx` (línea 43) hay una API key de Filestack hardcodeada: `filestack.init("AXPWPBPSTvSKYoyHwByaaz")`. Añadir también `VITE_FILESTACK_KEY` al `.env.local` y reemplazarla con `import.meta.env.VITE_FILESTACK_KEY`.
