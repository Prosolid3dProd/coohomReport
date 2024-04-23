import {
  setLocalOrder,
  createCabinetByUser,
  updateCabinet,
  getOrderById,
  updateCabinetsOrder,
  getOrders,
  getLocalOrder,
} from "../../../handlers/order";
import { message } from "antd";
import { inputsValues, labelsValues } from "./domManage";

/**
 *
 *
 * @return {object[] | []} --> Todos los Muebles
 */
const getCabinets = () => getLocalOrder()?.cabinets || [];
/**
 *
 *
 * @param {number} [index=0] --> Índice Mueble
 * @return {object} --> Mueble Individual
 */
const getCab = (index = 0) => {
  const cabinets = getCabinets();
  return cabinets[index];
};

/**
 *
 *
 * @param {number} indexCab --> Índice Mueble
 * @return {object[] | []} --> Objeto con las variables del mueble
 */
const getVariants = (indexCab) => {
  const cab = getCab(indexCab);
  return cab?.variants || [];
};

/**
 *
 *
 * @param {number} indexEliminar --> Ínidice mueble eliminar
 */
const eliminarMueble = async (indexEliminar) => {
  const order = getLocalOrder();
  const muebles = getCabinets();
  const newCabinets = muebles.filter((_, index) => index !== indexEliminar);

  // for (const index in muebles)
  //         if (index != indexEliminar) newCabinets.push(muebles[index]) //No incluimos el mueble eliminado
  await updateCabinetsOrder({ _id: order._id, cabinets: newCabinets });
  const orderData = await getOrderById({ _id: order._id });
  setLocalOrder(orderData);
};

/**
 *
 *
 * @param {function} cambio --> Indica que se ha producido un cambio en la orden/tabla
 * @param {function} abrirModal --> Abrir/cerrar Modal
 */
const agregarMueble = async (cambio, abrirModal) => {
  const labels = Object.values(document.querySelectorAll("label")).map(
    (label) => label.innerText
  );
  const inputs = Object.values(document.querySelectorAll("input")).map(
    (label) => label.value
  );
  const primerMueble = getCab(0);

  let nuevoMueble = {};
  for (const key of Object.keys(primerMueble))
    nuevoMueble = {
      ...nuevoMueble,
      [key]: inputs[labels.indexOf(key)] || "Empty",
    };
  nuevoMueble["variants"] = [];

  const order = JSON.parse(localStorage.getItem("order"));
  await createCabinetByUser({ orderId: order._id, ...nuevoMueble });
  const orderData = await getOrderById({ _id: order._id });

  // const local = getLocalOrder();
  // local["cabinets"].push(nuevoMueble);
  setLocalOrder(orderData);
  cambio((cambio) => (cambio = true));
  abrirModal((abrir) => (abrir = false));
};

/**
 *
 *
 * @param {Object.<string, string>} mueble
 * @param {function} cambiar --> Expone si se ha hecho cambios en la tabla
 * @param {function} abrirModal --> Especificar si se a abierto el modal
 */
const editarMueble = async (mueble, cambiar, abrirModal) => {
  let { index, muebles, cab } = mueble;
  const labels = labelsValues((input) => input.innerText);
  const inputs = inputsValues();

  let obj = {};
  const cabArr = Object.entries(cab); //key : value de la fila seleccionada

  for (const index in inputs) obj = { ...obj, [labels[index]]: inputs[index] };

  const objArr = Object.entries(obj); //Label : Input --> Titulo Columna : Valor Columna

  for (const i in cabArr) {
    //Comparamos las key(columnas) que tenemos en la tabla con el objeto 'cab' de 'cabinets'
    for (const j in objArr) {
      if (objArr[j][0] !== cabArr[i][0]) continue;
      const key = cabArr[i][0];
      cab[key] = objArr[j][1];
    }
  }

  const vc = []; //vc es el nuevo cabinets
  delete cab["action"]; //No necesitamos editar está columna
  for (const position in muebles) {
    //Rellenamos vc con los muebles(filas) que no han cambiado y la que ha cambiado
    if (position != index)
      vc.push(muebles[position]); //Muebles que no han cambiado
    else vc.push(cab); //Fila que ha cambiado
  }
  let local = getLocalOrder();
  local.cabinets = vc; //Cambiamos cabinets por su nueva versión
  await handleUpdateCabinet(local);

  cambiar((cambio) => (cambio = true)); //Bool = True --> Data = localStorage
  abrirModal((abrir) => (abrir = false)); // Close Modal
};

/**
 *
 *
 * @param {Object.<string, number | string>} cabinet --> Muebles
 */
const handleUpdateCabinet = async (cabinet) => {
  try {
    const response = await updateCabinet(cabinet);
    if (response && response._id) {
      message.success("Se ha actualizado correctamente");
      setLocalOrder(response);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 *
 * @param {number} muebleIndex --> Índice Mueble cambiar variante
 * @param {number} variableIndex --> Índice Variable eliminar
 */
const eliminarVariante = (muebleIndex, variableIndex) => {
  const local = getOrders();
  const muebles = getCabinets();
  const mueble = getCab(muebleIndex);
  let variantes = getVariants(muebleIndex);

  variantes.splice(variableIndex, 1);
  mueble["variants"] = variantes;
  muebles[muebleIndex] = mueble;
  local["cabinets"] = muebles;
  setLocalOrder(local);
};

/**
 *
 *
 * @param {Event} evento
 * @param {Function} indices --> Índices Mueble y variable que serán editados, al editar la variable se edita el muebele
 * @return {Array}
 */
const editarVariante = (evento, indices) => {
  const thisBtn = evento.currentTarget;
  const tr = thisBtn.parentNode.parentNode.parentNode;
  const tbody = tr.parentNode.parentNode;
  const ths = tbody.querySelectorAll("th");

  let indexCab = 0; //Índice cab(mueble)

  let variantsCols = Object.values(ths)
    .filter((th, i, arr) => {
      if (th.querySelector("span"))
        indexCab = th.querySelector("span").getAttribute("data-index");
      if (i !== arr.length - 1) return th;
    })
    .map((th) => th.innerText);

  const indexVariant = tr.getAttribute("data-row-key");
  indices(
    (index) => (index = { ["variant"]: indexVariant, ["cab"]: indexCab })
  );

  const tdValues = Object.values(tr.childNodes)
    .filter((td, _i, arr) => {
      if (arr.at(-1) !== td) return td;
    })
    .map((td) => td.innerText);

  const valuesModal = [];

  for (const index in variantsCols)
    valuesModal.push({
      [variantsCols[index]]: tdValues[index],
    });

  return valuesModal;
};

/**
 *
 *
 * @param {function} cerrarModal --> Controlador para visualizar el modal
 * * @param {number} indexMueble --> Índice Mueble agregar Variante
 * * @param {function} cambiarOrden --> Indicar cambio en la orden
 */
const agregarVariante = (cerrarModal, indexMueble, cambioOrden) => {
  const columnas = ['name', 'value', 'description']
  const inputs = document.querySelectorAll('input')
  const values = Object.values(inputs).map(inp => inp.value || 'Empty')

  let obj = {}
  columnas.map((col, index) => obj = { ...obj, [col]: values[index] })

  const data = getOrders()
  const muebles = getCabinets()
  const muebleAgregarVariante = getCab(indexMueble)
  const variantes = typeof getVariants(indexMueble) === 'object' ? getVariants(indexMueble) : []

  //Agregamos la nueva variante
  variantes.push(obj)
  muebleAgregarVariante['variants'] = variantes
  muebles[indexMueble] = muebleAgregarVariante
  data['cabinets'] = muebles

  setLocalOrder(data)
  cerrarModal(abierto => abierto = false)
  cambioOrden(cambio => cambio = true)
}

export {
  editarVariante,
  eliminarMueble,
  eliminarVariante,
  getCab,
  getCabinets,
  getVariants,
  handleUpdateCabinet,
  agregarMueble,
  editarMueble,
  agregarVariante
};
