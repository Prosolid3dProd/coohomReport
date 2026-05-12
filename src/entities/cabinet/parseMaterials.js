import { CONFIG } from "../../shared/config";

export const getInfoCabinet = (submodels) => {
  let values = {
    materialCabinet: null,
    materialCabinetMP: null,
    materialCabinetAcab: null,
  };

  if (Array.isArray(submodels)) {
    submodels.forEach((item) => {
      if (
        String(item.modelName).toLocaleUpperCase().indexOf("CASCO") !== -1 ||
        String(item.modelBrandGoodName).toLocaleUpperCase().indexOf("CASCO") !== -1
      ) {
        values.materialCabinet = item.textureName;
      }
    });
  } else if (typeof submodels === "object" && submodels !== null) {
    submodels.parameters.forEach((item) => {
      if (item.name === "ACABP" && item.value) values.materialCabinetMP = item.value;
      if (item.name === "ACABB" && item.value) values.materialCabinetAcab = item.value;
    });
  }

  return values;
};

export const getInfoDrawer = (submodels) => {
  let modelDrawer = null;
  let textureDrawer = null;
  let materialDrawer = null;

  submodels.forEach((item) => {
    if (String(item.customCode).substring(0, 2) === CONFIG.CUSTOMCODE.DRAWER) {
      modelDrawer = item.modelBrandGoodName;
      textureDrawer = item.textureName;
      materialDrawer = item.textureName;
    }
  });

  return { modelDrawer, textureDrawer, materialDrawer };
};
