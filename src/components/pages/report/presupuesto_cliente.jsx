import React, { useState, useEffect } from "react";

import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CONFIG } from "../../../data/constants";
import LogoSola from "../../../assets/sola.png";

Font.register({
  family: "Helvetica-Bold",
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

const totales = [];

const convertirFecha = (fecha) => {
  try {
    const partes = fecha?.split(" ") || "";
    const fechaPartes = partes[0]?.split("-") || "";

    const año = fechaPartes[0];
    const mes = fechaPartes[1];
    const dia = fechaPartes[2];

    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada;
  } catch (e) {
    console.log(e);
    return fecha;
  }
};

const Presupuesto_Cliente = ({
  data,
  price,
  totalEncimeras,
  totalEquipamiento,
  totalElectrodomesticos,
}) => {
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

  const logoGrande = (url) => {
    if (!url || url === "") {
      return <Image style={{ width: "100px" }} src={LogoSola} />;
    } else {
      return <Image style={{ width: "100px" }} src={url} />;
    }
  };

  const filterData = (dat, type) => {
    return dat.filter((item) => item.type === type);
  };

  const calcularTotal = (dat, name) => {
    const data = dat?.filter((item) => item.type === name) || [];
    let total = 0;
    data.forEach((element) => {
      total += parseFloat(element.total);
    });
    return total.toFixed(2);
  };

  const calcularDescuento = (importe, descuento) => {
    return parseFloat((importe * descuento) / 100).toFixed(2);
  };

  const calcularImporteDescuento = (importe, desc) => {
    const descuento = calcularDescuento(importe, desc);
    return (importe - descuento).toFixed(2);
  };

  const calcularIva = (imp, descuento, iva) => {
    const importe = calcularImporteDescuento(imp, descuento);
    return parseFloat((importe * iva) / 100).toFixed(2);
  };

  const calcularTotalDescuento = (imp, descuento, iva) => {
    const importe = parseFloat(calcularImporteDescuento(imp, descuento));
    const ivaCalculado = parseFloat(calcularIva(imp, descuento, iva));
    const total = importe + ivaCalculado;
    return total.toFixed(2);
  };

  const calcularIvaCabinets = (imp, descuento, ivaCabinets) => {
    const ivaAplicable = ivaCabinets || 21;
    const importeConDescuento = calcularImporteDescuento(imp, descuento);
    return parseFloat((importeConDescuento * ivaAplicable) / 100).toFixed(2);
  };

  const calcularTotalDescuentoIvaCabinets = (imp, descuento, ivaCabinets) => {
    const importeConDescuento = calcularImporteDescuento(imp, descuento);
    const iva = calcularIvaCabinets(imp, descuento, ivaCabinets);
    const total = parseFloat(importeConDescuento) + parseFloat(iva);
    return parseFloat(total).toFixed(2);
  };

  const Total2 = ({ descuento, importe, seccion, iva }) => {
    const sumaImportes = parseFloat(calcularTotal(importe, seccion));
    const ivaPorcentaje = parseFloat(iva || 21);
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          fontSize: 8,
          marginTop: 20,
          marginBottom: 20,
        }}
        className="flex justify-end flex-row mt-20 mr-12"
        wrap={false}
      >
        <View>
          {descuento && descuento != 0 && (
            <>
              <View style={{ marginBottom: 1 }}>
                <Text>DESCUENTO ({descuento}%)</Text>
              </View>
            </>
          )}
          <View>
            <Text>I.V.A. ({ivaPorcentaje ? "21" : ivaPorcentaje}%)</Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text>
              <Text>PRECIO TOTAL</Text>
            </Text>
          </View>
        </View>
        <View style={{ width: 80, textAlign: "right" }}>
          {descuento && descuento != 0 && (
            <View style={{ textAlign: "right" }}>
              <View style={{ marginTop: 1 }}>
                <Text>{calcularDescuento(sumaImportes, descuento)}</Text>
              </View>
            </View>
          )}
          <View style={{ textAlign: "right", marginTop: 1 }}>
            <Text>{calcularIva(sumaImportes, descuento, ivaPorcentaje)}</Text>
          </View>
          <View
            style={{
              borderTop: "1 solid #000000",
              paddingLeft: 8,
              marginTop: 1,
            }}
          >
            {descuento && descuento != 0 ? (
              <Text>
                {calcularTotalDescuento(sumaImportes, descuento, ivaPorcentaje)}
              </Text>
            ) : (
              <Text>
                {(
                  parseFloat(sumaImportes) +
                  parseFloat(
                    calcularIva(sumaImportes, descuento, ivaPorcentaje)
                  )
                ).toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
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
          (item2) => item2.tipo === CONFIG.MODELNAME.MURALES.CODE
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

  return (
    <Document title="Presupuesto COOHOM" pageMode="fullScreen">
      <Page
        style={{ paddingHorizontal: "55", paddingVertical: "45" }}
        size={"A4"}
        wrap
      >
        <View
          fixed
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "15",
              marginBottom: "18",
            }}
          >
            <View>{logoGrande(data.userId?.logo)}</View>
            <Text
              style={{
                color: "#CFCFCF",
                fontWeight: "extralight",
                fontSize: "8",
              }}
            ></Text>
            <View style={{ fontSize: "8", marginRight: "110" }}>
              <Text>{data.userId.info1}</Text>
              <Text>{data.userId.info2}</Text>
              <Text>{data.userId.info3}</Text>
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
              <Text style={{ fontFamily: CONFIG.BOLD }}>Fecha:</Text>{" "}
              <Text style={{ fontFamily: CONFIG.BOLD }}>Cliente:</Text>{" "}
              <Text style={{ fontFamily: CONFIG.BOLD }}>Referencia:</Text>{" "}
              <Text style={{ fontFamily: CONFIG.BOLD }}>Localidad:</Text>{" "}
              <Text style={{ fontFamily: CONFIG.BOLD }}>Telefono:</Text>{" "}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text>{convertirFecha(data?.fecha)}</Text>
              <Text>{data?.customerName}</Text>
              <Text>{data?.projectName}</Text>
              <Text>{data?.location === "" ? "." : data.location}</Text>
              <Text>{data?.phone}</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={{ marginTop: "10" }}>
            <Text
              style={{
                borderBottom: "1 solid #000000",
                fontFamily: "Helvetica-Bold",
                fontSize: "12",
                marginBottom: "12",
                paddingBottom: "2",
              }}
            >
              PRESUPUESTO
            </Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View
                style={{
                  width: "45",
                  height: "22",
                  backgroundColor: "#CFCFCF",
                  marginTop: "1",
                }}
              ></View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "1",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: "14",
                    marginLeft: "2",
                    marginRight: "4",
                  }}
                >
                  Muebles
                </Text>
                <Text style={{ fontSize: "8" }}>(segun diseño) COCINA</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  fontSize: "12",
                  marginTop: "10",
                  borderBottom: "1 solid #e8e8e9",
                }}
              >
                {data.modelDoor !== undefined && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={{
                        marginRight: "4",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "8",
                      }}
                    >
                      Modelo:
                    </Text>
                    <Text
                      style={{
                        marginRight: "12",
                        fontSize: "8",
                      }}
                    >
                      {data.modelDoor || "."}
                    </Text>
                  </View>
                )}
                {data.materialDoor !== undefined && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={{
                        marginRight: "4",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "8",
                      }}
                    >
                      Color:
                    </Text>
                    <Text
                      style={{
                        marginRight: "12",
                        fontSize: "8",
                      }}
                    >
                      {data.materialDoor || "."}
                    </Text>
                  </View>
                )}
                {data.modelHandler !== undefined && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={{
                        marginRight: "4",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "8",
                      }}
                    >
                      Tirador:
                    </Text>
                    <Text
                      style={{
                        marginRight: "12",
                        fontSize: "8",
                      }}
                    >
                      {data.modelHandler || "."}
                    </Text>
                  </View>
                )}
                {data.materialCabinet !== undefined && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={{
                        marginRight: "4",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "8",
                      }}
                    >
                      Armazón:
                    </Text>
                    <Text
                      style={{
                        marginRight: "12",
                        fontSize: "8",
                      }}
                    >
                      {data.materialCabinet || "."}
                    </Text>
                  </View>
                )}
                {data.modelDrawer !== undefined && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={{
                        marginRight: "4",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "8",
                      }}
                    >
                      Cajón:
                    </Text>
                    <Text
                      style={{
                        marginRight: "12",
                        fontSize: "8",
                      }}
                    >
                      {data?.modelDrawer || ""}
                      {data?.modelDrawer && " / "}
                      {data?.materialDrawer || ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                fontFamily: "Helvetica-Bold",
                marginTop: "4",
                fontSize: "8",
              }}
            >
              <View>
                <Text style={{ width: "30" }}>Ctd</Text>
              </View>
              <View>
                <Text style={{ width: "100" }}>Referencía</Text>
              </View>
              <View>
                <Text style={{ width: "300" }}>Descripción</Text>
              </View>
              <View>
                <Text
                  style={{
                    textAlign: "right",
                    width: "100",
                  }}
                >
                  Importe
                </Text>
              </View>
            </View>

            {cabinets &&
              cabinets.bajos.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text> {item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

            {cabinets &&
              cabinets.murales.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text> {item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

            {cabinets &&
              cabinets.altos.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text> {item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

            {cabinets &&
              cabinets.regletas.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text> {item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

            {cabinets &&
              cabinets.costados.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text> {item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

            {cabinets &&
              cabinets.complementos.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text> {item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

            {cabinets &&
              cabinets.accesorios.map((item) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1",
                  }}
                >
                  <View style={{ height: "10", width: "30", fontSize: "8" }}>
                    <Text>1</Text>{" "}
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.reference}</Text>
                  </View>
                  <View
                    style={{
                      height: "10",
                      width: "300",
                      fontSize: "8",
                    }}
                  >
                    <Text>{item.name}</Text>
                  </View>

                  <View
                    View
                    style={{
                      height: "10",
                      width: "100",
                      fontSize: "8",
                      textAlign: "right",
                    }}
                  >
                    {price && (
                      <Text style={{ textAlign: "right" }}>
                        {parseFloat(item.priceTotal).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
          </View>
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
            <View>
              <View style={{ marginBottom: "1" }}>
                <Text>IMPORTE</Text>
              </View>
              {data?.discountCabinets && data?.discountCabinets != 0 && (
                <>
                  <View style={{ marginBottom: "1" }}>
                    <Text>DESCUENTO({data?.discountCabinets}%)</Text>
                  </View>
                  <View style={{ marginBottom: "1" }}>
                    <Text>IMPORTE</Text>
                  </View>
                </>
              )}
              <View>
                <Text>
                  I.V.A. ({data.ivaCabinets == "0" ? "21" : data.ivaCabinets}
                  %)
                </Text>
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
                <Text>{parseFloat(data.importe).toFixed(2)}</Text>
              </View>
              {data?.discountCabinets && data?.discountCabinets != 0 && (
                <View style={{ textAlign: "right", paddingLeft: "12" }}>
                  <View style={{ marginTop: "1", textAlign: "right" }}>
                    <Text>
                      {calcularDescuento(data.importe, data.discountCabinets)}
                    </Text>
                  </View>
                  <View style={{ marginTop: "1", textAlign: "right" }}>
                    <Text>
                      {calcularImporteDescuento(
                        data.importe,
                        data.discountCabinets
                      )}
                    </Text>
                  </View>
                </View>
              )}
              <View>
                <Text>
                  {calcularIvaCabinets(
                    data.importe,
                    data.discountCabinets,
                    data.ivaCabinets == "0" ? 21 : data.ivaCabinets
                  )}
                </Text>
              </View>
              <View
                style={{
                  borderTop: "1 solid #000000",
                  paddingLeft: "8",
                  marginTop: "1",
                }}
              >
                <Text>
                  {calcularTotalDescuentoIvaCabinets(
                    data.importe,
                    data.discountCabinets,
                    data.ivaCabinets == "0" ? 21 : data.ivaCabinets
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View wrap={false}>
          {filterData(data.details, "Encimera").length > 0 && (
            <View>
              <View style={{ marginBottom: totalEncimeras ? "0" : "20" }}>
                {data.details &&
                  filterData(data.details, "Encimera") !== "" && (
                    <View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderTop: "1 solid #000000",
                        }}
                      >
                        <View
                          style={{
                            width: "55",
                            height: "22",
                            backgroundColor: "#CFCFCF",
                          }}
                        ></View>
                        <Text
                          style={{
                            fontFamily: "Helvetica-Bold",
                            fontSize: "14",
                            marginLeft: "1",
                          }}
                        >
                          Encimera & Forrado pared
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "4",
                            fontSize: "8",
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          <View
                            style={{
                              width: "30",
                            }}
                          >
                            <Text>Ctd</Text>
                          </View>
                          <View style={{ width: "40" }}>
                            <Text>Grosor</Text>
                          </View>
                          <View style={{ width: "70" }}>
                            <Text>Marca</Text>
                          </View>
                          <View style={{ width: "300" }}>
                            <Text>Descripción</Text>
                          </View>
                          <View style={{ width: "100", textAlign: "right" }}>
                            <Text>(IVA incluido)Total</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                {data &&
                  data.details &&
                  filterData(data.details, "Encimera").map((item) => {
                    const iva = calcularIva(item.total, data.discountEncimeras);
                    // const totalConIva =
                    //   parseFloat(item.total) + parseFloat(iva);
                    return (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          fontSize: "8",
                          marginTop: "1",
                        }}
                      >
                        <View style={{ width: "30" }}>
                          <Text>{item.qty}</Text>{" "}
                        </View>
                        <View style={{ width: "40" }}>
                          <Text>{item.grosor}</Text>
                        </View>
                        <View style={{ width: "70" }}>
                          <Text>{item.marca}</Text>
                        </View>
                        <View style={{ width: "300" }}>
                          <Text>{item.descripcion}</Text>
                        </View>
                        <View style={{ width: "100", textAlign: "right" }}>
                          <Text>{parseFloat(item.total).toFixed(2)}</Text>
                        </View>
                      </View>
                    );
                  })}
              </View>
              {data.details &&
                totalEncimeras &&
                filterData(data.details, "Encimera") !== "" && (
                  <Total2
                    descuento={data.discountEncimeras}
                    importe={data.details}
                    seccion={"Encimera"}
                    iva={data.ivaEncimeras}
                  />
                )}
            </View>
          )}
        </View>
        <View wrap={false}>
          {filterData(data.details, "Equipamiento").length > 0 && (
            <View>
              <View style={{ marginBottom: totalEquipamiento ? "0" : "20" }}>
                <View>
                  {data.details &&
                    filterData(data.details, "Equipamiento") !== "" && (
                      <View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            borderTop: "1 solid #000000",
                          }}
                        >
                          <View
                            style={{
                              width: "55",
                              height: "22",
                              backgroundColor: "#CFCFCF",
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: "Helvetica-Bold",
                              fontSize: "14",
                              marginLeft: "1",
                            }}
                          >
                            Equipamiento
                          </Text>
                        </View>
                        <View>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              fontSize: "8",
                              marginTop: "4",
                              fontFamily: "Helvetica-Bold",
                            }}
                          >
                            <View
                              style={{
                                width: "30",
                              }}
                            >
                              <Text>Ctd</Text>
                            </View>
                            <View
                              style={{
                                width: "100",
                              }}
                            >
                              <Text>Referencia</Text>
                            </View>
                            <View style={{ width: "280" }}>
                              <Text>Descripción</Text>
                            </View>
                            <View style={{ width: "120", textAlign: "right" }}>
                              <Text>(IVA incluido)Total</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  {data &&
                    data.details &&
                    filterData(data.details, "Equipamiento").map((item) => {
                      const iva = calcularIva(
                        item.total,
                        data.discountEncimeras
                      );
                      // const totalConIva =
                      //   parseFloat(item.total) + parseFloat(iva);
                      return (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            fontSize: "8",
                            marginTop: "1",
                          }}
                        >
                          <View style={{ width: "30" }}>
                            <Text>{item.qty}</Text>{" "}
                          </View>
                          <View
                            style={{
                              width: "100",
                            }}
                          >
                            <Text>{item.referencia}</Text>
                          </View>
                          <View style={{ width: "280" }}>
                            <Text>{item.descripcion}</Text>
                          </View>
                          <View style={{ width: "120", textAlign: "right" }}>
                            <Text>{parseFloat(item.total).toFixed(2)}</Text>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  fontSize: "8",
                }}
                className="flex justify-end flex-row mt-20 mr-12"
              >
                {data.details &&
                  totalEquipamiento &&
                  filterData(data.details, "Equipamiento") !== "" && (
                    <Total2
                      descuento={data.discountEquipamientos}
                      importe={data.details}
                      seccion={"Equipamiento"}
                      iva={data.ivaEquipamientos}
                    />
                  )}
              </View>
            </View>
          )}
        </View>
        <View wrap={false}>
          {filterData(data.details, "Electrodomestico").length > 0 && (
            <View>
              <View
                style={{ marginBottom: totalElectrodomesticos ? "0" : "20" }}
              >
                {data.details &&
                  filterData(data.details, "Electrodomestico") !== "" && (
                    <View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderTop: "1 solid #000000",
                        }}
                      >
                        <View
                          style={{
                            width: "55",
                            height: "22",
                            backgroundColor: "#CFCFCF",
                          }}
                        ></View>
                        <Text
                          style={{
                            fontFamily: "Helvetica-Bold",
                            fontSize: "14",
                            marginLeft: "1",
                          }}
                        >
                          Electrodomésticos y Otros
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            fontSize: "8",
                            marginTop: "4",
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          <View style={{ width: "30" }}>
                            <Text>Ctd</Text>
                          </View>
                          <View style={{ width: "70" }}>
                            <Text>Referencia</Text>
                          </View>
                          <View style={{ width: "70" }}>
                            <Text>Marca</Text>
                          </View>
                          <View style={{ width: "300" }}>
                            <Text>Descripción</Text>
                          </View>
                          <View style={{ width: "100", textAlign: "right" }}>
                            <Text>(IVA incluido)Total</Text>{" "}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                {data &&
                  data.details &&
                  filterData(data.details, "Electrodomestico").map((item) => {
                    const iva = calcularIva(item.total, data.discountEncimeras);
                    // const totalConIva =
                    //   parseFloat(item.total) + parseFloat(iva);
                    return (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          fontSize: "8",
                          marginTop: "5",
                          textAlign: "left",
                        }}
                      >
                        <View style={{ width: "30" }}>
                          <Text>{item.qty}</Text>{" "}
                        </View>
                        <View
                          style={{
                            width: "70",
                          }}
                        >
                          <Text>{item.referencia}</Text>
                        </View>
                        <View style={{ width: "70" }}>
                          <Text>{item.marca}</Text>
                        </View>
                        <View style={{ width: "300" }}>
                          <Text>{item.descripcion}</Text>
                        </View>
                        <View style={{ width: "100", textAlign: "right" }}>
                          <Text>{parseFloat(item.total).toFixed(2)}</Text>
                        </View>
                      </View>
                    );
                  })}
              </View>
              {data.details &&
                totalElectrodomesticos &&
                filterData(data.details, "Electrodomestico") !== "" && (
                  <Total2
                    descuento={data.discountElectrodomesticos}
                    importe={data.details}
                    seccion={"Electrodomestico"}
                    iva={data.ivaElectrodomesticos}
                  />
                )}
            </View>
          )}
        </View>
        <View wrap={false}>
          <View style={{ paddingTop: "20" }}>
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: "14",
                marginLeft: "2",
                marginRight: "4",
              }}
            >
              Observaciones
            </Text>
            <Text
              style={{
                fontSize: "8",
                marginTop: "2",
                marginBottom: "",
                marginLeft: "0",
                width: "300",
              }}
              id="observaciones"
            >
              {data.observation}
            </Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.text}>
              {data.profile?.observacion1 ||
                "Los precios señalados son P.V.P. (21% I.V.A. incluido)."}
            </Text>
            <Text style={styles.text}>
              {data.profile?.observacion2 ||
                "El presupuesto queda abierto a posibles variaciones que puedan  surgir."}
            </Text>
            <Text style={styles.text}>
              {data.profile?.observacion3 ||
                "Módulos bajos de altura 84 cm. Zócalo de 6 cm."}
            </Text>
            <Text style={styles.text}>
              {data.profile?.observacion4 || "Fabricación a medida."}
            </Text>
            <Text style={styles.text}>
              {data.profile?.observacion5 || "Garantía de 5 años."}
            </Text>
          </View>
        </View>
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
        </View>
      </Page>
    </Document>
  );
};

export default Presupuesto_Cliente;
