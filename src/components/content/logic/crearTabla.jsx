import { Input, Label, TablaModal as Modal } from "../modals";
import { ButtonModal } from "../muebles";
import { editarMueble } from "./index";

/**
 *
 *
 * @param {object} mueble --> información mueble específico
 * @return {array} --> keys/columnas no deseadas
 */
const omitirColumnas = (mueble) => {
  //La tabla no permite renderizar tipos 'object', solamente primitivos
  if (!mueble) return [];
  const omitir = Object.entries(mueble)
    .filter((value) => {
      //Columnas que no queremos mostrar porque son de tipo 'object'
      const valueMueble = value[1];
      if (typeof valueMueble === "object") return value;
    })
    .map((objVals) => objVals[0]); //Obtenemos solamente la key

  omitir.push("key"); //Agregamos key como 'key' de objeto a omitir, más adelante se agregará una 'key' que reconocerá la tabla
  return omitir;
};

/**
 *
 *
 * @param {array} omitir --> columnas no deseadas (omitirColumnas fn)
 * @param {object} mueble
 * @return {array} --> columnas deseadas
 */
const crearColumnas = (mueble) => {
  if (!mueble) mueble = [];
  const omitir = omitirColumnas(mueble);
  return [
    ...Object.keys(mueble).filter((columna) => !omitir.includes(columna)),
    "action",
  ];
};

/**
 *
 *
 * @param {object} mueble
 * @return {array} --> columnas introducir tabla ANTD
 */
const columnasTabla = (mueble) => {
  const columnas = crearColumnas(mueble);

  return columnas.map((col) => ({
    title: col,
    dataIndex: col,
    key: col.toLowerCase(),
  }));
};

/**
 *
 *
 * @param {object} e --> mueble en particular al clickear fila en la tabla
 * @return {object[]} data --> variantes (variante --> object)
 * @return {object[]} columnas --> columnas tabla
 */
const tablaExpansible = (e) => {
  if (!e || !e.variants || e === null) return [];
  const variantes = e?.variants || [];
  const columnasVariantes = variantes[0] || [];
  const columnas = columnasTabla(columnasVariantes);
  const data = [];
  for (const index in variantes) {
    const variante = variantes[index];

    let obj = {};

    obj = { ...obj, ["key"]: index.toString() };

    Object.entries(variante).map(
      (pairs) => (obj = { ...obj, [pairs[0]]: pairs[1] })
    );

    obj = {
      ...obj,
      ["action"]: <ButtonModal muebleIndex={e.key} variableIndex={index} />,
    };

    data.push(obj);
  }

  return [data, columnas];
};

/**
 *
 *
 * @param {Function} { setModal, cols, rows, mueble, cambiosTabla }
 * @return { Component }
 */
const ModalEditarFila = ({ setModal, cols, rows, mueble, cambiosTabla }) => {
  return (
    <Modal
      okey={() => editarMueble(mueble, cambiosTabla, setModal)}
      cancelar={() => setModal((open) => (open = false))}
      contenido={
        <article className="flex flex-col gap-1">
          {cols.map((col, index) => {
            const row = rows[index];
            return (
              <Label key={index} texto={col} input={<Input dfValue={row} />} />
            );
          })}
        </article>
      }
    ></Modal>
  );
};

export { ModalEditarFila, columnasTabla, omitirColumnas, tablaExpansible };
