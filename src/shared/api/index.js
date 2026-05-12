import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";
import { getLocalToken } from "../lib/storage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const jwt = Cookies.get("token") || getLocalToken()?.token;
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});

export const handleApiError = (error, contexto = "la operacion") => {
  const backendMessage = error?.response?.data?.message;
  let texto;

  if (backendMessage) {
    texto = backendMessage;
  } else if (error.response) {
    const status = error.response.status;
    if (status === 401) texto = "Sesion expirada. Por favor, vuelve a iniciar sesion.";
    else if (status === 403) texto = "No tienes permisos para esta operacion.";
    else if (status === 404) texto = `Recurso no encontrado al ejecutar ${contexto}.`;
    else if (status >= 500) texto = `Error del servidor (${status}) en ${contexto}.`;
    else texto = `Error ${status} en ${contexto}.`;
  } else if (error.request) {
    texto = "Sin respuesta del servidor. Verifica tu conexion.";
  } else {
    texto = `Error inesperado en ${contexto}: ${error.message}`;
  }

  message.error(texto);
  return { ok: false, message: texto };
};

export const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default apiClient;
