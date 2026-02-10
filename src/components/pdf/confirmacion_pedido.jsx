import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, Image, Font } from "@react-pdf/renderer";
import LogoSola from "../../assets/sola.png";
import { CONFIG } from "../../data/constants";

import PdfHeader from "./PdfHeader";
import CabinetTable from "./CabinetTable";
import "./fonts";



const Confirmacion_Pedido = ({
  data,
  price,
  title,
  totalconDescuento,
  ivaCalculado,
  resultadoFinal,
  importeTotal,
  descuentoAplicado,
  filteredCabinets,
}) => {
  // Use pre-filtered cabinets from hook for better performance
  const cabinets = filteredCabinets || {
    decorativos: [],
    altos: [],
    bajos: [],
    complementos: [],
    murales: [],
    regletas: [],
    costados: [],
    accesorios: [],
  };

  const logoGrande = (url) => {
    if (!url || url === "") {
      return <Image style={{ width: "100px" }} src={LogoSola} />;
    } else {
      return <Image style={{ width: "100px" }} src={url} />;
    }
  };

  const complementos =
    (data.infoZocalos && data.infoZocalos.length > 0) ||
      (cabinets.complementos && cabinets.complementos.length > 0)
      ? true
      : false;

  // Calculate starting indices for each table to maintain continuous numbering
  const startBajos = 1;
  const startMurales = startBajos + (cabinets.bajos?.length || 0);
  const startAltos = startMurales + (cabinets.murales?.length || 0);
  const startRegletas = startAltos + (cabinets.altos?.length || 0);
  const startCostados = startRegletas + (cabinets.regletas?.length || 0);
  const startDecorativos = startCostados + (cabinets.costados?.length || 0);
  const startComplementos = startDecorativos + (cabinets.decorativos?.length || 0);
  const startAccesorios = startComplementos + (cabinets.complementos?.length || 0);


  return (
    <Document title="Presupuesto COOHOM">
      <Page
        style={{ paddingHorizontal: "55", paddingVertical: "45" }}
        size={"A4"}
        wrap
      >
        <PdfHeader data={data} title={title} logoGrande={logoGrande} />

        <CabinetTable
          items={cabinets?.bajos}
          title="MUEBLES BAJOS"
          price={price}
          contador={startBajos}
        />

        <CabinetTable
          items={cabinets?.murales}
          title="MUEBLES MURALES"
          price={price}
          contador={startMurales}
        />

        <CabinetTable
          items={cabinets?.altos}
          title="MUEBLES ALTOS"
          price={price}
          contador={startAltos}
        />

        <CabinetTable
          items={cabinets?.regletas}
          title="REGLETAS"
          price={price}
          contador={startRegletas}
        />

        <CabinetTable
          items={cabinets?.costados}
          title="COSTADOS"
          price={price}
          contador={startCostados}
        />

        <CabinetTable
          items={cabinets?.decorativos}
          title="DECORATIVOS"
          price={price}
          contador={startDecorativos}
        />

        <CabinetTable
          items={cabinets?.complementos}
          title="COMPLEMENTOS"
          price={price}
          contador={startComplementos}
        />

        <CabinetTable
          items={cabinets?.accesorios}
          title="ACCESORIOS"
          price={price}
          contador={startAccesorios}
        />

        {/* Footer Page Number & Logo */}
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
        </View>

        {/* Totals Footer */}
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
                    I.V.A. ({data.ivaCabinets == "0" ? "21" : data.ivaCabinets}%
                    en muebles)
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
                  <Text>{parseFloat(importeTotal).toFixed(2)}</Text>
                </View>
                <View>
                  {data?.discountCabinets > 0 && (
                    <View>
                      <Text>{parseFloat(descuentoAplicado).toFixed(2)}</Text>
                    </View>
                  )}
                </View>
                {data?.discountCabinets > 0 && (
                  <View>
                    <Text>{parseFloat(totalconDescuento).toFixed(2)}</Text>
                  </View>
                )}

                <View>
                  <Text>{parseFloat(ivaCalculado).toFixed(2)}</Text>
                </View>

                <View
                  style={{
                    borderTopWidth: 1,
                    paddingLeft: 8,
                    marginTop: 1,
                  }}
                >
                  <View>
                    <Text>{parseFloat(resultadoFinal).toFixed(2)}</Text>
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

export default React.memo(Confirmacion_Pedido);
