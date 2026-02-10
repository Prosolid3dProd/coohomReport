import { CONFIG } from "../../data/constants";

export const getInfoHandler = (submodels) => {
    let handler = "";
    submodels?.forEach((item) => {
        if (
            String(item.customCode).trim().substring(0, 2) ===
            CONFIG.CUSTOMCODE.HANDLER
        ) {
            handler = item.modelBrandGoodName;
        }
    });
    return handler;
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

    return {
        modelDrawer,
        textureDrawer,
        materialDrawer,
    };
};
