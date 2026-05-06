# 02 — Manejo de Errores y Estado

Categoría: `window.location.reload()` · typos · errores en handlers · useEffect sin cleanup · async innecesario

---

## 1. Reemplazar `window.location.reload()` en todos los archivos afectados

**Problema general:** `window.location.reload()` destruye el estado de React, obliga a re-cargar todos los recursos de red y produce un parpadeo visible. La alternativa correcta es actualizar el estado local o llamar a la función que vuelve a cargar los datos desde el servidor.

### 1.1 — `src/components/pages/log/login.jsx` (línea 46)

En `login.jsx` el reload se ejecuta justo antes de `window.location.href`, lo que no tiene sentido: si se asigna `href`, el navegador ya hace una navegación completa. La solución correcta es usar `useNavigate` de React Router, que ya está importado en el archivo.

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

> `useNavigate` ya está importado en la línea 2 del archivo. La constante `navigate` ya está declarada en el scope del componente (línea 3: `const navigate = useNavigate()`). No hay que añadir nada más.

---

### 1.2 — `src/components/content/muebles.jsx` (líneas 349, 364, 381)

Los tres `window.location.reload()` están dentro de `handleFinished` y `handleArchived`. El componente `Muebles` ya tiene estado `setOrden` y una función `getDataOrden` que recarga los datos desde el servidor. Usarlos en lugar del reload.

**ANTES — `handleFinished`, modo `edit` (líneas 334-351):**
```javascript
const handleFinished = async (e) => {
  if (selected.mode === "edit") {
    const fields = form.getFieldsValue();
    const cabinetFields = orden.cabinets.filter(
      (cabinet) => cabinet.id !== selected.id
    );
    const allFields = [...cabinetFields, fields];

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

**DESPUÉS — modo `edit`:**
```javascript
const handleFinished = async (e) => {
  if (selected.mode === "edit") {
    const fields = form.getFieldsValue();
    const cabinetFields = orden.cabinets.filter(
      (cabinet) => cabinet.id !== selected.id
    );
    const allFields = [...cabinetFields, fields];

    const result = await updateCabinetsOrder({
      _id: getLocalOrder()?._id,
      cabinets: allFields,
    });

    if (result) {
      message.success("Mueble actualizado correctamente");
      setOpenModal(false);
      await getDataOrden();
    }
  }
```

**ANTES — modo `new` (líneas 353-366):**
```javascript
  if (selected.mode === "new") {
    const fields = form.getFieldsValue();
    const cabinetFields = orden.cabinets;
    const allFields = [...cabinetFields, fields];
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

**DESPUÉS — modo `new`:**
```javascript
  if (selected.mode === "new") {
    const fields = form.getFieldsValue();
    const cabinetFields = orden.cabinets;
    const allFields = [...cabinetFields, fields];
    const result = await updateCabinetsOrder({
      _id: getLocalOrder()?._id,
      cabinets: allFields,
    });

    if (result) {
      message.success("Mueble actualizado correctamente");
      setOpenModal(false);
      await getDataOrden();
    }
  }
```

**ANTES — `handleArchived` (líneas 369-383):**
```javascript
const handleArchived = async (row) => {
  const cabinetFields = orden.cabinets.filter(
    (cabinet) => cabinet.id !== row.id
  );

  const result = await updateCabinetsOrder({
    _id: getLocalOrder()?._id,
    cabinets: cabinetFields,
  });

  if (result) {
    message.success("Mueble actualizado correctamente");
    window.location.reload();
  }
};
```

**DESPUÉS:**
```javascript
const handleArchived = async (row) => {
  const cabinetFields = orden.cabinets.filter(
    (cabinet) => cabinet.id !== row.id
  );

  const result = await updateCabinetsOrder({
    _id: getLocalOrder()?._id,
    cabinets: cabinetFields,
  });

  if (result) {
    message.success("Mueble actualizado correctamente");
    await getDataOrden();
  }
};
```

**Además**, en `ButtonModal` (línea 264) hay un `location.reload()` dentro de `Popconfirm`. Ese componente no tiene acceso a `getDataOrden`, así que debe recibir un callback por prop:

**ANTES (línea 262-265):**
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

Y `ButtonModal` recibe el prop `onDelete`:
```javascript
export const ButtonModal = ({ muebleIndex, variableIndex, onDelete }) => {
```

Cuando se instancie `ButtonModal` desde la tabla, pasar `onDelete={getDataOrden}`.

---

### 1.3 — `src/components/forms/general.jsx` (línea 58) — `location.reload()`

> El análisis lo llama `profile.jsx`. El archivo real es `src/components/forms/general.jsx`, componente `General`.

**ANTES (función `onFinish`, líneas 51-64):**
```javascript
const onFinish = async (values) => {
  try {
    if (data._id) {
      const result = await updateProfile({ ...values });
      if (result) {
        message.success("Se ha actualizado correctamente");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
  } catch (error) {
    message.error("Error al actualizar el perfil");
  }
};
```

**DESPUÉS:**
```javascript
const onFinish = async (values) => {
  try {
    if (data._id) {
      const result = await updateProfile({ ...values });
      if (result) {
        message.success("Se ha actualizado correctamente");
        // Recargar datos desde el servidor en lugar de recargar la página
        const users = await getUsers();
        const currentUser = users.find(
          (user) => user.email === data.profile.email
        );
        if (currentUser) {
          form.setFieldsValue({
            email: currentUser.email,
            info2: currentUser.info2,
            info1: currentUser.info1,
            info3: currentUser.info3,
            logo: currentUser.logo,
            coefficient: currentUser.coefficient,
            observacion1: currentUser.observacion1,
            observacion2: currentUser.observacion2,
            observacion3: currentUser.observacion3,
            observacion4: currentUser.observacion4,
            observacion5: currentUser.observacion5,
          });
        }
      }
    }
  } catch (error) {
    message.error("Error al actualizar el perfil");
  }
};
```

---

## 2. Corregir el typo `window.reload` en `login.jsx`

**Problema:** En la línea 150 el botón "Acceder" tiene un `onClick` que referencia `window.reload` — sin paréntesis y con la propiedad equivocada (debería ser `window.location.reload()`). Como no tiene paréntesis, no ejecuta nada. Dado que el submit ya lo maneja `onFinish` mediante `htmlType="submit"`, este `onClick` es completamente innecesario.

**Archivo:** `src/components/pages/log/login.jsx`

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

## 3. Mejorar el manejo de errores en `src/handlers/order.js`

**Problema:** Todos los `catch` del archivo hacen `console.log(error); return false;`. El componente que llama a la función recibe `false` sin ningún contexto: no sabe si fue un error de red, un 401, un 404 o un 500. El usuario no recibe ningún feedback.

**Solución:** Crear una función helper `handleOrderError` que muestre un `message.error()` de Ant Design y devuelva `false`. Reemplazar todos los `catch` con esta función.

**Archivo:** `src/handlers/order.js`

**Paso 1 — Añadir el import de `message` de Ant Design al principio del archivo:**

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
```

**Paso 2 — Añadir la función helper justo después de `axiosToken` (después de la línea 30):**

```javascript
/**
 * Maneja errores de llamadas a la API y muestra feedback al usuario.
 * @param {Error} error - El error capturado en el catch
 * @param {string} contexto - Descripción de la operación que falló
 */
const handleOrderError = (error, contexto = "la operación") => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      message.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
    } else if (status === 404) {
      message.error(`Recurso no encontrado al ejecutar ${contexto}.`);
    } else if (status >= 500) {
      message.error(`Error del servidor (${status}) en ${contexto}.`);
    } else {
      message.error(`Error ${status} en ${contexto}.`);
    }
  } else if (error.request) {
    message.error("Sin respuesta del servidor. Verifica tu conexión.");
  } else {
    message.error(`Error inesperado en ${contexto}: ${error.message}`);
  }
  return false;
};
```

**Paso 3 — Reemplazar los `catch` en cada función. Ejemplo para `createOrder`:**

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
    const data = await _AXIOS_.post(
      `${CONFIG.API.BACKEND_URL}/${CONFIG.API.ENDPOINT}`,
      {
        ...params,
        token: Settings.TOKEN,
      }
    );
    return data.data;
  } catch (error) {
    return handleOrderError(error, "crear orden");
  }
};
```

Aplicar el mismo patrón a todas las funciones del archivo sustituyendo:
```javascript
} catch (error) {
  console.log(error);
  return false;
}
```
por:
```javascript
} catch (error) {
  return handleOrderError(error, "DESCRIPCIÓN_DE_LA_OPERACIÓN");
}
```

Tabla de descripciones para cada función:

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

---

## 4. Corregir `useEffect` sin cleanup en `src/components/forms/general.jsx`

**Problema:** El `useEffect` de la línea 20 lanza una petición async (`fetchUserData`). Si el componente se desmonta antes de que la petición complete, el `setInitialValues` y `form.setFieldsValue` se ejecutan sobre un componente ya desmontado, lo que produce el warning de React: *"Can't perform a React state update on an unmounted component"*.

**Archivo:** `src/components/forms/general.jsx`

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
          info1: currentUser.info1,
          info3: currentUser.info3,
          logo: currentUser.logo,
          coefficient: currentUser.coefficient,
          observacion1: currentUser.observacion1,
          observacion2: currentUser.observacion2,
          observacion3: currentUser.observacion3,
          observacion4: currentUser.observacion4,
          observacion5: currentUser.observacion5,
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
          info1: currentUser.info1,
          info3: currentUser.info3,
          logo: currentUser.logo,
          coefficient: currentUser.coefficient,
          observacion1: currentUser.observacion1,
          observacion2: currentUser.observacion2,
          observacion3: currentUser.observacion3,
          observacion4: currentUser.observacion4,
          observacion5: currentUser.observacion5,
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

> La variable `cancelado` actúa como flag de abort. Cuando React ejecuta el cleanup (desmontaje o cambio de dependencias), se pone a `true` y cualquier `setState` posterior a la petición se salta.

---

## 5. Corregir `setLocalOrder` en `src/handlers/order.js`

**Problema:** La función `setLocalOrder` en las líneas 480-485 usa `async/Promise` de forma innecesaria y además resuelve la Promise con `getOrders()`, que es async pero no se espera. El resultado de `getOrders()` se ignora completamente y la Promise siempre se resuelve con una Promise pendiente.

**Archivo:** `src/handlers/order.js`

**ANTES (líneas 479-485):**
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
// Esta función guarda la orden en localStorage de forma síncrona.
// Si necesitas refrescar datos del servidor después de guardar, llama a getOrders() en el caller.
export const setLocalOrder = (params) => {
  localStorage.setItem("order", JSON.stringify(params));
};
```

> Los callers de `setLocalOrder` dentro del código usan `setLocalOrder(orderJson)` sin `await`, por lo que este cambio no rompe nada. Si algún componente hace `await setLocalOrder(...)`, seguirá funcionando: una función no-async devuelve `undefined`, y `await undefined` resuelve inmediatamente.

---

## Pasos de ejecución en orden

1. **`login.jsx`** — Sustituir el bloque `window.location.reload()` + `window.location.href` por `navigate("/Dashboard/Presupuestos")`. Eliminar el `onClick` con `window.reload` del botón "Acceder".
2. **`muebles.jsx`** — En `handleFinished` (modos `edit` y `new`) y en `handleArchived`, reemplazar `window.location.reload()` por `await getDataOrden()`. Cerrar el modal con `setOpenModal(false)`. En `ButtonModal`, añadir el prop `onDelete` y usarlo en `Popconfirm.onConfirm`.
3. **`general.jsx`** — En `onFinish`, reemplazar `location.reload()` dentro del `setTimeout` por la lógica de recarga de datos con `getUsers()` + `form.setFieldsValue()`.
4. **`order.js`** — Añadir `import { message } from "antd"`. Añadir la función `handleOrderError`. Reemplazar todos los bloques `catch` con la nueva función.
5. **`general.jsx`** — En el `useEffect` de carga inicial, añadir la variable `cancelado` y el `return () => { cancelado = true; }`.
6. **`order.js`** — Reemplazar `setLocalOrder` por la versión síncrona sin Promise.
7. Ejecutar `npm run dev` y probar: login, editar un mueble, actualizar perfil. Verificar que no hay parpadeos de página y que los errores del servidor muestran `message.error` de Ant Design.
