import { CONFIG } from "../../shared/config";

export const getPrice = (parametros, tipo) => {
  const isCabinet = tipo === "cabinet";
  let price = 0;

  const findSpecificPrice = (items = [], targetName) => {
    const upperTarget = targetName.toUpperCase();
    return items
      .filter((item) => item?.name?.toUpperCase() === upperTarget && !isNaN(parseFloat(item?.value)))
      .reduce((sum, item) => sum + parseFloat(item.value), 0);
  };

  const findPrice = (items = [], targetName = "PRICE") => {
    const upperTarget = targetName.toUpperCase();
    const keyName = items.some((item) => item?.name?.toUpperCase() === "PTOTAL") ? "PTOTAL" : upperTarget;
    return items
      .filter((item) => item?.name?.toUpperCase() === keyName && !isNaN(parseFloat(item?.value)))
      .reduce((sum, item) => sum + parseFloat(item.value), 0);
  };

  const arrParameters = [].concat(parametros?.parameters || [], parametros?.ignoreParameters || []);
  price = findPrice(arrParameters);

  if (isCabinet) {
    price = price || 10000;
    const intv = arrParameters.some(
      (p) => p?.displayName?.toUpperCase() === "INTV" && parseFloat(p?.value) > 0
    );

    const getSubModelSidesPrice = (subModels = []) =>
      subModels.reduce((sum, subModel) => {
        const sidePrice = findSpecificPrice(subModel?.parameters, "PRECIOCOSTADOS");
        return sum + (parseFloat(sidePrice) > 0 ? parseFloat(sidePrice) : 0);
      }, 0);

    if (parametros.textureCustomCode === "C1") {
      price += getSubModelSidesPrice(parametros.subModels, findPrice);
    } else if (parametros.textureNumber === "111") {
      price += price * 0.1;
      if (intv) price += price * 0.25;
    }

    if (intv) {
      const textureAdjustments = {
        ESTB: 4, ESTF: 4, ESTM: 4, NP300: 4.5, NP200: 4.5,
        P200L: 4.5, LACAM: 4, LACAB: 4, PANT: 2, PLAM: 2,
      };
      price = price * (textureAdjustments[parametros.textureCustomCode] || 0);
    }
  }

  if (tipo !== undefined && tipo !== "cabinet") {
    if (tipo >= 210) {
      price = parseFloat(price) + 25;
    } else if (tipo < 210 && parametros.customCode !== "7070") {
      price = parseFloat(price) + 15;
    }
  }

  const discountParam = arrParameters.find((p) => p?.name?.toUpperCase() === "DESCUENTO");
  const incrementParam = arrParameters.find((p) => p?.name?.toUpperCase() === "INCREMENTO");

  if (discountParam && !isNaN(parseFloat(discountParam.value)))
    price -= price * (parseFloat(discountParam.value) / 100);
  if (incrementParam && !isNaN(parseFloat(incrementParam.value)))
    price += price * (parseFloat(incrementParam.value) / 100);

  return price;
};

export const getPerfil = (perf) => {
  let price = 0;
  let priceTapa = 0;
  let acabado = undefined;

  const getPriceFromParameters = (parameters, ignoreParameters) => {
    let p = 0;
    const all = [...(parameters || []), ...(ignoreParameters || [])];
    all.forEach((item) => {
      if (String(item.name).toUpperCase() === CONFIG.PRICE) p = parseFloat(item.value);
    });
    return p;
  };

  if (perf) {
    const perfil = perf.find((x) =>
      String(x.modelBrandGoodName).toLocaleUpperCase().includes("PERFIL")
    );
    const tapa = perf.find((x) =>
      String(x.modelBrandGoodName).toLocaleUpperCase().includes("TAPA")
    );
    if (perfil) {
      price = getPriceFromParameters(perfil.parameters, perfil.ignoreParameters);
      acabado = perfil.textureName;
    }
    if (tapa) priceTapa = getPriceFromParameters(tapa.parameters, tapa.ignoreParameters);
  }
  return { price: price + priceTapa, acabado };
};

export const getTotalDoors = (submodels) => {
  let total = 0;
  if (!submodels) return 0;
  submodels.forEach((item) => {
    if (String(item.customCode).substring(0, 2) === CONFIG.CUSTOMCODE.DOOR) {
      let perfil;
      const name = String(item.modelBrandGoodName).toLocaleUpperCase();
      if (name.includes("PURA") || name.includes("GP") || name.includes("MONTEA")) {
        perfil = getPerfil(item.subModels);
      }
      total += parseFloat(getPrice(item)) + parseFloat(perfil?.price || 0);
    }
  });
  return parseFloat(total);
};
