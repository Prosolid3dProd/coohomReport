import { Text, View, Image } from "@react-pdf/renderer";
import LogoSola from "../../../assets/sola.png";
import { CONFIG } from "../../../shared/config";
import { convertirFecha } from "./pdfUtils";

const PdfDocHeader = ({ data, title }) => {
  const logoGrande = (url) =>
    url ? <Image style={{ width: "100px" }} src={url} /> : <Image style={{ width: "100px" }} src={LogoSola} />;

  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <View>{logoGrande(data.userId?.logo)}</View>
        <Text style={{ fontSize: "14", display: "flex", fontFamily: CONFIG.BOLD }}>{title}</Text>
      </View>
      <View style={{ fontSize: "8", marginRight: "110" }}>
        <Text>{data.userId?.info1}</Text>
        <Text>{data.userId?.info2}</Text>
        <Text>{data.userId?.info3}</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "50", marginBottom: "40" }}>
        <View style={{ display: "flex", flexDirection: "row", textAlign: "right", fontSize: "8" }}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Confirmacion no.:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Creado:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Envio mercancia:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Referencia:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Cliente:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column" }}>
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
        <View style={{ display: "flex", flexDirection: "row", textAlign: "right", fontSize: "8" }}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Modelo:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Acabado:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Armazon:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Zocalo:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Tirador:</Text>
            <Text style={{ fontFamily: CONFIG.BOLD }}>Cajon:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text>{data?.modelDoor || "."}</Text>
            <Text>{String(data?.materialDoor) || "."}</Text>
            <Text>{data?.materialCabinet || "."}</Text>
            <Text>.{data?.infoZocalos[0]?.size?.z || "."}</Text>
            <Text>{data?.modelHandler || "."}</Text>
            <Text>{String(data?.modelDrawer + "/" + data?.materialDrawer) || "."}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PdfDocHeader;
