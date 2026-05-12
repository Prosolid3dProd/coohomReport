import { CONFIG } from "../../shared/config";
import { getPriceParameters } from "./parseVariants";

export const getRef = (parametros, reference) => {
  reference.ref = parametros.obsBrandGoodId;
  reference.type = "C";

  const updateReference = (value) => {
    const trimmedValue = value.trim();
    const upperValue = trimmedValue.toLocaleUpperCase();
    if (upperValue.includes(CONFIG.MODELNAME.SOBREENCIMERAS.CODE)) {
      reference.type = CONFIG.MODELNAME.MURALES.CODE;
    } else if (upperValue.startsWith(CONFIG.MODELNAME.MURALES.CODE)) {
      reference.type = CONFIG.MODELNAME.MURALES.CODE;
    } else if (["RA", "RB", "RM"].includes(trimmedValue.substring(0, 2))) {
      reference.type = CONFIG.MODELNAME.REGLETAS.CODE;
    } else if (trimmedValue.startsWith("AF")) {
      reference.type = CONFIG.MODELNAME.ALTOS.CODE;
    } else if (["BF", "BP", "BH"].includes(trimmedValue.substring(0, 2))) {
      reference.type = CONFIG.MODELNAME.BAJOS.CODE;
    } else if (trimmedValue.startsWith("BD25")) {
      reference.type = CONFIG.MODELNAME.COMPLEMENTOS.CODE;
    } else if (trimmedValue.startsWith("MF")) {
      reference.type = CONFIG.MODELNAME.MURALES.CODE;
    } else if (trimmedValue.startsWith("B")) {
      reference.type = CONFIG.MODELNAME.BAJOS.CODE;
    } else {
      reference.type = trimmedValue.substring(0, 1);
    }
    reference.ref = value;
  };

  const processParameters = (items) => {
    items?.forEach((item) => {
      if (item.name === CONFIG.REF) updateReference(String(item.value).replace(/['"]/g, ""));
    });
  };

  processParameters(parametros.parameters);
  processParameters(parametros.ignoreParameters);

  const modelNameUpper = String(parametros.modelName).toLocaleUpperCase();
  const modelProductNumberUpper = String(parametros.modelProductNumber)?.toUpperCase();

  if (modelNameUpper.includes("FORRADO")) {
    reference.type = "F";
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.DECORATIVOS.NAME) {
    reference.type = CONFIG.MODELNAME.DECORATIVOS.CODE;
  } else if (modelNameUpper.includes("M.")) {
    reference.type = "M";
  } else if (modelNameUpper.startsWith("MURAL")) {
    reference.type = CONFIG.MODELNAME.MURALES.CODE;
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.INTEGRACIONES.NAME) {
    reference.type = CONFIG.MODELNAME.INTEGRACIONES.CODE;
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.REGLETAS.NAME) {
    reference.type = CONFIG.MODELNAME.REGLETAS.CODE;
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.ACCESORIOS.NAME) {
    reference.type = CONFIG.MODELNAME.ACCESORIOS.CODE;
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.COMPLEMENTOS.NAME) {
    reference.type = CONFIG.MODELNAME.COMPLEMENTOS.CODE;
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.COSTADOS.NAME) {
    reference.type = CONFIG.MODELNAME.COSTADOS.CODE;
  } else if (parametros.modelProductNumber === "脚线") {
    reference.type = "";
  } else if (modelNameUpper.includes("PLACA")) {
    reference.type = "B";
  }

  if (reference.type === "L") reference.type = "C";
  return reference;
};

export const removeDuplicates = (array) =>
  array
    .map((el) => el.toUpperCase())
    .filter((el, i, self) => self.indexOf(el) === i);

export const getPriceZocalo = (item) => {
  const p = item.ignoreParameters.find((param) => param.name === "PRICE");
  return p ? parseFloat(p.value) : undefined;
};

export const getTotalPrice = (item, tipoMueble) => {
  const priceZocalo = getPriceZocalo(item);
  const priceParameters = getPriceParameters(item.parameters, item.ignoreParameters, tipoMueble);
  return (priceZocalo || 0) + (priceParameters || 0);
};

export const getReferenceZocalo = (item) => {
  const ref = item.ignoreParameters.find((p) => p.name === "REF");
  return ref ? String(ref.value) : undefined;
};
