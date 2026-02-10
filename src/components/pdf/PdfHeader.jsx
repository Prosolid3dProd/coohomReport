import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import LogoSola from "../../assets/sola.png";
import { CONFIG } from "../../data/constants";

const PdfHeader = ({ data, title, logoGrande }) => {
    const convertirFecha = (fecha) => {
        try {
            const partes = fecha.split(" ");
            const fechaPartes = partes[0].split("-");
            const año = fechaPartes[0];
            const mes = fechaPartes[1];
            const dia = fechaPartes[2];
            if (año !== undefined && mes !== undefined && dia !== undefined) {
                return `${dia}/${mes}/${año}`;
            }
        } catch (e) {
            return fecha;
        }
    };

    const defaultLogo = (url) => {
        if (!url || url === "") {
            return <Image style={{ width: "100px" }} src={LogoSola} />;
        } else {
            return <Image style={{ width: "100px" }} src={url} />;
        }
    }

    const renderLogo = logoGrande || defaultLogo;

    return (
        <View style={{ display: "flex", flexDirection: "column" }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View>{renderLogo(data.userId?.logo)}</View>
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
            <View style={{ fontSize: "8", marginRight: "110" }}>
                <Text>{data.userId?.info1}</Text>
                <Text>{data.userId?.info2}</Text>
                <Text>{data.userId?.info3}</Text>
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
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Confirmación nº:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Creado:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Envío mercancía:</Text>
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

                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        textAlign: "right",
                        fontSize: "8",
                    }}
                >
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Modelo:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Acabado:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Armazón:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Zócalo:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Tirador:</Text>
                        <Text style={{ fontFamily: CONFIG.BOLD }}>Cajón:</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text>{data?.modelDoor || "."}</Text>
                        <Text>{String(data?.materialDoor) || "."}</Text>
                        <Text>{data?.materialCabinet || "."}</Text>
                        <Text>{data?.infoZocalos?.[0]?.size?.z || "."}</Text>
                        <Text>{data?.modelHandler || "."}</Text>
                        <Text>
                            {(() => {
                                const model = data?.modelDrawer;
                                const material = data?.materialDrawer;
                                if (!model && !material) return ".";
                                if (model && material) return `${model}/${material}`;
                                return model || material;
                            })()}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PdfHeader;
