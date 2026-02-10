export const CONFIG = {
  ROLE: {
    CLIENT: "346J0NIHU7CRNRVJ0NIHU3T4T4854H9TV4NJ0NIHU5945",
    ADMIN: "E567890KMNGYCTDR6TYUJ067T8NIHUGVTFT67T87Y9HOJG",
  },
  URLS: {
    LOGIN: "https://coohom-report.vercel.app/Login",
  },
  API: {
    // BACKEND_URL: "http://localhost:3007",
    // BACKEND_URL: "https://octopus-app-dgmcr.ondigitalocean.app",
    BACKEND_URL: "https://api.simulhome.com/coohomReport",
    ENDPOINT: "reportCoohom",
    // Token is handled dynamically by api.js interceptor
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
    BALDAS_DECORATIVAS: "4545",
    FRENTE_FIJO: "7070",
    ZOCALOS: "2222",
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
  ALIASES: {
    ZOCALO_CHINESE: "脚线",
    FORRADO: "FORRADO",
    PLACA: "PLACA",
    MURAL: "MURAL",
    M_DOT: "M.",
  },
  PRICING: {
    DEFAULT_CABINET_PRICE: 10000,
    DRAWER_PRICE_HIGH: 25,
    DRAWER_PRICE_LOW: 15,
    PVA_PVL_PRICE: 15,
    INTV_MULTIPLIER: 0.25,
    TEXTURE_111_MULTIPLIER: 0.1,
    TEXTURE_ADJUSTMENTS: {
      ESTB: 4,
      ESTF: 4,
      ESTM: 4,
      NP300: 4.5,
      NP200: 4.5,
      P200L: 4.5,
      LACAM: 4,
      LACAB: 4,
      PANT: 2,
      PLAM: 2,
    },
  },
  PARAMETERS: {
    INTV: "INTV",
    PRECIOCOSTADOS: "PRECIOCOSTADOS",
    PTOTAL: "PTOTAL",
    DESCUENTO: "DESCUENTO",
    INCREMENTO: "INCREMENTO",
    PVA: "PVA",
    PVL: "PVL",
    INCD: "INCD",
  },
  EXCLUDED_NAMES: {
    COMMON: ["ELEC"],
    TYPE_B: ["ME", "MPF2P", "PE"],
    TYPE_A: ["ME", "MPF2P", "PE", "MTCEC", "UM"],
  },
};
