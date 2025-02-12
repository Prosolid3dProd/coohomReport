export const CONFIG = {
  ROLE: {
    CLIENT: "346J0NIHU7CRNRVJ0NIHU3T4T4854H9TV4NJ0NIHU5945",
    ADMIN: "E567890KMNGYCTDR6TYUJ067T8NIHUGVTFT67T87Y9HOJG",
  },
  API: {
    // BACKEND_URL: "http://localhost:3007",
    // BACKEND_URL: "https://octopus-app-dgmcr.ondigitalocean.app",
    BACKEND_URL: "https://api.simulhome.com/coohomReport",
    ENDPOINT: "reportCoohom",
    TOKEN: JSON.parse(localStorage.getItem("token"))?.token || null, //"Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH" ,
  },
  BOLD: "Helvetica-Bold",
  DRAWERMODEL: {
    LEGRABOX: "Legrabox",
    ANTARO: "Antaro",
  },
  DOOROPENING: {
    IZQUIERDA: "Izquierda",
    DERECHA: "Derecha",
  },
  FONDOPUERTA: 20,
  DOOR: "PUERTA",
  CASCO: "CASCO",
  PRICE: "PRICE",
  REF: "REF",
  CUSTOMCODE: {
    DOOR: "03",
    DRAWER: "10",
    CASCO: "0201",
    COMPLEMENTO: "500",
    HANDLER: "11",
    BALDAS_DECORATIVAS:"4545",
    FRENTE_FIJO: "7070",
    ZOCALOS:"2222",
  },
  MODELNAME: {
    ACCESORIOS: {
      NAME: "ACCESORIOS",
      CODE: "C",
    },
    REGLETAS: {
      NAME: "REGLETAS",
      CODE: "R",
    },
    INTEGRACIONES: {
      NAME: "INTEGRACIONES",
      CODE: "B",
    },
    COMPLEMENTOS: {
      NAME: "COMPLEMENTOS",
      CODE: "T",
    },
    BAJOS: {
      NAME: "BAJOS",
      CODE: "B",
    },
    ALTOS: {
      NAME: "ALTOS",
      CODE: "A",
    },
    MURALES: {
      NAME: "MURALES",
      CODE: "M",
    },
    DECORATIVOS: {
      NAME: "DECORATIVOS",
      CODE: "D",
    },
    COSTADOS: {
      NAME: "COSTADOS",
      CODE: "O",
    },
    SOBREENCIMERAS: {
      NAME: "SOBREENCIMERAS",
      CODE: "SO",
    },
    FORRADO: {
      NAME: "FORRADO",
      CODE: "F",
    },
  },
};
