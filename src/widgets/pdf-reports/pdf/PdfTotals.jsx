import { Text, View } from "@react-pdf/renderer";

const PdfTotals = ({ data, importeTotal, descuentoAplicado, totalconDescuento, ivaCalculado, resultadoFinal, ivaIncluido = false }) => (
  <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", fontSize: 8, marginTop: 20, marginBottom: 20 }}>
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", fontSize: 8 }}>
      <View>
        <View style={{ marginBottom: 1 }}><Text>IMPORTE</Text></View>
        {data?.discountCabinets > 0 && (
          <View style={{ marginBottom: 1 }}>
            <Text>DESCUENTO({data.discountCabinets}% en muebles)</Text>
          </View>
        )}
        {data?.discountCabinets > 0 && <View><Text>IMPORTE</Text></View>}
        {!ivaIncluido && (
          <View style={{ marginTop: 1 }}>
            <Text>I.V.A. ({data.ivaCabinets == "0" ? "21" : data.ivaCabinets}% en muebles)</Text>
          </View>
        )}
        <View style={{ marginTop: 1 }}><Text>PRECIO TOTAL</Text></View>
      </View>
      <View style={{ width: 80, textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <View style={{ borderTopWidth: 1, marginBottom: 1, textAlign: "right" }}>
          <Text>{parseFloat(importeTotal).toFixed(2)}</Text>
        </View>
        {data?.discountCabinets > 0 && (
          <View>
            <Text>{parseFloat(descuentoAplicado).toFixed(2)}</Text>
          </View>
        )}
        {data?.discountCabinets > 0 && (
          <View><Text>{parseFloat(totalconDescuento).toFixed(2)}</Text></View>
        )}
        {!ivaIncluido && <View><Text>{parseFloat(ivaCalculado).toFixed(2)}</Text></View>}
        <View style={{ borderTopWidth: 1, paddingLeft: 8, marginTop: 1 }}>
          <Text>{parseFloat(resultadoFinal).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  </View>
);

export default PdfTotals;
