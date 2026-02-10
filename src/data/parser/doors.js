import { CONFIG } from "../../data/constants";
import { getPrice } from "./pricing";

// Forward declaration or import needed for recursive dependency?
// getPerfil is needed by getDoors.
// getInfoHandler is needed by getInfoDoor.
// These are in separate files or need to be passed in / imported.
// For now I will import them assuming they exist or will exist.
import { getPerfil } from "./profiles";
import { needsPerfil, getPrefix } from "./stringHelpers";

export const getDoors = (submodels) => {
    let values = {};

    submodels.forEach((item) => {
        if (getPrefix(item.customCode) === CONFIG.CUSTOMCODE.DOOR) {
            let perfil = null;

            if (needsPerfil(item.modelBrandGoodName)) {
                perfil = getPerfil(item.subModels);
            }

            const price =
                parseFloat(getPrice(item)) + (perfil ? parseFloat(perfil.price) : 0);

            values = {
                price,
                material: item.textureName,
                name: item.modelProductNumber,
                acabadoTirador: perfil?.acabado || "",
            };
        }
    });

    return values;
};

export const getInfoDoor = (submodels, getInfoHandlerFunc) => {
    let values = {
        materialDoor: null,
        modelDoor: null,
        handler: null,
    };
    const updateValues = (item) => {
        values.materialDoor = String(item.textureName);
        values.modelDoor = String(item.modelProductNumber);
        if (getInfoHandlerFunc) {
            values.handler = getInfoHandlerFunc(item.subModels);
        }
    };
    submodels.forEach((item) => {
        if (getPrefix(item.customCode) === CONFIG.CUSTOMCODE.DRAWER) {
            item.subModels.forEach((item2) => {
                if (getPrefix(item2.customCode) === CONFIG.CUSTOMCODE.DOOR) {
                    updateValues(item2);
                }
            });
        } else if (getPrefix(item.customCode) === CONFIG.CUSTOMCODE.DOOR) {
            updateValues(item);
        }
    });
    return values;
};

export const getTotalDoors = (submodels) => {
    let total = 0;
    if (submodels) {
        submodels?.forEach((item) => {
            if (getPrefix(item.customCode) === CONFIG.CUSTOMCODE.DOOR) {
                let perfil;
                if (needsPerfil(item.modelBrandGoodName)) {
                    perfil = getPerfil(item.subModels);
                }
                total =
                    parseFloat(getPrice(item)) + total + parseFloat(perfil?.price || 0);
            }
        });
    }
    return parseFloat(total);
};

export const getDoorParameters = (param, op, createPushObjectFunc) => {
    // We need createPushObject here.
    // We can import it from utils.

    param.subModels
        .filter((puertas) => puertas.customCode === "0301")
        .forEach((puertas) => {
            puertas.parameters
                .filter(
                    (variante) =>
                        (variante.name === "PVA" || variante.name === "PVL") &&
                        parseFloat(variante.value) > 0
                )
                .forEach((variante) => {
                    if (createPushObjectFunc) {
                        op.push(createPushObjectFunc(variante));
                    }
                });
        });
};
