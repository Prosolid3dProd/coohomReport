import { CONFIG } from "../../shared/config";
import { getPrice, getPerfil } from "./parsePrice";

export const getFrente = (block) => {
  const FRENTE_FIJO = String(CONFIG.CUSTOMCODE.FRENTE_FIJO);
  const DOOR_PREFIX = String(CONFIG.CUSTOMCODE.DOOR);

  if (String(block.customCode) === FRENTE_FIJO) return { datos: block, tipo: "frente" };

  const findFrente = (subModels) => {
    if (!subModels) return undefined;
    return subModels.find((item) => {
      const customCode = String(item.customCode);
      if (item.subModels && item.subModels.length > 0) {
        return customCode.startsWith(DOOR_PREFIX) || customCode === FRENTE_FIJO;
      } else if (block.customCode === "1002") {
        return block.subModels.find((int) =>
          int.modelBrandGoodName.toLocaleUpperCase().indexOf("BASE") !== -1
        );
      }
      return false;
    });
  };

  const frente = findFrente(block.subModels);
  if (frente) return { datos: frente, tipo: "cajon" };
  return { datos: {}, tipo: "" };
};

export const getInfoHandler = (submodels) => {
  let handler = "";
  submodels?.forEach((item) => {
    if (String(item.customCode).trim().substring(0, 2) === CONFIG.CUSTOMCODE.HANDLER) {
      handler = item.modelBrandGoodName;
    }
  });
  return handler;
};

export const getInfoDoor = (submodels) => {
  let values = { materialDoor: null, modelDoor: null, handler: null };

  const updateValues = (item) => {
    values.materialDoor = String(item.textureName);
    values.modelDoor = String(item.modelProductNumber);
    values.handler = getInfoHandler(item.subModels);
  };

  submodels.forEach((item) => {
    const customCode = String(item.customCode).trim().substring(0, 2);
    if (customCode === CONFIG.CUSTOMCODE.DRAWER) {
      item.subModels.forEach((item2) => {
        if (String(item2.customCode).trim().substring(0, 2) === CONFIG.CUSTOMCODE.DOOR) {
          updateValues(item2);
        }
      });
    } else if (customCode === CONFIG.CUSTOMCODE.DOOR) {
      updateValues(item);
    }
  });
  return values;
};

export const getDoors = (submodels) => {
  let values = {};
  submodels.forEach((item) => {
    const customCode = String(item.customCode).trim().substring(0, 2);
    if (customCode === CONFIG.CUSTOMCODE.DOOR) {
      let perfil = null;
      const needsPerfil = ["PURA", "GP", "MONTEA"].some((kw) =>
        String(item.modelBrandGoodName).toLocaleUpperCase().includes(kw)
      );
      if (needsPerfil) perfil = getPerfil(item.subModels);
      values = {
        price: parseFloat(getPrice(item)) + (perfil ? parseFloat(perfil.price) : 0),
        material: item.textureName,
        name: item.modelProductNumber,
        acabadoTirador: perfil?.acabado || "",
      };
    }
  });
  return values;
};
