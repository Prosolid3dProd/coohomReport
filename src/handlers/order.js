import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";

const Settings = {
  // BACKEND_URL: "http://localhost:2002",
  BACKEND_URL: "https://octopus-app-dgmcr.ondigitalocean.app",
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
    console.log(data.data.result, "createOrder")
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
    console.log(data.data, "updateOrder")
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
    // console.log(data.data)
    // console.log("getOrders")
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getComplements = async (params) => {
  try {
    const data = await _AXIOS_.get(
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
    localStorage.setItem("orderErp", JSON.stringify(data.data));

    // console.log(data.data)
    // console.log("getOrderById")
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
    console.log(params);
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

export const fixOrder = (order, onSuccess = () => {}) => {
  let total = 0;
  let priceTotal = 0;
  let cabinetsArray = [];

  if (order) {
    
    order.cabinets.forEach((item) => {
      let totalVariants = 0;

      priceTotal = parseFloat(item.total) * parseFloat(order.coefficient);
      total = total + priceTotal;

      item.variants?.forEach((variant) => {
        totalVariants =
          parseFloat(variant.value) * parseFloat(order.coefficient) +
          totalVariants;
      });

      cabinetsArray.push({
        ...item,
        priceTotal,
        priceVariants: totalVariants,
      });
    });

    let discountEncimerasPorcentaje  = 0;
    let discountCabinetsPorcentaje = 0;
    let discountElectrodomesticosPorcentaje = 0;
    let discountEquipamientosPorcentaje = 0;


    if(parseFloat(order.discountEncimeras) > 0){
      discountEncimerasPorcentaje  = parseFloat(total)*(parseFloat(order.discountEncimeras)/100) ;
    }

    if(parseFloat(order.discountCabinets) > 0){
      discountCabinetsPorcentaje  = parseFloat(total)*(parseFloat(order.discountCabinets)/100) ;
    }

    if(parseFloat(order.discountElectrodomesticos) > 0){
      discountElectrodomesticosPorcentaje  = parseFloat(total)*(parseFloat(order.discountElectrodomesticos)/100) ;
    }

    if(parseFloat(order.discountEquipamientos) > 0){
      discountEquipamientosPorcentaje  = parseFloat(total)*(parseFloat(order.discountEquipamientos)/100) ;
    }


    const iva = parseFloat((total.toFixed(2) * 21) / 100);
    const orderJson = {
      ...order,
      importe: parseFloat(total).toFixed(2),
      iva: parseFloat(iva).toFixed(2),
      total: (parseFloat(total) - discountEncimerasPorcentaje - discountCabinetsPorcentaje - discountElectrodomesticosPorcentaje - discountEquipamientosPorcentaje + parseFloat(iva)).toFixed(2)|| 0,
      cabinets: cabinetsArray,
      discountEncimerasPorcentaje,
      discountCabinetsPorcentaje,
      discountElectrodomesticosPorcentaje,
      discountEquipamientosPorcentaje
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
