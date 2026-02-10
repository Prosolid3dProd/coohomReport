import { createPushObject } from "./utils";
import { isCasco } from "./stringHelpers";

export const getInfoCabinet = (submodels) => {
    let values = {
        materialCabinet: null,
        materialCabinetMP: null,
        materialCabinetAcab: null,
    };

    if (Array.isArray(submodels)) {
        submodels.forEach((item) => {
            if (isCasco(item)) {
                values.materialCabinet = item.textureName;
            }
        });
    } else if (typeof submodels === "object" && submodels !== null) {
        submodels.parameters.forEach((item) => {
            if (item.name === "ACABP" && item.value) {
                values.materialCabinetMP = item.value;
            }
            if (item.name === "ACABB" && item.value) {
                values.materialCabinetAcab = item.value;
            }
        });
    }

    return values;
};

export const getCasco = (param) => {
    return param.customCode === "9876"
        ? param
        : param.subModels.find((x) =>
            x.modelBrandGoodName?.toUpperCase().includes("CASCO")
        );
};

export const findTexture = (casco) => {
    return casco.subModels.find((x) => {
        const upperCaseModelName = x.modelName?.toLocaleUpperCase();
        return (
            upperCaseModelName &&
            (upperCaseModelName.includes("VISTO IZQ") ||
                upperCaseModelName.includes("VISTO DER") ||
                upperCaseModelName.includes("AMBOS"))
        );
    });
};

export const findParameter = (model, paramName, minValue = 0) => {
    return model.parameters.find(
        (x) => x.name === paramName && parseFloat(x.value) > minValue
    );
};

export const getVuelo = (param) => {
    const vueloParam = param.parameters.find((item) => item.name === "Vuelo");
    return vueloParam ? parseInt(vueloParam.value) : 0;
};

export const chooseVuelo = (customCode, item, vueloValue) => {
    if (customCode !== "9876" || parseFloat(item.value) <= 0) {
        return false;
    }
    if (item.name === "VIZQ" && (vueloValue === 1 || vueloValue === 3)) {
        return true;
    }
    if (item.name === "VDER" && (vueloValue === 2 || vueloValue === 3)) {
        return true;
    }
    if (item.name === "Vuelo") {
        return false;
    }
    return false;
};

export const getParameters = (param, tipoMueble, getDoorParametersFunc) => {
    let op = [];

    const getExcludedNames = (tipoMueble) => [
        "ELEC",
        // "CVI",
        // "CPI",
        ...(tipoMueble === "B" ? ["ME", "MPF2P", "PE"] : []),
        ...(tipoMueble === "A" ? ["ME", "MPF2P", "PE", "MTCEC", "UM"] : []),
    ];

    const excludedNames = getExcludedNames(tipoMueble);
    const casco = getCasco(param);
    const vueloValue = getVuelo(param);

    if (casco) {
        const mcv = findTexture(casco);
        const cv = findParameter(casco, "CV", 0);
        if (cv) {
            op.push(createPushObject(cv, mcv?.textureName));
        }
    }

    param.parameters.forEach((item) => {
        if (chooseVuelo(param.customCode, item, vueloValue)) {
            op.push(createPushObject(item));
            return;
        }
    });

    if (getDoorParametersFunc) {
        getDoorParametersFunc(param, op);
    }

    param.parameters.forEach((item) => {
        if (excludedNames.includes(item.name)) return;

        if (["PVA", "PVL"].includes(item.name) && parseFloat(item.value) > 0) {
            op.push(createPushObject(item));
            return;
        }

        if (item.name === "pies" && parseFloat(item.value) > 0) {
            op.push({
                name: "Pies",
                value: parseFloat(item.value),
                description: item.description || "Número de pies",
            });
        }

        if (item.name === "FSK" && item.value < 0) {
            op.push(createPushObject(item));
        } else if (parseFloat(item.value) > 0 && item.description) {
            op.push(createPushObject(item));
        }
    });
    return op;
};
