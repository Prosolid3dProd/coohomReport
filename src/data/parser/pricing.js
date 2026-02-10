import { CONFIG } from "../../data/constants";

export const getPrice = (parametros, tipo) => {
    const isCabinet = tipo === "cabinet";
    let price = 0;

    const findSpecificPrice = (items = [], targetName) => {
        const upperTarget = targetName.toUpperCase();
        return items
            .filter(
                (item) =>
                    item?.name?.toUpperCase() === upperTarget &&
                    !isNaN(parseFloat(item?.value))
            )
            .reduce((sum, item) => sum + parseFloat(item.value), 0);
    };

    const findPrice = (items = [], targetName = "PRICE") => {
        const upperTarget = targetName.toUpperCase();
        const keyName = items.some((item) => item?.name?.toUpperCase() === CONFIG.PARAMETERS.PTOTAL)
            ? CONFIG.PARAMETERS.PTOTAL
            : upperTarget;

        return items
            .filter(
                (item) =>
                    item?.name?.toUpperCase() === keyName &&
                    !isNaN(parseFloat(item?.value))
            )
            .reduce((sum, item) => sum + parseFloat(item.value), 0);
    };

    const arrParameters = [].concat(
        parametros?.parameters || [],
        parametros?.ignoreParameters || []
    );

    price = findPrice(arrParameters);
    if (isCabinet) {
        price = price || CONFIG.PRICING.DEFAULT_CABINET_PRICE;
        const intv = arrParameters.some(
            (p) =>
                p?.displayName?.toUpperCase() === CONFIG.PARAMETERS.INTV && parseFloat(p?.value) > 0
        );

        const getSubModelSidesPrice = (subModels = []) => {
            return subModels.reduce((sum, subModel) => {
                const sidePrice = findSpecificPrice(
                    subModel?.parameters,
                    CONFIG.PARAMETERS.PRECIOCOSTADOS
                );
                return sum + (parseFloat(sidePrice) > 0 ? parseFloat(sidePrice) : 0);
            }, 0);
        };

        if (parametros.textureCustomCode === "C1") {
            price += getSubModelSidesPrice(parametros.subModels, findPrice);
        } else if (parametros.textureNumber === "111") {
            price += price * CONFIG.PRICING.TEXTURE_111_MULTIPLIER;
            if (intv) {
                price += price * CONFIG.PRICING.INTV_MULTIPLIER;
            }
        }

        if (intv) {
            price = price * (CONFIG.PRICING.TEXTURE_ADJUSTMENTS[parametros.textureCustomCode] || 0);
        }
    }
    // Lógica para cajones
    if (tipo !== undefined && tipo !== "cabinet") {
        if (tipo >= 210) {
            price = parseFloat(price) + CONFIG.PRICING.DRAWER_PRICE_HIGH;
        } else if (tipo < 210 && parametros.customCode !== CONFIG.CUSTOMCODE.FRENTE_FIJO) {
            price = parseFloat(price) + CONFIG.PRICING.DRAWER_PRICE_LOW;
        }
    }

    // Aplicar Descuento o Incremento según los valores en arrParameters
    const discountParam = arrParameters.find(
        (p) => p?.name?.toUpperCase() === CONFIG.PARAMETERS.DESCUENTO
    );
    const incrementParam = arrParameters.find(
        (p) => p?.name?.toUpperCase() === CONFIG.PARAMETERS.INCREMENTO
    );

    if (discountParam && !isNaN(parseFloat(discountParam.value))) {
        price -= price * (parseFloat(discountParam.value) / 100);
    }

    if (incrementParam && !isNaN(parseFloat(incrementParam.value))) {
        price += price * (parseFloat(incrementParam.value) / 100);
    }
    return price;
};

export const getPriceParameters = (param, ignoreParam, tipoMueble) => {
    let precioVariant = 0;
    const excludedNames = [
        ...CONFIG.EXCLUDED_NAMES.COMMON,
        ...(tipoMueble === "B" ? CONFIG.EXCLUDED_NAMES.TYPE_B : []),
        ...(tipoMueble === "A" ? CONFIG.EXCLUDED_NAMES.TYPE_A : []),
    ];
    const allParameters = [...(param || []), ...(ignoreParam || [])];

    allParameters.forEach((item) => {
        const itemName = String(item.name);
        const itemdescription = String(item.description);

        if (excludedNames.includes(itemName)) return;

        if (parseFloat(item.value) > 0) {
            if (itemName === CONFIG.PARAMETERS.PVA || itemName === CONFIG.PARAMETERS.PVL) {
                precioVariant += CONFIG.PRICING.PVA_PVL_PRICE;
            }

            if (itemdescription.includes("$") || itemName === CONFIG.PARAMETERS.INTV) return;

            const itemValue =
                itemName === CONFIG.PARAMETERS.PVA || itemName === CONFIG.PARAMETERS.PVL ? CONFIG.PRICING.PVA_PVL_PRICE : parseFloat(item.value);

            const valueINCD = itemName === CONFIG.PARAMETERS.INCD ? parseFloat(item.value) : 0;

            if (itemName === CONFIG.PARAMETERS.INCD) {
                precioVariant += valueINCD;
                return;
            }

            if (itemValue > 0 && item.description) {
                precioVariant += itemValue;
            }
        }
    });
    return parseFloat(precioVariant);
};

export const getPriceZocalo = (item) => {
    const priceParameter = item.ignoreParameters.find(
        (param) => param.name === CONFIG.PRICE
    );
    return priceParameter ? parseFloat(priceParameter.value) : undefined;
};

export const getTotalPrice = (item, tipoMueble) => {
    const priceZocalo = getPriceZocalo(item);
    const priceParameters = getPriceParameters(
        item.parameters,
        item.ignoreParameters,
        tipoMueble
    );

    const totalPrice = (priceZocalo || 0) + (priceParameters || 0);
    return totalPrice;
};
