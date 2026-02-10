import { CONFIG } from "../../data/constants";

export const getPerfil = (perf) => {
    let price = 0;
    let priceTapa = 0;
    let acabado = undefined;

    const getPriceFromParameters = (parameters, ignoreParameters) => {
        let price = 0;
        const allParameters = [...(parameters || []), ...(ignoreParameters || [])];
        allParameters.forEach((item) => {
            if (String(item.name).toUpperCase() === CONFIG.PRICE) {
                price = parseFloat(item.value);
            }
        });
        return price;
    };

    if (perf) {
        const perfil = perf.find((x) =>
            String(x.modelBrandGoodName).toLocaleUpperCase().includes("PERFIL")
        );
        const tapa = perf.find((x) =>
            String(x.modelBrandGoodName).toLocaleUpperCase().includes("TAPA")
        );

        if (perfil) {
            price = getPriceFromParameters(
                perfil.parameters,
                perfil.ignoreParameters
            );
            acabado = perfil.textureName;
        }

        if (tapa) {
            priceTapa = getPriceFromParameters(
                tapa.parameters,
                tapa.ignoreParameters
            );
        }
    }
    return {
        price: price + priceTapa,
        acabado,
    };
};
