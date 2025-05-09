import { CONFIG } from "../data/constants";

const getFrente = (block) => {
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

const getPrice = (parametros, tipo) => {
  const isCabinet = tipo === "cabinet";

  let price = 0;

  const findSpecificPrice = (items = [], targetName) => {
    const upperTarget = targetName.toUpperCase();
    return items
      .filter(item =>
        item?.name?.toUpperCase() === upperTarget &&
        !isNaN(parseFloat(item?.value))
      )
      .reduce((sum, item) => sum + parseFloat(item.value), 0);
  };
  

  const findPrice = (items = [], targetName = "PRICE") => {
    const upperTarget = targetName.toUpperCase();
    const keyName = items.some(item => item?.name?.toUpperCase() === "PTOTAL")
      ? "PTOTAL"
      : upperTarget;
  
    return items
      .filter(item =>
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
    price = price || 10000;
    const intv = arrParameters.some(
      (p) =>
        p?.displayName?.toUpperCase() === "INTV" && parseFloat(p?.value) > 0
    );

    const getSubModelSidesPrice = (subModels = []) => {
      return subModels.reduce((sum, subModel) => {
        const sidePrice = findSpecificPrice(subModel?.parameters, "PRECIOCOSTADOS");
        return sum + (parseFloat(sidePrice) > 0 ? parseFloat(sidePrice) : 0);
      }, 0);
    };
    
     
    if (parametros.textureCustomCode === "C1") {
      price += getSubModelSidesPrice(parametros.subModels, findPrice)
    } else if (parametros.textureNumber === "111") {
      price += price * 0.1;
      if (intv) {
        price += price * 0.25;
      }
    }

    if (intv) {
      const textureAdjustments = {
        ESTB: 4,
        ESTF: 4,
        ESTM: 4,
        NP300: 4.5,
        NP200: 4.5,
        P200L: 4.5,
        LACAM: 4,
        LACAB: 4,
        PANT: 2,
        PLAM: 2
      };
      price = price * (textureAdjustments[parametros.textureCustomCode] || 0);
    }
  }
  // Lógica para cajones
  if (tipo !== undefined && tipo !== "cabinet") {
    if (tipo >= 210) {
      price = parseFloat(price) + 25;
    } else if (tipo < 210 && parametros.customCode !== "7070") {
      price = parseFloat(price) + 15;
    }
  }

  // Aplicar Descuento o Incremento según los valores en arrParameters
  const discountParam = arrParameters.find(
    (p) => p?.name?.toUpperCase() === "DESCUENTO"
  );
  const incrementParam = arrParameters.find(
    (p) => p?.name?.toUpperCase() === "INCREMENTO"
  );

  if (discountParam && !isNaN(parseFloat(discountParam.value))) {
    price -= price * (parseFloat(discountParam.value) / 100);
  }

  if (incrementParam && !isNaN(parseFloat(incrementParam.value))) {
    price += price * (parseFloat(incrementParam.value) / 100);
  }
  return price;
};

const getRef = (parametros, reference) => {
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

  if (modelNameUpper.includes("FORRADO")) {
    reference.type = "F";
  } else if (modelProductNumberUpper === CONFIG.MODELNAME.DECORATIVOS.NAME) {
    reference.type = CONFIG.MODELNAME.DECORATIVOS.CODE;
  } else if (modelNameUpper.includes("M.")) {
    reference.type = "M";
  } else if (modelNameUpper.startsWith("MURAL")) {
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
  } else if (parametros.modelProductNumber === "脚线") {
    reference.type = "";
  } else if (modelNameUpper.includes("PLACA")) {
    reference.type = "B";
  }

  // Ajuste especial si type es "L"
  if (reference.type === "L") {
    reference.type = "C";
  }

  return reference;
};

const getDoors = (submodels) => {
  let values = {};

  submodels.forEach((item) => {
    const customCode = String(item.customCode).trim().substring(0, 2);
    if (customCode === CONFIG.CUSTOMCODE.DOOR) {
      let perfil = null;

      const needsPerfil = ["PURA", "GP", "MONTEA"].some((keyword) =>
        String(item.modelBrandGoodName).toLocaleUpperCase().includes(keyword)
      );

      if (needsPerfil) {
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

const getInfoDoor = (submodels) => {
  let values = {
    materialDoor: null,
    modelDoor: null,
    handler: null,
  };
  const updateValues = (item) => {
    values.materialDoor = String(item.textureName);
    values.modelDoor = String(item.modelProductNumber);
    values.handler = getInfoHandler(item.subModels);
  };
  submodels.forEach((item) => {
    const customCode = String(item.customCode).trim().substring(0, 2);

    if (customCode === CONFIG.CUSTOMCODE.DRAWER) {
      item.subModels.forEach((item2) => {
        if (
          String(item2.customCode).trim().substring(0, 2) ===
          CONFIG.CUSTOMCODE.DOOR
        ) {
          updateValues(item2);
        }
      });
    } else if (customCode === CONFIG.CUSTOMCODE.DOOR) {
      updateValues(item);
    }
  });
  return values;
};

const getInfoHandler = (submodels) => {
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

const getInfoCabinet = (submodels) => {
  let values = {
    materialCabinet: null,
    materialCabinetMP: null,
    materialCabinetAcab: null,
  };

  if (Array.isArray(submodels)) {
    submodels.forEach((item) => {
      if (
        String(item.modelName).toLocaleUpperCase().indexOf("CASCO") !== -1 ||
        String(item.modelBrandGoodName).toLocaleUpperCase().indexOf("CASCO") !==
          -1
      ) {
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

const getInfoDrawer = (submodels) => {
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

const getPerfil = (perf) => {
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

const getTotalDoors = (submodels) => {
  let total = 0;
  if (submodels) {
    submodels?.forEach((item) => {
      if (String(item.customCode).substring(0, 2) === CONFIG.CUSTOMCODE.DOOR) {
        let perfil;
        if (
          String(item.modelBrandGoodName)
            .toLocaleUpperCase()
            .indexOf("PURA") !== -1 ||
          String(item.modelBrandGoodName).toLocaleUpperCase().indexOf("GP") !==
            -1 ||
          String(item.modelBrandGoodName)
            .toLocaleUpperCase()
            .indexOf("MONTEA") !== -1
        ) {
          perfil = getPerfil(item.subModels);
        }
        total =
          parseFloat(getPrice(item)) + total + parseFloat(perfil?.price || 0);
      }
    });
  }
  return parseFloat(total);
};

const getParameters = (param, tipoMueble) => {
  let op = [];

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

  getDoorParameters(param, op);

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

const getExcludedNames = (tipoMueble) => [
  "ELEC",
  // "CVI",
  // "CPI",
  ...(tipoMueble === "B" ? ["ME", "MPF2P", "PE"] : []),
  ...(tipoMueble === "A" ? ["ME", "MPF2P", "PE", "MTCEC", "UM"] : []),
];

const getCasco = (param) => {
  return param.customCode === "9876"
    ? param
    : param.subModels.find((x) =>
        x.modelBrandGoodName?.toUpperCase().includes("CASCO")
      );
};

const findTexture = (casco) => {
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

const findParameter = (model, paramName, minValue = 0) => {
  return model.parameters.find(
    (x) => x.name === paramName && parseFloat(x.value) > minValue
  );
};

const createPushObject = (item, mcv = null) => ({
  name: item.displayName || item.name,
  value: parseFloat(item.value),
  description: item.description || null,
  nameValue:
    item.options?.length > 2
      ? item.optionValues?.[item.options?.indexOf(item.value)]?.name
      : undefined,
  mcv,
});

const getVuelo = (param) => {
  const vueloParam = param.parameters.find((item) => item.name === "Vuelo");
  return vueloParam ? parseInt(vueloParam.value) : 0;
};

const chooseVuelo = (customCode, item, vueloValue) => {
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

const getDoorParameters = (param, op) => {
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
          op.push(createPushObject(variante));
        });
    });
};

const getPriceParameters = (param, ignoreParam, tipoMueble) => {
  let precioVariant = 0;
  const excludedNames = [
    "ELEC",
    // "CVI",
    // "CPI",
    ...(tipoMueble === "B" ? ["ME", "MPF2P", "PE"] : []),
    ...(tipoMueble === "A" ? ["ME", "MPF2P", "PE", "MTCEC", "UM"] : []),
  ];
  const allParameters = [...(param || []), ...(ignoreParam || [])];

  allParameters.forEach((item) => {
    const itemName = String(item.name);
    const itemdescription = String(item.description);

    if (excludedNames.includes(itemName)) return;

    if (parseFloat(item.value) > 0) {
      if (itemName === "PVA" || itemName === "PVL") {
        precioVariant += 15;
      }

      if (itemdescription.includes("$") || itemName === "INTV") return;

      const itemValue =
        itemName === "PVA" || itemName === "PVL" ? 15 : parseFloat(item.value);

      const valueINCD = itemName === "INCD" ? parseFloat(item.value) : 0;

      if (itemName === "INCD") {
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

const getCalculoFondo = (item) => {
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

  size.x = item.boxSize.x;
  size.z = item.boxSize.z;
  return size;
};

const removeDuplicates = (array) => {
  return array
    .map((element) => element.toUpperCase())
    .filter((element, index, self) => {
      return self.indexOf(element) === index;
    });
};

const getPriceZocalo = (item) => {
  const priceParameter = item.ignoreParameters.find(
    (param) => param.name === "PRICE"
  );
  return priceParameter ? parseFloat(priceParameter.value) : undefined;
};

const getTotalPrice = (item, tipoMueble) => {
  const priceZocalo = getPriceZocalo(item);
  const priceParameters = getPriceParameters(
    item.parameters,
    item.ignoreParameters,
    tipoMueble
  );

  const totalPrice = (priceZocalo || 0) + (priceParameters || 0);
  return totalPrice;
};

const getReferenceZocalo = (item) => {
  const reference = item.ignoreParameters.find((param) => param.name === "REF");
  return reference ? String(reference.value) : undefined;
};

// main
export const parseJson3D = async (json) => {
  try {
    let referenceTemp;
    let contador = 0;
    var cabinets = [];
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
    let arrZocalos = [];
    let modelHandlerArray = [];
    let arrEncimeras = [];
    let tiradoresCabecera = [];

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
          variants: getParameters(item, referenceType.type),
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
            getInfoDoor(item.subModels).materialDoor !== null &&
            validarDoor === false
          ) {
            validarDoor = true;
            door = getInfoDoor(item.subModels);
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
                ? (puertasInfo = getInfoDoor(submodel.subModels))
                : (puertasInfo = getInfoDoor(item.subModels));
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
              // Búsqueda recursiva en submodelos anidados
              if (model.subModels) {
                buscarTiradores(model.subModels);
              }
            });
          }

          function buscarCajonesYPuertas(subModels) {
            if (!subModels) return;

            subModels.forEach((model) => {
              if (model.customCode === "1001" || model.customCode === "0301") {
                if (model.customCode === "1001") {
                  model.subModels.map((mo) => {
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

          cajonesInfo?.modelDrawer &&
            cajonesInfo?.modelDrawer !== "undefined" &&
            cajonesInfo?.modelDrawer?.indexOf("Cajon") === -1 &&
            cajonesInfo?.modelDrawer?.indexOf("Gaveta") === -1 &&
            cajonesInfo?.modelDrawer?.indexOf("Sola") === -1 &&
            cajonesInfo?.modelDrawer?.indexOf("Mural") === -1 &&
            cajonesInfo?.modelDrawer?.indexOf("Corte") === -1 &&
            modelDrawerArray.push(cajonesInfo?.modelDrawer);

          item.subModels.map((filtroMaterialDrawer) => {
            if (filtroMaterialDrawer.customCode === "1001") {
              filtroMaterialDrawer.subModels.map((matInteriorDrawer) => {
                if (matInteriorDrawer.customCode === "0201") {
                  cajonesInfo?.materialDrawer &&
                    cajonesInfo?.materialDrawer !== "undefined" &&
                    cajonesInfo?.materialDrawer?.indexOf("Cajon") === -1 &&
                    cajonesInfo?.materialDrawer?.indexOf("Gaveta") === -1 &&
                    cajonesInfo?.materialDrawer?.indexOf("Sola") === -1 &&
                    cajonesInfo?.materialDrawer?.indexOf("Mural") === -1 &&
                    cajonesInfo?.materialDrawer?.indexOf("Corte") === -1 &&
                    materialDrawerArray.push(cajonesInfo?.materialDrawer);
                }
              });
            }
          });

          //Puertas y puertas dentro de gavetas
          item.subModels.map((filtroModelDoor) => {
            const isCustomCode1001 =
              String(filtroModelDoor.customCode).trim() === "1001";
            const isDoorCustomCode =
              String(filtroModelDoor.customCode).trim().substring(0, 2) ===
              CONFIG.CUSTOMCODE.DOOR;
            if (isCustomCode1001 || isDoorCustomCode) {
              if (
                puertasInfo?.modelDoor &&
                puertasInfo?.modelDoor !== "undefined" &&
                !puertasInfo?.modelDoor.includes("Cajon") &&
                !puertasInfo?.modelDoor.includes("Gaveta") &&
                !puertasInfo?.modelDoor.includes("Mural") &&
                !puertasInfo?.modelDoor.includes("Sola") &&
                !puertasInfo?.modelDoor.includes("Corte")
              ) {
                modelDoorArray.push(puertasInfo?.modelDoor);
              }
            }
          });

          item.subModels.map((filtroMaterialDoor) => {
            if (
              String(filtroMaterialDoor.customCode).trim().substring(0, 2) ===
              CONFIG.CUSTOMCODE.DOOR
            ) {
              puertasInfo?.materialDoor &&
                puertasInfo?.materialDoor !== "undefined" &&
                puertasInfo?.materialDoor?.indexOf("Cajon") === -1 &&
                puertasInfo?.materialDoor?.indexOf("Gaveta") === -1 &&
                puertasInfo?.materialDoor?.indexOf("Sola") === -1 &&
                puertasInfo?.materialDoor?.indexOf("Mural") === -1 &&
                puertasInfo?.materialDoor?.indexOf("Corte") === -1 &&
                materialDoorArray.push(puertasInfo?.materialDoor);
            }
          });

          armazonInfo?.modelCabinet &&
            armazonInfo?.modelCabinet !== "undefined" &&
            armazonInfo?.modelCabinet?.indexOf("Cajon") === -1 &&
            armazonInfo?.modelCabinet?.indexOf("Gaveta") === -1 &&
            armazonInfo?.modelCabinet?.indexOf("Sola") === -1 &&
            armazonInfo?.modelCabinet?.indexOf("Mural") === -1 &&
            armazonInfo?.modelCabinet?.indexOf("Corte") === -1 &&
            modelCabinetArray.push(armazonInfo?.modelCabinet);

          item.subModels.map((filtroArmazon) => {
            if (
              String(filtroArmazon.modelBrandGoodName)
                .toLocaleUpperCase()
                .indexOf("CASCO") !== -1
            ) {
              armazonInfo?.materialCabinet &&
                armazonInfo?.materialCabinet !== "undefined" &&
                armazonInfo?.materialCabinet !== null &&
                armazonInfo?.materialCabinet?.indexOf("Cajon") === -1 &&
                armazonInfo?.materialCabinet?.indexOf("Gaveta") === -1 &&
                armazonInfo?.materialCabinet?.indexOf("Sola") === -1 &&
                armazonInfo?.materialCabinet?.indexOf("Mural") === -1 &&
                armazonInfo?.materialCabinet?.indexOf("Corte") === -1 &&
                materialCabinetArray.push(armazonInfo?.materialCabinet);
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
                  referenceTemp = `${itemx.reference}${
                    roundedValue * 10 || ""
                  }`;
                }

                if (itemx.reference?.indexOf("CPL") > -1) {
                  const roundedValue = Math.floor(sizeX / 100);
                  referenceTemp = `${itemx.reference}${
                    roundedValue * 10 || ""
                  }L`;
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
                  variants: getParameters(item),
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
            if (
              String(item.modelProductNumber).toLocaleUpperCase() ===
              "COMPLEMENTOS"
            )
              isComplement = true;
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
              size: getCalculoFondo(item),
              variants: getParameters(item, referenceType.type),
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
      modelDrawer: removeDuplicates(modelDrawerArray)
        .toString()
        .replace(/,/g, " / "),
      materialDrawer: removeDuplicates(materialDrawerArray)
        .toString()
        .replace(/,/g, " / "),
      modelDoor: removeDuplicates(modelDoorArray)
        .toString()
        .replace(/,/g, " / "),
      materialDoor: removeDuplicates(materialDoorArray)
        .toString()
        .replace(/,/g, " / "),
      modelCabinet: removeDuplicates(modelCabinetArray)
        .toString()
        .replace(/,/g, " / "),
      materialCabinet: removeDuplicates(materialCabinetArray)
        .toString()
        .replace(/,/g, " / "),
      modelHandler: removeDuplicates(tiradoresCabecera)
        .toString()
        .replace(/,/g, " / "),
      location: json.partnerOrder?.detailAddress || "",
      zocalo,
      designerName: json.partnerOrder?.designerName || "",
      storeName: json.partnerOrder?.storeName || "",
    };

    const orderJsonWhitoutZocalos = cabinets.filter(
      (filtro) => filtro.modelProductNumber !== "脚线"
    );

    orderJson.cabinets = orderJsonWhitoutZocalos;

    orderJson.cabinets.map((el) => {
      el.id = `id_${contador++}`;
    });

    return orderJson;
  } catch (error) {
    console.log(error);
  }
};
