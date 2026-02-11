import axios from "axios";
import Cookies from "js-cookie";
import { CONFIG } from "../data/constants";

// Helper para obtener token (prioridad Cookie > LocalStorage)
// Helper para obtener token
const getToken = () => {
    if (typeof window !== "undefined") {
        return Cookies.get("token") || null;
    }
    return null;
};

// Instancia Axios base
const axiosInstance = axios.create({
    baseURL: CONFIG.API.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10s timeout
});

// Interceptor Request: Inyectar token automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        const fallbackToken = CONFIG.API.TOKEN;
        const activeToken = token || fallbackToken;

        // Inyectar Authorization header
        if (activeToken) {
            config.headers.Authorization = activeToken;
        }

        // Inyectar token en Params (SOLO para GET o si no hay body)
        if (!config.params) config.params = {};
        if (activeToken && config.method === 'get' && !config.params.token) {
            config.params.token = activeToken;
        }

        // Inyectar token en Body (para POST/PUT) - soporte legacy
        if (config.data && typeof config.data === "object" && (config.method === 'post' || config.method === 'put')) {
            if (activeToken && !config.data.token) {
                config.data.token = activeToken;
            }
        }

        return config;
    },
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            Cookies.remove("token");
            // Check if we are already on login page to avoid loops
            if (!window.location.pathname.toLowerCase().includes("/login")) {
                window.location.href = "/Login";
            }
        }
        return Promise.reject(error);
    }
);

// Interceptor Response: Manejo de errores centralizado
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

// Objeto API unificado
const api = {
    get: (url, params = {}) => axiosInstance.get(url, { params }),
    post: (url, data = {}) => axiosInstance.post(url, data),
    put: (url, data = {}) => axiosInstance.put(url, data),
    delete: (url, data = {}) => axiosInstance.delete(url, { data }),
    // Para subida de archivos
    upload: (url, formData) =>
        axiosInstance.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};

export default api;
