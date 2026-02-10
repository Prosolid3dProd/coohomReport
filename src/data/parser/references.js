import { CONFIG } from "../../data/constants";

export const getRef = (parametros, reference) => {
    reference.ref = parametros.obsBrandGoodId;
    reference.type = "C";

    const updateReference = (value) => {
        const trimmedValue = value.trim();
        const upperValue = trimmedValue.toLocaleUpperCase();
        if (upperValue.includes(CONFIG.MODELNAME.SOBREENCIMERAS.CODE)) {
            reference.type = CONFIG.MODELNAME.MURALES.CODE;
        } else if (upperValue.startsWith(CONFIG.MODELNAME.MURALES.CODE)) {
            reference.type = CONFIG.MODELNAME.MURALES.CODE;
        } else if (["RA", "RB", "RM"].includes(trimmedValue.substring(0, 2))) {
            reference.type = CONFIG.MODELNAME.REGLETAS.CODE;
        } else if (trimmedValue.startsWith("AF")) {
            reference.type = CONFIG.MODELNAME.ALTOS.CODE;
        } else if (["BF", "BP", "BH"].includes(trimmedValue.substring(0, 2))) {
            reference.type = CONFIG.MODELNAME.BAJOS.CODE;
        } else if (trimmedValue.startsWith("BD25")) {
            reference.type = CONFIG.MODELNAME.COMPLEMENTOS.CODE;
        } else if (trimmedValue.startsWith("MF")) {
            reference.type = CONFIG.MODELNAME.MURALES.CODE;
        } else if (trimmedValue.startsWith("B")) {
            reference.type = CONFIG.MODELNAME.BAJOS.CODE;
        } else {
            reference.type = trimmedValue.substring(0, 1);
        }
        reference.ref = value;
    };

    const processParameters = (items) => {
        items?.forEach((item) => {
            if (item.name === CONFIG.REF) {
                updateReference(String(item.value).replace(/['"]/g, ""));
            }
        });
    };

    processParameters(parametros.parameters);
    processParameters(parametros.ignoreParameters);

    // Reasignar tipo específico para ciertos valores
    const modelNameUpper = String(parametros.modelName).toLocaleUpperCase();
    const modelProductNumberUpper = String(
        parametros.modelProductNumber
    )?.toUpperCase();

    if (modelNameUpper.includes(CONFIG.ALIASES.FORRADO)) {
        reference.type = "F";
    } else if (modelProductNumberUpper === CONFIG.MODELNAME.DECORATIVOS.NAME) {
        reference.type = CONFIG.MODELNAME.DECORATIVOS.CODE;
    } else if (modelNameUpper.includes(CONFIG.ALIASES.M_DOT)) {
        reference.type = "M";
    } else if (modelNameUpper.startsWith(CONFIG.ALIASES.MURAL)) {
        reference.type = CONFIG.MODELNAME.MURALES.CODE;
    } else if (modelProductNumberUpper === CONFIG.MODELNAME.INTEGRACIONES.NAME) {
        reference.type = CONFIG.MODELNAME.INTEGRACIONES.CODE;
    } else if (modelProductNumberUpper === CONFIG.MODELNAME.REGLETAS.NAME) {
        reference.type = CONFIG.MODELNAME.REGLETAS.CODE;
    } else if (modelProductNumberUpper === CONFIG.MODELNAME.ACCESORIOS.NAME) {
        reference.type = CONFIG.MODELNAME.ACCESORIOS.CODE;
    } else if (modelProductNumberUpper === CONFIG.MODELNAME.COMPLEMENTOS.NAME) {
        reference.type = CONFIG.MODELNAME.COMPLEMENTOS.CODE;
    } else if (modelProductNumberUpper === CONFIG.MODELNAME.COSTADOS.NAME) {
        reference.type = CONFIG.MODELNAME.COSTADOS.CODE;
    } else if (parametros.modelProductNumber === CONFIG.ALIASES.ZOCALO_CHINESE) {
        reference.type = "";
    } else if (modelNameUpper.includes(CONFIG.ALIASES.PLACA)) {
        reference.type = "B";
    }

    // Ajuste especial si type es "L"
    if (reference.type === "L") {
        reference.type = "C";
    }

    return reference;
};

export const getReferenceZocalo = (item) => {
    const reference = item.ignoreParameters.find((param) => param.name === "REF");
    return reference ? String(reference.value) : undefined;
};
