import React, { useState, useEffect, forwardRef } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  Font,
  StyleSheet,
  Svg,
} from "@react-pdf/renderer";
import LogoALLER from "../../../assets/ALLER.jpeg";
import LogoRAEL from "../../../assets/RAEL.jpeg";
import LogoKUBS from "../../../assets/KUBS.jpeg";
import LogoCERAPAL from "../../../assets/CERAPAL.jpeg";
import LogoJ10 from "../../../assets/J10.jpeg";
import LogoDecor from "../../../assets/DECORMOBILIARIO.jpeg";
import Sukaldeak from "../../../assets/Sukaldeak.jpeg";
import Alkain from "../../../assets/Alkain.jpeg";
import Sukaldatu from "../../../assets/Sukaldatu.jpeg";
import LogoSola from "../../../assets/sola.png";
import { CONFIG } from "../../../data/constants";
import { SolaImagenes } from "./solaImages";

Font.register({
  family: "Courier",
  src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  fontStyle: "normal",
  fontWeight: "normal",
});

const Confirmacion_Pedido = ({ data, price, title }) => {
  const [cabinets, setCabinets] = useState({
    decorativos: [],
    altos: [],
    bajos: [],
    complementos: [],
    murales: [],
    regletas: [],
    costados: [],
    accesorios: [],
  });

  const logoUrl = (name) => {
    if (name === "Aller Alvarez") {
      return <Image style={{ width: "30" }} src={LogoALLER} />;
    } else if (name === "decormobiliario") {
      return <Image style={{ width: "30" }} src={LogoDecor} />;
    } else if (name === "KUBS") {
      return <Image style={{ width: "30" }} src={LogoKUBS} />;
    } else if (name === "j10") {
      return <Image style={{ width: "30" }} src={LogoJ10} />;
    } else if (name === "RAEL") {
      return <Image style={{ width: "30" }} src={LogoRAEL} />;
    } else if (name === "CERAPAL") {
      return <Image style={{ width: "30" }} src={LogoCERAPAL} />;
    } else if (name === "Kitchen sukaldeak") {
      return <Image style={{ width: "30" }} src={Sukaldeak} />;
    } else if (name === "Alkain") {
      return <Image style={{ width: "30" }} src={Alkain} />;
    } else {
      return <Image style={{ width: "30" }} src={LogoSola} />;
    }
  };

  const urlObject = {
    uri: "https://ca.slack-edge.com/T01FDFA152Q-U059GUC3KHD-7c3fcf45349d-512",
    method: 'GET',
    headers: "CORS",
    body: ''
  };

  const logoUrlGrande = (name) => {
    if (name === "Aller Alvarez") {
      return <Image style={{ width: "100" }} src={LogoALLER} />;
    } else if (name === "decormobiliario") {
      return <Image style={{ width: "100" }} src={LogoDecor} />;
    } else if (name === "KUBS") {
      return <Image style={{ width: "100" }} src={LogoKUBS} />;
    } else if (name === "j10") {
      return <Image style={{ width: "100" }} src={LogoJ10} />;
    } else if (name === "RAEL") {
      return <Image style={{ width: "100" }} src={LogoRAEL} />;
    } else if (name === "CERAPAL") {
      return <Image style={{ width: "100" }} src={LogoCERAPAL} />;
    } else if (name === "Kitchen sukaldeak") {
      return <Image style={{ width: "100" }} src={Sukaldeak} />;
    } else if (name === "Alkain") {
      return <Image style={{ width: "100" }} src={Alkain} />;
    } else if (name === "Sukaldatu") {
      return <Image style={{ width: "100" }} src={Sukaldatu} />;
    } else {
      return <Image style={{ width: "100px" }} src={LogoSola} />;
    }
  };

  const logoLocal = (name) => {
    return <Image src={LogoSola} style={{ width: "30" }} />;
  };
  const logoLocalGrande = (name) => {
    return <Image src={name} style={{ width: "100" }} />;
  };

  const grayscaleFilter = (color) => {
    const r = Math.floor(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
    return { r, g: r, b: r };
  };

  /**
   *
   *
   * @param {number | string} x
   * @return {number}
   */
  const formatNumber = (x) => {
    if (!x) return 0;
    const result =
      // parseFloat(x).toFixed(0) * parseFloat(data.profile.role === "admin" ? data.userId.coefficient : data.coefficient).toFixed(2)
      (
        parseFloat(x).toFixed(0) * parseFloat(data.coefficient).toFixed(2)
      ).toFixed(0);
    return result;
  };

  let contador = 1;
  let totalDescuentos = 0;

  const convertirFecha = (fecha) => {
    try {
      const partes = fecha.split(" ");
      const fechaPartes = partes[0].split("-");

      const año = fechaPartes[0];
      const mes = fechaPartes[1];
      const dia = fechaPartes[2];

      if (año !== undefined && mes !== undefined && dia !== undefined) {
        const fechaFormateada = `${dia}/${mes}/${año}`;
        return fechaFormateada;
      }
    } catch (e) {
      return fecha;
    }
  };

  // const convertirFechaCreacion = (fecha) => {
  //   try {
  //     const partes = fecha.split("T");
  //     const fechaPartes = partes[0].split("-");

  //     const año = fechaPartes[0];
  //     const mes = fechaPartes[1];
  //     const dia = fechaPartes[2];

  //     const fechaFormateada = `${dia}/${mes}/${año}`;
  //     return fechaFormateada;
  //   } catch (e) {
  //     return fecha;
  //   }
  // };

  const loadImage = (serial) => {
    const xxx = SolaImagenes().find((item) => item.serial === serial);

    if (xxx && xxx.link) {
      return (
        SolaImagenes().find((item) => item.serial === serial)?.link || null
      );
    } else {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMV97UpeAbbPPiPpJz8iFsmgeusjg_pVfTscc75Hm18KTA6np6O7Tro2YAaooQDdqq_zk&usqp=CAU";
    }
    // return SolaImagenes().find((item) => item.serial === serial)?.link || null;
  };

  const verificarVariable = (material) => {
    if (typeof material === "string") {
      return material;
    } else if (typeof material === "object" && material !== null) {
      if (material.materialCabinet !== null) return material.materialCabinet;
    }
  };

  useEffect(() => {
    data &&
      data.cabinets &&
      setCabinets({
        decorativos: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.DECORATIVOS.CODE
        ),
        altos: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.ALTOS.CODE
        ),
        accesorios: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.ACCESORIOS.CODE
        ),
        murales: data.cabinets.filter(
          (item2) =>
            item2.tipo === CONFIG.MODELNAME.MURALES.CODE ||
            item2.tipo === CONFIG.MODELNAME.SOBREENCIMERAS.CODE
        ),
        regletas: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.REGLETAS.CODE
        ),
        bajos: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.BAJOS.CODE
        ),
        complementos: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.COMPLEMENTOS.CODE
        ),
        costados: data.cabinets.filter(
          (item2) => item2.tipo === CONFIG.MODELNAME.COSTADOS.CODE
        ),
      });
  }, [data]);

  // const changeRegletas = (largoRegletas) => {
  //   data.map((largoReg) => {
  //     console.log(largoReg);
  //   });
  //   console.log(largoRegletas);
  // };

  // Función para calcular la suma total de los precios
  let totalIva = 0;

  const calcularSumaTotal = (productos) => {
    return productos.reduce(
      (total, producto) => total + producto.priceTotal,
      0
    );
  };

  let totalZocalo = data.infoZocalos.reduce(
    (total, zocalo) => total + (zocalo.precio ? zocalo.precio : 0),
    0
  );

  const calcularTotalDescuentos = (data) => {
    let totalDescuentos = 0;
    if (data.discountCabinets > 0) {
      totalDescuentos += parseFloat(data.discountCabinetsPorcentaje) || 0;
    }
    return totalDescuentos;
  };

  const calcularTotalIva = (data) => {
    // Asegúrate de que el porcentaje de IVA se extraiga correctamente
    let ivaCabinetsPorcentaje = parseFloat(data.ivaCabinets) || 21; // Default to 21% if not specified
    const totalIva = {
      ivaCabinetsPorcentaje: ivaCabinetsPorcentaje,
    };
    return totalIva;
  };

  const calcularTotalConDescuento = (
    sumaTotal,
    totalZocalo,
    totalDescuentos
  ) => {
    return parseFloat(sumaTotal + totalZocalo - totalDescuentos).toFixed(2);
  };

  const calcularTotalConDescuentoEIVA = (
    sumaTotal,
    totalZocalo,
    totalDescuentos,
    totalIva
  ) => {
    const total = sumaTotal + totalZocalo;
    const totalConDescuento = total - totalDescuentos;
    const totalConIva =
      totalConDescuento *
      (1 + parseFloat(totalIva.ivaCabinetsPorcentaje) / 100);
    return parseFloat(totalConIva).toFixed(2);
  };

  const calcularIva = (sumaTotalSinDescuento, totalIva) => {
    const ivaCabinetsPorcentaje = totalIva.ivaCabinetsPorcentaje || 21;
    return parseFloat(
      sumaTotalSinDescuento * (ivaCabinetsPorcentaje / 100)
    ).toFixed(2);
  };

  // const calcularTotal = (sumaTotalSinDescuento, totalIva) => {
  //   const ivaCabinetsPorcentaje = totalIva.ivaCabinetsPorcentaje || 21;
  //   return parseFloat(
  //     sumaTotalSinDescuento * (1 + ivaCabinetsPorcentaje / 100)
  //   ).toFixed(2);
  // };

  const sumaTotal = calcularSumaTotal(data.cabinets);
  totalIva = calcularTotalIva(data);
  totalDescuentos = calcularTotalDescuentos(data);
  // const sumaTotalSinDescuento = sumaTotal + totalZocalo;

  const complementos =
    data.infoZocalos.length > 0 || cabinets.complementos.length > 0
      ? true
      : false;
  return (
    <Document title="Presupuesto COOHOM">
      <Page
        style={{ paddingHorizontal: "55", paddingVertical: "45" }}
        size={"A4"}
        wrap
      >
        <View style={{ display: "flex", flexDirection: "column" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>{logoUrlGrande(data.userId?.name)}</View>
            {/* <View>{logoLocalGrande(data.userId?.image)}</View> */}
            <Text
              style={{
                fontSize: "14",
                display: "flex",
                fontFamily: CONFIG.BOLD,
              }}
            >
              {title}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "50",
              marginBottom: "40",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "right",
                fontSize: "8",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={{ fontFamily: CONFIG.BOLD }}>
                  Confirmación nº:
                </Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>Creado:</Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>
                  Envío mercancía:
                </Text>
                <Text style={{ fontFamily: CONFIG.BOLD }}>Referencia:</Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>Cliente:</Text>{" "}
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text>{data?.orderCode}</Text>
                <Text>{convertirFecha(data?.fecha) || "."}</Text>
                <Text>
                  {convertirFecha(data.fechaEntrega) || "."}
                  {data.semanaEntrega ? "  (" + data.semanaEntrega + ")" : "."}
                </Text>
                <Text>{data?.customerName}</Text>
                <Text>{data?.storeName}</Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "right",
                fontSize: "8",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={{ fontFamily: CONFIG.BOLD }}>Modelo:</Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>Acabado:</Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>Armazón:</Text>
                <Text style={{ fontFamily: CONFIG.BOLD }}>Zócalo:</Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>Tirador:</Text>{" "}
                <Text style={{ fontFamily: CONFIG.BOLD }}>Cajón:</Text>{" "}
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text>{data?.modelDoor || "."}</Text>
                <Text>{String(data?.materialDoor) || "."}</Text>
                <Text>{data?.materialCabinet || "."}</Text>
                <Text>
                  {/* {data.infoZocalos !== null ? data.infoZocalos.map((zocalo) => {
                    return zocalo.height - 10 + "/"
                  }) : "." } */}
                  .{data?.infoZocalos[0]?.size?.z || "."}
                </Text>
                <Text>{data?.modelHandler || "."}</Text>
                <Text>
                  {String(data?.modelDrawer + "/" + data?.materialDrawer) ||
                    "."}
                  {/* {String(data?.materialDrawer).toLowerCase() || ""} */}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {cabinets && cabinets?.bajos.length > 0 && (
          <View style={{ margintop: "10" }}>
            <View wrap={false}>
              <View>
                <Text style={{ fontSize: "14", marginLeft: "32" }}>
                  MUEBLES BAJOS
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
              {cabinets?.bajos.map((item, key) => (
                <View
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                    marginBottom: "5",
                  }}
                  wrap={false}
                >
                  <View style={{ width: "50", fontSize: "8" }}>
                    <Text>{contador++}</Text>{" "}
                  </View>
                  <View style={{ height: "100", width: "100", fontSize: "8" }}>
                    <Text>
                      <Image
                        style={{
                          width: "80",
                          height: "80",
                        }}
                        filter={grayscaleFilter("#fff")}
                        src={loadImage(
                          item.obsBrandGoodId || item.obsBrandGoodId2
                        )}
                      />
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "40",
                      fontSize: "11",
                    }}
                  >
                    <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                  </View>
                  <View
                    style={{ width: "300", fontSize: "8", marginBottom: 10 }}
                  >
                    <View>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {item.reference}
                      </Text>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: "8" }}>
                        L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                      </Text>
                      {item.opening && (
                        <Text style={{ fontSize: "8" }}>
                          M: {item?.opening}
                        </Text>
                      )}

                      {formatNumber(item.priceDrawers) > 0 && (
                        <Text>
                          - Frente:{" "}
                          {item.drawerMaterialDetails.length > 0 &&
                            item.drawerPriceDetails.length > 0 && (
                              <View>
                                <Text style={{ fontSize: 7 }}>
                                  {item.drawerPriceDetails.map((it, index) => {
                                    const materialDetail =
                                      item.drawerMaterialDetails[index];
                                    if (!materialDetail || it === 0) {
                                      return null;
                                    }

                                    const modelo = materialDetail.modelo || "";
                                    const acabado =
                                      materialDetail.Acabado || "";

                                    const modeloInfo = modelo
                                      ? `${modelo}-`
                                      : "";

                                    return `${modeloInfo}${acabado}/ `;
                                  })}
                                </Text>
                              </View>
                            )}
                        </Text>
                      )}

                      {item.doors !== undefined &&
                        item.doors.acabadoTirador !== undefined &&
                        item.doors.acabadoTirador !== "" && (
                          <Text>
                            - Tiradores: {`${item.doors.acabadoTirador}/ `}
                          </Text>
                        )}
                      {/* {item.drawerMaterialDetails !== undefined &&
                        item.drawerMaterialDetails.length > 0 && (
                          <View>
                            {item.drawerPriceDetails.some((it, index) => {
                              const acabadoTirador =
                                item.drawerMaterialDetails[index]
                                  ?.acabadoTirador;
                              return (
                                acabadoTirador !== undefined &&
                                acabadoTirador.trim() !== ""
                              );
                            }) && (
                              <Text style={{ fontSize: 7 }}>
                                - Tiradores:
                                {item.drawerPriceDetails.map((it, index) => {
                                  const acabadoTirador =
                                    item.drawerMaterialDetails[index]
                                      ?.acabadoTirador;
                                  if (
                                    acabadoTirador !== undefined &&
                                    acabadoTirador.trim() !== ""
                                  ) {
                                    const acabadoInfo = `${acabadoTirador}-`;
                                    return `${acabadoInfo}/ `;
                                  } else {
                                    return "";
                                  }
                                })}
                              </Text>
                            )}
                          </View>
                        )} */}
                      {item.drawerMaterialDetails !== undefined &&
                        item.drawerMaterialDetails.length > 0 && (
                          <View>
                            {item.drawerMaterialDetails.some(
                              (materialDetail) => {
                                const acabadoTirador =
                                  materialDetail?.acabadoTirador;
                                return (
                                  acabadoTirador !== undefined &&
                                  acabadoTirador.trim() !== ""
                                );
                              }
                            ) && (
                              <Text>
                                - Tiradores:
                                {item.drawerMaterialDetails.map(
                                  (materialDetail, index) => {
                                    const acabadoTirador =
                                      materialDetail?.acabadoTirador;
                                    if (
                                      acabadoTirador !== undefined &&
                                      acabadoTirador.trim() !== ""
                                    ) {
                                      const acabadoInfo = `${acabadoTirador}`;
                                      return `${acabadoInfo} / `;
                                    } else {
                                      return "";
                                    }
                                  }
                                )}
                              </Text>
                            )}
                          </View>
                        )}

                      {formatNumber(item.priceDoor) > 0 && (
                        <Text>
                          - Puertas:{" "}
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: "8",
                            }}
                          >
                            {/* {formatNumber(item.priceDoor)} */}
                          </Text>
                          {`${
                            item.doors.name?.toLocaleUpperCase() +
                            "-" +
                            item.doors.material
                          }`}
                        </Text>
                      )}

                      {formatNumber(item.priceCabinet) > 0 && (
                        <Text>
                          - Armazón:{" "}
                          <Text style={{ fontSize: "8" }}>
                            {item.material || item.materialCabinet}
                            {/* / [{" "}{formatNumber(item.priceCabinet)}] */}
                          </Text>
                        </Text>
                      )}
                      {formatNumber(item.priceVariants) > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {" "}
                          <Text>Variantes: </Text>
                          {item.variants.map((it) => (
                            <Text>
                              {" "}
                              {it.name}: {it.nameValue || it.description}{" "}
                              {it.name === "PVA" ? it.value : ""}{" "}
                              {it.mcv ? "/" + it.mcv : ""}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                    {item?.observation !== undefined &&
                      item?.observation.length > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                            }}
                          >
                            Observaciones: {item.observation}
                          </Text>
                        </View>
                      )}
                  </View>
                  {price && (
                    <View style={{ width: "70" }}>
                      <Text style={{ fontSize: "8", textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={{ marginTop: 10 }}>
          {cabinets && cabinets?.murales.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <View wrap={false}>
                <View>
                  <Text style={{ fontSize: "14", marginLeft: "32" }}>
                    MUEBLES MURALES
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontFamily: CONFIG.BOLD,
                    marginTop: "12",
                    fontSize: "10",
                    padding: "2",
                    backgroundColor: "#CFCFCF",
                    borderBottom: "1 black solid",
                  }}
                >
                  <View>
                    <Text style={{ width: "50" }}>POS</Text>
                  </View>
                  <View>
                    <Text style={{ width: "100" }}>MUEBLE</Text>
                  </View>
                  <View>
                    <Text style={{ width: "40" }}>UD.</Text>
                  </View>
                  <View>
                    <Text style={{ width: "300" }}>DESCRIPCION</Text>
                  </View>
                  {price && (
                    <View>
                      <Text style={{ width: "70" }}>IMPORTE</Text>
                    </View>
                  )}
                </View>
              </View>
              {cabinets.murales.map((item, key) => (
                <View
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "10",
                    marginTop: "1",
                  }}
                  wrap={false}
                >
                  <View
                    style={{
                      width: "50",
                      fontSize: "8",
                    }}
                  >
                    <Text>{contador++}</Text>{" "}
                  </View>
                  <View style={{ height: "100", width: "100", fontSize: "8" }}>
                    <Text>
                      <Image
                        style={{
                          width: "80",
                          height: "80",
                        }}
                        filter={grayscaleFilter("#fff")}
                        src={loadImage(
                          item.obsBrandGoodId || item.obsBrandGoodId2
                        )}
                      />
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "40",
                      fontSize: "11",
                    }}
                  >
                    <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                  </View>
                  <View
                    style={{
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <View>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {item.reference}
                      </Text>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: "8" }}>
                        L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                      </Text>
                      {item.opening && (
                        <Text style={{ fontSize: "8" }}>
                          M: {item?.opening}
                        </Text>
                      )}
                      {formatNumber(item.priceDrawers) > 0 && (
                        <Text>
                          - Frente:{" "}
                          {item.drawerMaterialDetails.length > 0 &&
                            item.drawerPriceDetails.length > 0 && (
                              <View>
                                <Text
                                  style={{
                                    fontSize: "7",
                                  }}
                                >
                                  {item.drawerPriceDetails.map(
                                    (it, index) =>
                                      `${item.drawerMaterialDetails[index].modelo}-${item.drawerMaterialDetails[index].Acabado}/ `
                                  )}
                                </Text>
                              </View>
                            )}
                        </Text>
                      )}
                      {formatNumber(item.priceDoor) > 0 && (
                        <Text>
                          - Puertas:{" "}
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: "8",
                            }}
                          >
                            {/* {formatNumber(item.priceDoor)} */}
                          </Text>
                          {` ${
                            item.doors.name.toLocaleUpperCase() +
                            "-" +
                            item.doors.material
                          } / `}
                        </Text>
                      )}
                      {item.doors !== undefined &&
                        item.doors.acabadoTirador !== undefined &&
                        item.doors.acabadoTirador !== "" && (
                          <Text>
                            - Tiradores: {`${item.doors.acabadoTirador}/ `}
                          </Text>
                        )}
                      {/* {item.drawerMaterialDetails !== undefined &&
                        item.drawerMaterialDetails.length > 0 && (
                          <View>
                            {item.drawerPriceDetails.some((it, index) => {
                              const acabadoTirador =
                                item.drawerMaterialDetails[index]
                                  ?.acabadoTirador;
                              return (
                                acabadoTirador !== undefined &&
                                acabadoTirador.trim() !== ""
                              );
                            }) && (
                              <Text style={{ fontSize: 7 }}>
                                - Tiradores:
                                {item.drawerPriceDetails.map((it, index) => {
                                  const acabadoTirador =
                                    item.drawerMaterialDetails[index]
                                      ?.acabadoTirador;
                                  if (
                                    acabadoTirador !== undefined &&
                                    acabadoTirador.trim() !== ""
                                  ) {
                                    const acabadoInfo = `${acabadoTirador}-`;
                                    return `${acabadoInfo}/ `;
                                  } else {
                                    return "";
                                  }
                                })}
                              </Text>
                            )}
                          </View>
                        )} */}
                      {item.drawerMaterialDetails !== undefined &&
                        item.drawerMaterialDetails.length > 0 && (
                          <View>
                            {item.drawerMaterialDetails.some(
                              (materialDetail) => {
                                const acabadoTirador =
                                  materialDetail?.acabadoTirador;
                                return (
                                  acabadoTirador !== undefined &&
                                  acabadoTirador.trim() !== ""
                                );
                              }
                            ) && (
                              <Text>
                                - Tiradores:
                                {item.drawerMaterialDetails.map(
                                  (materialDetail, index) => {
                                    const acabadoTirador =
                                      materialDetail?.acabadoTirador;
                                    if (
                                      acabadoTirador !== undefined &&
                                      acabadoTirador.trim() !== ""
                                    ) {
                                      const acabadoInfo = `${acabadoTirador}-`;
                                      return `${acabadoInfo}/ `;
                                    } else {
                                      return "";
                                    }
                                  }
                                )}
                              </Text>
                            )}
                          </View>
                        )}

                      {formatNumber(item.priceCabinet) > -1 && (
                        <Text>
                          - Armazón:{" "}
                          <Text style={{ fontSize: "8" }}>
                            {item.material || item.materialCabinet}
                            {/* / [{" "}{formatNumber(item.priceCabinet)} ] */}
                          </Text>
                        </Text>
                      )}

                      {formatNumber(item.priceVariants) > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {" "}
                          <Text>Variantes: </Text>
                          {item.variants.map((it) => (
                            <Text>
                              {" "}
                              {it.name}: {it.nameValue || it.description}{" "}
                              {it.name === "PVA" ? it.value : ""}{" "}
                              {it.mcv ? "/" + it.mcv : ""}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>

                    {item?.observation !== undefined &&
                      item?.observation.length > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                            }}
                          >
                            Observaciones: {item.observation}
                          </Text>
                        </View>
                      )}
                  </View>
                  {price && (
                    <View style={{ width: "70" }}>
                      <Text style={{ fontSize: "8", textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {cabinets && cabinets.altos.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <View wrap={false}>
              <View>
                <Text style={{ fontSize: "14", marginLeft: "32" }}>
                  MUEBLES ALTOS
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
            </View>
            {cabinets.altos.map((item, key) => (
              <View
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1",
                  marginBottom: "5",
                }}
                wrap={false}
              >
                <View
                  style={{
                    width: "50",
                    fontSize: "8",
                  }}
                >
                  <Text>{contador++}</Text>{" "}
                </View>
                <View style={{ height: "100", width: "100", fontSize: "8" }}>
                  <Text>
                    <Image
                      style={{
                        width: "80",
                        height: "80",
                      }}
                      filter={grayscaleFilter("#fff")}
                      src={loadImage(
                        item.obsBrandGoodId || item.obsBrandGoodId2
                      )}
                    />
                  </Text>
                </View>
                <View
                  style={{
                    width: "40",
                    fontSize: "11",
                  }}
                >
                  <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                </View>
                <View
                  style={{
                    width: "300",
                    fontSize: "8",
                  }}
                >
                  <View>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>
                      {item.reference}
                    </Text>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
                    <Text style={{ fontSize: "8" }}>
                      L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {item.campana && (
                      <Text style={{ fontSize: "8" }}>
                        {item.campana?.ladoCampana == "DERECHA"
                          ? "-Campana DR:"
                          : item.campana?.ladoCampana == "IZQUIERDA"
                          ? "-Campana IZQ:"
                          : "-Campana:"}
                        {item.campana?.campana}
                        {item.campana?.muebleDR > 0 ? " Mueble IZQ" : " Mueble"}
                        :{item.campana?.mueble}
                        {item.campana?.muebleDR != null
                          ? " Mueble DR:" + item.campana?.muebleDR
                          : ""}
                      </Text>
                    )}
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>- Frente: </Text>
                    )}
                    {formatNumber(item.priceDoor) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>- Puertas: </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {formatNumber(item.priceDoor) + " "}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {item.modelDoor || ""} {item.modelDoor ? "/" : " "}{" "}
                          {item.materialDoor || ""}
                        </Text>
                      </View>
                    )}
                    {formatNumber(item.priceCabinet) > 0 && (
                      <Text>
                        - Armazón:{" "}
                        <Text style={{ fontSize: "8" }}>
                          {item.material || item.materialCabinet}
                          {/* / [{" "}{formatNumber(item.priceCabinet)} ] */}
                        </Text>
                      </Text>
                    )}

                    {formatNumber(item.priceVariants) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {" "}
                        <Text>Variantes: </Text>
                        {item.variants.map((it) => (
                          <Text>
                            {" "}
                            {it.name}: {it.nameValue || it.description}{" "}
                            {it.name === "PVA" ? it.value : ""}{" "}
                            {it.mcv ? "/" + it.mcv : ""}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  {item?.observation !== undefined &&
                    item?.observation.length > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
                      </View>
                    )}
                </View>
                {price && (
                  <View style={{ width: "70" }}>
                    <Text style={{ fontSize: "8", textAlign: "right" }}>
                      {parseFloat(item.priceTotal).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {cabinets && cabinets?.regletas?.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <View wrap={false}>
              <View>
                <Text style={{ fontSize: "14", marginLeft: "32" }}>
                  REGLETAS
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
            </View>
            {cabinets?.regletas?.map((item, key) => (
              <View
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1",
                }}
                wrap={false}
              >
                <View
                  style={{
                    width: "50",
                    fontSize: "8",
                  }}
                >
                  <Text>{contador++}</Text>{" "}
                </View>
                <View style={{ height: "100", width: "100", fontSize: "8" }}>
                  <Text>
                    <Image
                      style={{
                        width: "80",
                        height: "80",
                      }}
                      filter={grayscaleFilter("#fff")}
                      src={loadImage(
                        item.obsBrandGoodId || item.obsBrandGoodId2
                      )}
                    />
                  </Text>
                </View>
                <View
                  style={{
                    width: "40",
                    fontSize: "11",
                  }}
                >
                  <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                </View>
                <View
                  style={{
                    width: "300",
                    fontSize: "8",
                  }}
                >
                  <View>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>
                      {item.reference}
                    </Text>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
                    <Text style={{ fontSize: "8" }}>
                      L:{" "}
                      {item.name.toLocaleUpperCase().includes("REGLETA")
                        ? 150
                        : item.size.x}
                      F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>- Frente: </Text>
                    )}
                    <Text>- Frente: {item.materialRegletaF}</Text>

                    {/* {formatNumber(item.priceDoor) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>- Puertas: </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {formatNumber(item.priceDoor) + " "}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {item.modelDoor || ""} {item.modelDoor ? "/" : " "}{" "}
                          {item.materialDoor || ""}
                        </Text>
                      </View>
                    )} */}
                    {formatNumber(item.priceCabinet) >= 0 && (
                      <Text>
                        - Armazón:{" "}
                        <Text style={{ fontSize: "8" }}>
                          {item.materialRegleta}
                          {/* / [{" "}{formatNumber(item.priceCabinet)} ] */}
                        </Text>
                      </Text>
                    )}

                    {formatNumber(item.priceVariants) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {" "}
                        <Text>Variantes: </Text>
                        {item.variants.map((it) => (
                          <Text>
                            {" "}
                            {it.name}: {it.nameValue || it.description}{" "}
                            {it.name === "PVA" ? it.value : ""}{" "}
                            {it.mcv ? "/" + it.mcv : ""}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  {item?.observation !== undefined &&
                    item?.observation.length > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
                      </View>
                    )}
                </View>
                {price && (
                  <View style={{ width: "70" }}>
                    <Text style={{ fontSize: "8", textAlign: "right" }}>
                      {parseFloat(item.priceTotal).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {cabinets && cabinets?.costados?.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <View wrap={false}>
              <View>
                <Text style={{ fontSize: "14", marginLeft: "32" }}>
                  COSTADOS
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
            </View>
            {cabinets?.costados?.map((item, key) => (
              <View
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1",
                }}
                wrap={false}
              >
                <View
                  style={{
                    width: "50",
                    fontSize: "8",
                  }}
                >
                  <Text>{contador++}</Text>{" "}
                </View>
                <View style={{ height: "100", width: "100", fontSize: "8" }}>
                  <Text>
                    <Image
                      style={{
                        width: "80",
                        height: "80",
                      }}
                      filter={grayscaleFilter("#fff")}
                      src={loadImage(
                        item.obsBrandGoodId || item.obsBrandGoodId2
                      )}
                    />
                  </Text>
                </View>
                <View
                  style={{
                    width: "40",
                    fontSize: "11",
                  }}
                >
                  <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                </View>
                <View
                  style={{
                    width: "300",
                    fontSize: "8",
                  }}
                >
                  <View>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>
                      {item.reference}
                    </Text>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
                    <Text style={{ fontSize: "8" }}>
                      L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                    {formatNumber(item.priceDoor) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>- Puertas: </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {formatNumber(item.priceDoor) + " "}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {item.modelDoor || ""} {item.modelDoor ? "/" : " "}{" "}
                          {item.materialDoor || ""}
                        </Text>
                      </View>
                    )}
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>- Frente: </Text>
                    )}
                    {formatNumber(item.priceDoor) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>- Puertas: </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {formatNumber(item.priceDoor) + " "}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8",
                          }}
                        >
                          {item.modelDoor || ""} {item.modelDoor ? "/" : " "}{" "}
                          {item.materialDoor || ""}
                        </Text>
                      </View>
                    )}
                    {formatNumber(item.priceCabinet) > 0 && (
                      <Text>
                        - Acabado:{" "}
                        <Text style={{ fontSize: "8" }}>
                          {item.materialCostado || "No hay acabado"}
                        </Text>
                      </Text>
                    )}

                    {formatNumber(item.priceVariants) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {" "}
                        <Text>Variantes: </Text>
                        {item.variants.map((it) => (
                          <Text>
                            {" "}
                            {it.name}: {it.nameValue || it.description}{" "}
                            {it.name === "PVA" ? it.value : ""}{" "}
                            {it.mcv ? "/" + it.mcv : ""}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  {item?.observation !== undefined &&
                    item?.observation.length > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
                      </View>
                    )}
                </View>
                {price && (
                  <View style={{ width: "70" }}>
                    <Text style={{ fontSize: "8", textAlign: "right" }}>
                      {parseFloat(item.priceTotal).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {cabinets?.decorativos.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <View wrap={false}>
              <View>
                <Text style={{ fontSize: "14", marginLeft: "32" }}>
                  DECORATIVOS
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
            </View>
            {cabinets.decorativos.map((item, key) => (
              <View
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1",
                }}
                wrap={false}
              >
                <View
                  style={{
                    height: "100",
                    width: "50",
                    fontSize: "8",
                  }}
                >
                  <Text>{contador++}</Text>{" "}
                </View>
                <View style={{ height: "100", width: "100", fontSize: "8" }}>
                  <Text>
                    <Image
                      style={{
                        width: "80",
                        height: "80",
                      }}
                      filter={grayscaleFilter("#fff")}
                      src={loadImage(
                        item.obsBrandGoodId || item.obsBrandGoodId2
                      )}
                    />
                  </Text>
                </View>
                <View
                  style={{
                    height: "100",
                    width: "40",
                    fontSize: "11",
                  }}
                >
                  <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                </View>
                <View
                  style={{
                    height: "120",
                    width: "300",
                    fontSize: "8",
                  }}
                >
                  <View>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>
                      {item.reference}
                    </Text>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
                    <Text style={{ fontSize: "8" }}>
                      L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>- Frente: </Text>
                    )}
                    {formatNumber(item.priceDoor) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>- Puertas: </Text>
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {formatNumber(item.priceDoor) + " "}
                        </Text>
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {item.modelDoor || ""} {item.modelDoor ? "/" : " "}{" "}
                          {item.materialDoor || ""}
                        </Text>
                      </View>
                    )}
                    {formatNumber(item.priceCabinet) > 0 && (
                      <Text>
                        - Acabado:{" "}
                        <Text style={{ fontSize: "8" }}>{item.material}</Text>
                      </Text>
                    )}

                    {formatNumber(item.priceVariants) > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {" "}
                        <Text>Variantes: </Text>
                        {item.variants.map((it) => (
                          <Text>
                            {" "}
                            {it.name}: {it.nameValue || it.description}{" "}
                            {it.name === "PVA" ? it.value : ""}{" "}
                            {it.mcv ? "/" + it.mcv : ""}
                          </Text>
                        ))}
                      </View>
                    )}

                    {item?.observation !== undefined &&
                      item?.observation.length > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                            }}
                          >
                            Observaciones: {item.observation}
                          </Text>
                        </View>
                      )}
                  </View>
                </View>
                {price && (
                  <View style={{ width: "70" }}>
                    <Text style={{ fontSize: "8", textAlign: "right" }}>
                      {parseFloat(item.priceTotal).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        <View style={{ margintop: 40 }}>
          {complementos && (
            <View wrap={false}>
              <View>
                <Text
                  style={{
                    fontSize: "14",
                    marginLeft: "32",
                    marginTop: 20,
                  }}
                >
                  COMPLEMENTOS
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {cabinets.complementos.length > 0 && (
            <View>
              {cabinets?.complementos?.map((item, key) => (
                <View
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                  wrap={false}
                >
                  <View style={{ width: "50", fontSize: "8" }}>
                    <Text>{contador++}</Text>{" "}
                  </View>
                  <View style={{ height: "100", width: "100", fontSize: "8" }}>
                    <Text>
                      <Image
                        style={{
                          width: "80",
                          height: "80",
                        }}
                        filter={grayscaleFilter("#fff")}
                        src={loadImage(
                          item.obsBrandGoodId || item.obsBrandGoodId2
                        )}
                      />
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "40",
                      fontSize: "11",
                    }}
                  >
                    <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                  </View>
                  <View style={{ width: "300", fontSize: "8" }}>
                    <View>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {item.reference}
                      </Text>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: "8" }}>
                        L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                      </Text>
                      {item.opening && (
                        <Text style={{ fontSize: "8" }}>
                          M: {item?.opening}
                        </Text>
                      )}
                      {
                        <Text>
                          - Acabado:{" "}
                          <Text style={{ fontSize: "8" }}>
                            {verificarVariable(item.material)}
                          </Text>
                        </Text>
                      }
                    </View>
                    {item?.observation !== undefined &&
                      item?.observation.length > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                            }}
                          >
                            Observaciones: {item.observation}
                          </Text>
                        </View>
                      )}
                  </View>

                  {price && (
                    <View style={{ width: "70" }}>
                      <Text style={{ fontSize: "8", textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    </View>
                  )}

                  {/* {price && item.typeZocalo === "" ? (
                    <View style={{ width: "70" }}>
                      <Text style={{ fontSize: "8", textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ width: "70" }}>
                      <Text style={{ fontSize: "8", textAlign: "right" }}>
                        {parseFloat(item.priceCabinet).toFixed(2)}
                      </Text>
                    </View>
                  )} */}
                </View>
              ))}
            </View>
          )}

          {/* {data && data.infoZocalos.length > 0 && (
            <View>
              {data.infoZocalos.map((zoc, key) => (
                <View
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                  wrap={false}
                >
                  <View style={{ width: "50", fontSize: "8" }}>
                    <Text>{contador++}</Text>{" "}
                  </View>
                  <View style={{ height: "100", width: "100", fontSize: "8" }}>
                    <Text>
                      <Image
                        style={{
                          width: "80",
                          height: "80",
                        }}
                        filter={grayscaleFilter("#fff")}
                        src={loadImage(zoc.obsBrandGoodId)}
                      />
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "40",
                      fontSize: "11",
                    }}
                  >
                    <Text style={{ fontSize: "8" }}>{zoc.quantity || 1}</Text>
                  </View>
                  <View style={{ width: "300", fontSize: "8" }}>
                    <View>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {zoc.reference}
                      </Text>
                      <Text style={{ fontFamily: CONFIG.BOLD }}>
                        {zoc.name}
                      </Text>

                      <Text style={{ fontSize: "8" }}>
                        {" L: " +
                          zoc?.size?.x +
                          " F: " +
                          zoc?.size?.y +
                          " A: " +
                          zoc?.size?.z}
                      </Text>

                      {data.infoZocalos.length > 0 && (
                        <Text>
                          - Acabado:{" "}
                          <Text style={{ fontSize: "8" }}>
                            {zoc.material} / [ {formatNumber(zoc.priceCabinet)} ]
                          </Text>
                        </Text>
                      )}
                    </View>
                    {zoc?.observation !== undefined &&
                      zoc?.observation.length > 0 && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                            }}
                          >
                            Observaciones: {zoc.observation}
                          </Text>
                        </View>
                      )}
                  </View>

                  {price && (
                    <View style={{ width: "70" }}>
                      <Text style={{ fontSize: "8", textAlign: "right" }}>
                        {zoc.material}
                        {parseFloat(formatNumber(zoc.priceCabinet)).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )} */}

          {/* <View style={{ fontSize: 8 }} key={index}>
                      {zoc.mediaTira && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "10",
                          }}
                        >
                          <View style={{ width: "50", fontSize: "8" }}>
                            <Text>{contador++}</Text>{" "}
                          </View>
                          <View
                            style={{
                              height: "100",
                              width: "100",
                              fontSize: "8",
                            }}
                          >
                            <Text>
                              <Image
                                style={{
                                  width: "80",
                                  height: "80",
                                }}
                                filter={grayscaleFilter("#fff")}
                                src={loadImage(zoc.obsBrandGoodId)}
                              />
                            </Text>
                          </View>
                          <Text style={{ width: "40" }}>{zoc.mediaTira}</Text>
                          <View style={{ width: "300" }}>
                            <Text style={{ fontFamily: CONFIG.BOLD }}>
                              {zoc.referenciaMedia
                                ? zoc.referenciaMedia
                                : "Sin referencia"}
                            </Text>
                            <Text style={{ fontFamily: CONFIG.BOLD }}>
                              {zoc.name}
                            </Text>
                            <Text style={{ fontSize: "8" }}>
                              L: {zoc.anchoMaximo} A: {zoc.material}
                            </Text>
                            <Text> Ancho Max: {zoc.anchoMaximo / 2}</Text>
                          </View>
                          <Text style={{ textAlign: "right", width: "70" }}>
                            {parseFloat(
                              zoc.precioMediaTira * zoc.mediaTira
                            ).toFixed(2)}
                          </Text>
                        </View>
                      )}
                      {zoc.tira && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "10",
                          }}
                        >
                          <View style={{ width: "50", fontSize: "8" }}>
                            <Text>{contador++}</Text>{" "}
                          </View>
                          <View
                            style={{
                              height: "100",
                              width: "100",
                              fontSize: "8",
                            }}
                          >
                            <Text>
                              <Image
                                style={{
                                  width: "80",
                                  height: "80",
                                }}
                                filter={grayscaleFilter("#fff")}
                                src={loadImage(zoc.obsBrandGoodId)}
                              />
                            </Text>
                          </View>
                          <Text style={{ width: "40" }}>{zoc.tira}</Text>
                          <View style={{ width: "300" }}>
                            <Text style={{ fontFamily: CONFIG.BOLD }}>
                              {zoc.referenciaTira
                                ? zoc.referenciaTira
                                : "Sin referencia"}
                            </Text>
                            <Text style={{ fontFamily: CONFIG.BOLD }}>
                              {zoc.name}
                            </Text>
                            <Text style={{ fontSize: "8" }}>
                              L: {zoc.anchoMaximo} A: {zoc.material}
                            </Text>
                            <Text>Ancho Max: {zoc.anchoMaximo}</Text>
                          </View>
                          {price && (
                            <Text style={{ textAlign: "right", width: "70" }}>
                              {parseFloat(zoc.precioTira * zoc.tira).toFixed(2)}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )} */}
        </View>

        {cabinets && cabinets?.accesorios.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <View wrap={false}>
              <View>
                <Text style={{ fontSize: 14, marginLeft: 32 }}>ACCESORIOS</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: CONFIG.BOLD,
                  marginTop: "12",
                  fontSize: "10",
                  padding: "2",
                  backgroundColor: "#CFCFCF",
                  borderBottom: "1 black solid",
                }}
              >
                <View>
                  <Text style={{ width: "50" }}>POS</Text>
                </View>
                <View>
                  <Text style={{ width: "100" }}>MUEBLE</Text>
                </View>
                <View>
                  <Text style={{ width: "40" }}>UD.</Text>
                </View>
                <View>
                  <Text style={{ width: "300" }}>DESCRIPCION</Text>
                </View>
                {price && (
                  <View>
                    <Text style={{ width: "70" }}>IMPORTE</Text>
                  </View>
                )}
              </View>
            </View>
            {cabinets?.accesorios.map((item, key) => (
              <View
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1",
                }}
                wrap={false}
              >
                <View style={{ width: "50", fontSize: "8" }}>
                  <Text>{contador++}</Text>{" "}
                </View>
                <View style={{ height: "100", width: "100", fontSize: "8" }}>
                  <Text>
                    <Image
                      style={{
                        width: "80",
                        height: "80",
                      }}
                      filter={grayscaleFilter("#fff")}
                      src={loadImage(
                        item.obsBrandGoodId || item.obsBrandGoodId2
                      )}
                    />
                  </Text>
                </View>
                <View
                  style={{
                    width: "40",
                    fontSize: "11",
                  }}
                >
                  <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                </View>
                <View style={{ width: "300", fontSize: "8" }}>
                  <View>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>
                      {item.reference}
                    </Text>
                    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
                    <Text style={{ fontSize: "8" }}>
                      L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {formatNumber(item.priceCabinet) > 0 && (
                      <Text>
                        - Acabado:{" "}
                        <Text style={{ fontSize: "8" }}>{item.material}</Text>
                      </Text>
                    )}
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                  </View>
                  {formatNumber(item.priceVariants) > 0 && (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {" "}
                      <Text>Variantes: </Text>
                      {item.variants.map((it) => (
                        <Text>
                          {" "}
                          {it.name}: {it.nameValue || it.description}{" "}
                          {it.name === "PVA" ? it.value : ""}{" "}
                          {it.mcv ? "/" + it.mcv : ""}
                        </Text>
                      ))}
                    </View>
                  )}
                  {item?.observation !== undefined &&
                    item?.observation.length > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: 8, // Asegúrate de que el valor sea numérico y no una cadena
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
                      </View>
                    )}
                </View>

                {price && (
                  <View style={{ width: "70" }}>
                    <Text style={{ fontSize: "8", textAlign: "right" }}>
                      {parseFloat(item.priceTotal).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        <View fixed style={{ position: "absolute", bottom: "20", left: "280" }}>
          <View>
            <Text
              style={{
                width: "30",
                textAlign: "center",
                fontSize: "8",
                marginBottom: "2",
              }}
              render={({ pageNumber }) => `${pageNumber}`}
              fixed
            />
          </View>
          <Image style={{ width: "30" }} src={LogoSola} />
          {/* {logoUrl(data.userId?.name)} */}
          {/* {logoLocal(data.userId?.name)} */}
        </View>
        {price && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              fontSize: 8,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                fontSize: 8,
              }}
            >
              <View>
                <View style={{ marginBottom: 1 }}>
                  <Text>IMPORTE</Text>
                </View>

                <View style={{ marginBottom: 1 }}>
                  {data?.discountCabinets > 0 && (
                    <View>
                      <Text>
                        DESCUENTO({data.discountCabinets}% en muebles)
                      </Text>
                    </View>
                  )}
                </View>
                {data?.discountCabinets > 0 && (
                  <View>
                    <Text>IMPORTE</Text>
                  </View>
                )}
                <View style={{ marginTop: 1 }}>
                  <Text>
                    I.V.A. ({data.ivaCabinets || data.ivaCabinets == 0 ? data.ivaCabinets : "21"}
                    % en muebles)
                  </Text>
                </View>
                <View style={{ marginTop: 1 }}>
                  <Text>PRECIO TOTAL</Text>
                </View>
              </View>

              <View
                style={{
                  width: 80,
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    borderTopWidth: 1,
                    marginBottom: 1,
                    textAlign: "right",
                  }}
                >
                  <Text>{parseFloat(sumaTotal + totalZocalo).toFixed(2)}</Text>
                </View>
                <View>
                  {data?.discountCabinets > 0 && (
                    <View>
                      <Text>
                        {parseFloat(data.discountCabinetsPorcentaje).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>

                {data?.discountCabinets > 0 && (
                  <View>
                    <Text>
                      {calcularTotalConDescuento(
                        sumaTotal,
                        totalZocalo,
                        totalDescuentos
                      )}
                    </Text>
                  </View>
                )}

                <View>
                  <Text>
                    {calcularIva(
                      sumaTotal + totalZocalo - totalDescuentos,
                      totalIva
                    )}
                  </Text>
                </View>

                <View
                  style={{
                    borderTopWidth: 1,
                    paddingLeft: 8,
                    marginTop: 1,
                  }}
                >
                  <View>
                    <Text>
                      {calcularTotalConDescuentoEIVA(
                        sumaTotal,
                        totalZocalo,
                        totalDescuentos,
                        totalIva
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default Confirmacion_Pedido;
