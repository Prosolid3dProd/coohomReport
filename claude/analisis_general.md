# INFORME TÉCNICO DE ANÁLISIS - COOHOM REPORT (Frontend)

**Fecha**: 6 de Mayo de 2026
**Proyecto**: CoohomReport — Frontend React + Vite + Tailwind CSS
**Ubicación**: `C:\Users\alvar\WebstormProjects\coohomReport`
**Backend asociado**: `C:\Users\alvar\WebstormProjects\backend-coohomReport` (Node.js + Express + MongoDB, puerto 3007)
**Objetivo**: Análisis exhaustivo de estructura, componentes obsoletos, problemas de seguridad y dependencias.

---

## 1. ESTRUCTURA GENERAL DEL PROYECTO

```
coohomReport/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── vercel.json
└── src/
    ├── App.jsx                              # Componente raíz con routing
    ├── main.jsx                             # Entry point
    ├── index.css                            # Estilos globales Tailwind
    ├── assets/                              # Imágenes y recursos
    ├── components/
    │   ├── index.js                         # Barrel export principal
    │   ├── icons.js                         # Iconografía centralizada (react-icons)
    │   ├── content/
    │   │   ├── muebles.jsx                  # Tabla interactiva de muebles/cabinetes
    │   │   ├── title.jsx                    # Header con acciones (subida de archivos)
    │   │   ├── modals.jsx                   # Componentes modales reutilizables
    │   │   └── logic/
    │   │       ├── btnLogic.js              # Lógica de botones
    │   │       ├── obtenerArchivoJson.js    # Procesamiento XLSX/Excel
    │   │       ├── crearTabla.jsx           # Generación de tablas
    │   │       ├── muebles.js               # Lógica de muebles
    │   │       └── domManage.js             # Manipulación del DOM
    │   ├── forms/
    │   │   ├── history.jsx                  # Lista de presupuestos con paginación
    │   │   ├── products.jsx                 # Formulario de productos/complementos
    │   │   ├── general.jsx                  # Formulario general de perfil
    │   │   ├── profile.jsx                  # Configuración de perfil de usuario
    │   │   └── orderList.jsx                # Listado de órdenes
    │   ├── interfaces/
    │   │   ├── nav/nav.jsx                  # Header con usuario y botón Orden
    │   │   └── menu/
    │   │       ├── menu.jsx                 # Menú principal
    │   │       ├── lista.jsx                # Listado de opciones de menú
    │   │       ├── botonPlegar.jsx          # Botón colapsar/expandir
    │   │       └── menuData.js              # Datos estáticos del menú
    │   ├── pages/
    │   │   ├── log/
    │   │   │   ├── login.jsx                # Página de login
    │   │   │   └── guard.jsx                # Protector de rutas (verifica token)
    │   │   ├── report/
    │   │   │   ├── report.jsx               # Generador de PDFs (múltiples tabs)
    │   │   │   ├── operaciones.jsx          # Cálculos de totales
    │   │   │   ├── confirmacion_pedido.jsx  # Documento PDF
    │   │   │   ├── confirmacion_pedido_venta.jsx
    │   │   │   ├── presupuesto_cliente.jsx
    │   │   │   ├── solaImages.js            # URLs de imágenes (posible obsoleto)
    │   │   │   └── report.css
    │   │   ├── admin/
    │   │   │   ├── admin.jsx                # Gestor de usuarios/tiendas
    │   │   │   ├── tienda.jsx               # Gestión de tiendas
    │   │   │   └── admin.css
    │   │   ├── Encimeras/
    │   │   │   ├── encimeras.jsx            # Listado filtrable de encimeras
    │   │   │   └── encimerasModal.jsx       # Modal de selección
    │   │   ├── dashboard.jsx                # Layout principal (Nav + Menu + Outlet)
    │   │   ├── others/config.jsx            # Página de configuración de perfil
    │   │   └── error/errorPage.jsx          # Página 404
    │   └── utils/
    │       ├── btnAction.jsx                # Botones estilizados con props de color
    │       ├── btnRedirect.jsx              # Botones de navegación
    │       └── index.js
    ├── data/
    │   ├── constants.js                     # Constantes globales (API URL, roles, códigos)
    │   ├── localStorage.js                  # Wrappers para localStorage
    │   ├── session.js                       # Wrappers para sessionStorage
    │   ├── parseJson3d.js                   # Parser JSON de Coohom (1492 líneas)
    │   └── index.js
    └── handlers/
        ├── order.js                         # 30+ funciones CRUD de órdenes (486 líneas)
        └── user.js                          # Autenticación y gestión de usuarios (116 líneas)
```

### Routing configurado en App.jsx

```
/Login                          → login.jsx (pública)
/                               → Redirector a /Login o /Dashboard
/Dashboard                      → dashboard.jsx (protegida)
  /Dashboard/Presupuestos       → history.jsx
  /Dashboard/Report             → report.jsx
  /Dashboard/Biblioteca         → encimeras.jsx
  /Dashboard/Config             → config.jsx
  /Dashboard/Tiendas            → admin.jsx (solo admin — SIN guard de rol)
/*                              → errorPage.jsx (404)
```

---

## 2. COMPONENTES OBSOLETOS O SIN USAR

### 2.1 Código comentado sin eliminar

| Archivo | Contenido comentado |
|---------|---------------------|
| `App.jsx` (líneas 21-27) | Componente `ReDirect` nunca usado |
| `components/content/muebles.jsx` (líneas 25-100) | Función `createRows()` completa |
| `components/content/title.jsx` (líneas 56-90) | Función `handleChangeJSON` (lógica antigua) |
| `handlers/order.js` (líneas 142-157) | Función `updateCabinet` |
| `handlers/order.js` (líneas 296-317) | Función `deleteComplements` (versión antigua) |
| `components/forms/products.jsx` (líneas 87-106) | Función `updateLocalOrderData` |
| `components/content/logic/obtenerArchivoJson.js` (líneas 48-54) | Campos `width`, `height`, `archived` |

### 2.2 Archivos posiblemente obsoletos

- **`pages/report/solaImages.js`** — Define URLs de imágenes pero no se encuentra importado en ningún otro archivo.
- **`assets/Generador de Informes.html`** y **`assets/Generador de Informes_files/`** — Archivos de snapshot HTML histórico. No forman parte del bundle ni se usan en código. Deberían eliminarse de `src/`.

### 2.3 Opción de menú comentada

En `components/interfaces/menu/menuData.js` (líneas 19-22): La opción "Config" está comentada. Si está en uso condicionalmente para admin, debería gestionarse con lógica de roles en vez de comentario.

---

## 3. PROBLEMAS DE SEGURIDAD Y CÓDIGO COMPROMETIDO

### 3.1 CRÍTICO: Token hardcodeado en código fuente

**`handlers/order.js` (línea 11) y `handlers/user.js` (línea 8):**
```javascript
TOKEN: "Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH"
```
Este mismo token está hardcodeado en el backend (`routes/sola.js` línea 11 como `_TOKEN_`). Ambos extremos exponen el mismo secreto en sus respectivos repositorios. Rotar y mover a variables de entorno en ambos proyectos simultáneamente.

### 3.2 CRÍTICO: URLs de backend hardcodeadas

En `data/constants.js:9`, `handlers/order.js:9`, `handlers/user.js:7` y `components/content/title.jsx` (líneas 139, 151):
```javascript
BACKEND_URL: "https://api.simulhome.com/coohomReport"
```
El backend correcto es `backend-coohomReport` corriendo en el puerto 3007. No se usa ningún archivo `.env`. Cambiar de entorno (local vs. producción) requiere modificar código fuente y recompilar.

### 3.3 ALTO: Token inconsistente entre handlers

- `handlers/order.js` usa `Settings.TOKEN` (el `_TOKEN_` hardcodeado del backend — validación secundaria de API)
- `handlers/user.js` usa `Cookies.get("token")` — el JWT que devuelve `/signinReporthom`

Son dos mecanismos distintos: uno es un token de API fijo, el otro es un JWT de sesión. La inconsistencia hace difícil auditar qué protege cada endpoint.

### 3.4 ALTO: Filestack API key expuesta

**`pages/admin/admin.jsx` (línea 43):**
```javascript
filestack.init("AXPWPBPSTvSKYoyHwByaaz")
```
Aunque las keys de Filestack tienen scope limitado, no deben estar en código fuente ni en el historial de git.

### 3.5 ALTO: console.log() en código de producción

| Archivo | Instancias aproximadas |
|---------|----------------------|
| `handlers/order.js` | ~25 |
| `handlers/user.js` | ~8 |
| `components/forms/products.jsx` | ~3 activas + 3 comentadas |
| `components/forms/history.jsx` | ~3 |
| `components/pages/Encimeras/encimeras.jsx` | 1 |
| `data/parseJson3d.js` | 1 |

Expone información interna en la consola del navegador y afecta al rendimiento.

### 3.6 ALTO: Sin protección de roles en rutas de admin

`/Dashboard/Tiendas` renderiza `admin.jsx` sin verificar si el usuario tiene rol de administrador. El guard `guard.jsx` solo comprueba si existe un token, no el rol.

Un usuario `client` puede acceder editando su localStorage.

### 3.7 ALTO: window.location.reload() como patrón de actualización de estado

| Archivo | Líneas |
|---------|--------|
| `login.jsx` | 46 |
| `muebles.jsx` | 264, 349, 364, 381 |
| `profile.jsx` | 58 |

Hard reload elimina el estado de React, es lento y produce mala experiencia de usuario. La solución correcta es actualizar el estado con `setState` o llamar `navigate()`.

**Además**, en `login.jsx` hay un typo en la línea ~150:
```javascript
onClick={() => { window.reload; }}  // No hace nada — falta () y .location
```

### 3.8 MEDIO: Token guardado en localStorage (vulnerable a XSS)

Si el proyecto tiene algún punto de XSS (incluso en futuras dependencias), el token puede ser robado desde `localStorage`. La alternativa más segura es usar cookies `httpOnly` gestionadas por el servidor.

### 3.9 MEDIO: Sin manejo de errores diferenciado en llamadas API

Todos los `catch` en `handlers/order.js` hacen:
```javascript
catch (error) {
  console.log(error);
  return false;
}
```
El caller recibe `false` sin saber si fue un error de red, 401, 404 o 500. El usuario no recibe feedback útil.

### 3.10 BAJO: Clases Tailwind dinámicas con template strings

En `components/utils/btnAction.jsx`:
```javascript
className={`text-[${color}] bg-[${background}]`}
```
Tailwind genera CSS en tiempo de build y no puede detectar clases construidas dinámicamente con template strings. Estas clases no aparecerán en el CSS final del bundle. Usar `style={{}}` para valores dinámicos o predefinir las clases.

### 3.11 BAJO: Lógica con "número mágico" sin documentar

En `report.jsx` (línea ~54):
```javascript
item.customcode === "3333"
```
El código `3333` no tiene nombre ni comentario que explique qué tipo de artículo representa. Debería ser una constante nombrada en `data/constants.js`.

---

## 4. GESTIÓN DE ESTADO Y DATOS

### 4.1 Patrón actual

El estado se gestiona mediante una combinación de:
- `useState` local por componente
- `localStorage` como base de datos de sesión
- Un `userContext` en `App.jsx` que no se usa consistentemente

### 4.2 Problemas

**localStorage como source of truth:**
- `handlers/order.js` tiene funciones `getLocalOrder()` / `setLocalOrder()` que guardan la orden entera en localStorage.
- Si el servidor actualiza la orden desde otra fuente, el frontend lo desconoce.
- Si el usuario abre dos pestañas, los datos se desincronizarán.

**Lógica de negocio en componentes UI:**
- `report.jsx` (líneas 40-92): cálculos complejos de totales dentro de un `useMemo`.
- `history.jsx` (líneas 23-37): función de cálculo de días dentro del componente.
- `title.jsx` (líneas 92-122): lógica de actualización de órdenes en el componente visual.

**useEffect sin cleanup:**
- `profile.jsx` (líneas 20-49): fetch sin cleanup — si el componente se desmonta antes de completarse, puede actualizar estado de un componente desmontado.

**Sin caché de peticiones:**
- `encimerasModal.jsx` (líneas 59-77): hace un fetch en cada cambio de filtro sin caché ni debounce.

---

## 5. SERVICIOS Y LLAMADAS API

### 5.1 Endpoints consumidos (desde handlers/) — estado en backend

El backend correcto es `backend-coohomReport`. El análisis cruzado revela que 3 de los 24 endpoints que consume el frontend **no están implementados en el backend** (están comentados en `routes/sola.js`):

| Endpoint | Estado en backend |
|---|---|
| POST /signinReporthom | ✓ Implementado |
| POST /createUserCoohom | ✓ Implementado |
| POST /reportCoohomUserLists | ✓ Implementado |
| POST /editUserCoohom | ✓ Implementado |
| POST /deleteUserCoohom | ✓ Implementado |
| POST /reportCoohom | ✓ Implementado |
| PUT /reportCoohom | ✓ Implementado |
| POST /reportsCoohom | ✓ Implementado |
| POST /reporthomById | ✓ Implementado |
| GET /reportCoohomComplements | ✓ Implementado |
| POST /reportCoohomComplementsbyText | ✓ Implementado |
| **POST /reportCoohomCabinetCreate** | **✗ COMENTADO en backend — 404** |
| **PUT /reportCoohomCabinets** | **✗ COMENTADO en backend — 404** |
| POST /reporthomDetails | ✓ Implementado |
| PUT /reporthomDetails | ✓ Implementado |
| POST /reporthomComplementDetailsDelete | ✓ Implementado |
| **POST /reporthomUpdateCabinets** | **✗ COMENTADO en backend — 404** |
| PUT /archivedReportCoohom | ✓ Implementado |
| POST /cargarNuevoXlsxSola | ✓ Implementado |
| POST /eliminarComplementsXlsxSola | ✓ Implementado |
| POST /resetPasswordUserCoohom | ✓ Implementado |
| POST /getProfile | ✓ Implementado |
| PUT /profileUpdate | ✓ Implementado |
| POST /eliminarPorCodigo | ✓ Implementado |

Los 3 endpoints faltantes corresponden a operaciones de gabinetes individuales. Si el frontend los llama, recibirá un 404 silencioso (el backend devuelve false, no un error claro).

### 5.2 Problemas en handlers/

- Sin timeout configurado en axios: si el servidor cuelga, el usuario espera indefinidamente.
- Sin reintentos automáticos en operaciones críticas.
- URLs de Upload en Ant Design Upload están hardcodeadas directamente en `title.jsx`, no pasan por `handlers/`.

### 5.3 setLocalOrder retorna Promise sin await

```javascript
export const setLocalOrder = async (params) => {
  return new Promise((resolve) => {
    localStorage.setItem("order", JSON.stringify(params));
    resolve(getOrders());  // getOrders() es async, pero no se espera
  });
};
```
La Promise siempre se resuelve inmediatamente. El resultado de `getOrders()` se ignora.

---

## 6. DEPENDENCIAS (package.json)

### Paquetes problemáticos en `dependencies`

| Paquete | Problema |
|---------|----------|
| `json-server` | Herramienta de desarrollo (mock API). No debe estar en dependencias de producción. |
| `@uidotdev/usehooks` | No se encontró ningún import en el código. Probablemente no se usa. |
| `caniuse-lite` | Dependencia de herramientas de build, no de runtime. No debería estar aquí. |

### Paquetes desactualizados

| Paquete | Versión instalada | Nota |
|---------|------------------|------|
| `react-router-dom` | ^6.14.1 (agosto 2023) | Funcional pero sin updates de seguridad recientes |
| `antd` | ^5.8.2 (agosto 2023) | Versión actual: 5.15+ |
| `vite` (devDep) | ^4.4.0 (agosto 2023) | Versión actual: 5.x |

### Paquetes en devDependencies a revisar

- `esm` (^3.2.25): No se encuentra usado. Vite ya gestiona ESM nativamente.

---

## 7. CONFIGURACIÓN

### vite.config.js

Configuración mínima — funciona, pero sin:
- Alias de paths (ej. `@/components` → `src/components`)
- Proxy para API en desarrollo
- Optimizaciones de chunk

### tailwind.config.js

```javascript
fontFamily: {
  default: "Helvetica Neue,sans-serif;",  // Semicolon innecesario dentro del string
}
screens: {
  tableHeader: { max: "768px" }           // Nombre confuso: no es un header
}
backgroundImage: {
  login: "url('../../../assets/loginBg.jpg')"  // Ruta relativa frágil
}
```

Las fuentes `Helvetica Neue` y `Muli` no se cargan explícitamente — dependen de que estén instaladas en el sistema del usuario.

### jsconfig.json

Sin `paths` ni `baseUrl` configurados: todos los imports son relativos (`../../`), lo que hace el código más difícil de mantener.

### vercel.json

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```
Correcto para SPA con React Router.

---

## 8. MANIPULACIÓN DIRECTA DEL DOM

El proyecto usa `document.getElementById()` directamente en varios componentes React, lo que rompe el modelo declarativo y puede causar errores en SSR o en re-renders:

| Archivo | Líneas aproximadas |
|---------|-------------------|
| `pages/others/config.jsx` | 88, 97, 143, 199 |
| `components/content/title.jsx` | 8 |
| `components/content/muebles.jsx` | 6 |

Además, en `config.jsx`:
- `window.onload` y `window.onresize` se reasignan en cada render del componente.
- Los listeners se acumulan, causando memory leak.

Solución: usar `useRef` y `useEffect` con cleanup.

---

## 9. RESUMEN EJECUTIVO

### Críticos (acción inmediata)

1. **Token hardcodeado** — Rotar y mover a variable de entorno del servidor.
2. **URLs de backend hardcodeadas** — Crear `.env.local` con `VITE_API_URL`.
3. **Sin guard de rol en /Tiendas** — Cualquier usuario autenticado puede acceder al panel de admin.
4. **Filestack key en código fuente** — Mover a variable de entorno.

### Altos (corregir pronto)

5. **Token inconsistente** — Unificar uso de token entre `order.js` y `user.js`.
6. **console.log() en producción** — Eliminar o condicionar a `import.meta.env.DEV`.
7. **window.location.reload()** — Reemplazar con `navigate()` o actualización de estado.
8. **Sin manejo de errores diferenciado** — Distinguir tipos de error en handlers.
9. **useEffect sin cleanup** — Añadir return de cleanup en fetches dentro de useEffect.

### Medios (refactorizar)

10. **localStorage como source of truth** — Evaluar React Query o SWR para caché sincronizada.
11. **Lógica de negocio en UI** — Mover cálculos complejos a handlers o hooks personalizados.
12. **Código comentado** — Eliminar bloques de código comentado (7 archivos afectados).
13. **Clases Tailwind dinámicas** — Reemplazar por `style={{}}` o clases predefinidas.
14. **document.getElementById** — Reemplazar por `useRef`.
15. **Listeners en render** — Mover `window.onload/resize` a `useEffect` con cleanup.

### Bajos

16. **Número mágico "3333"** — Crear constante con nombre en `constants.js`.
17. **json-server en dependencies** — Mover a devDependencies o eliminar.
18. **@uidotdev/usehooks no usado** — Eliminar si no se usa.
19. **Archivos HTML en assets/** — Eliminar snapshots históricos de `src/assets/`.
20. **Alias en vite.config.js** — Añadir alias para simplificar imports relativos.

---

*Documento generado por Claude Code — 6 de Mayo de 2026*
*Solo análisis. No se modificó ningún archivo de código.*
