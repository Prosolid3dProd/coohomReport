import { useMemo } from "react";
import { Page, Text, View, Document, Image, Font } from "@react-pdf/renderer";
import LogoSola from "../../assets/sola.png";
import { groupCabinetsByType } from "../../shared/lib/cabinetFilters";
import PdfDocHeader from "./pdf/PdfDocHeader";
import PdfTotals from "./pdf/PdfTotals";
import CabinetSections from "./pdf/CabinetSections";

Font.register({
  family: "Courier",
  src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  fontStyle: "normal",
  fontWeight: "normal",
});

const Confirmacion_Pedido = ({
  data, price, title,
  totalconDescuento, ivaCalculado, resultadoFinal, importeTotal, descuentoAplicado,
  ivaIncluido = false,
}) => {
  const cabinets = useMemo(() => groupCabinetsByType(data?.cabinets || []), [data]);
  const complementos = data.infoZocalos.length > 0 || cabinets.complementos.length > 0;

  return (
    <Document title="Presupuesto COOHOM">
      <Page style={{ paddingHorizontal: "55", paddingVertical: "45" }} size={"A4"} wrap>
        <PdfDocHeader data={data} title={title} />
        <CabinetSections cabinets={cabinets} price={price} complementos={complementos} />
        <View fixed style={{ position: "absolute", bottom: "20", left: "280" }}>
          <Text
            style={{ width: "30", textAlign: "center", fontSize: "8", marginBottom: "2" }}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
          <Image style={{ width: "30" }} src={LogoSola} />
        </View>
        {price && (
          <PdfTotals
            data={data}
            importeTotal={importeTotal}
            descuentoAplicado={descuentoAplicado}
            totalconDescuento={totalconDescuento}
            ivaCalculado={ivaCalculado}
            resultadoFinal={resultadoFinal}
            ivaIncluido={ivaIncluido}
          />
        )}
      </Page>
    </Document>
  );
};

export default Confirmacion_Pedido;
