# 03 — Limpieza de Código y Refactorización

Categoría: Código comentado · Tailwind dinámico · `document.getElementById` · listeners en render

---

## 1. Bloques comentados a eliminar

Cada bloque está documentado con archivo, rango de líneas y contenido resumido. Eliminar el bloque completo incluyendo los delimitadores `//` o `/* */`.

### 1.1 `src/App.jsx` — líneas 21-27

Componente `ReDirect` que nunca se usó y nunca se importó.

```javascript
// const ReDirect = () => {
//   const location = useLocation();
//   if (location && location.pathname === "/")
//     return <Navigate to={`Dashboard/Presupuestos`} replace />;

//   return;
// };
```

Eliminar esas 7 líneas completas. También quitar el import de `useLocation` y `Navigate` si quedaran sin usar tras la eliminación — verificar primero si se usan en algún otro punto del archivo (no se usan).

---

### 1.2 `src/components/content/muebles.jsx` — líneas 25-167

Tres funciones antiguas comentadas: `createRows`, `expandedRowRender` y dos modales (`EditRow`, `ModalAgregarFila`). Son 143 líneas de código muerto.

```javascript
// const createRows = (
//   cols,
//   ...
// );

// const expandedRowRender = (e) => {
// ...
// };

// const EditRow = ({ setOpen, cols, rows, mueble, setBool }) => {
// ...
// };

// const ModalAgregarFila = ({ setOpen, setBool }) => {
// ...
// };
```

Además, en la misma tabla (alrededor de la línea 395-408) hay otro bloque comentado con un `<Row>` que ya está reemplazado por el botón de `<Header>`:

```javascript
{/* <Row gutter={[16, 16]}>
  <Col span={20}></Col>
  <Col span={4}>
    <Button
      style={{ background: "#000", color: "#fff", width: "100%" }}
      onClick={() => {
        setSelected({ mode: "new" });
        setOpenModal(true);
      }}
    >
      Agregar Mueble
    </Button>
  </Col>
</Row> */}
```

Y también las líneas de `expandable` comentadas en la `<Table>` (aproximadamente líneas 415-417):
```javascript
// expandable={{
//   expandedRowRender
// }}
```

---

### 1.3 `src/components/content/title.jsx` — líneas 56-90

Función `handleChangeJSON` (versión antigua) completamente comentada — 35 líneas. La versión activa está en las líneas 92-122.

```javascript
//Esto deberia de ser asi, pero no actualiza el elemento desde el back y no se por que
// const handleChangeJSON = async (json) => {
//   setLoading(true);
//   try {
//     const newData = await parseJson3D(json);
//     ...
//   }
//   setLoading(false);
// };
```

Eliminar también el comentario de texto de la línea 56.

---

### 1.4 `src/handlers/order.js` — líneas 41 y 75 — `console.log` comentados

```javascript
// console.log(data.data.result, "createOrder");
// console.log(data.data, "updateOrder");
```

---

### 1.5 `src/handlers/order.js` — líneas 113-114 — URL comentada en `getComplements`

```javascript
// "http://localhost:3000/verTodosComplementos2",
```

---

### 1.6 `src/handlers/order.js` — líneas 142-157 — función `updateCabinet` antigua

```javascript
/*
export const updateCabinet = async (params) => {
  try {
    const data = await axios.put(
      `${CONFIG.API.BACKEND_URL}/reportCoohomComplements`,
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
};*/
```

> La versión activa de `updateCabinet` está en las líneas 264-278. El bloque comentado usa un endpoint diferente (`/reportCoohomComplements` en vez de `/reportCoohomCabinets`). Eliminar solo el bloque comentado.

---

### 1.7 `src/handlers/order.js` — líneas 296-317 — función `deleteComplements` antigua

```javascript
// export const deleteComplements = async (params) => {
//   const formData = new URLSearchParams();
//   formData.append('code', params.code);
//   formData.append('token', Settings.TOKEN);

//   try {
//     const response = await axios.put(
//       `${CONFIG.API.BACKEND_URL}/eliminarPorCodigo`,
//       formData.toString(),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };
```

> La versión activa de `deleteComplements` está en las líneas 319-330 (usa `axios.post` sin `formData`). Eliminar solo el bloque comentado.

---

### 1.8 `src/components/forms/products.jsx` — líneas 87-106 — función `updateLocalOrderData` comentada

```javascript
// const updateLocalOrderData = useCallback(
//   (updatedDetails) => {
//     const updatedData = {
//       ...state.data,
//       details: state.data.details.map((detail) =>
//         detail.referencia === updatedDetails.referencia
//           ? { ...detail, ...updatedDetails }
//           : detail
//       ),
//     };
//     setState((prev) => ({ ...prev, data: updatedData }));
//     setLocalOrder(updatedData).then(() => {
//       getData(updatedData);
//     });
//   },
//   [state.data, getData]
// );
```

Si `useCallback` ya no se llama en ningún otro lugar del componente tras eliminar este bloque, también quitar `useCallback` del import de React en la línea 1.

---

### 1.9 `src/components/content/logic/obtenerArchivoJson.js` — líneas 48-54

Cuatro campos comentados en la función `exportarArchivo`:

```javascript
// width: obj.width,
// height: obj.height,
// archived: obj.archived,
// id: obj._id,
// fecha1: obj.createdAt,
// fecha2: obj.updatedAt,
// v: obj.__v,
```

---

### 1.10 `src/handlers/user.js` — líneas 5-6 y 70 — URLs y `console.log` comentados

```javascript
// const backendUrl = "http://localhost:3007";
// const backendUrl = "https://octopus-app-dgmcr.ondigitalocean.app";
```

Y en `getUsers`:
```javascript
// console.log(data)
```

---

### 1.11 `src/components/interfaces/menu/menuData.js` — líneas 19-22

La opción "Config" comentada. Dado que existe `listaCliente` para clientes y `lista` para admins, la forma correcta es usar lógica de roles, no un comentario. Si la intención es que Config solo aparezca para admins, añadirla al array `lista` y eliminar el comentario:

**ANTES (líneas 3-23):**
```javascript
export const lista = [
  {
    id: 1,
    name: "Presupuestos",
    icon: List,
  },
  {
    id: 2,
    name: "Biblioteca",
    icon: Encimera,
  },
  {
    id: 3,
    name: "Tiendas",
    icon: Tiendas,
  },
  // {
  //   name: "Config",
  //   icon: Config,
  // },
];
```

**DESPUÉS (si se quiere rehabilitar Config para admins):**
```javascript
export const lista = [
  {
    id: 1,
    name: "Presupuestos",
    icon: List,
  },
  {
    id: 2,
    name: "Biblioteca",
    icon: Encimera,
  },
  {
    id: 3,
    name: "Tiendas",
    icon: Tiendas,
  },
  {
    id: 4,
    name: "Config",
    icon: Config,
  },
];
```

Si `Config` no se va a recuperar, eliminar también el import de `Config` en la línea 1 del mismo archivo.

---

## 2. Corregir clases Tailwind dinámicas en `src/components/utils/btnAction.jsx`

**Problema:** Tailwind genera el CSS en tiempo de build escaneando el código fuente con regex. Las clases construidas con template strings como `` `text-[${color}]` `` no se pueden detectar: Tailwind nunca las añade al CSS final y los botones aparecen sin color en producción.

**Archivo:** `src/components/utils/btnAction.jsx`

La solución es separar las clases estáticas (que sí detecta Tailwind) de los valores dinámicos (que van en el atributo `style`). Las clases de layout, tamaño, border-radius, flex y transition son estáticas y se quedan en `className`. El color, el background y el color del outline son dinámicos y van en `style`.

**ANTES — `ButtonAction` (líneas 1-18):**
```javascript
const ButtonAction = ({
  text,
  color = "transparent",
  background = "white",
  altura = "full",
  hbg,
  htext,
  action,
}) => {
  return (
    <button
      className={` rounded-md w-[75px] md:w-[100px] md:h-${altura} h-[50px] flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`}
      onClick={action}
    >
      {text}
    </button>
  );
};
```

**DESPUÉS:**
```javascript
const ButtonAction = ({
  text,
  color = "transparent",
  background = "white",
  altura = "full",
  hbg,
  htext,
  action,
}) => {
  return (
    <button
      className="rounded-md w-[75px] md:w-[100px] h-[50px] flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </button>
  );
};
```

**ANTES — `ButtonForm` (líneas 19-36):**
```javascript
const ButtonForm = ({
  text,
  color = "transparent",
  background = "white",
  altura = "full",
  hbg,
  htext,
  action,
}) => {
  return (
    <button
      className={`w-[160px] md:w-[160px] md:h-${altura} h-[32px] rounded-lg flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`}
      onClick={action}
    >
      {text}
    </button>
  );
};
```

**DESPUÉS:**
```javascript
const ButtonForm = ({
  text,
  color = "transparent",
  background = "white",
  altura = "full",
  hbg,
  htext,
  action,
}) => {
  return (
    <button
      className="w-[160px] h-[32px] rounded-lg flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </button>
  );
};
```

**ANTES — `LabelForm` (líneas 38-52):**
```javascript
const LabelForm = ({
  text,
  color = "transparent",
  background = "white",
  action,
}) => {
  return (
    <label
      className={`w-[75px] md:w-[100px] h-[50px] rounded-lg md:h-full flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`}
      onClick={action}
    >
      {text}
    </label>
  );
};
```

**DESPUÉS:**
```javascript
const LabelForm = ({
  text,
  color = "transparent",
  background = "white",
  action,
}) => {
  return (
    <label
      className="w-[75px] md:w-[100px] h-[50px] rounded-lg flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </label>
  );
};
```

**ANTES — `LabelAction` (líneas 54-68):**
```javascript
const LabelAction = ({
  text,
  color = "transparent",
  background = "white",
  action,
}) => {
  return (
    <label
      className={` rounded-md w-[75px] md:w-[100px] h-[50px] md:h-full flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`}
      onClick={action}
    >
      {text}
    </label>
  );
};
```

**DESPUÉS:**
```javascript
const LabelAction = ({
  text,
  color = "transparent",
  background = "white",
  action,
}) => {
  return (
    <label
      className="rounded-md w-[75px] md:w-[100px] h-[50px] flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </label>
  );
};
```

> **Nota sobre hover:** Las clases `hover:bg-[${color}]` tampoco funcionaban en Tailwind. Si se necesita efecto hover con colores dinámicos, la alternativa es usar CSS custom properties o un `onMouseEnter/onMouseLeave` con estado. Por ahora se eliminan ya que no producían efecto alguno en el bundle de producción.

---

## 3. Reemplazar `document.getElementById` en `config.jsx` por `useRef`

**Problema:** El componente `Perfil` (en `src/components/pages/others/config.jsx`) accede al elemento `<img id="img">` con `document.getElementById('img')` en cuatro lugares distintos (líneas 54, 58, 63, 68, 88, 97, 143). Lo mismo ocurre en `EditableArticle` con `document.getElementById(text)` para manipular los inputs (líneas 199, 204, 205, 211, 213, 228). Acceder al DOM directamente rompe el modelo declarativo de React y puede fallar en re-renders o cuando el elemento no existe aún.

**Archivo:** `src/components/pages/others/config.jsx`

**Versión corregida del componente `Perfil` con `useRef`:**

**ANTES (líneas 49-188):**
```javascript
const Perfil = () => {

    const [botonSave, setBotonSave] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [color, setColor] = useState('#1a7af8')
    const [imgWidth, setImgWidth] = useState(document.getElementById('img'))
    const [img, setImg] = useState(getValue('Img') || `https://placehold.co/${imgWidth || '500'}X250`)

    useEffect(() => {
        setImgWidth(img => img = document.getElementById('img')?.width)
        setImg(img => img = `https://placehold.co/${imgWidth || '500'}X250`)
    }, [window.location])

    useEffect(() => {
        setImgWidth(img => img = document.getElementById('img')?.width)
    })


    const changeImg = (event) => {
        setImgWidth(img => img = document.getElementById('img')?.width)

        if (event < 1024) {
            setImg(img => img = getValue('Img') || `https://placehold.co/${imgWidth}X250`)
            return
        }

        setImg(img => img = getValue('Img') || `https://placehold.co/500X250`)
    }

    useEffect(() => {
        window.onload = () => {
            changeImg(window.innerWidth)
        }
        window.onresize = () => {
            changeImg(window.innerWidth)
        }
    })

    const onClick = () => {
        const imgSrc = document.getElementById('img').src
        setImg(img => img = imgSrc)
        setColor(c => c = '#1a7af8')
        setDisabled(d => d = false)
        setBotonSave(bool => bool = false)
        setValue('Img', imgSrc)
    }

    const cancel = () => {
        document.getElementById('img').src = getValue('Img')
        const imgSrc = document.getElementById('img').src
        setValue('Img', imgSrc)

        setColor(c => c = '#1a7af8')
        setDisabled(d => d = false)
        setBotonSave(btn => btn = false)
    }
    // ... JSX con <img id='img' ...>
```

**DESPUÉS:**
```javascript
const Perfil = () => {
    const imgRef = useRef(null)

    const [botonSave, setBotonSave] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [color, setColor] = useState('#1a7af8')
    const [img, setImg] = useState(getValue('Img') || 'https://placehold.co/500X250')

    const changeImg = (windowWidth) => {
        const width = imgRef.current?.offsetWidth || 500
        if (windowWidth < 1024) {
            setImg(getValue('Img') || `https://placehold.co/${width}X250`)
            return
        }
        setImg(getValue('Img') || 'https://placehold.co/500X250')
    }

    useEffect(() => {
        changeImg(window.innerWidth)

        const handleResize = () => changeImg(window.innerWidth)
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const onClick = () => {
        const imgSrc = imgRef.current?.src || img
        setImg(imgSrc)
        setColor('#1a7af8')
        setDisabled(false)
        setBotonSave(false)
        setValue('Img', imgSrc)
    }

    const cancel = () => {
        const savedImg = getValue('Img')
        if (imgRef.current) imgRef.current.src = savedImg
        setImg(savedImg)
        setValue('Img', savedImg)
        setColor('#1a7af8')
        setDisabled(false)
        setBotonSave(false)
    }

    return (
        <SectionBody tabName={'Detalles'}
            content={
                <>
                    <article className='h-[400px] py-4 flex flex-col items-center gap-4 w-full'>
                        <div className='w-full lg:w-[500px] flex flex-col items-center justify-center gap-4 flex-1 mr-l '>
                            {/* ref en lugar de id='img' */}
                            <img ref={imgRef} className='w-full h-[250px] bg-gray object-cover' src={img} />
                        </div>
                        <header className='flex flex-row h-[85px] items-center justify-between w-full p-8'>
                            <h2 className='font-semibold '>Banner</h2>
                            <div className='flex flex-row h-[50px] gap-4'>
                                {
                                    botonSave && (
                                        <>
                                            <BtnAction text={'Cancel'} color='#FF4733' action={cancel} />
                                            <BtnAction text={'Save'} color='#1a7af8' action={onClick} />
                                        </>
                                    )
                                }
                                <LabelForm text={
                                    <>
                                        <input
                                            placeholder="Introduce a file"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={disabled}
                                            onChange={(e) => {
                                                const files = e.target.files
                                                const fileUpload = files[0]
                                                const fileRead = new FileReader()

                                                if (files && files.length) {
                                                    fileRead.onload = () => {
                                                        const fileContent = fileRead.result;
                                                        if (imgRef.current) imgRef.current.src = fileContent
                                                    };
                                                    fileRead.readAsDataURL(fileUpload);
                                                    setDisabled(true)
                                                    setColor('#CFCFCF')
                                                    setBotonSave(true)
                                                }
                                            }}
                                        />
                                        <p>Change</p>
                                    </>
                                }
                                    color={color}
                                    altura={'[50px]'}
                                />
                            </div>
                        </header>
                    </article>
                    {/* El resto del JSX (Sections) permanece igual */}
                </>
            }
        />
    )
};
```

Añadir `useRef` al import de React en la línea 1:

**ANTES:**
```javascript
import { useState, useEffect } from 'react'
```

**DESPUÉS:**
```javascript
import { useState, useEffect, useRef } from 'react'
```

---

## 4. Mover `window.onload/onresize` a `useEffect` con cleanup en `config.jsx`

**Problema:** Los tres componentes `Actions`, `Exportar` y `AgregarMueble` en `title.jsx`, y los `useEffect` en `config.jsx` asignan `window.onload` y `window.onresize` directamente en el body del componente (fuera de `useEffect`). Esto significa que en cada render se reasigna el listener global, y el anterior se sobreescribe sin limpiarse. Si hay múltiples componentes usando `window.onresize`, solo el último asignado funciona.

Este problema ya está cubierto en la corrección del punto 3 para `config.jsx` (el `useEffect` corregido ya usa `addEventListener`/`removeEventListener`). El mismo patrón debe aplicarse en `title.jsx`.

**Archivo:** `src/components/content/title.jsx`

Hay tres componentes que asignan `window.onresize` directamente: `Actions` (línea 159), `Exportar` (línea 221) y `AgregarMueble` (línea 251).

**ANTES — en `Actions` (línea 159):**
```javascript
window.onresize = () => setScreenWidth(window.innerWidth);
```

**DESPUÉS — convertir en `useEffect` con cleanup:**
```javascript
useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
```

Aplicar el mismo patrón a `Exportar` y `AgregarMueble` (misma sustitución, mismo `useEffect`).

> Los tres componentes ya importan `useState`. Solo hay que añadir `useEffect` al import:

**ANTES (línea 1 de title.jsx):**
```javascript
import { useState } from "react";
```

**DESPUÉS:**
```javascript
import { useState, useEffect } from "react";
```

---

## Pasos de ejecución en orden

1. **Código comentado** — Recorrer los 11 bloques listados en el punto 1 y eliminarlos uno por uno. Usar el buscador del editor con los fragmentos textuales mostrados para localizarlos con exactitud.
2. **`btnAction.jsx`** — Reemplazar los cuatro componentes (`ButtonAction`, `ButtonForm`, `LabelForm`, `LabelAction`) con las versiones que usan `style={{}}`. El archivo completo queda sin template strings en `className`.
3. **`config.jsx`** — Añadir `useRef` al import. Reemplazar el componente `Perfil` completo con la versión corregida. Verificar que el `<img>` ahora tiene `ref={imgRef}` y no `id='img'`.
4. **`title.jsx`** — Añadir `useEffect` al import de React. Reemplazar los tres `window.onresize = ...` por `useEffect` con `addEventListener`/`removeEventListener`.
5. Ejecutar `npm run build` y verificar que no hay errores de compilación.
6. Abrir el build en un navegador y comprobar que los botones de `btnAction.jsx` muestran sus colores correctamente (antes estaban transparentes en producción).
