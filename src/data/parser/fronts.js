import { CONFIG } from "../../data/constants";

export const getFrente = (block) => {
    const FRENTE_FIJO = String(CONFIG.CUSTOMCODE.FRENTE_FIJO);
    const DOOR_PREFIX = String(CONFIG.CUSTOMCODE.DOOR);

    if (String(block.customCode) === FRENTE_FIJO) {
        return { datos: block, tipo: "frente" };
    }

    const findFrente = (subModels) => {
        if (!subModels) return undefined;

        return subModels.find((item) => {
            const customCode = String(item.customCode);
            if (item.subModels && item.subModels.length > 0) {
                return customCode.startsWith(DOOR_PREFIX) || customCode === FRENTE_FIJO;
            } else if (block.customCode === "1002") {
                return block.subModels.find((int) => {
                    return (
                        int.modelBrandGoodName.toLocaleUpperCase().indexOf("BASE") !== -1
                    );
                });
            }
            return false;
        });
    };

    const frente = findFrente(block.subModels);
    if (frente) {
        return { datos: frente, tipo: "cajon" };
    }

    return { datos: {}, tipo: "" };
};
