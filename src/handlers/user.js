import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "../data/constants";

const Settings = {
  // BACKEND_URL: "http://localhost:2002",
  BACKEND_URL: "https://octopus-app-dgmcr.ondigitalocean.app",
  ENDPOINT: "reportCoohom",
  TOKEN: "Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH",
};

const tokenLocal = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
};

export const createUser = async (params) => {
  try {
    const data = await axios.post(`${Settings.BACKEND_URL}/reportCoohomUser`, {
      ...params,
      token: Settings.TOKEN,
    });
    console.log(data.data);
    return data.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    return false;
  }
};

export const getUsers = async (params) => {
  try {
    const data = await axios.post(
      `${Settings.BACKEND_URL}/reportCoohomUserLists`,
      {
        ...params,
        token: Settings.TOKEN,
      }
    );
    console.log(data);
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateUser = async (params) => {
  try {
    const data = await axios.put(
      `${Settings.BACKEND_URL}/`,
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

export const login = async (params) => {
  try {
    const data = await axios.post(`${Settings.BACKEND_URL}/signinReporthom`, {
      ...params,
      token: Settings.TOKEN,
    });
    if (data.data) {
      if (data.data.ok) {
        if (data.data.user.role === "admin") {
          localStorage.setItem("campaign", CONFIG.ROLE.ADMIN);
        } else {
          localStorage.setItem("campaign", CONFIG.ROLE.CLIENT);
        }
      }
    }

    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};
