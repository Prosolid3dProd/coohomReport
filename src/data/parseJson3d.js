import { CONFIG } from "../data/constants";

// const zocalosw = [
//   {
//     ref: ["ESTM", "ESTF"], //estrato
//     pMediaTira: 49,
//     pTira: 77,
//     anchoMaximo: 3000,
//     descripcion: "Zócalo estratificado para h:",
//     referencia: {
//       M65: "ZE6.150B4",
//       T65: "ZE6.300B4",
//       M105: "ZE6.150B8",
//       T105: "ZE6.300B8",
//       M60: "ZE6.150",
//       T60: "ZE6.300",
//       M100: "ZE10.150",
//       T100: "ZE10.300",
//       M150: "ZE15.150",
//       T150: "ZE15.300",
//     },
//   },
//   {
//     ref: ["PLAM"], //Melamina
//     pMediaTira: 32,
//     pTira: 59,
//     anchoMaximo: 2750,
//     descripcion: "Zócalo melamina para h:",
//     referencia: {
//       M65: "ZM6.140B4",
//       T65: "ZM6.280B4",
//       M105: "ZM10.140B8",
//       T105: "ZM10.280B8",
//       M60: "ZM6.140",
//       T60: "ZM6.280",
//       M100: "ZM10.140",
//       T100: "ZM10.280",
//       M150: "ZM15.140",
//       T150: "ZM15.280",
//     },
//   },
//   {
//     ref: ["LACAM", "LACAB"], //Lacado
//     pMediaTira: 59,
//     pTira: 99,
//     anchoMaximo: 2440,
//     descripcion: "Zócalo dm lacado para h:",
//     referencia: {
//       M65: "ZL6.122B4",
//       T65: "ZL6.244B4",
//       M105: "ZL10.122B8",
//       T105: "ZL10.244B8",
//       M60: "ZL6.122",
//       T60: "ZL6.244",
//       M100: "ZL10.122",
//       T100: "ZL10.244",
//       M150: "ZL15.122",
//       T150: "ZL15.244",
//     },
//   },
//   {
//     ref: ["NP200", "NP300", "NP200L"], //barnizado
//     pMediaTira: 59,
//     pTira: 99,
//     anchoMaximo: 2440,
//     descripcion: "Zócalo barnizado para h:",
//     referencia: {
//       M65: "ZB6.122B4",
//       T65: "ZB6.244B4",
//       M105: "ZB10.122B8",
//       T105: "ZB10.244B8",
//       M60: "ZB6.122",
//       T60: "ZB6.244",
//       M100: "ZB10.122",
//       T100: "ZB10.244",
//       M150: "ZB15.122",
//       T150: "ZB15.244",
//     },
//   },
//   {
//     ref: ["ALU"], //aluminio
//     pMediaTira: {
//       M60: 38,
//       M100: 38,
//       M120: 47,
//       M150: 47,
//     },
//     pTira: {
//       T60: 70,
//       T100: 70,
//       T120: 85,
//       T150: 85,
//     },
//     anchoMaximo: 4000,
//     descripcion: "Zócalo aluminio mate para h:",
//     referencia: {
//       M60: "ZAM6.200",
//       T60: "ZAM6.400",
//       M100: "ZB10.ZAM10.200",
//       T100: "ZAM10.400",
//       M120: "ZAM12.200",
//       T120: "ZAM12.400",
//       M150: "ZAM15.200",
//       T150: "ZAM15.400",
//     },
//   },

//   {
//     ref: ["ALUL"], //aluminio lacado
//     pMediaTira: {
//       M60: 58,
//       M100: 58,
//       M120: 66,
//       M150: 66,
//     },
//     pTira: {
//       T60: 94,
//       T100: 94,
//       T120: 110,
//       T150: 110,
//     },
//     anchoMaximo: 4000,
//     descripcion: "Zócalo aluminio lacado para h:",
//     referencia: {
//       M60: "ZAL6.200",
//       T60: "ZAL6.400",
//       M100: "ZAL10.200",
//       T100: "ZAL10.400",
//       M120: "ZAL12.200",
//       T120: "ZAL12.400",
//       M150: "ZAL15.200",
//       T150: "ZAL15.400",
//     },
//   },
// ];

// const zocalos = (ite) => {
//   // if (item.lineales !== undefined) {
//   let footline = [];
//   let calculo = 0;
//   let division = "";
//   let tiraFootline = 0;
//   let mediatiraFootline = 0;
//   let newFootline = [];

//   if (ite !== undefined) {
//     try {
//       //recorremos los diferentes zocalos es decir vienen como un param model diferente
//       const zoc = zocalosw.find((x) =>
//         x.ref.includes(
//           ite.code === "1000" && ite.customCode != "ALU"
//             ? "ALUL"
//             : ite.customCode
//         )
//       );
//       tiraFootline = 0;
//       mediatiraFootline = 0;
//       ite.lineales.forEach((lineal) => {
//         // recorremos los puntos de un zocalo
//         calculo = lineal.lengthWithAllowance / zoc.anchoMaximo;
//         division = calculo.toString().split(".");
//         tiraFootline = tiraFootline + parseInt(division[0]);
//         // const zoc = zocalosw.find(x => x.ref === "Z36");

//         if (parseInt(String(division[1])[0]) < 5) {
//           mediatiraFootline++;
//         } else {
//           tiraFootline++;
//         }
//       });

//       if (tiraFootline > 0) {
//         footline.push({
//           tipo: "T",
//           typeZocalo: "5",
//           material: ite.material || null,
//           customCode: ite.customCode,
//           quantity: tiraFootline || null,
//           priceCabinet:
//             ite.code === "1000"
//               ? zoc.pMediaTira["M" + ite.height.toString()]
//               : zoc.pMediaTira,
//           // mediaTira: mediatiraFootline,
//           // precioTira:
//           //   ite.code === "1000"
//           //     ? zoc.pTira["T" + ite.height.toString()]
//           //     : zoc.pTira, //*tiraFootline
//           total:
//             ite.code === "1000"
//               ? zoc.pMediaTira["M" + ite.height.toString()]
//               : zoc.pMediaTira, //*mediatiraFootline
//           // referenciaMedia:
//           //   zoc.referencia["M" + ite.height.toString()] || null,
//           reference: zoc.referencia["T" + ite.height.toString()] || null,
//           obsBrandGoodId: ite.obsBrandGoodId,
//           name: zoc.descripcion + ite.height.toString(),
//           size: {
//             x: zoc.anchoMaximo,
//             z: ite.height,
//             y: ite.y,
//           },
//         });
//       } else if (mediatiraFootline > 0) {
//         footline.push({
//           tipo: "T",
//           typeZocalo: "5",
//           material: ite.material || null,
//           customCode: ite.customCode,
//           // tira: tiraFootline || null,
//           quantity: mediatiraFootline,
//           priceCabinet:
//             ite.code === "1000"
//               ? zoc.pMediaTira["M" + ite.height.toString()]
//               : zoc.pMediaTira,
//           // precioTira:
//           //   ite.code === "1000"
//           //     ? zoc.pTira["T" + ite.height.toString()]
//           //     : zoc.pTira, //*tiraFootline
//           total:
//             ite.code === "1000"
//               ? zoc.pMediaTira["M" + ite.height.toString()]
//               : zoc.pMediaTira, //*mediatiraFootline
//           reference: zoc.referencia["M" + ite.height.toString()] || null,
//           obsBrandGoodId: ite.obsBrandGoodId,
//           // referenciaTira: zoc.referencia["T" + ite.height.toString()] || null,
//           name: zoc.descripcion + ite.height.toString(),
//           size: {
//             x: zoc.anchoMaximo,
//             z: ite.height,
//             y: it.y,
//           },
//         });
//       }

//       //sumar los zocalos que son del mismo material(combinarlo)
//       newFootline = [].concat(footline); //duplicamos el array de los zocalos a otro nuevo

//       for (let tamano = 0; tamano < newFootline.length; tamano++) {
//         newFootline.forEach((lineal, indice) => {
//           if (
//             lineal != undefined &&
//             newFootline[tamano] != undefined &&
//             newFootline[tamano].material === lineal.material &&
//             tamano !== indice &&
//             newFootline[tamano].altura === lineal.altura &&
//             newFootline[tamano].reference === lineal.reference
//           ) {
//             newFootline[tamano].mediaTira += lineal.mediaTira;
//             newFootline[tamano].tira += lineal.tira;
//             newFootline[tamano].precioTira += lineal.precioTira;
//             newFootline[tamano].precioMediaTira += lineal.precioMediaTira;
//             delete newFootline[indice];
//           }
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     newFootline = newFootline.filter((x) => x != Empty);
//   }
//   return newFootline;
// };

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

const getPrice = (parametros, tipo, materialCasco) => {
  const isCabinet = tipo === "cabinet";
  // const cogerParametro = isCabinet ? CONFIG.PRICE : "PTOTAL";
  let price = 0;

  const findPrice = (items) => {
    let name = items?.some(
      (item) => item?.name && String(item.name).toUpperCase() === "PTOTAL"
    )
      ? "PTOTAL"
      : "PRICE";
    return items?.find(
      (item) => item?.name && String(item.name).toUpperCase() === name
    )?.value;
  };

  const arrParameters = parametros.parameters.concat(
    parametros.ignoreParameters
  );

  price = parseFloat(findPrice(arrParameters));

  // price = parseFloat(arrParameters || 0);

  if (isCabinet) {
    if (parametros.textureCustomCode === "C1") {
    } else if (parametros.textureCustomCode === "PLAM") {
      if (
        materialCasco === "171-EUCALIPTO" ||
        materialCasco === "172-ROBLE" ||
        materialCasco === "169-NOGAL NATURAL"
      ) {
        price += price * 0.1;
      } else {
        price += price * 0.25;
      }
    } else if (
      parametros.textureCustomCode === "ESTB" ||
      parametros.textureCustomCode === "ESTF" ||
      parametros.textureCustomCode === "ESTM"
    ) {
      price += price * 0.4;
    } else if (
      parametros.textureCustomCode === "NP300" ||
      parametros.textureCustomCode === "NP200" ||
      parametros.textureCustomCode === "P200L"
    ) {
      price += price * 0.6;
    } else if (
      parametros.textureCustomCode === "LACAM" ||
      parametros.textureCustomCode === "LACAB"
    ) {
      price += price * 0.6;
    } else if (parametros.textureCustomCode === "PANT") {
      price += price * 0.35;
    } else {
      price += price * 0.1;
    }
  }
  // console.log(
  //   "El cabinet: " +
  //     isCabinet +
  //     "        El tipo: " +
  //     tipo +
  //     "        El precio: " +
  //     price
  // );
  return price;
};

const getRef = (parametros, reference) => {
  // Inicialización de referencia

  reference.ref = parametros.obsBrandGoodId;
  reference.type = "C";

  const updateReference = (value) => {
    const trimmedValue = value.trim();
    const upperValue = trimmedValue.toLocaleUpperCase();
    if (upperValue.includes(CONFIG.MODELNAME.SOBREENCIMERAS.CODE)) {
      reference.type = CONFIG.MODELNAME.MURALES.CODE;
    } else if (upperValue.startsWith(CONFIG.MODELNAME.FORRADO.CODE)) {
      reference.type = CONFIG.MODELNAME.FORRADO.CODE;
    } else if (["RA", "RB", "RM"].includes(trimmedValue.substring(0, 2))) {
      reference.type = "R";
    } else if (trimmedValue.startsWith("AF")) {
      reference.type = "A";
    } else if (["BF", "BP", "BH"].includes(trimmedValue.substring(0, 2))) {
      reference.type = "B";
    } else if (trimmedValue.startsWith("BD25")) {
      reference.type = "T";
    } else if (trimmedValue.startsWith("MF")) {
      reference.type = "M";
    } else if (trimmedValue.startsWith("B")) {
      reference.type = "B";
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
    // } else if (modelNameUpper.includes("MURAL")) {
    //   reference.type = "M";
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

      // Verificar si el tipo de puerta requiere un perfil
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

//----------------------------------------------------------------
// const getInfoDoor = (submodels) => {
//   console.log(submodels);
//   let values = {
//     materialDoor: null,
//     modelDoor: null,
//   };

//   submodels.forEach((item) => {
//     if (
//       String(item.customCode).trim().substring(0, 2) ===
//       CONFIG.CUSTOMCODE.DRAWER
//     ) {
//       item.subModels.forEach((item2) => {
//         if (
//           String(item2.customCode).trim().substring(0, 2) ===
//           CONFIG.CUSTOMCODE.DOOR
//         ) {
//           values = {
//             materialDoor: String(item2.textureName),
//             modelDoor: String(item2.modelProductNumber),
//             handler: getInfoHandler(item.subModels),
//           };
//         }
//       });
//     }
//     if (
//       String(item.customCode).trim().substring(0, 2) === CONFIG.CUSTOMCODE.DOOR
//     ) {
//       values = {
//         materialDoor: String(item.textureName),
//         modelDoor: String(item.modelProductNumber),
//         handler: getInfoHandler(item.subModels),
//       };
//     }
//   });
//   return values;
// };
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
//----------------------------------------------------------------

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
  };

  submodels.forEach((item) => {
    if (
      String(item.modelName).toLocaleUpperCase().indexOf("CASCO") !== -1 ||
      String(item.modelBrandGoodName).toLocaleUpperCase().indexOf("CASCO") !==
        -1
    ) {
      values = {
        materialCabinet: item.textureName,
      };
    }

    /*if (
      String(item.customCode).trim().substring(0, 2) === CONFIG.CUSTOMCODE.CASCO
    ) {
      values = {
        materialCabinet: item.textureName,
      };
    }*/
  });
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

  submodels.forEach((item) => {
    if (String(item.customCode).substring(0, 2) === CONFIG.CUSTOMCODE.DOOR) {
      let perfil;
      //ESE TIPO DE PUERTAS LLEVAN UN PERFIL Y HAY QUE SUMARLE EL PRECIO DE ESTE A LA PUERTA
      if (
        String(item.modelBrandGoodName).toLocaleUpperCase().indexOf("PURA") !==
          -1 ||
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
  return parseFloat(total);
};

// const getParameters = (param, tipoMueble) => {
//   let op = [];

//   const casco = param.subModels.find((x) =>

//     x.modelBrandGoodName?.toLocaleUpperCase().includes("CASCO")

//   );

//   if (casco !== undefined) {
//     const mcv = casco.subModels.find((x) => {
//       const upperCaseModelName = x.modelName?.toLocaleUpperCase();

//       if (upperCaseModelName) {
//         if (
//           upperCaseModelName.includes("VISTO IZQ") ||
//           upperCaseModelName.includes("VISTO DER") ||
//           upperCaseModelName.includes("AMBOS")||
//           upperCaseModelName.includes("TODOS ACABADOS")

//         ) {
//           return x.textureName;
//         }
//       }
//     });
//     const cv = casco.parameters.find((x) =>
//       x.name == "CV" && x.value > 0 ? x.value : undefined
//     );
//     if (cv !== undefined) {
//       op.push({
//         name: cv.displayName || null,
//         value: parseFloat(cv.value) || null,
//         description: cv.description || null,
//         nameValue: cv.optionValues[cv.options?.indexOf(cv.value)].name || null,
//         mcv: mcv&&mcv!==undefined?mcv.textureName : null,
//       });
//     }
//   }
//   param.parameters.forEach((item) => {
//     //para quitar las variante que vienen activas por defecto
//     let bool = true;
//     if (
//       // String(item.name) === "CIZ" ||
//       String(item.name) === "ELEC" ||
//       String(item.name) === "CVI" ||
//       String(item.name) === "CPI" ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "B" &&
//         String(item.name) === "ME") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "B" &&
//         String(item.name) === "MPF2P") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "B" &&
//         String(item.name) === "PE") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "ME") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "MPF2P") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "PE") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "MTCEC") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "UM")
//       /* String(item.name) == "ME" ||
//       String(item.name) === "MPF2P" ||
//       String(item.name) === "PE" ||
//       String(item.name) === "MTCEC" ||
//       String(item.name) === "UM" ||
//       */
//     ) {
//       bool = false;
//     }
//     if (item.name == "FSK" && item.value < 0) {
//       op.push({
//         name: item.displayName,
//         value: parseFloat(item.value),
//         description: item.description,
//         nameValue: item.optionValues[item.options?.indexOf(item.value)].name,
//       });
//     } else if (
//       parseFloat(item.value) > 0 &&
//       item.description !== null &&
//       item.description !== "" &&
//       bool
//     ) {
//       let nameValue;
//       if (item.options.length > 2) {
//         nameValue = item.optionValues[item.options?.indexOf(item.value)].name;
//       }
//       op.push({
//         name: item.displayName,
//         value: parseFloat(item.value),
//         description: item.description,
//         nameValue,
//       });
//     }
//   });
//   return op;
// };

const getParameters = (param, tipoMueble) => {
  const op = [];

  const casco = param.subModels.find((x) =>
    x.modelBrandGoodName?.toUpperCase().includes("CASCO")
  );

  if (casco) {
    const mcv = casco.subModels.find((x) => {
      const upperCaseModelName = x.modelName?.toUpperCase();
      return upperCaseModelName &&
        (upperCaseModelName.includes("VISTO IZQ") ||
          upperCaseModelName.includes("VISTO DER") ||
          upperCaseModelName.includes("AMBOS"))
        ? x.textureName
        : undefined;
    });

    const cv = casco.parameters.find((x) => x.name === "CV" && x.value > 0);

    if (cv) {
      op.push({
        name: cv.displayName || null,
        value: parseFloat(cv.value) || null,
        description: cv.description || null,
        nameValue:
          cv.optionValues?.[cv.options?.indexOf(cv.value)]?.name || null,
        mcv: mcv?.textureName || null,
      });
    }
  }

  const excludedNames = [
    "ELEC",
    "CVI",
    "CPI",
    ...(tipoMueble === "B" ? ["ME", "MPF2P", "PE"] : []),
    ...(tipoMueble === "A" ? ["ME", "MPF2P", "PE", "MTCEC", "UM"] : []),
  ];

  param.subModels.map((puertas) => {
    if (puertas.customCode === "0301") {
      puertas.parameters.map((variante) => {
        if (
          (variante.name === "PVA" || variante.name === "PVL") &&
          variante.value > 0
        ) {
          op.push({
            name: variante.displayName || null,
            value: parseFloat(variante.value) || null,
            description: variante.description || null,
            nameValue:
              variante.optionValues?.[variante.options?.indexOf(variante.value)]
                ?.name || null,
          });
        }
      });
    }
  });

  param.parameters.forEach((item) => {
    const itemName = String(item.name);
    const itemValue = parseFloat(item.value);

    if ((itemName === "PVA" || itemName === "PVL") && itemValue) {
      op.push({
        name: item.displayName,
        value: item.value,
        description: item.description,
        nameValue:
          item.options.length > 2
            ? item.optionValues?.[item.options?.indexOf(item.value)]?.name
            : undefined,
      });
      return;
    }

    if (excludedNames.includes(itemName)) return;

    if (
      (itemName === "FSK" && itemValue < 0) ||
      (itemValue > 0 && item.description)
    ) {
      const paramObject = createParameterObject(item);
      if (paramObject) {
        op.push(paramObject);
      }
    }
  });

  return op;
};

const createParameterObject = (item) => ({
  name: item.displayName,
  value: parseFloat(item.value),
  description: item.description,
  nameValue:
    item.options.length > 2
      ? item.optionValues?.[item.options?.indexOf(item.value)]?.name
      : undefined,
});

// const getPriceParameters = (param, tipoMueble) => {
//   let precioVariant = 0;
//   param.forEach((item) => {
//     //borrar
//     let bool = true;

//     if (
//       // String(item.name) === "CIZ" ||
//       String(item.name) === "ELEC" ||
//       String(item.name) === "CVI" ||
//       String(item.name) === "CPI" ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "B" &&
//         String(item.name) === "ME") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "B" &&
//         String(item.name) === "MPF2P") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "B" &&
//         String(item.name) === "PE") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "ME") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "MPF2P") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "PE") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "MTCEC") ||
//       (tipoMueble != undefined &&
//         String(tipoMueble) == "A" &&
//         String(item.name) === "UM")
//       /* String(item.name) == "ME" ||
//       String(item.name) === "MPF2P" ||
//       String(item.name) === "PE" ||
//       String(item.name) === "MTCEC" ||
//       String(item.name) === "UM" ||
//       */
//     ) {
//       bool = false;
//     }

//     if (
//       parseFloat(item.value) > 0 &&
//       item.description !== null &&
//       item.description !== "" &&
//       bool
//     ) {
//       precioVariant += parseFloat(item.value);
//     }

//     //borrar
//   });
//   return parseFloat(precioVariant).toFixed(2);
// };

const getPriceParameters = (param, tipoMueble) => {
  let precioVariant = 0;
  const excludedNames = [
    "ELEC",
    "CVI",
    "CPI",
    ...(tipoMueble === "B" ? ["ME", "MPF2P", "PE"] : []),
    ...(tipoMueble === "A" ? ["ME", "MPF2P", "PE", "MTCEC", "UM"] : []),
  ];

  param.forEach((item) => {
    const itemName = String(item.name);

    if (excludedNames.includes(itemName)) return;

    if (itemName === "PVA" || itemName === "PVL") {
      precioVariant += 15;
    }

    if (itemName === "AP" || itemName === "INTV") return;

    const itemValue =
      itemName === "PVA" || itemName === "PVL" ? 15 : parseFloat(item.value);

    if (itemValue > 0 && item.description) {
      precioVariant += itemValue;
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

  // if (
  //   String(item.modelProductNumber).toUpperCase() === "COSTADOS" &&
  //   item.boxSize.y >= 150 &&
  //   item.boxSize.y < 700
  // ) {
  //   size.y = item.boxSize.y + 2;
  // } else if (
  //   String(item.modelProductNumber).toUpperCase() === "COSTADOS" &&
  //   item.boxSize.y >= 700
  // ) {
  //   size.y = item.boxSize.y + 4;
  // } elses
  if (
    (item.prodCatId === 721 || item.prodCatId === 719 || item.prodCatId === 696) &&
    String(item.modelProductNumber).toUpperCase() !== "DECORATIVOS"
  ) {
    console.log(item);
    size.y = item.boxSize.y + fondoPuerta;
  } else {
    size.y = item.boxSize.y;
  }
  
  size.x = item.boxSize.x;
  size.z = item.boxSize.z;
  
  size.x = item.boxSize.x;
  size.z = item.boxSize.z;

  /* item.subModels.forEach((item) => {
      if (String(item.customCode).substring(0, 2) === config.customCode.drawer) {
        item.subModels?.forEach((item) => {
          if (item && item.subModels && item.subModels.length > 0) {
            if (
              String(item.customCode).substring(0, 2) === config.customCode.door
            ) {
              fondoPuerta = item.boxSize.y;
            }
          }
        });
      } else if (
        String(item.customCode).substring(0, 2) === config.customCode.door
      ) 
        fondoPuerta = item.boxSize.y;
      }
    });*/

  return size;
};

const removeDuplicates = (array) => {
  // Se mapea cada elemento del array a mayúsculas y luego se filtran los elementos únicos
  return array
    .map((element) => element.toUpperCase())
    .filter((element, index, self) => {
      // Se devuelve true solo para el primer índice de cada elemento único
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
  const priceParameters = getPriceParameters(item.parameters, tipoMueble);

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
    let contador2 = 0;
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
      //Si es campana integrada tenemos que sacar unas variables del mueble
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
            referenceType.type
          ),
        });
        // } else if (item["@type"] == "5") {
        // arrZocalos.push(
        //   zocalos(
        //     {
        //       material: item.textureName,
        //       lineales: item.profileSegments,
        //       customCode: item.textureCustomCode,
        //       y: item.profileSegments[0].width,
        //       height: item.size.z,
        //       code:
        //         "brandGoodCode" in item.profiles[0]
        //           ? item.profiles[0].brandGoodCode
        //           : null,
        //     },
        //   )
        // );
        // let pushTipo = zocalos({
        //   tipo: "T",
        //   tipo: "T",
        //   material: item.textureName,
        //   lineales: item.profileSegments,
        //   customCode: item.textureCustomCode,
        //   y: item.profileSegments[0].width,
        //   height: item.size.z,
        //   code:
        //     "brandGoodCode" in item.profiles[0]
        //       ? item.profiles[0].brandGoodCode
        //       : null,
        //   obsBrandGoodId: item.obsBrandGoodId,
        //   customCode: item.textureCustomCode,
        // });
      } else if (item["@type"] == "3") {
        item.subModels?.forEach((submodel) => {
          if (submodel.modelName == "Countertop Block") {
            arrEncimeras.push({
              Material: submodel.textureName,
              Puntos: submodel.size,
            });
          }
        });
        // } else if (item["@type"] == 1) {
        //   item.subModels
        //     .filter((element) => String(element.modelTypeId) === "1")
        //     .map((element) => {
        //       if (
        //         String(element.customCode).trim().substring(0, 2) ===
        //         CONFIG.CUSTOMCODE.DOOR
        //       ) {
        //         element.subModels.map((el) => {
        //           if (String(el.modelTypeId) === "2") {
        //             tiradores.push({
        //               name: el.modelBrandGoodName,
        //               material: el.textureName,
        //               price: el.modelCostInfo.unitCost,
        //             });
        //           }
        //         });
        //       }
        //     });
      } else {
        referenceType = getRef(item, referenceType);
        opening = "";
        contador = contador + 1;
        // let priceCabinet =
        //   referenceType.type !== "A" ||
        //   referenceType.type !== "B" ||
        //   referenceType.type !== "M"
        //     ? parseFloat(
        //         item.parameters.find(
        //           (item) => String(item.name).toUpperCase() === "PRICE"
        //         )?.value
        //       )
        //     : getPrice(
        //         item,
        //         "cabinet",
        //         item.textureName,
        //         item.modelCostInfo.quotationRate
        //       );
        let items = {
          id: `id_${contador}`,
          name: item.modelName,
          // priceCabinet: priceCabinet,
          reference: referenceType.ref,
          tipo: referenceType.type,
          customcode: item.customCode || null,
          campana,
          priceCabinet: getPrice(
            item,
            // "cabinet",
            referenceType.type === "A" ||
              referenceType.type === "B" ||
              referenceType.type === "M"
              ? "cabinet"
              : referenceType.type,
            item.textureName,
            item.modelCostInfo.quotationRate
          ),
        };

        // --------------------------------------------------------------------------------------------------------------------------------------

        // if (
        //   item.modelProductNumber !== undefined ||
        //   item.modelProductNumber !== 0
        // ) {
        //   item.subModels.map(it => {
        //     if (
        //       it.modelProductNumber !== undefined ||
        //       it.modelProductNumber !== 0
        //     ) {
        //       model = it.modelProductNumber;
        //       console.log(it.modelProductNumber);
        //     } else {
        //       model = "No hay modelo";
        //     }
        //   });
        //   if (
        //     tipos.includes(String(item.modelProductNumber).toLocaleUpperCase())
        //   ) {
        //   } else {
        //     model = item.modelProductNumber;
        //   }
        // } else {
        //   item.subModels.map(it => {
        //     if (
        //       it.modelProductNumber !== undefined ||
        //       it.modelProductNumber !== 0
        //     ) {
        //       model = it.modelProductNumber;
        //       console.log(it.modelProductNumber);
        //     } else {
        //       model = "No hay modelo";
        //     }
        //   });
        // }

        // if (item.modelProductNumber !== undefined && item.modelProductNumber !== 0 && !tipos.includes(String(item.modelProductNumber).toLocaleUpperCase())) {
        //   model = item.modelProductNumber;
        // } else {
        //   item.subModels.some(it => {
        //     if (it.modelProductNumber !== undefined && it.modelProductNumber !== 0 && !tipos.includes(String(it.modelProductNumber).toLocaleUpperCase())) {
        //       model = it.modelProductNumber;
        //       return true;
        //     }
        //     return false;
        //   });

        //   if (model === undefined) {
        //     model = "No hay modelo";
        //   }
        // }
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
            ? (materialRegletaF =
                item.subModels[0]
                  .textureName) /*(materialRegletaF = item.subModels[0].subModels[0].textureName)*/
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
            // if (
            //   item3.simpleName === "LD" &&
            //   (referenceType.type === CONFIG.MODELNAME.BAJOS.CODE ||
            //     referenceType.type === CONFIG.MODELNAME.MURALES.CODE) ||
            //   arrZocalos.length > 0
            // ) {
            //   if (zocalo === 0) {
            //     zocalo = arrZocalos[0].height;
            //   }
            // }
          });

          if (item.customCode === CONFIG.CUSTOMCODE.BALDAS_DECORATIVAS) {
            armazonInfo = {
              materialCabinet: item.textureName,
              modelCabinet: item.modelName,
            };
          } else {
            armazonInfo = getInfoCabinet(item.subModels);
          }
          cajonesInfo = getInfoDrawer(item.subModels);
          cabinet = armazonInfo;
          // -------------------------------------------------------
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
                  cajonesInfo = {
                    modelName: model.modelName,
                    materialDrawer: model.textureName,
                  };
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

          // Llamada a la función con el item principal
          buscarCajonesYPuertas(item.subModels);

          // ----------------------------------------------------
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
              // console.log(filtroMaterialDrawer)
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

          const accesories = item.subModels
            .filter((element) => String(element.modelTypeId) === "4")
            .map((element) => {
              return {
                id: `id_${contador}_${contador2++}`,
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
            });
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
          let totalPrice =
            parseFloat(items.priceCabinet) +
            parseFloat(getTotalDoors(item.subModels)) +
            parseFloat(
              getPriceParameters(item.parameters, referenceType.type)
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

              //A las esterillas se le agrega el ancho de la cajonera
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
              if (`${itemx.reference}${item.size?.x || ""}`) {
                cabinets.push({
                  id: itemx.id,
                  description: description2,
                  obsBrandGoodId2,
                  obsBrandGoodId: itemx.obsBrandGoodId,
                  name: `${itemx.name}`,
                  tipo: CONFIG.MODELNAME.ACCESORIOS.CODE,
                  reference: referenceTemp,
                  doors: 0,
                  priceDoor: parseFloat(getTotalDoors(item.subModels)),
                  total:
                    parseFloat(itemx.price) * parseFloat(itemx.quantity || 1),
                  size: item.boxSize, // { width: 0, height: 0, depth: 0 },
                  variants: getParameters(item),
                  priceVariants: 0,
                  priceDrawers: 0,
                  drawerPriceDetails,
                  drawerMaterialDetails,
                  //description: description ,
                  // material: getInfoArmazon(item.subModels) || null,
                  material: item.textureName,
                  variants: [],
                  designerName: json.partnerOrder?.designerName || "",
                  quantity: parseInt(itemx.quantity) || 1,
                  ...extra,
                });
              }
            });
          // Buscar casco para pasarlo directamente
          // const casco = item.subModels.find((x) =>
          //   x.modelBrandGoodName?.toLocaleUpperCase().includes("CASCO")
          // );
          // console.log(casco, "CASCO");

          let nameFinal = item.modelName;
          if (String(item.modelName).indexOf("L") > -1) {
            //quitar los ultimos 4 digitos y eliminar los guiones

            nameFinal = String(item.modelName)
              .substring(0, String(item.modelName).length - 5)
              .replace(/-/g, "");
          }
          // nameFinal.toUpperCase().includes("LINERO")
          //   ? (armazonInfo = {
          //       materialCabinet: item.textureName,
          //       modelCabinet: item.modelName,
          //     })
          //   : (armazonInfo = getInfoCabinet(item.subModels));
          // console.log(item, totalPrice)
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
              obsBrandGoodId: item.obsBrandGoodId,
              description,
              name: String(nameFinal).replace("-", ""),
              modelName: String(nameFinal).replace("-", ""),
              doors: getDoors(item.subModels),
              opening,
              modelDrawer: modeloDrawer,
              zocalo: zocalo,
              priceDoor: parseInt(getTotalDoors(item.subModels)),
              total: parseFloat(totalPrice),
              size: getCalculoFondo(item), // { width: 0, height: 0, depth: 0 },
              variants: getParameters(item, referenceType.type),
              priceVariants: getPriceParameters(
                item.parameters,
                referenceType.type
              ),
              priceDrawers: isCajonExist
                ? parseFloat(drawerPrice) //.toFixed(0)
                : "",
              drawerPriceDetails,
              drawerMaterialDetails,
              tiradores,
              // material: isComplement
              //   ? item.textureName
              //   : getInfoArmazon(item.subModels) || null,
              material: item.textureName,
              modelDrawer: cajonesInfo?.modelDrawer || null,
              materialDrawer: cajonesInfo?.materialDrawer || null,
              modelDoor: puertasInfo?.modelDoor || null,
              materialDoor: puertasInfo?.materialDoor || null,
              modelHandler: puertasInfo?.handler || null,
              modelCabinet: armazonInfo?.modelCabinet || null,
              materialCabinet: armazonInfo?.materialCabinet || null,
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
          parseFloat(getTotalDoors(item.subModels)) +
          parseFloat(getPriceParameters(item.parameters, referenceType.type));
      }
      const referenceTiradores = (item) => {
        for (const reference of item.ignoreParameters) {
          if (reference.name === "REF") {
            return String(reference.value);
          }
        }
      };

      for (const cabinet of cabinets) {
        if (
          String(cabinet.modelProductNumber).toLocaleUpperCase() ===
            "COMPLEMENTOS" ||
          String(cabinet.modelProductNumber).toLocaleUpperCase() ===
            "ACCESORIOS"
        ) {
          const cantidad = item.parameters.find((c) => c.name === "Cantidad");
          const precio = item.parameters.find((p) => p.name === "price");
          if (cantidad && cabinet.quantity === undefined) {
            cabinet.quantity = parseFloat(cantidad.value);
          }
          if (precio && cabinet.total === undefined) {
            cabinet.total = parseFloat(precio.value);
          }
        }
      }
      item.subModels
        .filter((element) => String(element.modelTypeId) === "1")
        .map((element) => {
          if (
            String(element.customCode).trim().substring(0, 2) ===
            CONFIG.CUSTOMCODE.DOOR
          ) {
            element.subModels?.map((el) => {
              if (String(el.customCode).trim() === "1101") {
                modelHandlerArray.push({
                  material: el.textureName,
                  total: parseFloat(el.modelCostInfo.unitCost),
                  priceCabinet: parseFloat(el.modelCostInfo.unitCost),
                  tipo: "C",
                  material: el.textureName,
                  reference: referenceTiradores(el) || null,
                  customCode: null,
                  size: {
                    x: el.size.x,
                    y: el.size.y,
                    z: el.size.z,
                  },
                  name: el.modelName,
                  obsBrandGoodId: el.obsBrandGoodId,
                });
              }
            });
          }
        });
      modelHandlerArray.forEach((handler) => {
        tiradoresCabecera.push(handler.name);
      });
    });

    contador = contador + 1;
    arrZocalos.filter((zoc) => {
      zoc.typeZocalo = "library";
      zoc.id = `id_${contador++}`;
      cabinets.push(zoc);
    });

    modelHandlerArray.map((tirador) => {
      tirador.id = `id_${contador++}`;
      cabinets.push(tirador);
    });

    if (modelDrawer) {
      drawerTemp = modelDrawer[0].modelDrawer;
      drawerTexture = modelDrawer[0].textureDrawer;
    }

    cabinets.map((filtro) => {
      if (filtro.tipo === "O") {
        filtro.size.y = filtro.size.y - 20;
      }
      if (String(filtro.modelProductNumber).toUpperCase() === "REGLETAS") {
        filtro.size.x = 150;
      }
    });

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

    // console.log(orderJson);

    return orderJson;
  } catch (error) {
    console.log(error);
  }
};
