import { CONFIG } from "../../data/constants";

export const getCalculoFondo = (item) => {
    const fondoPuerta = CONFIG.FONDOPUERTA;
    const size = {
        x: 0,
        y: 0,
        z: 0,
    };
    if (
        (String(item.modelProductNumber).toUpperCase() === "INTEGRACIONES" ||
            item.prodCatId === 721 ||
            item.prodCatId === 719 ||
            item.prodCatId === 696) &&
        String(item.modelProductNumber).toUpperCase() !== "DECORATIVOS"
    ) {
        size.y = item.boxSize.y + fondoPuerta;
    } else {
        size.y = item.boxSize.y;
    }

    size.x = item.boxSize.x;
    size.z = item.boxSize.z;

    return size;
};
