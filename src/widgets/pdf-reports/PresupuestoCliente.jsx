import { useMemo } from "react";
import { Page, Text, View, Document, Image, Font, StyleSheet } from "@react-pdf/renderer";
import LogoSola from "../../assets/sola.png";
import { CONFIG } from "../../shared/config";
import { groupCabinetsByType } from "../../shared/lib/cabinetFilters";
import { convertirFecha } from "../../shared/lib/date";

Font.register({
  family: "Helvetica-Bold",
  src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  fontStyle: "normal",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  container: { flexDirection: "column", marginBottom: 10 },
  text: { fontSize: 8 },
});

const CabinetRow = ({ item, price }) => (
  <View style={{ display: "flex", flexDirection: "row", marginTop: "1" }}>
    <View style={{ height: "10", width: "30", fontSize: "8" }}><Text>{item.quantity || 1}</Text></View>
    <View style={{ height: "10", width: "100", fontSize: "8" }}><Text>{item.reference}</Text></View>
    <View style={{ height: "10", width: "300", fontSize: "8" }}><Text>{item.name}</Text></View>
    <View style={{ height: "10", width: "100", fontSize: "8", textAlign: "right" }}>
      {price && <Text style={{ textAlign: "right" }}>{parseFloat(item.total).toFixed(2)}</Text>}
    </View>
  </View>
);

const SectionTotals = ({ data, descuento, discountKey, ivaKey, importe, seccion, ivaIncluido = false }) => {
  const items = (importe || []).filter((item) => item.type === seccion);
  const sumaImportes = items.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const ivaPorcentaje = parseFloat(data[ivaKey] || 21);
  const descuentoPct = parseFloat(descuento || 0);
  const descuentoAmt = parseFloat((sumaImportes * descuentoPct / 100).toFixed(2));
  const importeConDesc = sumaImportes - descuentoAmt;
  const ivaAmt = ivaIncluido ? 0 : parseFloat((importeConDesc * ivaPorcentaje / 100).toFixed(2));
  const total = (importeConDesc + ivaAmt).toFixed(2);

  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", fontSize: 8, marginTop: 20, marginBottom: 20 }} wrap={false}>
      <View>
        {descuentoPct > 0 && <View style={{ marginBottom: 1 }}><Text>DESCUENTO ({descuentoPct}%)</Text></View>}
        {!ivaIncluido && <View><Text>I.V.A. ({ivaPorcentaje}%)</Text></View>}
        <View style={{ marginTop: 2 }}><Text>PRECIO TOTAL</Text></View>
      </View>
      <View style={{ width: 80, textAlign: "right" }}>
        {descuentoPct > 0 && <View style={{ marginTop: 1 }}><Text>{descuentoAmt.toFixed(2)}</Text></View>}
        {!ivaIncluido && <View style={{ marginTop: 1 }}><Text>{ivaAmt.toFixed(2)}</Text></View>}
        <View style={{ borderTop: "1 solid #000000", paddingLeft: 8, marginTop: 1 }}><Text>{total}</Text></View>
      </View>
    </View>
  );
};

const DETAIL_CONFIGS = {
  Encimera: {
    title: "Encimera & Forrado pared",
    columns: (hasDiscount) => [
      { label: "Ctd", width: "30" },
      { label: "Grosor", width: "40" },
      { label: "Marca", width: "70" },
      { label: "Descripcion", width: "300" },
      ...(hasDiscount ? [{ label: "Desc(%)", width: "30" }] : []),
      { label: "Total", width: "100", textAlign: "right" },
    ],
    rowCells: (item) => (hasDiscount) => [
      { value: item.qty, width: "30" },
      { value: item.grosor, width: "40" },
      { value: item.marca, width: "70" },
      { value: item.descripcion, width: "300" },
      ...(hasDiscount ? [{ value: `${item.discount}%`, width: "30" }] : []),
      { value: parseFloat(item.total).toFixed(2), width: "100", textAlign: "right" },
    ],
    discountKey: "discountEncimeras",
    ivaKey: "ivaEncimeras",
  },
  Equipamiento: {
    title: "Equipamiento",
    columns: (hasDiscount) => [
      { label: "Ctd", width: "100" },
      { label: "Referencia", width: "100" },
      { label: "Descripcion", width: "300" },
      ...(hasDiscount ? [{ label: "Desc(%)", width: "30" }] : []),
      { label: "Total", width: "100", textAlign: "right" },
    ],
    rowCells: (item) => (hasDiscount) => [
      { value: item.qty, width: "100" },
      { value: item.referencia, width: "100" },
      { value: item.descripcion, width: "300" },
      ...(hasDiscount ? [{ value: `${item.discount}%`, width: "30" }] : []),
      { value: parseFloat(item.total).toFixed(2), width: "100", textAlign: "right" },
    ],
    discountKey: "discountEquipamientos",
    ivaKey: "ivaEquipamientos",
  },
  Electrodomestico: {
    title: "Electrodomesticos y Otros",
    columns: (hasDiscount) => [
      { label: "Ctd", width: "30" },
      { label: "Referencia", width: "70" },
      { label: "Marca", width: "70" },
      { label: "Descripcion", width: "300" },
      ...(hasDiscount ? [{ label: "Desc(%)", width: "30" }] : []),
      { label: "Total", width: "100", textAlign: "right" },
    ],
    rowCells: (item) => (hasDiscount) => [
      { value: item.qty, width: "30" },
      { value: item.referencia, width: "70" },
      { value: item.marca, width: "70" },
      { value: item.descripcion, width: "300" },
      ...(hasDiscount ? [{ value: `${item.discount}%`, width: "30" }] : []),
      { value: parseFloat(item.total).toFixed(2), width: "100", textAlign: "right" },
    ],
    discountKey: "discountElectrodomesticos",
    ivaKey: "ivaElectrodomesticos",
  },
};

const DetailSection = ({ data, type, showTotals, ivaIncluido = false }) => {
  const cfg = DETAIL_CONFIGS[type];
  const items = (data.details || []).filter((item) => item.type === type);
  if (items.length === 0) return null;
  const hasDiscount = items.some((item) => item.discount > 0);
  const columns = cfg.columns(hasDiscount);

  return (
    <View wrap={false}>
      <View>
        <View style={{ marginBottom: showTotals ? "0" : "20" }}>
          <View style={{ display: "flex", flexDirection: "row", borderTop: "1 solid #000000" }}>
            <View style={{ width: "55", height: "22", backgroundColor: "#CFCFCF" }} />
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: "14", marginLeft: "1" }}>{cfg.title}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", marginTop: "4", fontSize: "8", fontFamily: "Helvetica-Bold" }}>
            {columns.map(({ label, width, textAlign }) => (
              <View key={label} style={{ width, textAlign }}><Text>{label}</Text></View>
            ))}
          </View>
          {items.map((item, index) => {
            const cells = cfg.rowCells(item)(hasDiscount);
            return (
              <View key={index} style={{ display: "flex", flexDirection: "row", fontSize: "8", marginTop: "1" }}>
                {cells.map(({ value, width, textAlign }, idx) => (
                  <View key={idx} style={{ width, textAlign }}><Text>{value}</Text></View>
                ))}
              </View>
            );
          })}
        </View>
        {showTotals && (
          <SectionTotals
            data={data}
            descuento={data[cfg.discountKey]}
            discountKey={cfg.discountKey}
            ivaKey={cfg.ivaKey}
            importe={data.details}
            seccion={type}
            ivaIncluido={ivaIncluido}
          />
        )}
      </View>
    </View>
  );
};

const Presupuesto_Cliente = ({
  data, price,
  totalEncimeras, totalEquipamiento, totalElectrodomesticos,
  totalconDescuento, ivaCalculado, resultadoFinal, importeTotal, descuentoAplicado,
  ivaIncluido = false,
}) => {
  const cabinets = useMemo(() => groupCabinetsByType(data?.cabinets || []), [data]);
  const allCabinetRows = useMemo(() => Object.values(cabinets).flat(), [cabinets]);

  return (
    <Document title="Presupuesto COOHOM" pageMode="fullScreen">
      <Page style={{ paddingHorizontal: "55", paddingVertical: "45" }} size={"A4"} wrap>

        <View fixed style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ display: "flex", flexDirection: "column", marginRight: "15", marginBottom: "18" }}>
            <View>
              {data.userId?.logo
                ? <Image style={{ width: "100px" }} src={data.userId.logo} />
                : <Image style={{ width: "100px" }} src={LogoSola} />}
            </View>
            <View style={{ fontSize: "8", marginRight: "110" }}>
              <Text>{data.userId.info1}</Text>
              <Text>{data.userId.info2}</Text>
              <Text>{data.userId.info3}</Text>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", textAlign: "right", fontSize: "8" }}>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ fontFamily: CONFIG.BOLD }}>Fecha:</Text>
              <Text style={{ fontFamily: CONFIG.BOLD }}>Cliente:</Text>
              <Text style={{ fontFamily: CONFIG.BOLD }}>Referencia:</Text>
              <Text style={{ fontFamily: CONFIG.BOLD }}>Localidad:</Text>
              <Text style={{ fontFamily: CONFIG.BOLD }}>Telefono:</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text>{convertirFecha(data?.fecha)}</Text>
              <Text>{data?.customerName}</Text>
              <Text>{data?.projectName}</Text>
              <Text>{data?.location === "" ? "." : data.location}</Text>
              <Text>{data?.phone}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: "10" }}>
          <Text style={{ borderBottom: "1 solid #000000", fontFamily: "Helvetica-Bold", fontSize: "12", marginBottom: "12", paddingBottom: "2" }}>
            PRESUPUESTO
          </Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ width: "45", height: "22", backgroundColor: "#CFCFCF", marginTop: "1" }} />
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "1" }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: "14", marginLeft: "2", marginRight: "4" }}>Muebles</Text>
              <Text style={{ fontSize: "8" }}>(segun diseno) COCINA</Text>
            </View>
          </View>

          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", fontSize: "12", marginTop: "10", borderBottom: "1 solid #e8e8e9" }}>
            {[
              { label: "Modelo:", value: data.modelDoor },
              { label: "Color:", value: data.materialDoor },
              { label: "Tirador:", value: data.modelHandler },
              { label: "Armazon:", value: data.materialCabinet },
              { label: "Cajon:", value: data?.modelDrawer ? `${data.modelDrawer}${data.modelDrawer ? " / " : ""}${data.materialDrawer || ""}` : undefined },
            ].filter(({ value }) => value !== undefined).map(({ label, value }) => (
              <View key={label} style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "4", fontFamily: "Helvetica-Bold", fontSize: "8" }}>{label}</Text>
                <Text style={{ marginRight: "12", fontSize: "8" }}>{value || "."}</Text>
              </View>
            ))}
          </View>

          <View style={{ display: "flex", flexDirection: "row", fontFamily: "Helvetica-Bold", marginTop: "4", fontSize: "8" }}>
            <View><Text style={{ width: "30" }}>Ctd</Text></View>
            <View><Text style={{ width: "100" }}>Referencia</Text></View>
            <View><Text style={{ width: "300" }}>Descripcion</Text></View>
            <View><Text style={{ textAlign: "right", width: "100" }}>Importe</Text></View>
          </View>

          {allCabinetRows.map((item, i) => (
            <CabinetRow key={i} item={item} price={price} />
          ))}
        </View>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", fontSize: "8", marginTop: "20", marginBottom: "20" }} wrap={false}>
          <View>
            <View style={{ marginBottom: "1" }}><Text>IMPORTE</Text></View>
            {data?.discountCabinets && data?.discountCabinets != 0 && (
              <>
                <View style={{ marginBottom: "1" }}><Text>DESCUENTO({data?.discountCabinets}%)</Text></View>
                <View style={{ marginBottom: "1" }}><Text>IMPORTE</Text></View>
              </>
            )}
            {!ivaIncluido && <View><Text>I.V.A. ({data.ivaCabinets}%)</Text></View>}
            <View style={{ marginTop: "1" }}><Text>PRECIO TOTAL</Text></View>
          </View>
          <View style={{ width: "80", textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <View style={{ borderTop: "1 solid #000000", marginBottom: "1", textAlign: "right" }}>
              <Text>{parseFloat(importeTotal).toFixed(2)}</Text>
            </View>
            {data?.discountCabinets && data?.discountCabinets != 0 && (
              <View style={{ textAlign: "right", paddingLeft: "12" }}>
                <View style={{ marginTop: "1", textAlign: "right" }}><Text>{parseFloat(descuentoAplicado).toFixed(2)}</Text></View>
                <View style={{ marginTop: "1", textAlign: "right" }}><Text>{parseFloat(totalconDescuento).toFixed(2)}</Text></View>
              </View>
            )}
            {!ivaIncluido && <View><Text>{parseFloat(ivaCalculado).toFixed(2)}</Text></View>}
            <View style={{ borderTop: "1 solid #000000", paddingLeft: "8", marginTop: "1" }}>
              <Text>{parseFloat(resultadoFinal).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <DetailSection data={data} type="Encimera" showTotals={totalEncimeras} ivaIncluido={ivaIncluido} />
        <DetailSection data={data} type="Equipamiento" showTotals={totalEquipamiento} ivaIncluido={ivaIncluido} />
        <DetailSection data={data} type="Electrodomestico" showTotals={totalElectrodomesticos} ivaIncluido={ivaIncluido} />

        <View wrap={false}>
          <View style={{ paddingTop: "20" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: "14", marginLeft: "2", marginRight: "4" }}>Observaciones</Text>
            <Text style={{ fontSize: "8", marginTop: "2", width: "300" }}>
              {data?.observation?.includes("null") ? "" : data.observation}
            </Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.text}>{data.userId?.observacion1 || "Los precios senyalados son P.V.P. (21% I.V.A. incluido)."}</Text>
            <Text style={styles.text}>{data.userId?.observacion2 || "El presupuesto queda abierto a posibles variaciones que puedan surgir."}</Text>
            <Text style={styles.text}>{data.userId?.observacion3 || "Modulos bajos de altura 84 cm. Zocalo de 6 cm."}</Text>
            <Text style={styles.text}>{data.userId?.observacion4 || "Fabricacion a medida."}</Text>
            <Text style={styles.text}>{data.userId?.observacion5 || "Garantia de 5 anos."}</Text>
          </View>
        </View>

        <View fixed style={{ position: "absolute", bottom: "20", left: "280" }}>
          <Text style={{ width: "30", textAlign: "center", fontSize: "8", marginBottom: "2" }} render={({ pageNumber }) => `${pageNumber}`} fixed />
          <Image style={{ width: "30" }} src={LogoSola} />
        </View>
      </Page>
    </Document>
  );
};

export default Presupuesto_Cliente;
