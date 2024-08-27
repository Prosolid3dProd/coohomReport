import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";

const Settings = {
  // BACKEND_URL: "http://localhost:2002",
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

export const createOrder = async (params) => {
  try {
    const data = await _AXIOS_.post(
      `${CONFIG.API.BACKEND_URL}/${CONFIG.API.ENDPOINT}`,
      {
        ...params,
        token: Settings.TOKEN,
      }
    );
    console.log(data.data.result, "createOrder");
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createCabinetByUser = async (params) => {
  try {
    const data = await axios.post(
      `${CONFIG.API.BACKEND_URL}/reportCoohomCabinetCreate`,
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

export const updateOrder = async (params) => {
  try {
    const data = await _AXIOS_.put(
      `${CONFIG.API.BACKEND_URL}/${Settings.ENDPOINT}`,
      {
        ...params,
        token: Settings.TOKEN,
      }
    );
    console.log(data.data, "updateOrder");
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateProfile = async (params) => {
  try {
    const data = await _AXIOS_.put(`${CONFIG.API.BACKEND_URL}/profileUpdate`, {
      ...params,
      token: Settings.TOKEN,
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getOrders = async (params) => {
  try {
    const data = await _AXIOS_.post(`${CONFIG.API.BACKEND_URL}/reportsCoohom`, {
      ...params,
      token: Settings.TOKEN,
    });
    return data?.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getComplements = async (params) => {
  try {
    const data = await _AXIOS_.get(
      `${CONFIG.API.BACKEND_URL}/reportCoohomComplements`,
      // "http://localhost:3000/verTodosComplementos2",
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

export const getComplementsByText = async (params) => {
  try {
    const data = await axios.post(
      `${CONFIG.API.BACKEND_URL}/reportCoohomComplementsbyText`,
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

export const getOrderById = async (params) => {
  try {
    const data = await _AXIOS_.post(`${CONFIG.API.BACKEND_URL}/reporthomById`, {
      ...params,
      token: Settings.TOKEN,
    });
    //OrderErp es lo que me devuelve reporthomById si se quieren añadir campos supongo que habra que añadirlos al crear el reporte, (reportCoohom (post, put))
    localStorage.setItem("orderErp", JSON.stringify(data.data));

    console.log(data.data, "getOrderById");
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getProfile = async (params) => {
  try {
    const data = await _AXIOS_.post(`${CONFIG.API.BACKEND_URL}/getProfile`, {
      ...params,
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateOrderDetails = async (params) => {
  try {
    const data = await _AXIOS_.post(
      `${CONFIG.API.BACKEND_URL}/reporthomDetails`,
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

export const updateCabinetsOrder = async (params) => {
  try {
    const data = await axios.post(
      `${CONFIG.API.BACKEND_URL}/reporthomUpdateCabinets`,
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

export const archivedOrderDetails = async (params) => {
  try {
    const data = await axios.put(`${CONFIG.API.BACKEND_URL}/reporthomDetails`, {
      ...params,
      token: Settings.TOKEN,
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const handleArchivedOrderDetails = async (params) => {
  try {
    const data = await axios.post(
      `${CONFIG.API.BACKEND_URL}/reporthomComplementDetailsDelete`,
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

export const updateCabinet = async (params) => {
  try {
    const data = await axios.put(
      `${CONFIG.API.BACKEND_URL}/reportCoohomCabinets`,
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

export const archivedOrder = async (params) => {
  try {
    const data = await axios.put(
      `${CONFIG.API.BACKEND_URL}/archivedReportCoohom`,
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

export const deleteComplements = async (params) => {
  try {
    const data = await axios.post(
      `${CONFIG.API.BACKEND_URL}/eliminarPorCodigo`,
      params
    );
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const importLibrary = async (formData) => {
  try {
    await axios.post(
      `${CONFIG.API.BACKEND_URL}/cargarNuevoXlsxSola`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...formData,
        token: Settings.TOKEN,
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const fixOrder = (order, tab = 0, onSuccess = () => {}) => {
  let total = 0;
  let priceTotal = 0;
  let cabinetsArray = [];
  const role = JSON.parse(localStorage.getItem("token")).user.role;

  let coefficient;

  if (role === "admin") {
    if (tab === 0 || tab === 1) {
      coefficient = order?.userId?.coefficient;
    } else if (tab === 2 || tab === 3) {
      coefficient = order?.coefficient;
    }
  } else if (role === "client") {
    if (tab === 0 || tab === 1) {
      coefficient = order?.userId?.coefficient;
    } else if (tab === 2 || tab === 3) {
      coefficient = order?.userId?.coefficientVentaTienda;
      
    }
  }

  if (order) {
    order.cabinets.forEach((item) => {
      let totalVariants = 0;
      priceTotal = parseFloat(item.total) * parseFloat(coefficient);
      total += priceTotal;

      item.variants?.forEach((variant) => {
        totalVariants += parseFloat(variant.value) * parseFloat(coefficient);
      });
      cabinetsArray.push({
        ...item,
        priceTotal,
        priceVariants: totalVariants,
      });
    });

    let discountEncimerasPorcentaje = 0;
    let discountCabinetsPorcentaje = 0;
    let discountElectrodomesticosPorcentaje = 0;
    let discountEquipamientosPorcentaje = 0;

    let ivaEncimerasPorcentaje = 0;
    let ivaCabinetsPorcentaje = 0;
    let ivaElectrodomesticosPorcentaje = 0;
    let ivaEquipamientosPorcentaje = 0;

    // Calculando los descuentos individuales
    if (parseFloat(order.discountEncimeras) > 0) {
      discountEncimerasPorcentaje =
        parseFloat(total) * (parseFloat(order.discountEncimeras) / 100);
    }

    if (parseFloat(order.discountCabinets) > 0) {
      discountCabinetsPorcentaje =
        parseFloat(total) * (parseFloat(order.discountCabinets) / 100);
    }

    if (parseFloat(order.discountElectrodomesticos) > 0) {
      discountElectrodomesticosPorcentaje =
        parseFloat(total) * (parseFloat(order.discountElectrodomesticos) / 100);
    }

    if (parseFloat(order.discountEquipamientos) > 0) {
      discountEquipamientosPorcentaje =
        parseFloat(total) * (parseFloat(order.discountEquipamientos) / 100);
    }

    // Calculando los IVA individuales
    if (parseFloat(order.ivaEncimeras) > 0) {
      ivaEncimerasPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaEncimeras)) / 100;
    }

    if (parseFloat(order.ivaCabinets) > 0) {
      ivaCabinetsPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaCabinets)) / 100;
    }

    if (parseFloat(order.ivaElectrodomesticos) > 0) {
      ivaElectrodomesticosPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaElectrodomesticos)) / 100;
    }

    if (parseFloat(order.ivaEquipamientos) > 0) {
      ivaEquipamientosPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaEquipamientos)) / 100;
    }

    const iva =
      ivaEncimerasPorcentaje +
      ivaCabinetsPorcentaje +
      ivaElectrodomesticosPorcentaje +
      ivaEquipamientosPorcentaje;

    const orderJson = {
      ...order,
      importe: parseFloat(total),
      iva: parseFloat(iva),
      total:
        parseFloat(total) -
          discountEncimerasPorcentaje -
          discountCabinetsPorcentaje -
          discountElectrodomesticosPorcentaje -
          discountEquipamientosPorcentaje +
          parseFloat(iva) || 0,
      cabinets: cabinetsArray,
      discountEncimerasPorcentaje,
      discountCabinetsPorcentaje,
      discountElectrodomesticosPorcentaje,
      discountEquipamientosPorcentaje,
      ivaEncimerasPorcentaje,
      ivaCabinetsPorcentaje,
      ivaElectrodomesticosPorcentaje,
      ivaEquipamientosPorcentaje,
    };

    setLocalOrder(orderJson);
    onSuccess();
    return orderJson;
  }
};

// ok

// Esta funcion es para obtener en localstorage
export const getLocalOrder = () => {
  return JSON.parse(localStorage.getItem("order"));
};

// Esta funcion es para guardar en localstorage
export const setLocalOrder = async (params) => {
  localStorage.setItem("order", JSON.stringify(params));
  return getOrders();
};

export const clearLocalOrder = () =>
  localStorage.setItem("order", JSON.stringify([]));
