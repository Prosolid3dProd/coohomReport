# 04 — Rendimiento y Configuración

Categoría: `package.json` · alias de Vite · timeout de axios · `tailwind.config.js` · `jsconfig.json` · `console.log` en producción · code-splitting · caché en `encimerasModal`

---

## 1. Limpiar `package.json`

**Archivo:** `C:\Users\alvar\WebstormProjects\coohomReport\package.json`

### 1.1 Mover `json-server` a `devDependencies`

**Problema:** `json-server` es una herramienta de desarrollo para simular una API REST con un archivo JSON. No debe estar en `dependencies` (que se instalan en producción), sino en `devDependencies`.

**ANTES — sección `dependencies` (incluye la línea problemática):**
```json
"dependencies": {
  "@react-pdf/renderer": "^3.1.12",
  "@uidotdev/usehooks": "^2.1.1",
  "antd": "^5.8.2",
  "axios": "^1.4.0",
  "caniuse-lite": "^1.0.30001692",
  "file-saver": "^2.0.5",
  "filestack-js": "^3.32.3",
  "js-cookie": "^3.0.5",
  "json-server": "^0.17.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.10.1",
  "react-router-dom": "^6.14.1",
  "xlsx": "^0.18.5"
},
```

**DESPUÉS — `dependencies` sin `json-server` ni `@uidotdev/usehooks`:**
```json
"dependencies": {
  "@react-pdf/renderer": "^3.1.12",
  "antd": "^5.8.2",
  "axios": "^1.4.0",
  "file-saver": "^2.0.5",
  "filestack-js": "^3.32.3",
  "js-cookie": "^3.0.5",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.10.1",
  "react-router-dom": "^6.14.1",
  "xlsx": "^0.18.5"
},
```

**ANTES — sección `devDependencies`:**
```json
"devDependencies": {
  "@types/react": "^18.2.14",
  "@types/react-dom": "^18.2.6",
  "@vitejs/plugin-react-swc": "^3.3.2",
  "autoprefixer": "^10.4.20",
  "esm": "^3.2.25",
  "postcss": "^8.5.1",
  "tailwindcss": "^3.4.17",
  "vite": "^4.4.0"
}
```

**DESPUÉS — `devDependencies` con `json-server` añadido:**
```json
"devDependencies": {
  "@types/react": "^18.2.14",
  "@types/react-dom": "^18.2.6",
  "@vitejs/plugin-react-swc": "^3.3.2",
  "autoprefixer": "^10.4.20",
  "json-server": "^0.17.3",
  "postcss": "^8.5.1",
  "tailwindcss": "^3.4.17",
  "vite": "^4.4.0"
}
```

> `esm` también se eliminó de `devDependencies`. Vite gestiona ESM nativamente y este paquete no está referenciado en ningún archivo del proyecto.

### 1.2 Eliminar `@uidotdev/usehooks`

**Verificación realizada:** Se buscó el string `@uidotdev/usehooks` en todos los archivos de `src/`. No aparece en ningún import. El paquete puede eliminarse de `dependencies` de forma segura (ya excluido en el bloque DESPUÉS de arriba).

Después de editar el archivo, ejecutar:
```bash
npm install
```
Para actualizar `node_modules` y `package-lock.json`.

---

## 2. Añadir alias `@` en `vite.config.js`

**Problema:** Todos los imports en `src/` usan rutas relativas como `../../../data/constants`. Un alias `@` que apunte a `src/` simplifica los imports y elimina los `../../..` anidados.

**Archivo:** `C:\Users\alvar\WebstormProjects\coohomReport\vite.config.js`

**ANTES (archivo completo):**
```javascript
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
})
```

**DESPUÉS:**
```javascript
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
```

> A partir de este cambio, un import como `import { CONFIG } from '../../../data/constants'` puede escribirse como `import { CONFIG } from '@/data/constants'`. Los imports existentes siguen funcionando sin modificarlos — el alias es opcional, no rompe nada.

---

## 3. Añadir timeout a axios en ambos handlers

**Problema:** Sin un timeout configurado, si el servidor no responde (caída, red lenta), el usuario espera indefinidamente sin ningún indicador de error.

### 3.1 — `src/handlers/order.js`

**ANTES (creación de `_AXIOS_`):**
```javascript
let _AXIOS_ = axios.create({
  headers: {
    Authorization: CONFIG.API.TOKEN,
  },
});
```

**DESPUÉS:**
```javascript
let _AXIOS_ = axios.create({
  headers: {
    Authorization: CONFIG.API.TOKEN,
  },
  timeout: 15000, // 15 segundos
});
```

Las funciones que usan `axios` directamente (sin `_AXIOS_`) como `createCabinetByUser`, `getComplementsByText`, `updateCabinetsOrder`, `archivedOrderDetails`, etc., también deberían pasar por una instancia con timeout. La forma más limpia es crear una segunda instancia o configurar `axios.defaults.timeout`:

Añadir justo después de la instancia `_AXIOS_`:
```javascript
// Timeout global para llamadas directas con axios (sin instancia)
axios.defaults.timeout = 15000;
```

### 3.2 — `src/handlers/user.js`

En este archivo `axios.defaults.baseURL` ya está configurado. Añadir el timeout en la misma zona:

**ANTES:**
```javascript
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(
```

**DESPUÉS:**
```javascript
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 15000; // 15 segundos

axios.interceptors.request.use(
```

> **Advertencia:** `axios.defaults` es global y afecta a todas las instancias de axios, incluida la de `order.js`. Si ambos handlers configuran `axios.defaults.timeout`, el valor final dependerá del orden de carga. Lo más robusto es crear una instancia compartida en un archivo separado (ej. `src/handlers/axiosInstance.js`) y exportarla. Eso queda fuera del alcance de esta mejora puntual.

---

## 4. Arreglar el semicolon en `tailwind.config.js`

**Problema:** En la línea 6, el string del `fontFamily` para `default` termina con `;` dentro del valor del string. Ese semicolon es parte del valor de la fuente y no de JavaScript, lo que hace que el nombre de la familia de fuentes enviado al CSS sea `"Helvetica Neue,sans-serif;"` con el punto y coma incluido. Los navegadores ignoran esa declaración al analizarla como CSS inválido.

**Archivo:** `C:\Users\alvar\WebstormProjects\coohomReport\tailwind.config.js`

**ANTES (líneas 5-8):**
```javascript
fontFamily: {
  default: "Helvetica Neue,sans-serif;",
  login: "Muli,sans-serif",
},
```

**DESPUÉS:**
```javascript
fontFamily: {
  default: "Helvetica Neue,sans-serif",
  login: "Muli,sans-serif",
},
```

---

## 5. Añadir `baseUrl` en `jsconfig.json`

**Problema:** Sin `baseUrl` configurado, el editor (WebStorm / VS Code) no puede resolver los imports con el alias `@` y las rutas no se autocompletarán correctamente. El compilador tampoco valida los paths.

**Archivo:** `C:\Users\alvar\WebstormProjects\coohomReport\jsconfig.json`

**ANTES (archivo completo):**
```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "target": "ES2020",
        "jsx": "react",
        "allowImportingTsExtensions": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true
    },
    "exclude": [
        "node_modules",
        "**/node_modules/*"
    ]
}
```

**DESPUÉS:**
```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "target": "ES2020",
        "jsx": "react",
        "allowImportingTsExtensions": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "exclude": [
        "node_modules",
        "**/node_modules/*"
    ]
}
```

> El `"baseUrl": "."` hace que la raíz del proyecto sea la base para resolver imports. El `"paths": { "@/*": ["src/*"] }` le dice al editor que `@/` equivale a `src/`. Esto alinea `jsconfig.json` con el alias de `vite.config.js` del punto 2.

---

## 6. Quitar `console.log()` de producción

**Problema:** El proyecto tiene aproximadamente 30+ `console.log()` activos en handlers y componentes. En producción exponen información interna en la consola del navegador (rutas de API, datos de órdenes, errores de red) y tienen un impacto menor en rendimiento.

**Solución:** Condicionar los `console.log` existentes con `import.meta.env.DEV`. Vite define `DEV` como `true` en modo desarrollo y `false` en el build de producción. Los bloques `if (import.meta.env.DEV)` se eliminan completamente del bundle de producción por tree-shaking.

### Patrón a aplicar en cada `console.log` existente:

**ANTES (ejemplo de `handlers/order.js`):**
```javascript
} catch (error) {
  console.log(error);
  return false;
}
```

**DESPUÉS (si no se aplica el helper del documento 02):**
```javascript
} catch (error) {
  if (import.meta.env.DEV) console.log(error);
  return false;
}
```

> Si ya se aplicó la mejora del documento 02 (función `handleOrderError`), los `console.log` de los `catch` de `order.js` ya habrán sido reemplazados. Aplicar este patrón solo a los que queden fuera de los catch, o en otros archivos.

### Archivos con `console.log` activos a revisar:

| Archivo | Descripción |
|---|---|
| `handlers/order.js` | ~10 en catch blocks (cubiertos por doc 02) |
| `handlers/user.js` | `handleAxiosError` — 3 `console.log` activos |
| `components/forms/products.jsx` | ~3 activos |
| `components/forms/history.jsx` | ~3 activos |
| `components/pages/Encimeras/encimeras.jsx` | 1 activo |
| `data/parseJson3d.js` | 1 activo |

### Ejemplo para `handlers/user.js` — función `handleAxiosError`:

**ANTES (líneas 107-116):**
```javascript
const handleAxiosError = (error) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log("Error", error.message);
  }
};
```

**DESPUÉS:**
```javascript
const handleAxiosError = (error) => {
  if (!import.meta.env.DEV) return;
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log("Error", error.message);
  }
};
```

> Añadir `if (!import.meta.env.DEV) return;` al inicio de `handleAxiosError` es la forma más limpia: en producción la función sale inmediatamente sin ejecutar ningún `console.log`.

### Alternativa global con `vite.config.js` (si se prefiere eliminarlos todos de una vez):

Vite soporta la opción `drop` en `esbuild` para eliminar automáticamente todos los `console.log` del bundle de producción sin tocar el código fuente:

**En `vite.config.js`, añadir dentro de `defineConfig`:**
```javascript
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        minify: 'esbuild',
    },
    esbuild: {
        drop: import.meta.env?.MODE === 'production' ? ['console', 'debugger'] : [],
    },
})
```

> **Atención:** `esbuild.drop` en `vite.config.js` no tiene acceso a `import.meta.env` en tiempo de configuración. La forma correcta es usar la función de configuración con el parámetro `mode`:

```javascript
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
}))
```

Con esta configuración, `npm run build` elimina todos los `console.*` y `debugger` del bundle final. `npm run dev` los mantiene.

---

## 7. Code-splitting de rutas pesadas

**Problema:** `report.jsx` importa `@react-pdf/renderer` (~500KB en el bundle de producción). `admin.jsx` importa `filestack-js`. Ambos se cargan en el bundle inicial aunque el usuario nunca visite esas páginas. Tiempo hasta interactivo (TTI) afectado en login y dashboard.

**Solución:** convertir esas dos rutas en `React.lazy` con `Suspense`, así Vite genera chunks separados que solo se descargan cuando el usuario navega allí.

**Archivo:** `src/App.jsx`

**ANTES (imports y rutas):**
```javascript
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

// ...

<Route path="Tiendas" element={<Admin />} />
<Route path="Report" element={<Report />} />
```

**DESPUÉS:**
```javascript
import React, { useState, lazy, Suspense } from "react";
import {
  Config,
  Dashboard,
  Login,
  Encimeras,
  RedirectLogin,
  Error,
  History,
} from "./components/index";

const Report = lazy(() => import("./components/pages/report/report"));
const Admin = lazy(() => import("./components/pages/admin/admin"));

// ...

const Loading = () => <div className="p-8 text-center">Cargando...</div>;

// dentro del JSX:
<Route path="Tiendas" element={
  <Suspense fallback={<Loading />}>
    <Admin />
  </Suspense>
} />
<Route path="Report" element={
  <Suspense fallback={<Loading />}>
    <Report />
  </Suspense>
} />
```

> Si los componentes `Report` y `Admin` se exportan como `export default` desde sus archivos, `lazy(() => import("./..."))` funciona directamente. Si solo tienen `export const`, hay que adaptar el import: `lazy(() => import("./..").then(m => ({ default: m.Report })))`.

**Verificar resultado:** tras `npm run build`, en `dist/assets/` deben aparecer chunks separados (`report-XXXX.js`, `admin-XXXX.js`). El bundle principal (`index-XXXX.js`) baja en tamaño.

---

## 8. Caché y debounce en `encimerasModal`

**Problema:** `src/components/pages/Encimeras/encimerasModal.jsx` líneas 59-77 hacen un fetch a `/reportCoohomComplements` (o similar) en cada cambio de filtro sin debounce ni caché. Si el usuario teclea "encimera" carácter a carácter, se lanzan 8 peticiones consecutivas. Si vuelve a un filtro previo, refetchea.

**Solución mínima:** debounce de 300ms + caché en `Map` por query.

### 8.1 Hook nuevo `src/hooks/useDebouncedValue.js`

```javascript
import { useEffect, useState } from "react";

export const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};
```

### 8.2 Caché simple a nivel de módulo

Dentro de `encimerasModal.jsx` (o en un archivo `src/data/encimerasCache.js`):

```javascript
const cache = new Map();

export const fetchEncimerasFiltered = async (query) => {
  if (cache.has(query)) return cache.get(query);
  const result = await getComplementsByText({ text: query });
  cache.set(query, result);
  return result;
};
```

### 8.3 Uso en el componente

```javascript
const [filter, setFilter] = useState("");
const debouncedFilter = useDebouncedValue(filter, 300);
const [items, setItems] = useState([]);

useEffect(() => {
  let cancelado = false;
  fetchEncimerasFiltered(debouncedFilter).then((res) => {
    if (!cancelado) setItems(res);
  });
  return () => { cancelado = true; };
}, [debouncedFilter]);
```

> Para invalidar la caché tras crear/borrar un complemento, exponer `cache.clear()` y llamarlo desde el handler que crea/borra. La caché vive solo en memoria del navegador y se reinicia al recargar — suficiente para el caso de uso.

---

## Pasos de ejecución en orden

1. **`package.json`** — Eliminar `@uidotdev/usehooks` y `caniuse-lite` de `dependencies`. Mover `json-server` a `devDependencies`. Eliminar `esm` de `devDependencies`. Ejecutar `npm install`.
2. **`vite.config.js`** — Añadir `import path from 'path'` y el bloque `resolve.alias`. Opcionalmente, convertir a función `defineConfig(({ mode }) => ...)` para el `esbuild.drop`.
3. **`handlers/order.js`** — `timeout: 15000` en la instancia compartida (ya cubierto en doc 03 sección 5.1 si se hizo el refactor de `axiosInstance.js`).
4. **`tailwind.config.js`** — Quitar el `;` del string `"Helvetica Neue,sans-serif;"`.
5. **`jsconfig.json`** — Añadir `"baseUrl": "."` y `"paths": { "@/*": ["src/*"] }`.
6. **`console.log` en producción** — Configurar `esbuild.drop` en `vite.config.js` para eliminarlos automáticamente en build.
7. **`App.jsx`** — Convertir `Report` y `Admin` a `React.lazy` con `<Suspense>`.
8. **`encimerasModal.jsx`** — Crear `useDebouncedValue` y caché en `Map`. Adaptar el `useEffect` de fetch.
9. Ejecutar `npm run build` y verificar:
   - El build completa sin errores.
   - `dist/assets/` tiene chunks separados para `report` y `admin`.
   - El bundle principal baja de tamaño respecto al build anterior.
10. Ejecutar `npm run preview` y comprobar que los colores de los botones se ven correctamente (doc 03), no hay `console.log` en consola, y la búsqueda en el modal de encimeras no satura la red.
