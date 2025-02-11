import React, { useState, useEffect, forwardRef } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import LogoSola from "../../../assets/sola.png";
import { CONFIG } from "../../../data/constants";
import { SolaImagenes } from "../report/solaImages";

Font.register({
  family: "Courier",
  src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  fontStyle: "normal",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginBottom: 10, // Esto crea un espacio entre líneas
  },
  text: {
    fontSize: 8,
  },
});

const Presupuesto_Fabrica = ({ data, price }) => {
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

  const logoLocal = (name) => {
    return <Image style={{ width: "30" }} src={LogoSola} />;
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
    return (
      parseFloat(x).toFixed(0) * parseFloat(data.coefficient).toFixed(2)
    ).toFixed(0);
  };

  let contador = 1;

  const convertirFecha = (fecha) => {
    try {
      const partes = fecha.split(" ");
      const fechaPartes = partes[0].split("-");

      const año = fechaPartes[0];
      const mes = fechaPartes[1];
      const dia = fechaPartes[2];

      const fechaFormateada = `${dia}/${mes}/${año}`;
      return fechaFormateada;
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

  const items = data.cabinets;
  let sumaTotal = 0;
  items.forEach((precio) => {
    sumaTotal += precio.priceTotal;
  });

  return (
    <Document title="Presupuesto COOHOM">
      <Page
        style={{ paddingHorizontal: "65", paddingVertical: "45" }}
        size={"A4"}
        wrap
      >
        <View fixed style={{ display: "flex", flexDirection: "column" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Image style={{ width: "100" }} src={LogoSola} />
            </View>
            <Text
              style={{
                fontSize: "14",
                display: "flex",
                fontFamily: CONFIG.BOLD,
              }}
            >
              Presupuesto
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
                  {data.semanaEntrega && ` (${data.semanaEntrega})`}
                </Text>
                <Text>{data?.customerName}</Text>
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
                <Text>{String(data?.materialDoor).toLowerCase() || "."}</Text>
                <Text>{data?.materialCabinet || "."}</Text>
                <Text>{parseFloat(data?.zocalo) || "."}</Text>
                <Text>{data?.modelHandler || "."}</Text>
                <Text>
                  {" "}
                  {String(data?.modelDrawer).toLowerCase() || ""}
                  {data?.modelDrawer && " / "}
                  {String(data?.materialDrawer).toLowerCase() || ""}
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
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: "8",
                            }}
                          >
                            {" "}
                            {formatNumber(item.priceDrawers)}
                          </Text>
                          {item.drawerPriceDetails.map(
                            (item) => ` [${formatNumber(item)}] `
                          )}
                        </Text>
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
                            {item.materialCabinet || "No hay acabado"} / [{" "}
                            {formatNumber(item.priceCabinet)}]
                          </Text>
                        </Text>
                      )}

                      {item.drawerMaterialDetails.length > 0 &&
                        item.drawerPriceDetails.length > 0 && (
                          <Text
                            style={{
                              fontSize: "7",
                            }}
                          >
                            {item.drawerPriceDetails.map(
                              (it, index) =>
                                `[${formatNumber(it)}] ${
                                  item.drawerMaterialDetails[index].Acabado
                                }/ `
                            )}
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
                          {item.variants.map((item) => (
                            <Text>
                              {" "}
                              {item.name}: {item.description} / [{item.value}]
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {" "}
                      {String(item.observation).length > 0 && (
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
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
                          <Text
                            style={{
                              fontFamily: CONFIG.BOLD,
                              fontSize: "8",
                            }}
                          >
                            {" "}
                            {formatNumber(item.priceDrawers)}
                          </Text>
                        </Text>
                      )}
                      {item.drawerMaterialDetails.length > 0 &&
                        item.drawerPriceDetails.length > 0 && (
                          <Text
                            style={{
                              fontSize: "7",
                            }}
                          >
                            {item.drawerPriceDetails.map(
                              (it, index) =>
                                `[${formatNumber(it)}]` +
                                item.drawerMaterialDetails[index].Acabado +
                                "/ "
                            )}
                          </Text>
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
                            {item.materialCabinet || "No hay acabado"} / [{" "}
                            {formatNumber(item.priceCabinet)} ]
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
                          {item.variants.map((item) => (
                            <Text>
                              {" "}
                              {item.name}: {item.description} / [{item.value}]
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {" "}
                      {String(item.observation).length > 5 && (
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
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
                      <Text>
                        - Frente:{" "}
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {" "}
                          {formatNumber(item.priceDrawers)}
                        </Text>
                      </Text>
                    )}
                    {item.drawerMaterialDetails.length > 0 &&
                      item.drawerPriceDetails.length > 0 && (
                        <Text
                          style={{
                            fontSize: "7",
                          }}
                        >
                          {item.drawerPriceDetails.map(
                            (it, index) =>
                              `[${formatNumber(it)}]` +
                              item.drawerMaterialDetails[index].Acabado +
                              "/ "
                          )}
                        </Text>
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
                          {/*formatNumber(item.priceDoor) + " "*/}
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
                          {item.materialCabinet || "No hay acabado"} / [{" "}
                          {formatNumber(item.priceCabinet)} ]
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
                        {item.variants.map((item) => (
                          <Text>
                            {" "}
                            {item.name}: {item.description} / [{item.value}]
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {" "}
                    {String(item.observation).length > 5 && (
                      <Text
                        style={{
                          fontFamily: CONFIG.BOLD,
                          fontSize: "8",
                        }}
                      >
                        Observaciones: {item.observation}
                      </Text>
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

        {/*cabinets && cabinets?.regletas?.length > 0 && (
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
                      L: 150 F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>
                        - Frente:{" "}
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {" "}
                          {formatNumber(item.priceDrawers)}
                        </Text>
                      </Text>
                    )}
                    {item.drawerMaterialDetails.length > 0 &&
                      item.drawerPriceDetails.length > 0 && (
                        <Text
                          style={{
                            fontSize: "7",
                          }}
                        >
                          {item.drawerPriceDetails.map(
                            (it, index) =>
                              `[${formatNumber(it)}]` +
                              item.drawerMaterialDetails[index].Acabado +
                              "/ "
                          )}
                        </Text>
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
                          {item.materialCabinet || "No hay acabado"} / [{" "}
                          {formatNumber(item.priceCabinet)} ]
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
                        {item.variants.map((item) => (
                          <Text>
                            {" "}
                            {item.name}: {item.description} / [{item.value}]
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {" "}
                    {String(item.observation).length > 5 && (
                      <Text
                        style={{
                          fontFamily: CONFIG.BOLD,
                          fontSize: "8",
                        }}
                      >
                        Observaciones: {item.observation}
                      </Text>
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
        )*/}

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
                      L: 150 F: {item.size?.y} A: {item.size?.z}
                    </Text>
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
                    )}
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>
                        - Frente:{" "}
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {" "}
                          {formatNumber(item.priceDrawers)}
                        </Text>
                        {item.drawerPriceDetails.map(
                          (item) => ` [${formatNumber(item)}] `
                        )}
                      </Text>
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
                    {formatNumber(item.priceCabinet) >= 0 && (
                      <Text>
                        - Armazón:{" "}
                        <Text style={{ fontSize: "8" }}>
                          {item.materialRegleta || "No hay acabado"} / [{" "}
                          {formatNumber(item.priceCabinet)} ]
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
                        {item.variants.map((item) => (
                          <Text>
                            {" "}
                            {item.name}: {item.description} / [{item.value}]
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {" "}
                    {String(item.observation).length > 0 && (
                      <Text
                        style={{
                          fontFamily: CONFIG.BOLD,
                          fontSize: "8",
                        }}
                      >
                        Observaciones: {item.observation}
                      </Text>
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
                    {formatNumber(item.priceDrawers) > 0 && (
                      <Text>
                        - Frente:{" "}
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {" "}
                          {formatNumber(item.priceDrawers)}
                        </Text>
                      </Text>
                    )}
                    {item.drawerMaterialDetails.length > 0 &&
                      item.drawerPriceDetails.length > 0 && (
                        <Text
                          style={{
                            fontSize: "7",
                          }}
                        >
                          {item.drawerPriceDetails.map(
                            (it, index) =>
                              `[${formatNumber(it)}]` +
                              item.drawerMaterialDetails[index].Acabado +
                              "/ "
                          )}
                        </Text>
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
                          {item.materialCabinet || "No hay acabado"} / [{" "}
                          {formatNumber(item.priceCabinet)} ]
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
                        {item.variants.map((item) => (
                          <Text>
                            {" "}
                            {item.name}: {item.description} / [{item.value}]
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {" "}
                    {String(item.observation).length > 5 && (
                      <Text
                        style={{
                          fontFamily: CONFIG.BOLD,
                          fontSize: "8",
                        }}
                      >
                        Observaciones: {item.observation}
                      </Text>
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

        {cabinets && cabinets?.decorativos.length > 0 && (
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
                      <Text>
                        - Frente:{" "}
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          {" "}
                          {formatNumber(item.priceDrawers)}
                        </Text>
                      </Text>
                    )}
                    {item.drawerMaterialDetails.length > 0 &&
                      item.drawerPriceDetails.length > 0 && (
                        <Text
                          style={{
                            fontSize: "7",
                          }}
                        >
                          {item.drawerPriceDetails.map(
                            (it, index) =>
                              `[${formatNumber(it)}]` +
                              item.drawerMaterialDetails[index].Acabado +
                              "/ "
                          )}
                        </Text>
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
                        - Armazón:{" "}
                        <Text style={{ fontSize: "8" }}>
                          {item.materialCabinet || "No hay acabado"} / [{" "}
                          {formatNumber(item.priceCabinet)} ]
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
                        {item.variants.map((item) => (
                          <Text>
                            {" "}
                            {item.name}: {item.description} / [{item.value}]
                          </Text>
                        ))}
                      </View>
                    )}

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {" "}
                      {String(item.observation).length > 0 && (
                        <Text
                          style={{
                            fontFamily: CONFIG.BOLD,
                            fontSize: "8",
                          }}
                        >
                          Observaciones: {item.observation}
                        </Text>
                      )}
                    </View>
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

        {(cabinets && cabinets?.complementos?.length > 0) ||
          (data.infoZocalos.length > 0 && (
            <View style={{ margintop: 40 }}>
              <View wrap={false}>
                <View>
                  <Text
                    style={{ fontSize: "14", marginLeft: "32", marginTop: 20 }}
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
              {data && data.infoZocalos.length > 0 && (
                <View>
                  {data.infoZocalos.map((zoc, index) => (
                    <View style={{ fontSize: 8 }} key={index}>
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
              )}
            </View>
          ))}

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
                    {item.opening && (
                      <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>
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
          {logoLocal(data.userId?.name)}
        </View>
        {price && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              fontSize: "8",
              marginTop: "20",
              marginBottom: "20",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                fontSize: "8",
              }}
            >
              <View>
                <View style={{ marginBottom: "1" }}>
                  <Text>IMPORTE</Text>
                </View>
                <View>
                  <Text>I.V.A. (21,00%)</Text>
                </View>
                <View style={{ marginTop: "1" }}>
                  <Text>
                    <Text>PRECIO TOTAL</Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "80",
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    borderTop: "1 solid #000000",
                    marginBottom: "1",
                    textAlign: "right",
                  }}
                >
                  <Text>{parseFloat(sumaTotal).toFixed(2)}</Text>
                </View>
                <View>
                  <Text>{data.iva}</Text>
                </View>
                <View
                  style={{
                    borderTop: "1 solid #000000",
                    paddingLeft: "8",
                    marginTop: "1",
                  }}
                >
                  <Text>{data.total}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default Presupuesto_Fabrica;
