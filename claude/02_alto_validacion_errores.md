# 02 — Validación, Errores y Estado

Categoría: `window.location.reload()` · typo `window.reload` · `handleOrderError` que entiende el formato del backend · `useEffect` cleanup · `setLocalOrder` síncrono

El backend ahora devuelve errores en formato uniforme `{ ok: false, message: "..." }` desde `middlewares/errorHandler.js`. Las recomendaciones de este documento están alineadas con ese contrato.

---

## 1. Reemplazar `window.location.reload()` en todos los archivos afectados

`window.location.reload()` destruye el estado de React, recarga todos los recursos de red y produce un parpadeo. La alternativa es actualizar estado local o llamar a la función que recarga datos del servidor.

### 1.1 `src/components/pages/log/login.jsx` (línea 46)

**ANTES (función `onFinish`, líneas 32-48):**
```javascript
const onFinish = async (values) => {
  
  const result = await login({
    email: values.email,
    password: values.password,
  });
  const { ok, message } = result;

  if (!ok) return onFailed(message);

  mensajeBienvenida(result?.user?.name || "Compañero");
  localStorage.setItem("token", JSON.stringify(result));
  localStorage.removeItem("init");

  window.location.reload();
  window.location.href = "/Dashboard/Presupuestos";
};
```

**DESPUÉS:**
```javascript
const onFinish = async (values) => {
  const result = await login({
    email: values.email,
    password: values.password,
  });
  const { ok, message } = result;

  if (!ok) return onFailed(message);

  mensajeBienvenida(result?.user?.name || "Compañero");
  localStorage.setItem("token", JSON.stringify(result));
  localStorage.removeItem("init");

  navigate("/Dashboard/Presupuestos");
};
```

> `useNavigate` ya está importado y `navigate` ya está declarado en el componente.

### 1.2 `src/components/content/muebles.jsx` (líneas 349, 364, 381)

Los tres `window.location.reload()` están dentro de `handleFinished` y `handleArchived`. El componente ya tiene `setOrden` y `getDataOrden` para refrescar datos.

**ANTES — `handleFinished` modo `edit` (líneas 334-351):**
```javascript
if (selected.mode === "edit") {
  // ...
  const result = await updateCabinetsOrder({
    _id: getLocalOrder()?._id,
    cabinets: allFields,
  });

  if (result) {
    message.success("Mueble actualizado correctamente");
    window.location.reload();
  }
}
```

**DESPUÉS:**
```javascript
if (selected.mode === "edit") {
  // ...
  const result = await updateCabinetsOrder({
    _id: getLocalOrder()?._id,
    cabinets: allFields,
  });

  if (result?.ok !== false) {
    message.success(result?.message || "Mueble actualizado correctamente");
    setOpenModal(false);
    await getDataOrden();
  }
}
```

Aplicar el mismo patrón a modo `new` y a `handleArchived`. Cambios clave:
- Validar `result?.ok !== false` (acepta tanto `result === true` legacy como `{ ok: true }`).
- Usar `result?.message` como texto del `message.success`.
- Cerrar el modal con `setOpenModal(false)`.
- Llamar a `getDataOrden()` en lugar de `reload`.

**Nota sobre `ButtonModal` (línea 264):** tiene un `location.reload()` dentro de `Popconfirm`. Pasar `onDelete` como prop:

**ANTES:**
```javascript
onConfirm={() => {
  eliminarVariante(muebleIndex, variableIndex);
  location.reload();
}}
```

**DESPUÉS:**
```javascript
onConfirm={() => {
  eliminarVariante(muebleIndex, variableIndex);
  if (onDelete) onDelete();
}}
```

Cuando se instancie, pasar `onDelete={getDataOrden}`.

### 1.3 ~~`src/components/forms/general.jsx`~~ — YA CORREGIDO

> Verificación 2026-05-07: el `setTimeout(() => location.reload(), 1000)` que mencionaba la versión anterior de este documento **ya no está en el código**. El `onFinish` actual (líneas 106-134) usa `setLocalOrder(updatedData)` + `getData(updatedData)` + `form.setFieldsValue(updatedData)` correctamente. No hay acción pendiente en esta sección.

---

## 2. Corregir el typo `window.reload` en `login.jsx`

**Problema:** Línea 150 — el botón "Acceder" tiene `onClick={() => { window.reload; }}`. Sin paréntesis, sin `.location`, expresión inerte. Como el submit ya lo gestiona `htmlType="submit"`, este `onClick` es innecesario.

**ANTES (líneas 140-156):**
```javascript
<Form.Item className="flex justify-center">
  <Button
    style={{
      backgroundColor: "#1a7af8",
      width: "160px",
      height: "40px",
    }}
    type="primary"
    htmlType="submit"
    onClick={() => {
      window.reload;
    }}
    className="login-form-button"
  >
    Acceder
  </Button>
</Form.Item>
```

**DESPUÉS:**
```javascript
<Form.Item className="flex justify-center">
  <Button
    style={{
      backgroundColor: "#1a7af8",
      width: "160px",
      height: "40px",
    }}
    type="primary"
    htmlType="submit"
    className="login-form-button"
  >
    Acceder
  </Button>
</Form.Item>
```

---

## 3. `handleOrderError` que entiende el formato del backend

El backend ahora responde a errores con `{ ok: false, message: "Texto humano" }`. El helper debe priorizar `error.response.data.message` antes de caer al genérico por status.

**Archivo:** `src/handlers/order.js`

### 3.1 Añadir el import de `message`

**ANTES (líneas 1-4):**
```javascript
import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";
```

**DESPUÉS:**
```javascript
import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";

import { CONFIG } from "../data/constants";
import { getLocalToken } from "../data/localStorage";
```

### 3.2 Añadir la función helper

Justo después del interceptor del axios instance:

```javascript
/**
 * Maneja errores de llamadas a la API y muestra feedback al usuario.
 * Prioriza el mensaje del backend (`error.response.data.message`) cuando existe.
 * @param {Error} error - El error capturado en el catch.
 * @param {string} contexto - Descripción de la operación que falló.
 * @returns {{ ok: false, message: string }}
 */
const handleOrderError = (error, contexto = "la operación") => {
  const backendMessage = error?.response?.data?.message;
  let texto;

  if (backendMessage) {
    texto = backendMessage;
  } else if (error.response) {
    const status = error.response.status;
    if (status === 401) texto = "Sesión expirada. Por favor, vuelve a iniciar sesión.";
    else if (status === 403) texto = "No tienes permisos para esta operación.";
    else if (status === 404) texto = `Recurso no encontrado al ejecutar ${contexto}.`;
    else if (status >= 500) texto = `Error del servidor (${status}) en ${contexto}.`;
    else texto = `Error ${status} en ${contexto}.`;
  } else if (error.request) {
    texto = "Sin respuesta del servidor. Verifica tu conexión.";
  } else {
    texto = `Error inesperado en ${contexto}: ${error.message}`;
  }

  message.error(texto);
  return { ok: false, message: texto };
};
```

> Cambio respecto a la versión anterior: el helper devuelve `{ ok: false, message }` en lugar de `false`. Así el caller puede distinguir error de éxito incluso si la respuesta legítima del backend es un boolean. Ajustar callers que comparaban con `=== false`.

### 3.3 Reemplazar los `catch` en cada función

**ANTES:**
```javascript
} catch (error) {
  console.log(error);
  return false;
}
```

**DESPUÉS:**
```javascript
} catch (error) {
  return handleOrderError(error, "DESCRIPCIÓN_DE_LA_OPERACIÓN");
}
```

Tabla de descripciones por función:

| Función | Descripción a pasar |
|---|---|
| `createOrder` | `"crear orden"` |
| `createCabinetByUser` | `"crear gabinete"` |
| `updateOrder` | `"actualizar orden"` |
| `updateProfile` | `"actualizar perfil"` |
| `getOrders` | `"obtener órdenes"` |
| `getComplements` | `"obtener complementos"` |
| `getComplementsByText` | `"buscar complementos"` |
| `getOrderById` | `"obtener orden por ID"` |
| `getProfile` | `"obtener perfil"` |
| `CreateOrderDetails` | `"crear detalles de orden"` |
| `updateOrderDetails` | `"actualizar detalles de orden"` |
| `updateCabinetsOrder` | `"actualizar gabinetes"` |
| `archivedOrderDetails` | `"archivar detalles"` |
| `handleArchivedOrderDetails` | `"eliminar detalle de complemento"` |
| `updateCabinet` | `"actualizar gabinete"` |
| `archivedOrder` | `"archivar orden"` |
| `deleteComplements` | `"eliminar complemento"` |

### 3.4 Aplicar lo mismo en `user.js`

`handlers/user.js` ya tiene `handleAxiosError` pero no muestra `message.error()` al usuario. Reescribirla igual que `handleOrderError` (puede vivir en un archivo compartido — ver doc 03 sección 5).

---

## 4. `useEffect` sin cleanup en `src/components/forms/general.jsx`

**Problema:** El `useEffect` de la línea 20 lanza `fetchUserData` async. Si el componente se desmonta antes, `setInitialValues` y `form.setFieldsValue` se ejecutan sobre un componente desmontado y React lanza el warning *"Can't perform a React state update on an unmounted component"*.

**ANTES (líneas 20-49):**
```javascript
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const users = await getUsers();
      const currentUser = users.find(
        (user) => user.email === data.profile.email
      );
      if (currentUser) {
        const updatedValues = {
          email: currentUser.email,
          info2: currentUser.info2,
          // ... más campos
        };
        setInitialValues(updatedValues);
        form.setFieldsValue(updatedValues);
      }
    } catch (error) {
      message.error("Error al cargar los datos del usuario");
    }
  };
  fetchUserData();
}, [data, form]);
```

**DESPUÉS:**
```javascript
useEffect(() => {
  let cancelado = false;

  const fetchUserData = async () => {
    try {
      const users = await getUsers();
      if (cancelado) return;

      const currentUser = users.find(
        (user) => user.email === data.profile.email
      );
      if (currentUser) {
        const updatedValues = {
          email: currentUser.email,
          info2: currentUser.info2,
          // ... más campos
        };
        setInitialValues(updatedValues);
        form.setFieldsValue(updatedValues);
      }
    } catch (error) {
      if (!cancelado) {
        message.error("Error al cargar los datos del usuario");
      }
    }
  };

  fetchUserData();

  return () => {
    cancelado = true;
  };
}, [data, form]);
```

---

## 5. `setLocalOrder` con Promise innecesaria

**Problema:** `setLocalOrder` en líneas 478-484 usa `async/Promise` sin necesidad y resuelve con `getOrders()` (async) sin `await`. La Promise siempre resuelve con una Promise pendiente que nadie consume.

**ANTES (líneas 478-484, verificadas 2026-05-07):**
```javascript
// Esta funcion es para guardar en localstorage
export const setLocalOrder = async (params) => {
  return new Promise((resolve) => {
    localStorage.setItem("order", JSON.stringify(params));
    resolve(getOrders()); // Asegura que getOrders() se ejecuta después de actualizar localStorage
  });
};
```

**DESPUÉS:**
```javascript
// Guarda la orden en localStorage de forma síncrona.
// Si necesitas refrescar datos del servidor después de guardar, llama a getOrders() en el caller.
export const setLocalOrder = (params) => {
  localStorage.setItem("order", JSON.stringify(params));
};
```

> Callers que hacen `setLocalOrder(orderJson)` sin `await` siguen funcionando. Callers que hacen `await setLocalOrder(...)` también: `await undefined` resuelve inmediatamente.

---

## 6. Validar respuestas del backend con el nuevo formato

Tras la migración a Bearer y el `errorHandler` central, las respuestas del backend tienen forma `{ ok: true, ...data }` o `{ ok: false, message }`. Los componentes que consumen handlers deben validar `result?.ok` antes de continuar.

### Patrón general

**ANTES (típico):**
```javascript
const result = await someHandler(...)
if (result) {
  message.success("OK")
  // ... seguir
}
```

**DESPUÉS:**
```javascript
const result = await someHandler(...)
if (result?.ok === false) {
  // handleOrderError ya mostró message.error
  return
}
message.success(result?.message || "OK")
// ... seguir
```

> Con el cambio del helper de la sección 3, los callers que comparan con `if (result)` siguen funcionando porque `{ ok: false, ... }` también es truthy. Pero el feedback al usuario ya no es genérico — el helper habrá mostrado el `message.error` con el texto del backend.

---

## Pasos de ejecución en orden

1. **`login.jsx`** — Sustituir `window.location.reload()` + `window.location.href` por `navigate("/Dashboard/Presupuestos")`. Eliminar el `onClick` con `window.reload` del botón Acceder.
2. **`muebles.jsx`** — En `handleFinished` (modos `edit` y `new`) y `handleArchived`, reemplazar `window.location.reload()` por `await getDataOrden()`. Cerrar modal con `setOpenModal(false)`. En `ButtonModal`, añadir prop `onDelete` y usarlo en `Popconfirm.onConfirm`.
3. **`general.jsx`** — Sección 1.3: ya corregido, no actuar.
4. **`order.js`** — Añadir `import { message } from "antd"`. Añadir `handleOrderError` que lee `error.response.data.message`. Reemplazar todos los catch.
5. **`user.js`** — Reescribir `handleAxiosError` con la misma lógica (o moverlo al archivo compartido del doc 03).
6. **`general.jsx`** — En el `useEffect` inicial, añadir `cancelado` y el `return () => { cancelado = true; }`.
7. **`order.js`** — Reemplazar `setLocalOrder` por la versión síncrona sin Promise.
8. `npm run dev` y probar:
   - Login y editar un mueble — sin parpadeos de página.
   - Si se desconecta el backend, los `message.error` muestran "Sin respuesta del servidor".
   - Si el backend devuelve un 401 con `{ ok: false, message: "Token inválido" }`, el `message.error` muestra "Token inválido" (texto del backend, no genérico).
9. Comprobar en DevTools → Console que no hay warnings de "Can't perform a React state update on an unmounted component" al navegar rápido entre páginas.
