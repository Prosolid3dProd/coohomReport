# 01 — Seguridad Crítica

Categoría: Variables de entorno · Migración a JWT Bearer · API_TOKEN selectivo · Filestack · Role guard · CORS

Estos cambios son prerrequisito de cualquier despliegue. El backend ya migró a `.env`, JWT Bearer y CORS por whitelist (ver `analisis_general.md` sección 0). El frontend tiene que alinearse.

---

## 1. Crear `.env.local` con la configuración de cliente

**Archivo a crear:** `C:\Users\alvar\WebstormProjects\coohomReport\.env.local`

```ini
VITE_API_URL=https://api.simulhome.com/coohomReport
VITE_API_TOKEN=Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH
VITE_FILESTACK_KEY=AXPWPBPSTvSKYoyHwByaaz
```

> Vite solo expone al cliente las variables que empiezan con `VITE_`. `.env.local` no se sube a git (ver paso 2). Aunque las claves del bundle frontend son inevitablemente visibles tras el build, sacarlas del repo evita que aparezcan en `git log` y bloqueos automáticos por leak detection.

---

## 2. Añadir `.env.local` al `.gitignore`

**Archivo:** `C:\Users\alvar\WebstormProjects\coohomReport\.gitignore`

El archivo ya tiene `*.local` (cubre `.env.local`). Añadir explícitamente para claridad:

**ANTES (final del archivo):**
```
*.sw?
```

**DESPUÉS:**
```
*.sw?

# Variables de entorno locales — nunca subir al repositorio
.env
.env.local
.env.*.local
```

---

## 3. Modificar `src/data/constants.js` para usar variables de entorno

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
    TOKEN: JSON.parse(localStorage.getItem("token"))?.token || null, //"Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH" ,
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
    // JWT del usuario, se lee al construir el axios instance.
    // Para acceso síncrono fuera de React: getLocalToken()?.token
    TOKEN: JSON.parse(localStorage.getItem("token") || "null")?.token || null,
  },
```

> Se quita el comentario con el token literal y se añade un fallback robusto a `JSON.parse` (el actual lanzaba excepción si `token` era `null`).

---

## 4. Migrar `src/handlers/order.js` a JWT Bearer + API_TOKEN selectivo

### 4.1 Cambio de filosofía

El backend ahora valida JWT en `Authorization: Bearer <token>` para casi todos los endpoints. Solo `POST /reporthomUpdateCabinets` (y por contrato similar `POST /signinReporthom` + `POST /resetPasswordUserCoohom`, que viven en `user.js`) siguen aceptando el `token` en el body.

Por tanto en `order.js` hay que:
- Eliminar el objeto `Settings` (URL + TOKEN literales).
- Construir la instancia axios con baseURL desde env y un interceptor que inyecte `Bearer ${jwt}` en cada request.
- Eliminar `{ token: Settings.TOKEN, ... }` del body de **todas** las funciones excepto `updateCabinetsInternal` (la que llama a `POST /reporthomUpdateCabinets`).

### 4.2 ANTES (líneas 1-30 de `src/handlers/order.js`)

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

const tokenLocal = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
};

export const axiosToken = axios.create({
  headers: {
    Authorization: Cookies.get("token") || tokenLocal(),
  },
});
```

### 4.3 DESPUÉS

```javascript
import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";
import { getLocalToken } from "../data/localStorage";

const ENDPOINT = "reportCoohom";

// Token de API solo se necesita en POST /reporthomUpdateCabinets.
// El resto de endpoints valida JWT en el header Authorization.
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const _AXIOS_ = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

_AXIOS_.interceptors.request.use((config) => {
  const jwt = Cookies.get("token") || getLocalToken()?.token;
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});

// Para llamadas que necesiten también el JWT pero como instancia separada
export const axiosToken = _AXIOS_;
```

### 4.4 Adaptar cada función — eliminar `token` del body

Patrón general:

**ANTES:**
```javascript
export const createOrder = async (params) => {
  try {
    const data = await _AXIOS_.post(
      `${CONFIG.API.BACKEND_URL}/${CONFIG.API.ENDPOINT}`,
      {
        ...params,
        token: Settings.TOKEN,
      }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};
```

**DESPUÉS:**
```javascript
export const createOrder = async (params) => {
  try {
    const { data } = await _AXIOS_.post(`/${ENDPOINT}`, params);
    return data;
  } catch (error) {
    return handleOrderError(error, "crear orden");
  }
};
```

`handleOrderError` se define en el documento `02_alto_validacion_errores.md` sección 3.

### 4.5 Funciones que cambian (eliminan `token: Settings.TOKEN` del body)

Aplicar el patrón a las siguientes funciones de `handlers/order.js`:

| Función | Endpoint que llama |
|---|---|
| `createOrder` | POST /reportCoohom |
| `updateOrder` | PUT /reportCoohom |
| `getOrders` | POST /reportsCoohom |
| `getOrderById` | POST /reporthomById |
| `getComplements` | GET /reportCoohomComplements |
| `getComplementsByText` | POST /reportCoohomComplementsbyText |
| `archivedOrder` | PUT /archivedReportCoohom |
| `deleteComplements` | POST /eliminarPorCodigo |
| `CreateOrderDetails` | POST /reporthomDetails |
| `updateOrderDetails` | PUT /reporthomDetails |
| `archivedOrderDetails` | POST /reporthomComplementDetailsDelete |
| `createCabinetByUser` | POST /reportCoohomCabinetCreate |
| `updateCabinetsOrder` | PUT /reportCoohomCabinets |
| `updateCabinet` | PUT /reportCoohomCabinets |

### 4.6 Excepción — `updateCabinetsInternal` (POST /reporthomUpdateCabinets)

Esta función SÍ debe seguir enviando `token` en el body, ya que el backend lo valida con `requireApiToken` inline en el controller (no por middleware):

```javascript
// Variante interna: el backend exige API_TOKEN en body, no Bearer
export const updateCabinetsInternal = async (params) => {
  try {
    const { data } = await _AXIOS_.post("/reporthomUpdateCabinets", {
      ...params,
      token: API_TOKEN,
    });
    return data;
  } catch (error) {
    return handleOrderError(error, "actualizar gabinetes (internal)");
  }
};
```

> Si el frontend no necesita ya el endpoint interno (todas las llamadas están cubiertas por `updateCabinetsOrder` con Bearer), eliminar esta función. Verificar antes de borrar.

---

## 5. Migrar `src/handlers/user.js` a JWT Bearer + API_TOKEN selectivo

### 5.1 Cambio en la cabecera + interceptor

**ANTES (líneas 1-21 de `src/handlers/user.js`):**
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
import { getLocalToken } from "../data/localStorage";

// API_TOKEN solo se envía en body para /signinReporthom y /resetPasswordUserCoohom.
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 15000;

axios.interceptors.request.use(
  (config) => {
    const jwt = Cookies.get("token") || getLocalToken()?.token;
    if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
    return config;
  },
  (error) => Promise.reject(error)
);
```

### 5.2 Funciones que SIGUEN enviando `token` en body (excepción)

Solo dos funciones de `user.js` necesitan el `token` en el body porque el backend las valida con `requireApiToken`:

```javascript
export const login = async (params) => {
  try {
    const { data } = await axios.post("/signinReporthom", {
      ...params,
      token: API_TOKEN,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
    return error.response?.data || { ok: false, message: "Error de red" };
  }
};

export const resetPassword = async (params) => {
  try {
    const { data } = await axios.post("/resetPasswordUserCoohom", {
      ...params,
      token: API_TOKEN,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
    return error.response?.data || { ok: false, message: "Error de red" };
  }
};
```

### 5.3 Funciones que dejan de enviar `token` (envían solo Bearer)

`createUser`, `editUser`, `deleteUser`, `getUsers`, `getProfile`, `updateProfile`. Eliminar `token,` del body en cada una. El interceptor ya inyecta `Bearer ${jwt}` automáticamente.

Ejemplo `createUser`:

**ANTES:**
```javascript
export const createUser = async (params) => {
  try {
    const { data } = await axios.post("/createUserCoohom", {
      ...params,
      token,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
    return error;
  }
};
```

**DESPUÉS:**
```javascript
export const createUser = async (params) => {
  try {
    const { data } = await axios.post("/createUserCoohom", params);
    return data;
  } catch (error) {
    handleAxiosError(error);
    return error.response?.data || { ok: false, message: "Error de red" };
  }
};
```

---

## 6. Añadir guard de rol para `/Dashboard/Tiendas`

**Problema:** `/Dashboard/Tiendas` renderiza `<Admin />` sin verificar rol. El guard actual (`guard.jsx`) solo comprueba si hay token. Un usuario `client` que edite manualmente `localStorage.campaign` accede al panel de admin.

### 6.1 Crear `AdminGuard` en `src/components/pages/log/guard.jsx`

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

const AdminGuard = () => {
    const role = getLocalToken()?.user?.role
    const campaign = localStorage.getItem('campaign')
    const isAdmin = role === 'admin' || campaign === CONFIG.ROLE.ADMIN
    return isAdmin ? <Outlet /> : <Navigate to={'/Dashboard/Presupuestos'} replace />
}

export {
    authLogin,
    RedirectLogin,
    AdminGuard,
}
```

> El guard valida tanto `getLocalToken()?.user?.role` como `localStorage.getItem('campaign')`. Cubre los dos formatos por compatibilidad. Tras la migración a JWT Bearer y la confianza en el `role` del token decodificado, se puede simplificar.

### 6.2 Envolver la ruta `Tiendas` en `src/App.jsx`

**ANTES (líneas 28-46):**
```javascript
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
```

**DESPUÉS:**
```javascript
import { AdminGuard } from "./components/pages/log/guard";
// ... resto de imports

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
```

---

## 7. Mover Filestack key a variable de entorno

**Archivo:** `src/components/pages/admin/admin.jsx` línea 43

**ANTES:**
```javascript
filestack.init("AXPWPBPSTvSKYoyHwByaaz")
```

**DESPUÉS:**
```javascript
filestack.init(import.meta.env.VITE_FILESTACK_KEY)
```

> La key sigue siendo visible en el bundle de producción (es inevitable en frontend), pero al menos no aparece en `git log` ni en buscadores de leaks como GitGuardian. Si se ha filtrado en commits previos, también hay que rotarla en la consola de Filestack.

---

## 8. Registrar dominio del frontend en `ALLOWED_ORIGINS` del backend

**No es código del frontend, pero es prerrequisito para que el frontend desplegado funcione.**

El backend ahora rechaza cualquier petición con un origen no incluido en `ALLOWED_ORIGINS`. Antes del deploy de producción:

1. Editar `backend-coohomReport/.env`:
   ```ini
   ALLOWED_ORIGINS=http://localhost:5173,https://simulhome.com,https://<dominio-real-frontend>
   ```
2. Reiniciar el proceso del backend para que recargue `.env`.
3. Verificar desde el navegador en el origen real: hacer una petición y comprobar en DevTools → Network que el response tiene `Access-Control-Allow-Origin: <origen>` y no aparecen errores CORS.

> Si el frontend se sirve desde el mismo dominio que el backend (proxy reverso, mismo host), la entrada de CORS sigue siendo necesaria — el navegador compara el origen del documento con el origen de la API.

---

## Pasos de ejecución en orden

1. Crear `.env.local` con `VITE_API_URL`, `VITE_API_TOKEN`, `VITE_FILESTACK_KEY`.
2. Actualizar `.gitignore` con `.env`, `.env.local`, `.env.*.local`.
3. Editar `src/data/constants.js` para usar `import.meta.env.VITE_API_URL` y endurecer `JSON.parse` con fallback `"null"`.
4. Reescribir cabecera + interceptor de `src/handlers/order.js` (eliminar `Settings`, añadir Bearer, añadir timeout).
5. Adaptar todas las funciones de `order.js` listadas en 4.5 para quitar `token` del body. Mantener excepción de `updateCabinetsInternal`.
6. Reescribir cabecera + interceptor de `src/handlers/user.js` (Bearer + timeout).
7. Mantener `token: API_TOKEN` en body solo en `login` y `resetPassword`. Quitarlo del resto.
8. Añadir `AdminGuard` en `src/components/pages/log/guard.jsx` y exportarlo.
9. Envolver `<Route path="Tiendas">` con `<AdminGuard />` en `src/App.jsx`.
10. Reemplazar `filestack.init("...")` por `import.meta.env.VITE_FILESTACK_KEY` en `pages/admin/admin.jsx`.
11. (Backend) Añadir el dominio real del frontend a `ALLOWED_ORIGINS` y reiniciar.
12. `npm run dev` y probar:
    - Login normal funciona.
    - DevTools → Network: las peticiones llevan `Authorization: Bearer ...` (no el API_TOKEN crudo).
    - Solo `signinReporthom`, `resetPasswordUserCoohom` y `reporthomUpdateCabinets` llevan `token` en el body.
    - Como usuario `client`, navegar a `/Dashboard/Tiendas` → redirige a Presupuestos.
    - Como `admin` → entra sin problemas.
    - Crear/editar mueble → funciona contra los endpoints reactivados.
13. `npm run build` y comprobar que no hay strings literales del token API en el bundle (`grep` sobre `dist/`).
