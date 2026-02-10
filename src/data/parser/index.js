import { CONFIG } from "../../data/constants";
import { getRef, getReferenceZocalo } from "./references";
import { getPrice, getTotalPrice, getPriceParameters, getPriceZocalo } from "./pricing";
import { getParameters, getInfoCabinet } from "./cabinets";
import { getDoors, getTotalDoors, getInfoDoor, getDoorParameters } from "./doors";
import { getInfoDrawer, getInfoHandler } from "./handlers";
import { getFrente } from "./fronts";
import { getPerfil } from "./profiles";
import { createPushObject } from "./utils";
import { isValidMaterialName } from "./stringHelpers";
import { getCalculoFondo } from "./calculations";

// Helper for circular dependency injection if needed
const getDoorParametersWrapper = (param, op) => getDoorParameters(param, op, createPushObject);
const getInfoDoorWrapper = (submodels) => getInfoDoor(submodels, getInfoHandler);

// main
export const parseJson3D = async (json) => {
    try {
        let referenceTemp;
        let contador = 0;
        const cabinets = [];
        let door;
        let cabinet;
        let armazonInfo;
        let extra;
        let puertasInfo;
        let cajonesInfo;
        let validarDoor = false;
        let drawer;
        let total = 0;
        let modelDrawer = null;
        let modeloDrawer = null;
        const doors = [];
        let isCajonExist = false;
        let referenceType = {
            ref: "",
            type: "",
        };

        const modelDrawerArray = [];
        const materialDrawerArray = [];
        const modelDoorArray = [];
        const materialDoorArray = [];
        const modelCabinetArray = [];
        const materialCabinetArray = [];

        let opening;
        let zocalo = 0;
        const arrZocalos = [];
        const modelHandlerArray = [];
        const arrEncimeras = [];
        const tiradoresCabecera = [];

        json.paramModel?.forEach((item) => {
            let materialCostado = "";
            let materialRegleta = "";
            let materialRegletaF = "";
            let materialAccesorios = "";
            let campana;
            let modelProductNumber = item.modelProductNumber;

            if (item.customCode == "8000") {
                let wCampana = 0;
                let mueble = 0;
                let ladoCampana;
                item.parameters?.forEach((param) => {
                    if (param.name == "WM1") {
                        wCampana = param.value;
                    } else if (param.name == "WMI") {
                        mueble = param.value;
                    } else if (param.name == "LC") {
                        ladoCampana = param.value.toUpperCase();
                    }
                });

                campana = {
                    campana: parseFloat(wCampana),
                    ladoCampana,
                    mueble:
                        mueble == 0
                            ? item.size.x - parseFloat(wCampana)
                            : parseFloat(mueble),
                    muebleDR:
                        mueble == 0
                            ? null
                            : item.size.x - parseFloat(wCampana) - parseFloat(mueble),
                };
            }

            if (item.customCode === CONFIG.CUSTOMCODE.ZOCALOS) {
                arrZocalos.push({
                    tipo: "T",
                    typeZocalo: "library",
                    material: item.textureName,
                    reference: getReferenceZocalo(item),
                    customCode: item.textureCustomCode,
                    observation: item.remark,
                    size: {
                        x: item.size.x,
                        y: item.size.y,
                        z: item.size.z,
                    },
                    total: getTotalPrice(item, referenceType.type),
                    priceCabinet: getPriceZocalo(item),
                    name: item.modelName,
                    obsBrandGoodId: item.obsBrandGoodId,
                    quantity: parseInt(item.modelCostInfo.quantity),
                    variants: getParameters(item, referenceType.type, getDoorParametersWrapper),
                    priceVariants: getPriceParameters(
                        item.parameters,
                        item.ignoreParameters,
                        referenceType.type
                    ),
                });
            } else if (item["@type"] == "3") {
                item.subModels?.forEach((submodel) => {
                    if (submodel.modelName == "Countertop Block") {
                        arrEncimeras.push({
                            Material: submodel.textureName,
                            Puntos: submodel.size,
                        });
                    }
                });
            } else {
                referenceType = getRef(item, referenceType);
                opening = "";
                let items = {
                    id: `id_${contador}`,
                    name: item.modelName,
                    reference: referenceType.ref,
                    tipo: referenceType.type,
                    customcode: item.customCode || null,
                    campana,
                    priceCabinet: getPrice(
                        item,
                        referenceType.type === "A" ||
                            referenceType.type === "B" ||
                            referenceType.type === "M"
                            ? "cabinet"
                            : referenceType.type,
                        item.textureName,
                        item.modelCostInfo.quotationRate
                    ),
                };

                if (
                    String(item.modelProductNumber).toLocaleUpperCase() === "COSTADOS"
                ) {
                    materialCostado = item.textureName;
                }

                if (
                    String(item.modelProductNumber).toLocaleUpperCase() === "ACCESORIOS"
                ) {
                    materialAccesorios = item.textureName;
                }

                if (
                    String(item.modelProductNumber).toLocaleUpperCase() === "REGLETAS"
                ) {
                    materialRegleta = item.textureName;

                    String(item.modelName).toLocaleUpperCase().indexOf("INGLETADA") !== -1
                        ? (materialRegletaF = item.subModels[0].textureName)
                        : (materialRegletaF = item.subModels[0].textureName);
                }

                if (item.subModels && item.subModels.length > 0) {
                    if (
                        getInfoDoorWrapper(item.subModels).materialDoor !== null &&
                        validarDoor === false
                    ) {
                        validarDoor = true;
                        door = getInfoDoorWrapper(item.subModels);
                    }

                    item.parameters?.forEach((item3) => {
                        if (item3.name === "DP") {
                            if (String(item3.value) === "0") {
                                opening = CONFIG.DOOROPENING.IZQUIERDA;
                            }

                            if (String(item3.value) === "1") {
                                opening = CONFIG.DOOROPENING.DERECHA;
                            }
                        }
                    });

                    if (item.customCode === CONFIG.CUSTOMCODE.BALDAS_DECORATIVAS) {
                        armazonInfo = {
                            materialCabinet: item.textureName,
                            modelCabinet: item.modelName,
                        };
                    } else if (item.customCode === "9876") {
                        armazonInfo = getInfoCabinet(item);
                    } else {
                        armazonInfo = getInfoCabinet(item.subModels);
                    }

                    cajonesInfo = getInfoDrawer(item.subModels);
                    cabinet = armazonInfo;

                    item.subModels.forEach((submodel) => {
                        if (
                            String(submodel.customCode).substring(0, 2) ===
                            CONFIG.CUSTOMCODE.DOOR ||
                            String(submodel.customCode) === "1001"
                        ) {
                            String(submodel.customCode) === "1001"
                                ? (puertasInfo = getInfoDoorWrapper(submodel.subModels))
                                : (puertasInfo = getInfoDoorWrapper(item.subModels));
                        }
                    });

                    const tiradores = [];

                    function buscarTiradores(subModels) {
                        if (!subModels) return;

                        subModels.forEach((model) => {
                            if (model.customCode === "202" || model.customCode === "203") {
                                const referencia = model?.ignoreParameters
                                    .filter(
                                        (ref) =>
                                            ref.displayName.toLocaleUpperCase() === "REFERENCIA"
                                    )
                                    .map((ref) => {
                                        return ref.originalValue;
                                    })[0];

                                const nombre = model.ignoreParameters
                                    .filter(
                                        (ref) => ref.displayName.toLocaleUpperCase() === "NOMBRE"
                                    )
                                    .map((ref) => {
                                        return ref.originalValue;
                                    })[0];

                                tiradores.push({
                                    reference: referencia,
                                    name: nombre,
                                    textureCustomCode: model.textureCustomCode,
                                    modelName: model.modelName,
                                    textureName: model.textureName,
                                    size: {
                                        x: model.size.x,
                                        y: model.size.y,
                                        z: model.size.z,
                                    },
                                });
                            }
                        });
                    }

                    function buscarCajonesYPuertas(subModels) {
                        if (!subModels) return;

                        subModels.forEach((model) => {
                            if (model.customCode === "1001" || model.customCode === "0301") {
                                if (model.customCode === "1001") {
                                    model.subModels.forEach((mo) => {
                                        if (
                                            mo.customCode === "0201" &&
                                            mo.modelBrandGoodName === "Base Cajon"
                                        ) {
                                            cajonesInfo = {
                                                modelName: mo.modelName,
                                                materialDrawer: mo.textureName,
                                                modelDrawer: mo.modelBrandGoodName,
                                            };
                                        }
                                    });
                                } else if (model.customCode === "0301") {
                                    puertasInfo = {
                                        modelDoor: model.modelProductNumber,
                                        materialDoor: model.textureName,
                                    };
                                }
                                // Buscar tiradores en submodelos del nivel actual
                                buscarTiradores(model.subModels);

                                // Buscar recursivamente en submodelos de 1001 o 0301
                                buscarCajonesYPuertas(model.subModels);
                            } else {
                                // Continuar la búsqueda recursiva en submodelos anidados
                                buscarCajonesYPuertas(model.subModels);
                            }
                        });
                    }
                    buscarCajonesYPuertas(item.subModels);

                    if (cajonesInfo && cajonesInfo.modelDrawer) {
                        if (referenceType.ref?.indexOf(".BC") !== -1) {
                            cajonesInfo = {
                                ...cajonesInfo,
                                modelDrawer: CONFIG.DRAWERMODEL.ANTARO,
                            };
                        } else {
                            cajonesInfo = {
                                ...cajonesInfo,
                                modelDrawer: CONFIG.DRAWERMODEL.LEGRABOX,
                            };
                        }
                    } else if (!cajonesInfo) {
                        cajonesInfo = null;
                    }

                    extra = {
                        ...armazonInfo,
                        ...puertasInfo,
                        ...cajonesInfo,
                    };

                    if (isValidMaterialName(cajonesInfo?.modelDrawer)) {
                        modelDrawerArray.push(cajonesInfo.modelDrawer);
                    }

                    item.subModels.forEach((filtroMaterialDrawer) => {
                        if (filtroMaterialDrawer.customCode === "1001") {
                            filtroMaterialDrawer.subModels.forEach((matInteriorDrawer) => {
                                if (matInteriorDrawer.customCode === "0201") {
                                    if (isValidMaterialName(cajonesInfo?.materialDrawer)) {
                                        materialDrawerArray.push(cajonesInfo.materialDrawer);
                                    }
                                }
                            });
                        }
                    });

                    //Puertas y puertas dentro de gavetas
                    item.subModels.forEach((filtroModelDoor) => {
                        const isCustomCode1001 =
                            String(filtroModelDoor.customCode).trim() === "1001";
                        const isDoorCustomCode =
                            String(filtroModelDoor.customCode).trim().substring(0, 2) ===
                            CONFIG.CUSTOMCODE.DOOR;
                        if (isCustomCode1001) {
                            if (isValidMaterialName(puertasInfo?.modelDoor)) {
                                modelDoorArray.push(puertasInfo.modelDoor);
                            }
                        }
                    });

                    item.subModels.forEach((filtroMaterialDoor) => {
                        if (
                            String(filtroMaterialDoor.customCode).trim().substring(0, 2) ===
                            CONFIG.CUSTOMCODE.DOOR
                        ) {
                            if (isValidMaterialName(puertasInfo?.materialDoor)) {
                                materialDoorArray.push(puertasInfo.materialDoor);
                            }
                        }
                    });

                    if (isValidMaterialName(armazonInfo?.modelCabinet)) {
                        modelCabinetArray.push(armazonInfo.modelCabinet);
                    }

                    item.subModels.forEach((filtroArmazon) => {
                        if (
                            String(filtroArmazon.modelBrandGoodName)
                                .toLocaleUpperCase()
                                .indexOf("CASCO") !== -1
                        ) {
                            if (isValidMaterialName(armazonInfo?.materialCabinet)) {
                                materialCabinetArray.push(armazonInfo.materialCabinet);
                            }
                        }
                    });

                    const referenceTiradores = (item) => {
                        for (const reference of item.ignoreParameters) {
                            if (reference.name === "REF") {
                                return String(reference.value);
                            }
                        }
                    };

                    const accesories = item.subModels
                        .filter(
                            (element) =>
                                String(element.modelTypeId) === "4" ||
                                String(element.customCode) === "1001" ||
                                String(element.customCode) === "0301"
                        )
                        .map((element) => {
                            if (String(element.modelTypeId) === "4") {
                                return {
                                    id: `id_${contador}`,
                                    name: element.modelBrandGoodName,
                                    obsBrandGoodId2: element.obsBrandGoodId,
                                    obsBrandGoodId: element.obsBrandGoodId,
                                    reference: element.customCode,
                                    width: item.boxSize.x,
                                    height: element.boxSize.z,
                                    depth: item.boxSize.y,
                                    variants: [],
                                    price: element.modelCostInfo.unitCost,
                                    quantity: element.modelCostInfo.quantity || 1,
                                };
                            } else if (String(element.customCode) === "1001") {
                                const subModel0301 = element.subModels.find(
                                    (subEl) => String(subEl.customCode) === "0301"
                                );
                                if (subModel0301) {
                                    const subModel1101 = subModel0301.subModels.find(
                                        (el) => String(el.customCode) === "1101"
                                    );
                                    if (subModel1101) {
                                        return {
                                            id: `id_${contador}`,
                                            material: subModel1101.textureName,
                                            total: parseFloat(subModel1101.modelCostInfo.unitCost),
                                            priceCabinet: parseFloat(
                                                subModel1101.modelCostInfo.unitCost
                                            ),
                                            tipo: "C",
                                            reference: referenceTiradores(subModel1101) || null,
                                            customCode: null,
                                            size: {
                                                x: subModel1101.size.x,
                                                y: subModel1101.size.y,
                                                z: subModel1101.size.z,
                                            },
                                            name: subModel1101.modelName,
                                            obsBrandGoodId: subModel1101.obsBrandGoodId,
                                            tirador: true,
                                        };
                                    }
                                }
                            } else if (String(element.customCode) === "0301") {
                                const subModel1101 = element.subModels?.find(
                                    (el) => String(el.customCode) === "1101"
                                );
                                if (subModel1101) {
                                    return {
                                        id: `id_${contador}`,
                                        material: subModel1101.textureName,
                                        total: parseFloat(subModel1101.modelCostInfo.unitCost),
                                        priceCabinet: parseFloat(
                                            subModel1101.modelCostInfo.unitCost
                                        ),
                                        tipo: "C",
                                        reference: referenceTiradores(subModel1101) || null,
                                        customCode: null,
                                        size: {
                                            x: subModel1101.size.x,
                                            y: subModel1101.size.y,
                                            z: subModel1101.size.z,
                                        },
                                        name: subModel1101.modelName,
                                        obsBrandGoodId: subModel1101.obsBrandGoodId,
                                        tirador: true,
                                    };
                                }
                            }
                        })
                        .filter(Boolean);

                    let drawerPrice = 0;
                    let drawerPriceDetails = [];
                    let drawerMaterialDetails = [];
                    let frente;

                    item.subModels?.forEach((item) => {
                        const customCodeSubstring = String(item.customCode).substring(0, 2);
                        if (customCodeSubstring === CONFIG.CUSTOMCODE.DOOR) {
                            item.subModels?.forEach((it) => {
                                if (it.customCode === CONFIG.CUSTOMCODE.FRENTE_FIJO) {
                                    frente = getFrente(item);
                                    const perfil = getPerfil(frente.datos.subModels);

                                    drawerMaterialDetails.push({
                                        Acabado: frente.datos.textureName,
                                        acabadoTirador: perfil.acabado,
                                    });

                                    const drawerSizeZ =
                                        frente.tipo === "cajon"
                                            ? frente.datos.boxSize.z
                                            : undefined;
                                    drawerPrice +=
                                        parseFloat(getPrice(frente.datos, drawerSizeZ)) +
                                        parseFloat(perfil.price);

                                    drawerPriceDetails.push(
                                        parseFloat(getPrice(frente.datos, drawerSizeZ)) +
                                        parseFloat(perfil.price)
                                    );
                                    isCajonExist = true;
                                }
                            });
                        }
                        if (
                            customCodeSubstring === CONFIG.CUSTOMCODE.DRAWER ||
                            item.customCode === CONFIG.CUSTOMCODE.FRENTE_FIJO
                        ) {
                            frente = getFrente(item);
                            const perfil = getPerfil(frente.datos.subModels);
                            drawerMaterialDetails.push({
                                tipo: frente.tipo,
                                Acabado: frente.datos.textureName,
                                modelo: frente.datos.modelProductNumber || "",
                                acabadoTirador: perfil.acabado,
                            });

                            const drawerSizeZ =
                                frente.tipo === "cajon" ? frente.datos.boxSize.z : undefined;
                            drawerPrice +=
                                parseFloat(getPrice(frente.datos, drawerSizeZ)) +
                                parseFloat(perfil.price);

                            drawerPriceDetails.push(
                                parseFloat(getPrice(frente.datos, drawerSizeZ)) +
                                parseFloat(perfil.price)
                            );

                            isCajonExist = true;
                        }
                    });

                    if (getInfoDrawer(item.subModels) !== null) {
                        drawer = getInfoDrawer(item.subModels);
                    }
                    const cantidad = item.parameters.find((c) => c.name === "Cantidad");
                    let totalPrice =
                        parseFloat(items.priceCabinet) +
                        parseFloat(getTotalDoors(item?.subModels)) +
                        parseFloat(
                            getPriceParameters(
                                item.parameters,
                                item.ignoreParameters,
                                referenceType.type
                            )
                        ) +
                        parseFloat(drawerPrice);

                    accesories &&
                        accesories.length > 0 &&
                        accesories.forEach((itemx) => {
                            let description2 = "";
                            let obsBrandGoodId2 = "";
                            json.resource?.models?.forEach((itemModels) => {
                                if (itemModels.obsBrandGoodId === item.obsBrandGoodId) {
                                    description2 = itemModels.description;
                                    obsBrandGoodId2 = itemModels.obsBrandGoodId;
                                }
                            });
                            referenceTemp = itemx.reference;

                            const sizeX = parseFloat(item.size?.x);

                            if (!isNaN(sizeX)) {
                                if (itemx.reference?.indexOf("EGCL") > -1) {
                                    const roundedValue = Math.ceil(sizeX / 100);
                                    referenceTemp = `${itemx.reference}${roundedValue * 10 || ""}`;
                                }

                                if (itemx.reference?.indexOf("CPL") > -1) {
                                    const roundedValue = Math.floor(sizeX / 100);
                                    referenceTemp = `${itemx.reference}${roundedValue * 10 || ""}L`;
                                }
                            }

                            if (
                                `${itemx.reference}${item.size?.x || ""}` &&
                                itemx.tirador !== true
                            ) {
                                cabinets.push({
                                    id: `id_${contador}`,
                                    description: description2,
                                    obsBrandGoodId2,
                                    obsBrandGoodId: itemx.obsBrandGoodId,
                                    name: `${itemx.name}`,
                                    tipo: CONFIG.MODELNAME.ACCESORIOS.CODE,
                                    reference: referenceTemp,
                                    doors: 0,
                                    priceDoor: parseFloat(getTotalDoors(item?.subModels)),
                                    total:
                                        parseFloat(itemx.price) * parseFloat(itemx.quantity || 1),
                                    size: item.boxSize,
                                    variants: getParameters(item, null, getDoorParametersWrapper),
                                    priceVariants: 0,
                                    priceDrawers: 0,
                                    drawerPriceDetails,
                                    drawerMaterialDetails,
                                    material: item.textureName,
                                    designerName: json.partnerOrder?.designerName || "",
                                    quantity: parseInt(itemx.quantity) || 1,
                                    ...extra,
                                });
                            }

                            if (itemx.tirador === true) {
                                modelHandlerArray.push({
                                    material: itemx.material,
                                    total: parseFloat(itemx.total),
                                    priceCabinet: parseFloat(itemx.priceCabinet),
                                    tipo: "C",
                                    reference: itemx.reference || null,
                                    customCode: null,
                                    size: {
                                        x: itemx.size.x,
                                        y: itemx.size.y,
                                        z: itemx.size.z,
                                    },
                                    name: itemx.name,
                                    obsBrandGoodId: itemx.obsBrandGoodId,
                                    tirador: itemx.tirador,
                                });
                                cabinets.push({
                                    id: `id_${contador}`,
                                    material: itemx.material,
                                    total: parseFloat(itemx.total),
                                    priceCabinet: parseFloat(itemx.priceCabinet),
                                    tipo: "C",
                                    reference: itemx.reference || null,
                                    customCode: null,
                                    size: {
                                        x: itemx.size.x,
                                        y: itemx.size.y,
                                        z: itemx.size.z,
                                    },
                                    name: itemx.name,
                                    obsBrandGoodId: itemx.obsBrandGoodId,
                                    tirador: itemx.tirador,
                                });
                            }
                            modelHandlerArray.forEach((handler) => {
                                tiradoresCabecera.push(handler.name);
                            });
                        });

                    let nameFinal = item.modelName;
                    if (String(item.modelName).indexOf("L") > -1) {
                        nameFinal = String(item.modelName)
                            .substring(0, String(item.modelName).length - 5)
                            .replace(/-/g, "");
                    }
                    if (parseFloat(totalPrice) >= 0) {
                        let description = "";

                        json.resource?.models?.forEach((itemModels) => {
                            if (itemModels.obsBrandGoodId === item.obsBrandGoodId) {
                                description = itemModels.description;
                            }
                        });

                        doors.push(getDoors(item.subModels));
                        let isComplement = false;
                        // if (
                        //   String(item.modelProductNumber).toLocaleUpperCase() ===
                        //   "COMPLEMENTOS"
                        // )
                        //   isComplement = true;
                        cabinets.push({
                            ...items,
                            quantity: cantidad ? parseFloat(cantidad.value) : 1,
                            obsBrandGoodId: item.obsBrandGoodId,
                            description,
                            name: String(nameFinal).replace("-", ""),
                            modelName: String(nameFinal).replace("-", ""),
                            doors: getDoors(item.subModels),
                            opening,
                            modelDrawer: modeloDrawer,
                            zocalo: zocalo,
                            priceDoor: parseInt(getTotalDoors(item?.subModels)),
                            total: totalPrice,
                            size: getCalculoFondo(item), // Function is missing! I need to extract getCalculoFondo
                            variants: getParameters(item, referenceType.type, getDoorParametersWrapper),
                            priceVariants: getPriceParameters(
                                item.parameters,
                                item.ignoreParameters,
                                referenceType.type
                            ),
                            priceDrawers: isCajonExist ? parseFloat(drawerPrice) : "",
                            drawerPriceDetails,
                            drawerMaterialDetails,
                            tiradores,
                            material: item.textureName,
                            modelDrawer: cajonesInfo?.modelDrawer || null,
                            materialDrawer: cajonesInfo?.materialDrawer || null,
                            modelDoor: puertasInfo?.modelDoor || null,
                            materialDoor: puertasInfo?.materialDoor || null,
                            modelHandler: puertasInfo?.handler || null,
                            modelCabinet: armazonInfo?.modelCabinet || null,
                            materialCabinet: armazonInfo?.materialCabinet || null,
                            materialCabinetMP: armazonInfo?.materialCabinetMP || null,
                            materialCabinetAcab: armazonInfo?.materialCabinetAcab || null,
                            observation: item.remark || "",
                            modelProductNumber,
                            designerName: json.partnerOrder?.designerName || "",
                            materialCostado,
                            materialRegleta,
                            materialRegletaF,
                            materialAccesorios,
                        });
                    }
                }
                total =
                    parseFloat(total) +
                    parseFloat(
                        getPrice(
                            item,
                            referenceType.type === "A" ||
                                referenceType.type === "B" ||
                                referenceType.type === "M"
                                ? "cabinet"
                                : referenceType.type
                        )
                    ) +
                    // parseFloat(priceCabinet) +
                    parseFloat(getTotalDoors(item?.subModels)) +
                    parseFloat(
                        getPriceParameters(
                            item.parameters,
                            item.ignoreParameters,
                            referenceType.type
                        )
                    );
            }
        });

        arrZocalos.filter((zoc) => {
            zoc.typeZocalo = "library";
            let zocNuevo = {
                id: zoc.id,
                ...zoc,
            };
            cabinets.push(zocNuevo);
        });

        let drawerTemp = null;
        let drawerTexture = null;

        if (modelDrawer) {
            drawerTemp = modelDrawer[0].modelDrawer;
            drawerTexture = modelDrawer[0].textureDrawer;
        }

        const conteo = cabinets.reduce((contador, item) => {
            const id = item.obsBrandGoodId;
            if (item.tirador === true) {
                contador[id] = (contador[id] || 0) + 1;
            }
            return contador;
        }, {});

        const cabinetsUnicos = cabinets.reduce((resultado, item) => {
            const id = item.obsBrandGoodId;

            if (item.name.toLocaleUpperCase().includes("REGLETA")) {
                item.size.x = 150;
            }

            if (item.tirador === true && conteo[id] > 1) {
                if (!resultado.some((cab) => cab.obsBrandGoodId === id)) {
                    resultado.push({
                        ...item,
                        total: item.priceCabinet * conteo[id],
                        quantity: conteo[id],
                    });
                }
            } else {
                resultado.push(item);
            }
            return resultado;
        }, []);

        cabinets.length = 0;
        cabinets.push(...cabinetsUnicos);

        const orderJson = {
            ...(json.partnerOrder || null),
            projectName: json.designData.designName || "",
            infoTiradores: modelHandlerArray || null,
            extra,
            cabinets,
            doors,
            total,
            infoZocalos: arrZocalos || null,
            ...door,
            ...cabinet,
            modelDrawer: Array.from(new Set(modelDrawerArray.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            materialDrawer: Array.from(new Set(materialDrawerArray.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            modelDoor: Array.from(new Set(modelDoorArray.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            materialDoor: Array.from(new Set(materialDoorArray.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            modelCabinet: Array.from(new Set(modelCabinetArray.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            materialCabinet: Array.from(new Set(materialCabinetArray.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            modelHandler: Array.from(new Set(tiradoresCabecera.map(e => e.toUpperCase())))
                .toString()
                .replace(/,/g, " / "),
            location: json.partnerOrder?.detailAddress || "",
            zocalo,
            designerName: json.partnerOrder?.designerName || "",
            storeName: json.partnerOrder?.storeName || "",
        };

        const orderJsonWithoutZocalos = cabinets.filter(
            (filtro) => filtro.modelProductNumber !== "脚线"
        );

        orderJson.cabinets = orderJsonWithoutZocalos;

        orderJson.cabinets.forEach((el) => {
            el.id = `id_${contador++}`;
        });

        return orderJson;
    } catch (error) {
        // Error handling
    }
};
