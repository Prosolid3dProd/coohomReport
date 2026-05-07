# 05 — Pendientes Futuros

Items que requieren decisión arquitectónica y/o esfuerzo significativo. No son refactors mecánicos, por lo que viven fuera de los 4 documentos por severidad. Cada uno se plantea como propuesta a evaluar, no como tarea a ejecutar de inmediato.

---

## 1. Caché sincronizado con el servidor — React Query / SWR

**Estado actual:** `localStorage` actúa como source-of-truth de la orden activa (`getLocalOrder`, `setLocalOrder`). El backend puede actualizar la orden desde otra fuente y el frontend no se entera. Si el usuario abre dos pestañas, los datos se desincronizan.

**Propuesta:** introducir [TanStack Query (React Query)](https://tanstack.com/query) o [SWR](https://swr.vercel.app/). Ventajas:
- Invalidación de caché y refetch automático al volver a la pestaña.
- Estados unificados de `isLoading`, `isError`, `data` por query.
- Optimistic updates con rollback automático ante error.
- Eliminación gradual del `localStorage` como base de estado del servidor (puede seguir usándose para preferencias del usuario, no para datos del backend).

**Impacto:** alto. Implica reescribir cada handler como `useQuery` / `useMutation` y eliminar el patrón `getLocalOrder/setLocalOrder` en componentes.

**Cuándo:** después de los docs 01-04. Idealmente como rama dedicada con tests (ver punto 4).

---

## 2. Error Boundary global

**Estado actual:** un error de render dentro de cualquier componente causa pantalla en blanco. No hay forma de recuperarse sin recargar.

**Propuesta:** componente `<ErrorBoundary>` envolviendo `<Routes>` en `App.jsx`. Muestra un fallback con botón "Volver al inicio" y, opcionalmente, envía el error a la telemetría (punto 3).

**Implementación mínima:**
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error(error, info); /* enviar a telemetría */ }
  render() {
    if (this.state.hasError) return <FallbackUI error={this.state.error} />;
    return this.props.children;
  }
}
```

**Impacto:** bajo. Un solo componente nuevo, dos líneas en `App.jsx`.

---

## 3. Telemetría / Sentry-equivalent

**Estado actual:** errores no manejados y warnings se pierden en la consola del navegador del usuario. Sin visibilidad de errores en producción.

**Propuesta:** integrar Sentry, LogRocket, Highlight, o un endpoint propio del backend (`POST /reportCoohomError`). El backend ya tiene `errorHandler` central que loguea en consola; añadir un transporte (Sentry/winston/pino) cerraría el loop.

**Decisión a tomar:**
- ¿Coste de Sentry justifica el caso de uso? Para una app interna con usuarios identificables, una solución simple casera (POST a un endpoint que escriba en MongoDB) puede ser suficiente.
- ¿Cuántos errores se generan hoy? Sin datos, es difícil dimensionar.

---

## 4. Tests unitarios — Vitest + Testing Library

**Estado actual:** cero tests. No hay forma de validar refactors sin probar manualmente cada flujo.

**Propuesta:** configurar [Vitest](https://vitest.dev/) (encaja con Vite sin esfuerzo) + `@testing-library/react`. Empezar por:

1. **Handlers** (`order.js`, `user.js`) — mockear axios y validar shape de las llamadas. Test directo, sin renderizado.
2. **`data/parseJson3d.js`** — parser puro de 1492 líneas, candidato perfecto para tests con fixtures de JSON real.
3. **Hooks personalizados** (`useReportTotals`, `useDebouncedValue`) — `renderHook` de Testing Library.
4. **Componentes críticos** (`muebles.jsx`, `report.jsx`, `login.jsx`) — al final, cuando los puntos 1-3 estén estables.

**Impacto:** medio. La configuración inicial es simple. La cobertura razonable (~50%) son varias semanas de trabajo, pero se puede ir incrementalmente.

---

## 5. Migración opcional a TypeScript

**Estado actual:** todo el frontend es `.jsx` / `.js`. El parser de JSON 3D tiene 1492 líneas sin tipado, lo que hace difícil entender la forma de los datos sin rastrear los usos.

**Propuesta:** migración gradual con `allowJs: true`. Empezar por:
- `data/constants.js` → `data/constants.ts` (cambia poco, gana autocompletar en `CONFIG.ROLE.ADMIN` etc.).
- `data/localStorage.js`, `data/session.js` → tipar `User`, `Order`.
- Handlers tipados con interfaces de request/response (alineadas con el backend).

**Coste:** alto. La pregunta clave es: ¿hay equipo con experiencia en TS para mantenerlo? Si es solo una persona y prefiere JS, no merece el coste de migración.

**Plantear como decisión, no como acción.**

---

## 6. Lazy-load del resto de rutas

Cubierto parcialmente en `04_bajo_rendimiento.md` sección 7 (lazy de `report` y `admin`). El resto de rutas (`encimeras`, `presupuestos`, `config`) también puede ser lazy si el bundle principal sigue siendo grande tras el primer split.

**Decisión:** ejecutar tras medir el tamaño del bundle post-04. Si está por debajo de 200KB gzip, no merece la pena.

---

## 7. Centralizar uploads de Ant Design en `handlers/order.js`

**Estado actual:** `src/components/content/title.jsx` líneas ~140-156 tienen objetos `props1` y `props2` con la URL del endpoint, headers de auth y handlers `onChange` directamente en el JSX. La URL sigue siendo literal incluso tras la migración a `VITE_API_URL` (porque está fuera de los handlers).

**Propuesta:** crear `handlers/uploads.js` con funciones:
```javascript
export const buildUploadProps = (endpoint, onChange) => ({
  action: `${import.meta.env.VITE_API_URL}/${endpoint}`,
  method: "POST",
  headers: { Authorization: `Bearer ${getLocalToken()?.token}` },
  onChange,
});
```

`title.jsx` queda:
```javascript
const props1 = buildUploadProps("cargarNuevoXlsxSola", handleChange);
const props2 = buildUploadProps("eliminarComplementsXlsxSola", handleChange);
```

**Impacto:** bajo. Una función nueva, dos cambios en `title.jsx`.

---

## 8. Refactor de `handlers/order.js` (486 líneas)

**Estado actual:** un solo archivo con 30+ funciones que cubren órdenes, complementos, cabinets, detalles y profile. Es difícil de navegar y testear.

**Propuesta:** dividir por dominio espejando el backend (`controllers/` ya está dividido así):

```
src/handlers/
├── axiosInstance.js     (creado en doc 03)
├── orders.js            (createOrder, updateOrder, getOrders, getOrderById, archivedOrder)
├── cabinets.js          (createCabinetByUser, updateCabinetsOrder, updateCabinet, updateCabinetsInternal)
├── complements.js       (getComplements, getComplementsByText, deleteComplements)
├── details.js           (CreateOrderDetails, updateOrderDetails, archivedOrderDetails, handleArchivedOrderDetails)
├── profile.js           (getProfile, updateProfile)
└── uploads.js           (del punto 7)
```

`user.js` también puede dividirse en `auth.js` (login, resetPassword) y `users.js` (createUser, editUser, deleteUser, getUsers).

**Impacto:** medio. Mecánico (mover funciones), pero implica actualizar todos los imports en componentes. Recomendable hacerlo después de los tests del punto 4 para detectar regresiones.

---

## Recomendación de orden

Si se ejecutan estos pendientes, este es el orden con menor riesgo:

1. **Error Boundary** (punto 2) — pequeño, alto valor, sin impacto en otras partes.
2. **Tests con Vitest** (punto 4) — base para todo lo demás.
3. **Centralizar uploads** (punto 7) — barato, cierra el último pedazo de URL hardcodeada.
4. **Refactor de `order.js`** (punto 8) — solo después de tests.
5. **React Query / SWR** (punto 1) — cambio grande, hacerlo con red de seguridad (tests).
6. **Telemetría** (punto 3) — útil pero requiere decisión de proveedor.
7. **Migración TS** (punto 5) — última prioridad, decisión de equipo.

> No hay dependencia estricta entre estos puntos y los de los docs 01-04. Pero ejecutar primero 01 (auth Bearer) y 02 (handleApiError) deja el contrato cliente-servidor estabilizado para que los pendientes futuros se construyan sobre base sólida.