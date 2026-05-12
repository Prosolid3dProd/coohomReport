import { CONFIG } from "../../shared/config";

const getExcludedNames = (tipoMueble) => [
  "ELEC",
  ...(tipoMueble === "B" ? ["ME", "MPF2P", "PE"] : []),
  ...(tipoMueble === "A" ? ["ME", "MPF2P", "PE", "MTCEC", "UM"] : []),
];

const getCasco = (param) =>
  param.customCode === "9876"
    ? param
    : param.subModels.find((x) => x.modelBrandGoodName?.toUpperCase().includes("CASCO"));

const findTexture = (casco) =>
  casco.subModels.find((x) => {
    const upper = x.modelName?.toLocaleUpperCase();
    return upper && (upper.includes("VISTO IZQ") || upper.includes("VISTO DER") || upper.includes("AMBOS"));
  });

const findParameter = (model, paramName, minValue = 0) =>
  model.parameters.find((x) => x.name === paramName && parseFloat(x.value) > minValue);

const createPushObject = (item, mcv = null) => ({
  name: item.displayName || item.name,
  value: parseFloat(item.value),
  description: item.description || null,
  nameValue:
    item.options?.length > 2
      ? item.optionValues?.[item.options?.indexOf(item.value)]?.name
      : undefined,
  mcv,
});

const getVuelo = (param) => {
  const vueloParam = param.parameters.find((item) => item.name === "Vuelo");
  return vueloParam ? parseInt(vueloParam.value) : 0;
};

const chooseVuelo = (customCode, item, vueloValue) => {
  if (customCode !== "9876" || parseFloat(item.value) <= 0) return false;
  if (item.name === "VIZQ" && (vueloValue === 1 || vueloValue === 3)) return true;
  if (item.name === "VDER" && (vueloValue === 2 || vueloValue === 3)) return true;
  return false;
};

const getDoorParameters = (param, op) => {
  param.subModels
    .filter((p) => p.customCode === "0301")
    .forEach((p) => {
      p.parameters
        .filter((v) => (v.name === "PVA" || v.name === "PVL") && parseFloat(v.value) > 0)
        .forEach((v) => op.push(createPushObject(v)));
    });
};

export const getParameters = (param, tipoMueble) => {
  const op = [];
  const excludedNames = getExcludedNames(tipoMueble);
  const casco = getCasco(param);
  const vueloValue = getVuelo(param);

  if (casco) {
    const mcv = findTexture(casco);
    const cv = findParameter(casco, "CV", 0);
    if (cv) op.push(createPushObject(cv, mcv?.textureName));
  }

  param.parameters.forEach((item) => {
    if (chooseVuelo(param.customCode, item, vueloValue)) {
      op.push(createPushObject(item));
      return;
    }
  });

  getDoorParameters(param, op);

  param.parameters.forEach((item) => {
    if (excludedNames.includes(item.name)) return;
    if (["PVA", "PVL"].includes(item.name) && parseFloat(item.value) > 0) {
      op.push(createPushObject(item));
      return;
    }
    if (item.name === "pies" && parseFloat(item.value) > 0) {
      op.push({ name: "Pies", value: parseFloat(item.value), description: item.description || "Número de pies" });
    }
    if (item.name === "FSK" && item.value < 0) {
      op.push(createPushObject(item));
    } else if (parseFloat(item.value) > 0 && item.description) {
      op.push(createPushObject(item));
    }
  });
  return op;
};

export const getPriceParameters = (param, ignoreParam, tipoMueble) => {
  let precioVariant = 0;
  const excludedNames = getExcludedNames(tipoMueble);
  const allParameters = [...(param || []), ...(ignoreParam || [])];

  allParameters.forEach((item) => {
    const itemName = String(item.name);
    const itemdescription = String(item.description);
    if (excludedNames.includes(itemName)) return;
    if (parseFloat(item.value) > 0) {
      if (itemName === "PVA" || itemName === "PVL") precioVariant += 15;
      if (itemdescription.includes("$") || itemName === "INTV") return;
      const itemValue = itemName === "PVA" || itemName === "PVL" ? 15 : parseFloat(item.value);
      const valueINCD = itemName === "INCD" ? parseFloat(item.value) : 0;
      if (itemName === "INCD") { precioVariant += valueINCD; return; }
      if (itemValue > 0 && item.description) precioVariant += itemValue;
    }
  });
  return parseFloat(precioVariant);
};

export const getCalculoFondo = (item) => {
  const fondoPuerta = CONFIG.FONDOPUERTA;
  const size = { x: 0, y: 0, z: 0 };
  const mpn = String(item.modelProductNumber).toUpperCase();
  if (
    (mpn === "INTEGRACIONES" || item.prodCatId === 721 || item.prodCatId === 719 || item.prodCatId === 696) &&
    mpn !== "DECORATIVOS"
  ) {
    size.y = item.boxSize.y + fondoPuerta;
  } else {
    size.y = item.boxSize.y;
  }
  size.x = item.boxSize.x;
  size.z = item.boxSize.z;
  return size;
};
